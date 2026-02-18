"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const privacy_model_1 = require("./privacy.model");
// Create or update privacy policy (only one active at a time)
const createOrUpdatePrivacyIntoDB = async (payload) => {
    // Deactivate all existing privacy policies
    await privacy_model_1.Privacy.updateMany({}, { isActive: false });
    // Create new privacy policy
    const result = await privacy_model_1.Privacy.create({ ...payload, isActive: true });
    return result;
};
// Get active privacy policy (public)
const getActivePrivacyFromDB = async () => {
    const result = await privacy_model_1.Privacy.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Privacy policy not found");
    }
    return result;
};
// Get all privacy policies history (admin)
const getAllPrivacyFromDB = async () => {
    const result = await privacy_model_1.Privacy.find().sort({ updatedAt: -1 });
    return result;
};
// Get single privacy policy by ID
const getSinglePrivacyFromDB = async (id) => {
    const result = await privacy_model_1.Privacy.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Privacy policy not found");
    }
    return result;
};
// Update privacy policy
const updatePrivacyIntoDB = async (id, payload) => {
    const privacy = await privacy_model_1.Privacy.findById(id);
    if (!privacy) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Privacy policy not found");
    }
    // If setting this version as active, deactivate all others
    if (payload.isActive === true) {
        await privacy_model_1.Privacy.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    const result = await privacy_model_1.Privacy.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete privacy policy
const deletePrivacyFromDB = async (id) => {
    const privacy = await privacy_model_1.Privacy.findById(id);
    if (!privacy) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Privacy policy not found");
    }
    // Don't allow deletion of active privacy policy
    if (privacy.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete active privacy policy. Please activate another version first.");
    }
    const result = await privacy_model_1.Privacy.findByIdAndDelete(id);
    return result;
};
exports.PrivacyService = {
    createOrUpdatePrivacyIntoDB,
    getActivePrivacyFromDB,
    getAllPrivacyFromDB,
    getSinglePrivacyFromDB,
    updatePrivacyIntoDB,
    deletePrivacyFromDB,
};
//# sourceMappingURL=privacy.service.js.map