"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const review_model_1 = require("./review.model");
const product_model_1 = require("../product/product.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("../order/order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const getReviewsByProductFromDB = async (productId) => {
    const reviews = await review_model_1.Review.find({ product: productId }).sort({
        createdAt: -1,
    });
    return reviews;
};
const addReviewIntoDB = async (productId, payload, imageBuffer, userUuid) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Get user info if authenticated
    let userId;
    let userName = payload.userName || "Anonymous";
    let isVerifiedPurchase = false;
    if (userUuid) {
        const user = await user_model_1.User.findOne({ uuid: userUuid });
        if (user) {
            userId = user._id;
            // Use user's full name from the database
            userName = `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`;
            // Check if user has purchased this product (if orderId provided)
            if (payload.orderId) {
                const order = await order_model_1.Order.findOne({
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
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "reviews");
        payload.userImage = imageUrl;
    }
    const review = await review_model_1.Review.create({
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
    const reviews = await review_model_1.Review.find({ product: productId });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product_model_1.Product.findByIdAndUpdate(productId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
    });
    return review;
};
const updateReviewIntoDB = async (reviewId, payload, imageBuffer) => {
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "reviews");
        payload.userImage = imageUrl;
    }
    const review = await review_model_1.Review.findByIdAndUpdate(reviewId, payload, {
        new: true,
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    // Update product rating
    const reviews = await review_model_1.Review.find({ product: review.product });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product_model_1.Product.findByIdAndUpdate(review.product, {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
    });
    return review;
};
const deleteReviewFromDB = async (reviewId) => {
    const review = await review_model_1.Review.findByIdAndDelete(reviewId);
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    // Update product rating
    const reviews = await review_model_1.Review.find({ product: review.product });
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await product_model_1.Product.findByIdAndUpdate(review.product, {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
    });
    return review;
};
exports.ReviewServices = {
    getReviewsByProductFromDB,
    addReviewIntoDB,
    updateReviewIntoDB,
    deleteReviewFromDB,
};
//# sourceMappingURL=review.service.js.map