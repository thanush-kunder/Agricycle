import { Exchange, Listing } from '../models/index.js';

/**
 * @desc    Create a new exchange / waste pickup request
 * @route   POST /api/exchanges
 * @access  Private (Waste Utilizers & Admins)
 */
export const createExchangeRequest = async (req, res) => {
  try {
    const { listingId, quantityKg, proposedPickupDate, deliveryMethod, notes } = req.body;

    if (!listingId || !quantityKg || !proposedPickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listingId, quantityKg, and proposedPickupDate',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.status !== 'available' && listing.status !== 'reserved') {
      return res.status(400).json({
        success: false,
        message: `This listing is currently ${listing.status} and cannot accept requests`,
      });
    }

    // Prevent farmer from buying their own listing
    if (listing.generator.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request waste from your own listing',
      });
    }

    const requestedQty = Number(quantityKg);
    if (requestedQty > listing.availableQuantityKg) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${requestedQty} kg) exceeds available stock (${listing.availableQuantityKg} kg)`,
      });
    }

    const exchange = await Exchange.create({
      listing: listing._id,
      generator: listing.generator,
      utilizer: req.user._id,
      quantityKg: requestedQty,
      unitPrice: listing.pricePerKg,
      totalAmount: requestedQty * listing.pricePerKg,
      proposedPickupDate: new Date(proposedPickupDate),
      deliveryMethod: deliveryMethod || 'self_pickup',
      notes,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Exchange request submitted to the waste generator',
      data: exchange,
    });
  } catch (error) {
    console.error('Create exchange error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating exchange request',
    });
  }
};

/**
 * @desc    Get user's exchanges (as farmer or buyer)
 * @route   GET /api/exchanges/my
 * @access  Private
 */
export const getMyExchanges = async (req, res) => {
  try {
    const { role } = req.query; // optional filter: 'generator' or 'utilizer'
    let query = {};

    if (role === 'generator') {
      query = { generator: req.user._id };
    } else if (role === 'utilizer') {
      query = { utilizer: req.user._id };
    } else {
      query = {
        $or: [{ generator: req.user._id }, { utilizer: req.user._id }],
      };
    }

    const exchanges = await Exchange.find(query)
      .populate('listing', 'title wasteType pricePerKg location images')
      .populate('generator', 'name phone organization email location')
      .populate('utilizer', 'name phone organization email location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: exchanges.length,
      data: exchanges,
    });
  } catch (error) {
    console.error('Get my exchanges error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving exchanges',
    });
  }
};

/**
 * @desc    Get single exchange by ID
 * @route   GET /api/exchanges/:id
 * @access  Private (Participants or Admin only)
 */
export const getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('listing')
      .populate('generator', 'name phone organization email location')
      .populate('utilizer', 'name phone organization email location');

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found',
      });
    }

    // Verify authorized user
    const isGenerator = exchange.generator._id.toString() === req.user._id.toString();
    const isUtilizer = exchange.utilizer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isGenerator && !isUtilizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this exchange details',
      });
    }

    return res.status(200).json({
      success: true,
      data: exchange,
    });
  } catch (error) {
    console.error('Get exchange by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving exchange',
    });
  }
};

/**
 * @desc    Update exchange status (accept, reject, in_transit, complete, cancel)
 * @route   PATCH /api/exchanges/:id/status
 * @access  Private
 */
export const updateExchangeStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found',
      });
    }

    const listing = await Listing.findById(exchange.listing);
    const isGenerator = exchange.generator.toString() === req.user._id.toString();
    const isUtilizer = exchange.utilizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    const prevStatus = exchange.status;

    // Validate permission based on target status
    if (status === 'accepted' || status === 'rejected') {
      if (!isGenerator && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the waste generator (farmer) can accept or reject this request',
        });
      }
    }

    if (status === 'cancelled') {
      if (!isUtilizer && !isGenerator && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this request',
        });
      }
    }

    if (status === 'completed') {
      if (!isGenerator && !isUtilizer && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to mark this exchange completed',
        });
      }
    }

    // Inventory adjustments on status transitions
    if (listing) {
      // When accepted: reserve inventory
      if (status === 'accepted' && prevStatus !== 'accepted') {
        listing.availableQuantityKg = Math.max(0, listing.availableQuantityKg - exchange.quantityKg);
        if (listing.availableQuantityKg === 0) {
          listing.status = 'reserved';
        }
        await listing.save();
      }

      // If accepted request is cancelled or rejected: release inventory back
      if (
        (status === 'cancelled' || status === 'rejected') &&
        prevStatus === 'accepted'
      ) {
        listing.availableQuantityKg += exchange.quantityKg;
        if (listing.status === 'reserved') {
          listing.status = 'available';
        }
        await listing.save();
      }

      // When completed: mark listing as completed if stock exhausted
      if (status === 'completed' && listing.availableQuantityKg === 0) {
        listing.status = 'completed';
        await listing.save();
      }
    }

    // Update exchange
    exchange.status = status;
    if (rejectionReason) exchange.rejectionReason = rejectionReason;

    await exchange.save(); // triggers pre('save') hook for CO2 and biomass calculation on 'completed'

    return res.status(200).json({
      success: true,
      message: `Exchange status updated to ${status}`,
      data: exchange,
    });
  } catch (error) {
    console.error('Update exchange status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating exchange status',
    });
  }
};

/**
 * @desc    Get aggregated environmental impact metrics for the Impact Dashboard
 * @route   GET /api/exchanges/impact-summary
 * @access  Public
 */
export const getImpactSummary = async (req, res) => {
  try {
    const completedExchanges = await Exchange.find({ status: 'completed' }).populate(
      'listing',
      'wasteType'
    );

    let totalBiomassDivertedKg = 0;
    let totalCo2MitigatedKg = 0;
    let totalTransactions = completedExchanges.length;
    let totalFarmerRevenue = 0;
    const wasteTypeMap = {};

    completedExchanges.forEach((ex) => {
      const biomass = ex.impactMetrics?.biomassDivertedKg || ex.quantityKg || 0;
      const co2 = ex.impactMetrics?.co2MitigatedKg || Number((biomass * 1.46).toFixed(2));
      const amount = ex.totalAmount || 0;

      totalBiomassDivertedKg += biomass;
      totalCo2MitigatedKg += co2;
      totalFarmerRevenue += amount;

      const type = ex.listing?.wasteType || 'Other';
      wasteTypeMap[type] = (wasteTypeMap[type] || 0) + biomass;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBiomassDivertedKg: Number(totalBiomassDivertedKg.toFixed(2)),
        totalBiomassDivertedTons: Number((totalBiomassDivertedKg / 1000).toFixed(2)),
        totalCo2MitigatedKg: Number(totalCo2MitigatedKg.toFixed(2)),
        totalCo2MitigatedTons: Number((totalCo2MitigatedKg / 1000).toFixed(2)),
        totalExchangesCompleted: totalTransactions,
        totalFarmerRevenueRs: Number(totalFarmerRevenue.toFixed(2)),
        wasteTypeBreakdown: wasteTypeMap,
      },
    });
  } catch (error) {
    console.error('Impact summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving environmental impact summary',
    });
  }
};
