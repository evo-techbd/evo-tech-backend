import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

const getReviewsByProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewServices.getReviewsByProductFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const addReview = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;
  const userUuid = req.user?.uuid;
  const result = await ReviewServices.addReviewIntoDB(
    productId,
    req.body,
    imageBuffer,
    userUuid as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review added successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await ReviewServices.updateReviewIntoDB(
    reviewId,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  await ReviewServices.deleteReviewFromDB(reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewControllers = {
  getReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
};
