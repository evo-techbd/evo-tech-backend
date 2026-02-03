import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LandingSectionService } from "./landingsection.service";

// Create landing section
const createLandingSection = catchAsync(async (req, res) => {
  const result = await LandingSectionService.createLandingSectionIntoDB(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Landing section created successfully",
    data: result,
  });
});

// Get active landing sections (public)
const getActiveLandingSections = catchAsync(async (req, res) => {
  const result = await LandingSectionService.getActiveLandingSectionsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active landing sections retrieved successfully",
    data: result,
  });
});

// Get all landing sections (admin)
const getAllLandingSections = catchAsync(async (req, res) => {
  const result = await LandingSectionService.getAllLandingSectionsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All landing sections retrieved successfully",
    data: result,
  });
});

// Get single landing section
const getSingleLandingSection = catchAsync(async (req, res) => {
  const result = await LandingSectionService.getSingleLandingSectionFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing section retrieved successfully",
    data: result,
  });
});

// Update landing section
const updateLandingSection = catchAsync(async (req, res) => {
  const result = await LandingSectionService.updateLandingSectionIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing section updated successfully",
    data: result,
  });
});

// Delete landing section
const deleteLandingSection = catchAsync(async (req, res) => {
  const result = await LandingSectionService.deleteLandingSectionFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing section deleted successfully",
    data: result,
  });
});

// Toggle landing section status
const toggleLandingSectionStatus = catchAsync(async (req, res) => {
  const result = await LandingSectionService.toggleLandingSectionStatus(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Landing section status toggled successfully",
    data: result,
  });
});

export const LandingSectionController = {
  createLandingSection,
  getActiveLandingSections,
  getAllLandingSections,
  getSingleLandingSection,
  updateLandingSection,
  deleteLandingSection,
  toggleLandingSectionStatus,
};
