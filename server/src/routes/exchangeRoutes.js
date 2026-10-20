import express from 'express';
import {
  createExchangeRequest,
  getMyExchanges,
  getExchangeById,
  updateExchangeStatus,
  getImpactSummary,
} from '../controllers/exchangeController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public environmental metrics dashboard
router.get('/impact-summary', getImpactSummary);

// Protected routes
router.post('/', protect, authorize('utilizer', 'admin'), createExchangeRequest);
router.get('/my', protect, getMyExchanges);
router.get('/:id', protect, getExchangeById);
router.patch('/:id/status', protect, updateExchangeStatus);

export default router;
