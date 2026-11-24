import express from 'express';
import {
  getRecommendations,
  getNearbyListings,
  getMatchStats,
} from '../controllers/matchController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public — supply & demand statistics for heatmap
router.get('/stats', getMatchStats);

// Public — nearby listings with database-level distance-based pagination
router.get('/nearby', getNearbyListings);

// Open to all users (with optional user context if authenticated) — personalized scored recommendations
router.get('/recommendations', optionalAuth, getRecommendations);

export default router;
