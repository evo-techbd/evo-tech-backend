import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FaqService } from "./faq.service";

// Create FAQ
const createFaq = catchAsync(async (req, res) => {
  const result = await FaqService.createFaqIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "FAQ created successfully",
    data: result,
  });
});

// Get active FAQs (public)
const getActiveFaqs = catchAsync(async (req, res) => {
  const result = await FaqService.getActiveFaqsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active FAQs retrieved successfully",
    data: result,
  });
});

// Get all FAQs (admin)
const getAllFaqs = catchAsync(async (req, res) => {
  const result = await FaqService.getAllFaqsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All FAQs retrieved successfully",
    data: result,
  });
});

// Get single FAQ
const getSingleFaq = catchAsync(async (req, res) => {
  const result = await FaqService.getSingleFaqFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ retrieved successfully",
    data: result,
  });
});

// Update FAQ
const updateFaq = catchAsync(async (req, res) => {
  const result = await FaqService.updateFaqIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ updated successfully",
    data: result,
  });
});

// Delete FAQ
const deleteFaq = catchAsync(async (req, res) => {
  const result = await FaqService.deleteFaqFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ deleted successfully",
    data: result,
  });
});

export const FaqController = {
  createFaq,
  getActiveFaqs,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};
