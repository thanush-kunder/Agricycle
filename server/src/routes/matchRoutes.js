import express from 'express';
import {
  getRecommendations,
  getNearbyListings,
  getMatchStats,
} from '../controllers/matchController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public — supply/demand statistics for heatmap
router.get('/stats', getMatchStats);

// Public — nearby listings with proper distance-based pagination
router.get('/nearby', getNearbyListings);

// Private — personalised scored recommendations for logged-in utilizers
router.get('/recommendations', protect, getRecommendations);

export default router;
