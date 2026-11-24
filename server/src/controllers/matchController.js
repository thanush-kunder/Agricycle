import { Listing } from '../models/index.js';
import { rankListings, WEIGHT_PROFILES } from '../utils/matchingAlgorithm.js';
import { isValidCoordinates, extractCoordinates } from '../utils/haversine.js';

/**
 * =====================================================================
 * AgriCycle — Matching & Recommendation Controller
 * Author: Shreya (4CB24CS141)
 * Scope : Matching Algorithms & Geospatial Proximity
 * =====================================================================
 */

/**
 * @desc    Get smart-matched listing recommendations for a utilizer
 * @route   GET /api/match/recommendations
 * @access  Public / Optional Auth
 *
 * Query params:
 *   lat, lng             — user's current location (required)
 *   wasteType            — preferred waste type (optional)
 *   neededKg             — quantity the user needs (optional)
 *   maxPricePerKg        — max ₹/kg willing to pay (optional)
 *   maxDistanceKm        — search radius in km (optional, default 100)
 *   priority             — 'balanced' | 'proximity' | 'budget' | 'quality' (default: balanced)
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

    // ── 1. Validate Geographic Coordinates ──
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates (lat and lng query params)',
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    if (!isValidCoordinates(userLat, userLng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180',
      });
    }

    // ── 2. Build Query & Proximity Boundary ──
    const query = { status: 'available' };

    // Filter by waste type if specified
    if (wasteType && wasteType.trim() !== '') {
      query.wasteType = new RegExp(`^${wasteType.trim()}$`, 'i');
    }

    // Filter by maximum acceptable price if specified
    if (maxPricePerKg && !isNaN(Number(maxPricePerKg))) {
      query.pricePerKg = { $lte: Number(maxPricePerKg) };
    }

    const radiusKm = Number(maxDistanceKm) > 0 ? Number(maxDistanceKm) : 100;
    const radiusInRadians = radiusKm / 6371; // Earth's mean radius ~6371 km

    query.location = {
      $geoWithin: {
        $centerSphere: [[userLng, userLat], radiusInRadians],
      },
    };

    // Fetch candidate listings from MongoDB
    let candidates = await Listing.find(query)
      .populate('generator', 'name phone organization email location')
      .lean();

    // Fallback: If no listings found within radius, broaden query across all Karnataka listings
    let expandedSearch = false;
    if (candidates.length === 0) {
      delete query.location;
      candidates = await Listing.find(query)
        .populate('generator', 'name phone organization email location')
        .lean();
      expandedSearch = true;
    }

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No available waste listings match your criteria at this moment.',
        data: [],
      });
    }

    // ── 3. Execute Multi-Criteria Matching Algorithm ──
    const preferences = {
      lat: userLat,
      lng: userLng,
      neededKg: neededKg ? Number(neededKg) : null,
      maxPricePerKg: maxPricePerKg ? Number(maxPricePerKg) : null,
      preferredWasteType: wasteType ? wasteType.trim() : null,
    };

    const selectedWeights = WEIGHT_PROFILES[priority] || WEIGHT_PROFILES.balanced;
    const rankedListings = rankListings(candidates, preferences, selectedWeights);

    // Limit returned recommendations (max 50)
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 20), 50);
    const topMatches = rankedListings.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      count: topMatches.length,
      totalCandidates: candidates.length,
      priorityApplied: priority in WEIGHT_PROFILES ? priority : 'balanced',
      searchRadius: expandedSearch ? 'expanded (state-wide)' : `${radiusKm} km`,
      data: topMatches,
    });
  } catch (error) {
    console.error('Recommendations API Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating recommendations',
    });
  }
};

/**
 * @desc    Get nearby listings using MongoDB $geoNear aggregation
 *          (sorts by distance at the database level before paginating)
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

    // ── 1. Validate Coordinates ──
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates (lat and lng query params)',
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);

    if (!isValidCoordinates(userLat, userLng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180',
      });
    }

    const maxDistMeters = Math.max(1, Number(maxDistanceKm) || 50) * 1000;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 10), 50);
    const skip = (pageNum - 1) * limitNum;

    // ── 2. MongoDB $geoNear Aggregation Pipeline ──
    const geoNearStage = {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [userLng, userLat],
        },
        key: 'location',
        distanceField: 'distanceMeters',
        maxDistance: maxDistMeters,
        spherical: true,
        query: {
          status: 'available',
          ...(wasteType ? { wasteType: new RegExp(`^${wasteType.trim()}$`, 'i') } : {}),
        },
      },
    };

    const pipeline = [
      geoNearStage,
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 2] },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limitNum }],
        },
      },
    ];

    let total = 0;
    let listings = [];

    try {
      const aggResults = await Listing.aggregate(pipeline);
      const result = aggResults && aggResults.length > 0 ? aggResults[0] : null;

      total = result?.metadata?.[0]?.total || 0;
      listings = result?.data || [];

      if (listings.length > 0) {
        await Listing.populate(listings, {
          path: 'generator',
          select: 'name phone organization email',
        });
      }
    } catch (aggErr) {
      // Graceful fallback to find query if 2dsphere index is still building or on mock memory
      console.warn('GeoNear aggregation fallback:', aggErr.message);
      const radiusInRadians = (maxDistMeters / 1000) / 6371;
      const fallbackQuery = {
        status: 'available',
        ...(wasteType ? { wasteType } : {}),
        location: {
          $geoWithin: {
            $centerSphere: [[userLng, userLat], radiusInRadians],
          },
        },
      };

      total = await Listing.countDocuments(fallbackQuery);
      listings = await Listing.find(fallbackQuery)
        .populate('generator', 'name phone organization email')
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Annotate Haversine distance
      listings = listings.map((item) => {
        const coords = extractCoordinates(item.location);
        const dist = coords
          ? calculateHaversineDistance(userLat, userLng, coords.lat, coords.lng)
          : null;
        return { ...item, distanceKm: dist };
      });
    }

    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      searchRadius: `${Number(maxDistanceKm) || 50} km`,
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
          totalQuantityKg: { $round: [{ $ifNull: ['$totalQuantityKg', 0] }, 2] },
          avgPricePerKg: { $round: [{ $ifNull: ['$avgPricePerKg', 0] }, 2] },
          centroid: {
            lat: { $round: [{ $ifNull: ['$avgLat', 0] }, 4] },
            lng: { $round: [{ $ifNull: ['$avgLng', 0] }, 4] },
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

export default {
  getRecommendations,
  getNearbyListings,
  getMatchStats,
};
