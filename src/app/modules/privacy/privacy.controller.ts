import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrivacyService } from "./privacy.service";

// Create or update privacy policy
const createOrUpdatePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.createOrUpdatePrivacyIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Privacy policy created successfully",
    data: result,
  });
});

// Get active privacy policy (public)
const getActivePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.getActivePrivacyFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active privacy policy retrieved successfully",
    data: result,
  });
});

// Get all privacy policies history (admin)
const getAllPrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.getAllPrivacyFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All privacy policies retrieved successfully",
    data: result,
  });
});

// Get single privacy policy
const getSinglePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.getSinglePrivacyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy policy retrieved successfully",
    data: result,
  });
});

// Update privacy policy
const updatePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.updatePrivacyIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy policy updated successfully",
    data: result,
  });
});

// Delete privacy policy
const deletePrivacy = catchAsync(async (req, res) => {
  const result = await PrivacyService.deletePrivacyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Privacy policy deleted successfully",
    data: result,
  });
});

export const PrivacyController = {
  createOrUpdatePrivacy,
  getActivePrivacy,
  getAllPrivacy,
  getSinglePrivacy,
  updatePrivacy,
  deletePrivacy,
};
