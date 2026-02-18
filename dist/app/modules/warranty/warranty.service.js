"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarrantyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const warranty_model_1 = require("./warranty.model");
// Create or update warranty information (only one active at a time)
const createOrUpdateWarrantyIntoDB = async (payload) => {
    // Deactivate all existing warranty information
    await warranty_model_1.Warranty.updateMany({}, { isActive: false });
    // Create new warranty information
    const result = await warranty_model_1.Warranty.create({ ...payload, isActive: true });
    return result;
};
// Get active warranty information (public)
const getActiveWarrantyFromDB = async () => {
    const result = await warranty_model_1.Warranty.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Warranty information not found");
    }
    return result;
};
// Get all warranty information history (admin)
const getAllWarrantyFromDB = async () => {
    const result = await warranty_model_1.Warranty.find().sort({ updatedAt: -1 });
    return result;
};
// Get single warranty information by ID
const getSingleWarrantyFromDB = async (id) => {
    const result = await warranty_model_1.Warranty.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Warranty information not found");
    }
    return result;
};
// Update warranty information
const updateWarrantyIntoDB = async (id, payload) => {
    const warranty = await warranty_model_1.Warranty.findById(id);
    if (!warranty) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Warranty information not found");
    }
    // If setting this version as active, deactivate all others
    if (payload.isActive === true) {
        await warranty_model_1.Warranty.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    const result = await warranty_model_1.Warranty.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete warranty information
const deleteWarrantyFromDB = async (id) => {
    const warranty = await warranty_model_1.Warranty.findById(id);
    if (!warranty) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Warranty information not found");
    }
    // Don't allow deletion of active warranty information
    if (warranty.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete active warranty information. Please activate another version first.");
    }
    const result = await warranty_model_1.Warranty.findByIdAndDelete(id);
    return result;
};
exports.WarrantyService = {
    createOrUpdateWarrantyIntoDB,
    getActiveWarrantyFromDB,
    getAllWarrantyFromDB,
    getSingleWarrantyFromDB,
    updateWarrantyIntoDB,
    deleteWarrantyFromDB,
};
//# sourceMappingURL=warranty.service.js.map