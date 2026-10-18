"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintPricingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const print_pricing_service_1 = require("./print-pricing.service");
// Public - used by the 3D printing page calculator
const getPublicPricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await print_pricing_service_1.PrintPricingService.getPublicPricingFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "3D print pricing retrieved successfully",
        data: result,
    });
});
// Admin - includes hidden materials
const getPricingSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await print_pricing_service_1.PrintPricingService.getPricingSettingsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "3D print calculator settings retrieved successfully",
        data: result,
    });
});
const updatePricingSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await print_pricing_service_1.PrintPricingService.updatePricingSettingsIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "3D print calculator settings updated successfully",
        data: result,
    });
});
exports.PrintPricingController = {
    getPublicPricing,
    getPricingSettings,
    updatePricingSettings,
};
//# sourceMappingURL=print-pricing.controller.js.map