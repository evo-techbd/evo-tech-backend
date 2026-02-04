"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const terms_model_1 = require("./terms.model");
// Create or update terms and conditions (only one active at a time)
const createOrUpdateTermsIntoDB = async (payload) => {
    // Deactivate all existing terms
    await terms_model_1.Terms.updateMany({}, { isActive: false });
    // Create new terms
    const result = await terms_model_1.Terms.create({ ...payload, isActive: true });
    return result;
};
// Get active terms and conditions (public)
const getActiveTermsFromDB = async () => {
    const result = await terms_model_1.Terms.findOne({ isActive: true }).sort({ updatedAt: -1 });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms and conditions not found");
    }
    return result;
};
// Get all terms history (admin)
const getAllTermsFromDB = async () => {
    const result = await terms_model_1.Terms.find().sort({ updatedAt: -1 });
    return result;
};
// Get single terms by ID
const getSingleTermsFromDB = async (id) => {
    const result = await terms_model_1.Terms.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms and conditions not found");
    }
    return result;
};
// Update terms
const updateTermsIntoDB = async (id, payload) => {
    const terms = await terms_model_1.Terms.findById(id);
    if (!terms) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms and conditions not found");
    }
    // If setting this version as active, deactivate all others
    if (payload.isActive === true) {
        await terms_model_1.Terms.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    const result = await terms_model_1.Terms.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete terms
const deleteTermsFromDB = async (id) => {
    const terms = await terms_model_1.Terms.findById(id);
    if (!terms) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Terms and conditions not found");
    }
    // Don't allow deletion of active terms
    if (terms.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete active terms and conditions. Please activate another version first.");
    }
    const result = await terms_model_1.Terms.findByIdAndDelete(id);
    return result;
};
exports.TermsService = {
    createOrUpdateTermsIntoDB,
    getActiveTermsFromDB,
    getAllTermsFromDB,
    getSingleTermsFromDB,
    updateTermsIntoDB,
    deleteTermsFromDB,
};
//# sourceMappingURL=terms.service.js.map