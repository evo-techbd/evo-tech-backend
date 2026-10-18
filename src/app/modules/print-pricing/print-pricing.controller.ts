import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrintPricingService } from "./print-pricing.service";

// Public - used by the 3D printing page calculator
const getPublicPricing = catchAsync(async (req, res) => {
  const result = await PrintPricingService.getPublicPricingFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "3D print pricing retrieved successfully",
    data: result,
  });
});

// Admin - includes hidden materials
const getPricingSettings = catchAsync(async (req, res) => {
  const result = await PrintPricingService.getPricingSettingsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "3D print calculator settings retrieved successfully",
    data: result,
  });
});

const updatePricingSettings = catchAsync(async (req, res) => {
  const result = await PrintPricingService.updatePricingSettingsIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "3D print calculator settings updated successfully",
    data: result,
  });
});

export const PrintPricingController = {
  getPublicPricing,
  getPricingSettings,
  updatePricingSettings,
};
