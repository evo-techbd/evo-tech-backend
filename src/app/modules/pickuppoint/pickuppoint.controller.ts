import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PickupPointService } from "./pickuppoint.service";

// Create pickup point
const createPickupPoint = catchAsync(async (req, res) => {
  const result = await PickupPointService.createPickupPointIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Pickup point created successfully",
    data: result,
  });
});

// Get active pickup points (public)
const getActivePickupPoints = catchAsync(async (req, res) => {
  const result = await PickupPointService.getActivePickupPointsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active pickup points retrieved successfully",
    data: result,
  });
});

// Get all pickup points (admin)
const getAllPickupPoints = catchAsync(async (req, res) => {
  const result = await PickupPointService.getAllPickupPointsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All pickup points retrieved successfully",
    data: result,
  });
});

// Get single pickup point
const getSinglePickupPoint = catchAsync(async (req, res) => {
  const result = await PickupPointService.getSinglePickupPointFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup point retrieved successfully",
    data: result,
  });
});

// Update pickup point
const updatePickupPoint = catchAsync(async (req, res) => {
  const result = await PickupPointService.updatePickupPointIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup point updated successfully",
    data: result,
  });
});

// Delete pickup point
const deletePickupPoint = catchAsync(async (req, res) => {
  const result = await PickupPointService.deletePickupPointFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup point deleted successfully",
    data: result,
  });
});

// Toggle pickup point status
const togglePickupPointStatus = catchAsync(async (req, res) => {
  const result = await PickupPointService.togglePickupPointStatus(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pickup point status toggled successfully",
    data: result,
  });
});

export const PickupPointController = {
  createPickupPoint,
  getActivePickupPoints,
  getAllPickupPoints,
  getSinglePickupPoint,
  updatePickupPoint,
  deletePickupPoint,
  togglePickupPointStatus,
};
