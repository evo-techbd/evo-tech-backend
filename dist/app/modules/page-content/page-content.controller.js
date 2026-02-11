"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const page_content_service_1 = require("./page-content.service");
// Create page content
const createPageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const result = await page_content_service_1.PageContentService.createPageContentIntoDB(type, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `${type} content created successfully`,
        data: result,
    });
});
// Get active content (public)
const getActivePageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const result = await page_content_service_1.PageContentService.getActivePageContentFromDB(type);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Active ${type} content retrieved successfully`,
        data: result,
    });
});
// Get all content history (admin)
const getAllPageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const result = await page_content_service_1.PageContentService.getAllPageContentFromDB(type);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `All ${type} content retrieved successfully`,
        data: result,
    });
});
// Get single content
const getSinglePageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await page_content_service_1.PageContentService.getSinglePageContentFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content retrieved successfully",
        data: result,
    });
});
// Update content
const updatePageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await page_content_service_1.PageContentService.updatePageContentIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content updated successfully",
        data: result,
    });
});
// Delete content
const deletePageContent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await page_content_service_1.PageContentService.deletePageContentFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content deleted successfully",
        data: result,
    });
});
exports.PageContentController = {
    createPageContent,
    getActivePageContent,
    getAllPageContent,
    getSinglePageContent,
    updatePageContent,
    deletePageContent,
};
//# sourceMappingURL=page-content.controller.js.map