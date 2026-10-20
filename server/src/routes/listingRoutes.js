import express from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Publicly view all listings; Generators & Admins can create new listings
router
  .route('/')
  .get(getAllListings)
  .post(protect, authorize('generator', 'admin'), createListing);

// Get listings belonging to the currently logged in generator
router.get('/my', protect, getMyListings);

// Individual listing operations
router
  .route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

export default router;
