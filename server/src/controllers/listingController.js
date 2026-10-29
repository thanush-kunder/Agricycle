import { Listing } from '../models/index.js';
import { calculateHaversineDistance, isValidCoordinates } from '../utils/haversine.js';

/**
 * @desc    Create a new agricultural waste listing
 * @route   POST /api/listings
 * @access  Private (Waste Generators & Admins only)
 */
export const createListing = async (req, res) => {
  try {
    const {
      title,
      wasteType,
      description,
      quantityKg,
      pricePerKg,
      location,
      images,
      qualityGrade,
      moisturePercentage,
      availableUntil,
    } = req.body;

    // Validate required fields
    if (!title || !wasteType || !quantityKg || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, wasteType, quantityKg, and location',
      });
    }

    // Parse coordinates [longitude, latitude]
    let coordinates = [];
    if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      coordinates = [Number(location.coordinates[0]), Number(location.coordinates[1])];
    } else if (location.lat !== undefined && location.lng !== undefined) {
      coordinates = [Number(location.lng), Number(location.lat)];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates must contain longitude and latitude',
      });
    }

    if (!isValidCoordinates(coordinates[1], coordinates[0])) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180',
      });
    }

    const listing = await Listing.create({
      generator: req.user._id,
      title,
      wasteType,
      description,
      quantityKg: Number(quantityKg),
      availableQuantityKg: Number(quantityKg),
      pricePerKg: pricePerKg !== undefined ? Number(pricePerKg) : 0,
      images: images || [],
      qualityGrade: qualityGrade || 'Pending Assessment',
      moisturePercentage,
      availableUntil,
      location: {
        type: 'Point',
        coordinates,
        address: location.address || 'Address not specified',
        city: location.city || '',
        state: location.state || 'Karnataka',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Waste listing created successfully',
      data: listing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating listing',
    });
  }
};

/**
 * @desc    Get all listings with filtering, pagination, and proximity matching
 * @route   GET /api/listings
 * @access  Public
 */
export const getAllListings = async (req, res) => {
  try {
    const {
      wasteType,
      isFree,
      status = 'available',
      minQuantity,
      maxQuantity,
      lat,
      lng,
      maxDistanceKm,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status };

    // Filter by waste type
    if (wasteType) {
      query.wasteType = wasteType;
    }

    // Filter by free/paid
    if (isFree === 'true') {
      query.isFree = true;
    } else if (isFree === 'false') {
      query.isFree = false;
    }

    // Filter by quantity range
    if (minQuantity || maxQuantity) {
      query.availableQuantityKg = {};
      if (minQuantity) query.availableQuantityKg.$gte = Number(minQuantity);
      if (maxQuantity) query.availableQuantityKg.$lte = Number(maxQuantity);
    }

    // Geospatial proximity filtering using MongoDB $centerSphere
    const hasCoordinates = lat !== undefined && lng !== undefined;
    let userLat;
    let userLng;

    if (hasCoordinates) {
      userLat = Number(lat);
      userLng = Number(lng);

      if (!isValidCoordinates(userLat, userLng)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180',
        });
      }

      if (maxDistanceKm) {
        const radiusInRadians = Number(maxDistanceKm) / 6371; // Earth's radius ~6371 km
        query.location = {
          $geoWithin: {
            $centerSphere: [[userLng, userLat], radiusInRadians],
          },
        };
      }
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { pricePerKg: 1 };
    if (sortBy === 'price_desc') sortOptions = { pricePerKg: -1 };
    if (sortBy === 'quantity_desc') sortOptions = { availableQuantityKg: -1 };

    const total = await Listing.countDocuments(query);
    let listings = await Listing.find(query)
      .populate('generator', 'name phone organization email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Calculate exact Haversine distance if user provided coordinates
    if (hasCoordinates) {
      listings = listings.map((item) => {
        const itemLng = item.location?.coordinates?.[0];
        const itemLat = item.location?.coordinates?.[1];

        let distanceKm = null;
        if (itemLng !== undefined && itemLat !== undefined) {
          distanceKm = calculateHaversineDistance(userLat, userLng, itemLat, itemLng);
        }

        return {
          ...item,
          distanceKm,
        };
      });

      // Sort by distance if requested
      if (sortBy === 'distance') {
        listings.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
      }
    }


    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: listings,
    });
  } catch (error) {
    console.error('Get listings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving listings',
    });
  }
};

/**
 * @desc    Get single listing details by ID
 * @route   GET /api/listings/:id
 * @access  Public
 */
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'generator',
      'name phone organization email location'
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Get listing by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Invalid listing ID or server error',
    });
  }
};

/**
 * @desc    Get all listings created by the logged-in user
 * @route   GET /api/listings/my
 * @access  Private (Waste Generator)
 */
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ generator: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user listings',
    });
  }
};

/**
 * @desc    Update listing
 * @route   PUT /api/listings/:id
 * @access  Private (Owner or Admin)
 */
export const updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership
    if (listing.generator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    // If updating location, reformat coordinates if lat/lng are provided
    if (req.body.location) {
      if (req.body.location.lat !== undefined && req.body.location.lng !== undefined) {
        req.body.location = {
          ...req.body.location,
          type: 'Point',
          coordinates: [Number(req.body.location.lng), Number(req.body.location.lat)],
        };
      }
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing,
    });
  } catch (error) {
    console.error('Update listing error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating listing',
    });
  }
};

/**
 * @desc    Delete listing
 * @route   DELETE /api/listings/:id
 * @access  Private (Owner or Admin)
 */
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership
    if (listing.generator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting listing',
    });
  }
};
