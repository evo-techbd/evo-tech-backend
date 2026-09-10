"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const settings_service_1 = require("./settings.service");
// Get delivery charge settings (public - used to calculate checkout totals)
const getDeliveryChargeSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await settings_service_1.SettingsService.getDeliveryChargeSettingsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Delivery charge settings retrieved successfully",
        data: result,
    });
});
// Update delivery charge settings (admin only)
const updateDeliveryChargeSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await settings_service_1.SettingsService.updateDeliveryChargeSettingsIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Delivery charge settings updated successfully",
        data: result,
    });
});
exports.SettingsController = {
    getDeliveryChargeSettings,
    updateDeliveryChargeSettings,
};
//# sourceMappingURL=settings.controller.js.map