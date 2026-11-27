import express from 'express';
import {
  analyzeWasteImage,
  assessAndSaveReport,
  getMyAnalyses,
  getAnalysisById,
  publishListingFromAnalysis,
  getAllAnalysesForAdmin,
  reviewAnalysisByAdmin,
  getReferencePricing,
  updateReferencePricing,
} from '../controllers/wasteAnalysisController.js';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. Initial image analysis (Gemini Vision / local CV)
router.post(
  '/analyze-image',
  upload.single('image'),
  handleUploadError,
  analyzeWasteImage
);

// 2. Submit farmer details & calculate grade/score/pricing report
router.post('/assess', protect, assessAndSaveReport);

// 3. Farmer report history
router.get('/my', protect, getMyAnalyses);

// 4. Single report lookup
router.get('/:id', protect, getAnalysisById);

// 5. Convert verified report directly into an active marketplace listing
router.post('/:id/publish-listing', protect, publishListingFromAnalysis);

// 6. Public reference pricing
router.get('/pricing/catalog', getReferencePricing);

// 7. Administrator audit & pricing control
router.get('/admin/all', protect, authorize('admin'), getAllAnalysesForAdmin);
router.put('/admin/:id/review', protect, authorize('admin'), reviewAnalysisByAdmin);
router.put('/admin/pricing', protect, authorize('admin'), updateReferencePricing);

export default router;
