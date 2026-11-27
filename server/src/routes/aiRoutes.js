import express from 'express';
import { chatWithAI, streamChatWithAI, verifyCropImage, checkAIHealth } from '../controllers/aiController.js';
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
 * @desc    General-purpose & circular bio-economy conversational AI assistant
 * @access  Public
 */
router.post('/chat', chatWithAI);

/**
 * @route   POST /api/ai/chat/stream
 * @desc    Streaming conversational AI assistant via Server-Sent Events (SSE)
 * @access  Public
 */
router.post('/chat/stream', streamChatWithAI);

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
