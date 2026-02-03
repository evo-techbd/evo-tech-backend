"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const getReviewsByProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await review_service_1.ReviewServices.getReviewsByProductFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reviews retrieved successfully",
        data: result,
    });
});
const addReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    const userUuid = req.user?.uuid;
    const result = await review_service_1.ReviewServices.addReviewIntoDB(productId, req.body, imageBuffer, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Review added successfully",
        data: result,
    });
});
const updateReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reviewId } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await review_service_1.ReviewServices.updateReviewIntoDB(reviewId, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review updated successfully",
        data: result,
    });
});
const deleteReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reviewId } = req.params;
    await review_service_1.ReviewServices.deleteReviewFromDB(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review deleted successfully",
        data: null,
    });
});
exports.ReviewControllers = {
    getReviewsByProduct,
    addReview,
    updateReview,
    deleteReview,
};
//# sourceMappingURL=review.controller.js.map