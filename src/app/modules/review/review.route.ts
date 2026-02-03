import express from "express";
import multer from "multer";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all reviews for a product
router.get(
  "/products/:productId/reviews",
  ReviewControllers.getReviewsByProduct
);

// Add a new review for a product (with optional image upload) - requires authentication
router.post(
  "/products/:productId/reviews",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  upload.single("userImage"),
  ReviewControllers.addReview
);

// Update a review (with optional image upload) - requires authentication
router.put(
  "/reviews/:reviewId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  upload.single("userImage"),
  ReviewControllers.updateReview
);

// Delete a review - requires authentication
router.delete(
  "/reviews/:reviewId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  ReviewControllers.deleteReview
);

export const ReviewRoutes = router;
