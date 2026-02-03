"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const banner_service_1 = require("./banner.service");
// Create banner
const createBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Banner image is required",
            data: null,
        });
    }
    const result = await banner_service_1.BannerService.createBannerIntoDB(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Banner created successfully",
        data: result,
    });
});
// Get active banners (public)
const getActiveBanners = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await banner_service_1.BannerService.getActiveBannersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active banners retrieved successfully",
        data: result,
    });
});
// Get all banners (admin)
const getAllBanners = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await banner_service_1.BannerService.getAllBannersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All banners retrieved successfully",
        data: result,
    });
});
// Get single banner
const getSingleBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await banner_service_1.BannerService.getSingleBannerFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Banner retrieved successfully",
        data: result,
    });
});
// Update banner
const updateBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    const result = await banner_service_1.BannerService.updateBannerIntoDB(req.params.id, req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Banner updated successfully",
        data: result,
    });
});
// Delete banner
const deleteBanner = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await banner_service_1.BannerService.deleteBannerFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Banner deleted successfully",
        data: result,
    });
});
// Toggle banner status
const toggleBannerStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await banner_service_1.BannerService.toggleBannerStatus(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Banner status toggled successfully",
        data: result,
    });
});
exports.BannerController = {
    createBanner,
    getActiveBanners,
    getAllBanners,
    getSingleBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
};
//# sourceMappingURL=banner.controller.js.map