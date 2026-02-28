"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPointController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pickuppoint_service_1 = require("./pickuppoint.service");
// Create pickup point
const createPickupPoint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.createPickupPointIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Pickup point created successfully",
        data: result,
    });
});
// Get active pickup points (public)
const getActivePickupPoints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.getActivePickupPointsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active pickup points retrieved successfully",
        data: result,
    });
});
// Get all pickup points (admin)
const getAllPickupPoints = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.getAllPickupPointsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All pickup points retrieved successfully",
        data: result,
    });
});
// Get single pickup point
const getSinglePickupPoint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.getSinglePickupPointFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pickup point retrieved successfully",
        data: result,
    });
});
// Update pickup point
const updatePickupPoint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.updatePickupPointIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pickup point updated successfully",
        data: result,
    });
});
// Delete pickup point
const deletePickupPoint = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.deletePickupPointFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pickup point deleted successfully",
        data: result,
    });
});
// Toggle pickup point status
const togglePickupPointStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await pickuppoint_service_1.PickupPointService.togglePickupPointStatus(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pickup point status toggled successfully",
        data: result,
    });
});
exports.PickupPointController = {
    createPickupPoint,
    getActivePickupPoints,
    getAllPickupPoints,
    getSinglePickupPoint,
    updatePickupPoint,
    deletePickupPoint,
    togglePickupPointStatus,
};
//# sourceMappingURL=pickuppoint.controller.js.map