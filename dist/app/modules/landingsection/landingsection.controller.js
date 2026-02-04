"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingSectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const landingsection_service_1 = require("./landingsection.service");
// Create landing section
const createLandingSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.createLandingSectionIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Landing section created successfully",
        data: result,
    });
});
// Get active landing sections (public)
const getActiveLandingSections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.getActiveLandingSectionsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active landing sections retrieved successfully",
        data: result,
    });
});
// Get all landing sections (admin)
const getAllLandingSections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.getAllLandingSectionsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All landing sections retrieved successfully",
        data: result,
    });
});
// Get single landing section
const getSingleLandingSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.getSingleLandingSectionFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Landing section retrieved successfully",
        data: result,
    });
});
// Update landing section
const updateLandingSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.updateLandingSectionIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Landing section updated successfully",
        data: result,
    });
});
// Delete landing section
const deleteLandingSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.deleteLandingSectionFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Landing section deleted successfully",
        data: result,
    });
});
// Toggle landing section status
const toggleLandingSectionStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await landingsection_service_1.LandingSectionService.toggleLandingSectionStatus(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Landing section status toggled successfully",
        data: result,
    });
});
exports.LandingSectionController = {
    createLandingSection,
    getActiveLandingSections,
    getAllLandingSections,
    getSingleLandingSection,
    updateLandingSection,
    deleteLandingSection,
    toggleLandingSectionStatus,
};
//# sourceMappingURL=landingsection.controller.js.map