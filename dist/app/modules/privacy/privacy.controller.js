"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const privacy_service_1 = require("./privacy.service");
// Create or update privacy policy
const createOrUpdatePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.createOrUpdatePrivacyIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Privacy policy created successfully",
        data: result,
    });
});
// Get active privacy policy (public)
const getActivePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.getActivePrivacyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active privacy policy retrieved successfully",
        data: result,
    });
});
// Get all privacy policies history (admin)
const getAllPrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.getAllPrivacyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All privacy policies retrieved successfully",
        data: result,
    });
});
// Get single privacy policy
const getSinglePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.getSinglePrivacyFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Privacy policy retrieved successfully",
        data: result,
    });
});
// Update privacy policy
const updatePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.updatePrivacyIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Privacy policy updated successfully",
        data: result,
    });
});
// Delete privacy policy
const deletePrivacy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await privacy_service_1.PrivacyService.deletePrivacyFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Privacy policy deleted successfully",
        data: result,
    });
});
exports.PrivacyController = {
    createOrUpdatePrivacy,
    getActivePrivacy,
    getAllPrivacy,
    getSinglePrivacy,
    updatePrivacy,
    deletePrivacy,
};
//# sourceMappingURL=privacy.controller.js.map