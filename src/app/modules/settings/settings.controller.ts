import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SettingsService } from "./settings.service";

// Get delivery charge settings (public - used to calculate checkout totals)
const getDeliveryChargeSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.getDeliveryChargeSettingsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delivery charge settings retrieved successfully",
    data: result,
  });
});

// Update delivery charge settings (admin only)
const updateDeliveryChargeSettings = catchAsync(async (req, res) => {
  const result = await SettingsService.updateDeliveryChargeSettingsIntoDB(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delivery charge settings updated successfully",
    data: result,
  });
});

export const SettingsController = {
  getDeliveryChargeSettings,
  updateDeliveryChargeSettings,
};
