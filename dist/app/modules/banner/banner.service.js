"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const banner_model_1 = require("./banner.model");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
// Create a new banner
const createBannerIntoDB = async (payload, file) => {
    // Upload image to Cloudinary
    const uploadResult = await (0, cloudinaryUpload_1.uploadToCloudinary)(file.buffer, `banners/${Date.now()}`);
    if (!uploadResult) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Image upload failed");
    }
    payload.image = uploadResult;
    const result = await banner_model_1.Banner.create(payload);
    return result;
};
// Get all active banners for public display
const getActiveBannersFromDB = async () => {
    const result = await banner_model_1.Banner.find({ isActive: true }).sort({ sortOrder: 1 });
    return result;
};
// Get all banners (admin)
const getAllBannersFromDB = async () => {
    const result = await banner_model_1.Banner.find().sort({ sortOrder: 1 });
    return result;
};
// Get single banner by ID
const getSingleBannerFromDB = async (id) => {
    const result = await banner_model_1.Banner.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Banner not found");
    }
    return result;
};
// Update banner
const updateBannerIntoDB = async (id, payload, file) => {
    const banner = await banner_model_1.Banner.findById(id);
    if (!banner) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Banner not found");
    }
    // Upload new image if provided
    if (file) {
        const uploadResult = await (0, cloudinaryUpload_1.uploadToCloudinary)(file.buffer, `banners/${Date.now()}`);
        if (!uploadResult) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Image upload failed");
        }
        payload.image = uploadResult;
    }
    const result = await banner_model_1.Banner.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete banner
const deleteBannerFromDB = async (id) => {
    const banner = await banner_model_1.Banner.findById(id);
    if (!banner) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Banner not found");
    }
    const result = await banner_model_1.Banner.findByIdAndDelete(id);
    return result;
};
// Toggle banner active status
const toggleBannerStatus = async (id) => {
    const banner = await banner_model_1.Banner.findById(id);
    if (!banner) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Banner not found");
    }
    const result = await banner_model_1.Banner.findByIdAndUpdate(id, { isActive: !banner.isActive }, { new: true });
    return result;
};
exports.BannerService = {
    createBannerIntoDB,
    getActiveBannersFromDB,
    getAllBannersFromDB,
    getSingleBannerFromDB,
    updateBannerIntoDB,
    deleteBannerFromDB,
    toggleBannerStatus,
};
//# sourceMappingURL=banner.service.js.map