import express from 'express';
import { chatWithAI, verifyCropImage, checkAIHealth } from '../controllers/aiController.js';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/ai/health
 * @desc    Check health status of AI microservice and backend integration
 * @access  Public
 */
router.get('/health', checkAIHealth);

/**
 * @route   POST /api/ai/chat
 * @desc    Agricultural circular bio-economy advisory chatbot
 * @access  Public
 */
router.post('/chat', chatWithAI);

/**
 * @route   POST /api/ai/verify
 * @desc    Upload & verify crop residue image, optionally updating listing
 * @access  Private
 */
router.post(
  '/verify',
  protect,
  upload.single('image'),
  handleUploadError,
  verifyCropImage
);

export default router;
