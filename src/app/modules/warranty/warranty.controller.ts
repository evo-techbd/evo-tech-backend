import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WarrantyService } from "./warranty.service";

// Create or update warranty information
const createOrUpdateWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.createOrUpdateWarrantyIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Warranty information created successfully",
    data: result,
  });
});

// Get active warranty information (public)
const getActiveWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.getActiveWarrantyFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active warranty information retrieved successfully",
    data: result,
  });
});

// Get all warranty information history (admin)
const getAllWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.getAllWarrantyFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All warranty information retrieved successfully",
    data: result,
  });
});

// Get single warranty information
const getSingleWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.getSingleWarrantyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warranty information retrieved successfully",
    data: result,
  });
});

// Update warranty information
const updateWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.updateWarrantyIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warranty information updated successfully",
    data: result,
  });
});

// Delete warranty information
const deleteWarranty = catchAsync(async (req, res) => {
  const result = await WarrantyService.deleteWarrantyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Warranty information deleted successfully",
    data: result,
  });
});

export const WarrantyController = {
  createOrUpdateWarranty,
  getActiveWarranty,
  getAllWarranty,
  getSingleWarranty,
  updateWarranty,
  deleteWarranty,
};
