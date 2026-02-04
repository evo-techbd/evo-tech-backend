import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TermsService } from "./terms.service";

// Create or update terms and conditions
const createOrUpdateTerms = catchAsync(async (req, res) => {
  const result = await TermsService.createOrUpdateTermsIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Terms and conditions created successfully",
    data: result,
  });
});

// Get active terms and conditions (public)
const getActiveTerms = catchAsync(async (req, res) => {
  const result = await TermsService.getActiveTermsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active terms and conditions retrieved successfully",
    data: result,
  });
});

// Get all terms history (admin)
const getAllTerms = catchAsync(async (req, res) => {
  const result = await TermsService.getAllTermsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All terms and conditions retrieved successfully",
    data: result,
  });
});

// Get single terms
const getSingleTerms = catchAsync(async (req, res) => {
  const result = await TermsService.getSingleTermsFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Terms and conditions retrieved successfully",
    data: result,
  });
});

// Update terms
const updateTerms = catchAsync(async (req, res) => {
  const result = await TermsService.updateTermsIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Terms and conditions updated successfully",
    data: result,
  });
});

// Delete terms
const deleteTerms = catchAsync(async (req, res) => {
  const result = await TermsService.deleteTermsFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Terms and conditions deleted successfully",
    data: result,
  });
});

export const TermsController = {
  createOrUpdateTerms,
  getActiveTerms,
  getAllTerms,
  getSingleTerms,
  updateTerms,
  deleteTerms,
};
