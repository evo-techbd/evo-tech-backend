"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPointService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const pickuppoint_model_1 = require("./pickuppoint.model");
// Create a new pickup point
const createPickupPointIntoDB = async (payload) => {
    const result = await pickuppoint_model_1.PickupPoint.create(payload);
    return result;
};
// Get all active pickup points for public display
const getActivePickupPointsFromDB = async () => {
    const result = await pickuppoint_model_1.PickupPoint.find({ isActive: true }).sort({
        sortOrder: 1,
    });
    return result;
};
// Get all pickup points (admin)
const getAllPickupPointsFromDB = async () => {
    const result = await pickuppoint_model_1.PickupPoint.find().sort({ sortOrder: 1 });
    return result;
};
// Get single pickup point by ID
const getSinglePickupPointFromDB = async (id) => {
    const result = await pickuppoint_model_1.PickupPoint.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Pickup point not found");
    }
    return result;
};
// Update pickup point
const updatePickupPointIntoDB = async (id, payload) => {
    const pickupPoint = await pickuppoint_model_1.PickupPoint.findById(id);
    if (!pickupPoint) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Pickup point not found");
    }
    const result = await pickuppoint_model_1.PickupPoint.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete pickup point
const deletePickupPointFromDB = async (id) => {
    const pickupPoint = await pickuppoint_model_1.PickupPoint.findById(id);
    if (!pickupPoint) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Pickup point not found");
    }
    const result = await pickuppoint_model_1.PickupPoint.findByIdAndDelete(id);
    return result;
};
// Toggle pickup point active status
const togglePickupPointStatus = async (id) => {
    const pickupPoint = await pickuppoint_model_1.PickupPoint.findById(id);
    if (!pickupPoint) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Pickup point not found");
    }
    const result = await pickuppoint_model_1.PickupPoint.findByIdAndUpdate(id, { isActive: !pickupPoint.isActive }, { new: true });
    return result;
};
exports.PickupPointService = {
    createPickupPointIntoDB,
    getActivePickupPointsFromDB,
    getAllPickupPointsFromDB,
    getSinglePickupPointFromDB,
    updatePickupPointIntoDB,
    deletePickupPointFromDB,
    togglePickupPointStatus,
};
//# sourceMappingURL=pickuppoint.service.js.map