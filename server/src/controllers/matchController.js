import { Listing } from '../models/index.js';
import { rankListings, WEIGHT_PROFILES } from '../utils/matchingAlgorithm.js';
import { calculateHaversineDistance, isValidCoordinates } from '../utils/haversine.js';

/**
 * @desc    Get smart-matched listing recommendations for a utilizer
 * @route   GET /api/match/recommendations
 * @access  Private (any authenticated user)
 *
 * Query params:
 *   lat, lng             — user's current location (required)
 *   wasteType            — preferred waste type (optional)
 *   neededKg             — quantity the user needs (optional)
 *   maxPricePerKg        — max ₹/kg willing to pay (optional)
 *   maxDistanceKm        — pre-filter radius in km (optional, default 100)
 *   priority             — matching priority: 'balanced' | 'proximity' | 'budget' | 'quality' (default: balanced)
 *   limit                — max results to return (optional, default 20)
 */
export const getRecommendations = async (req, res) => {
  try {
    const {
      lat,
      lng,
      wasteType,
      neededKg,
      maxPricePerKg,
      maxDistanceKm = 100,
      priority = 'balanced',
      limit = 20,
    } = req.query;

    // ── Validate coordinates ──
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your location (lat and lng query params)',
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    if (!isValidCoordinates(userLat, userLng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180',
      });
    }

    // ── Build MongoDB query ──
    const query = { status: 'available' };

    // Optionally filter by waste type
    if (wasteType) {
      query.wasteType = wasteType;
    }

    // Geospatial pre-filter: only fetch listings within radius
    const radiusKm = Number(maxDistanceKm);
    const radiusInRadians = radiusKm / 6371;
    query.location = {
      $geoWithin: {
        $centerSphere: [[userLng, userLat], radiusInRadians],
      },
    };

    // Fetch candidate listings from DB
    const candidates = await Listing.find(query)
      .populate('generator', 'name phone organization email location')
      .lean();

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: `No available listings found within ${radiusKm} km`,
        data: [],
      });
    }

    // ── Run scoring algorithm ──
    const preferences = {
      lat: userLat,
      lng: userLng,
      neededKg: neededKg ? Number(neededKg) : null,
      maxPricePerKg: maxPricePerKg ? Number(maxPricePerKg) : null,
      preferredWasteType: wasteType || null,
    };

    const selectedWeights = WEIGHT_PROFILES[priority] || WEIGHT_PROFILES.balanced;
    const ranked = rankListings(candidates, preferences, selectedWeights);

    // Limit results
    const limitNum = Math.min(parseInt(limit, 10) || 20, 50);
    const topMatches = ranked.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      count: topMatches.length,
      totalCandidates: candidates.length,
      searchRadius: `${radiusKm} km`,
      data: topMatches,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating recommendations',
    });
  }
};

/**
 * @desc    Get nearby listings using MongoDB $geoNear aggregation
 *          (fixes the pagination + distance sort bug in getAllListings)
 * @route   GET /api/match/nearby
 * @access  Public
 *
 * Query params:
 *   lat, lng             — user's location (required)
 *   maxDistanceKm        — search radius in km (optional, default 50)
 *   wasteType            — filter by waste type (optional)
 *   page, limit          — pagination (optional, defaults: page=1, limit=10)
 */
export const getNearbyListings = async (req, res) => {
  try {
    const {
      lat,
      lng,
      maxDistanceKm = 50,
      wasteType,
      page = 1,
      limit = 10,
    } = req.query;

    // ── Validate coordinates ──
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide lat and lng query params',
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    if (!isValidCoordinates(userLat, userLng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180',
      });
    }

    const maxDistMeters = Number(maxDistanceKm) * 1000;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // ── $geoNear aggregation pipeline ──
    // This sorts by distance at the DB level BEFORE pagination,
    // fixing the bug where distance sort happened after skip/limit.
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [userLng, userLat],
          },
          distanceField: 'distanceMeters',
          maxDistance: maxDistMeters,
          spherical: true,
          query: {
            status: 'available',
            ...(wasteType ? { wasteType } : {}),
          },
        },
      },
      // Add distanceKm field
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 2] },
        },
      },
      // Facet for total count + paginated data in one query
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limitNum }],
        },
      },
    ];

    const [result] = await Listing.aggregate(pipeline);

    const total = result.metadata[0]?.total || 0;
    const listings = result.data;

    // Populate generator details (aggregate doesn't auto-populate)
    await Listing.populate(listings, {
      path: 'generator',
      select: 'name phone organization email',
    });

    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      searchRadius: `${maxDistanceKm} km`,
      data: listings,
    });
  } catch (error) {
    console.error('Nearby listings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching nearby listings',
    });
  }
};

/**
 * @desc    Get match statistics — waste type demand heatmap data
 * @route   GET /api/match/stats
 * @access  Public
 *
 * Returns count of available listings grouped by wasteType and
 * average coordinates (centroid) for each group — useful for
 * rendering a demand/supply heatmap on the frontend.
 */
export const getMatchStats = async (req, res) => {
  try {
    const stats = await Listing.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          totalQuantityKg: { $sum: '$availableQuantityKg' },
          avgPricePerKg: { $avg: '$pricePerKg' },
          avgLng: { $avg: { $arrayElemAt: ['$location.coordinates', 0] } },
          avgLat: { $avg: { $arrayElemAt: ['$location.coordinates', 1] } },
        },
      },
      {
        $project: {
          _id: 0,
          wasteType: '$_id',
          count: 1,
          totalQuantityKg: { $round: ['$totalQuantityKg', 2] },
          avgPricePerKg: { $round: ['$avgPricePerKg', 2] },
          centroid: {
            lat: { $round: ['$avgLat', 4] },
            lng: { $round: ['$avgLng', 4] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      count: stats.length,
      data: stats,
    });
  } catch (error) {
    console.error('Match stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching match statistics',
    });
  }
};
