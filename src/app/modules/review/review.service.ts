import { Review } from "./review.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { Order } from "../order/order.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getReviewsByProductFromDB = async (productId: string) => {
  const reviews = await Review.find({ product: productId }).sort({
    createdAt: -1,
  });
  return reviews;
};

const addReviewIntoDB = async (
  productId: string,
  payload: any,
  imageBuffer?: Buffer,
  userUuid?: string
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Get user info if authenticated
  let userId;
  let userName = payload.userName || "Anonymous";
  let isVerifiedPurchase = false;
  
  if (userUuid) {
    const user = await User.findOne({ uuid: userUuid });
    if (user) {
      userId = user._id;
      // Use user's full name from the database
      userName = `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`;
      
      // Check if user has purchased this product (if orderId provided)
      if (payload.orderId) {
        const order = await Order.findOne({
          _id: payload.orderId,
          user: userUuid,
          orderStatus: "delivered"
        });
        
        if (order) {
          isVerifiedPurchase = true;
        }
      }
    }
  }

  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "reviews");
    payload.userImage = imageUrl;
  }

  const review = await Review.create({
    product: productId,
    user: userId,
    order: payload.orderId || undefined,
    isVerifiedPurchase,
    userName: userName,
    rating: payload.rating,
    reviewText: payload.reviewText,
    userImage: payload.userImage,
  });

  // Update product rating and review count
  const reviews = await Review.find({ product: productId });
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: reviews.length,
  });

  return review;
};

const updateReviewIntoDB = async (
  reviewId: string,
  payload: any,
  imageBuffer?: Buffer
) => {
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "reviews");
    payload.userImage = imageUrl;
  }

  const review = await Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });

  return review;
};

const deleteReviewFromDB = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });

  return review;
};

export const ReviewServices = {
  getReviewsByProductFromDB,
  addReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
};
