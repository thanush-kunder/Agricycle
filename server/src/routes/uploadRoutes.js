import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { upload, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload multiple listing crop images (up to 5)
 * @access  Private
 */
router.post(
  '/',
  protect,
  upload.array('images', 5),
  handleUploadError,
  uploadImages
);

/**
 * @route   POST /api/upload/single
 * @desc    Upload single crop residue image (e.g. for verification)
 * @access  Private
 */
router.post(
  '/single',
  protect,
  upload.single('image'),
  handleUploadError,
  uploadImages
);

export default router;
