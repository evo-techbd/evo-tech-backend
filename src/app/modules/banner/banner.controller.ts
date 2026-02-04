import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BannerService } from "./banner.service";

// Create banner
const createBanner = catchAsync(async (req, res) => {
  const file = req.file;

  if (!file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Banner image is required",
      data: null,
    });
  }

  const result = await BannerService.createBannerIntoDB(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Banner created successfully",
    data: result,
  });
});

// Get active banners (public)
const getActiveBanners = catchAsync(async (req, res) => {
  const result = await BannerService.getActiveBannersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active banners retrieved successfully",
    data: result,
  });
});

// Get all banners (admin)
const getAllBanners = catchAsync(async (req, res) => {
  const result = await BannerService.getAllBannersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All banners retrieved successfully",
    data: result,
  });
});

// Get single banner
const getSingleBanner = catchAsync(async (req, res) => {
  const result = await BannerService.getSingleBannerFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner retrieved successfully",
    data: result,
  });
});

// Update banner
const updateBanner = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await BannerService.updateBannerIntoDB(
    req.params.id,
    req.body,
    file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner updated successfully",
    data: result,
  });
});

// Delete banner
const deleteBanner = catchAsync(async (req, res) => {
  const result = await BannerService.deleteBannerFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner deleted successfully",
    data: result,
  });
});

// Toggle banner status
const toggleBannerStatus = catchAsync(async (req, res) => {
  const result = await BannerService.toggleBannerStatus(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner status toggled successfully",
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getActiveBanners,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
};
