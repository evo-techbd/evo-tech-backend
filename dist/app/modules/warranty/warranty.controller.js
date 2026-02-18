"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarrantyController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const warranty_service_1 = require("./warranty.service");
// Create or update warranty information
const createOrUpdateWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.createOrUpdateWarrantyIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Warranty information created successfully",
        data: result,
    });
});
// Get active warranty information (public)
const getActiveWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.getActiveWarrantyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active warranty information retrieved successfully",
        data: result,
    });
});
// Get all warranty information history (admin)
const getAllWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.getAllWarrantyFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All warranty information retrieved successfully",
        data: result,
    });
});
// Get single warranty information
const getSingleWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.getSingleWarrantyFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Warranty information retrieved successfully",
        data: result,
    });
});
// Update warranty information
const updateWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.updateWarrantyIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Warranty information updated successfully",
        data: result,
    });
});
// Delete warranty information
const deleteWarranty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await warranty_service_1.WarrantyService.deleteWarrantyFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Warranty information deleted successfully",
        data: result,
    });
});
exports.WarrantyController = {
    createOrUpdateWarranty,
    getActiveWarranty,
    getAllWarranty,
    getSingleWarranty,
    updateWarranty,
    deleteWarranty,
};
//# sourceMappingURL=warranty.controller.js.map