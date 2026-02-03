"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const terms_service_1 = require("./terms.service");
// Create or update terms and conditions
const createOrUpdateTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.createOrUpdateTermsIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Terms and conditions created successfully",
        data: result,
    });
});
// Get active terms and conditions (public)
const getActiveTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.getActiveTermsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active terms and conditions retrieved successfully",
        data: result,
    });
});
// Get all terms history (admin)
const getAllTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.getAllTermsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All terms and conditions retrieved successfully",
        data: result,
    });
});
// Get single terms
const getSingleTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.getSingleTermsFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Terms and conditions retrieved successfully",
        data: result,
    });
});
// Update terms
const updateTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.updateTermsIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Terms and conditions updated successfully",
        data: result,
    });
});
// Delete terms
const deleteTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await terms_service_1.TermsService.deleteTermsFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Terms and conditions deleted successfully",
        data: result,
    });
});
exports.TermsController = {
    createOrUpdateTerms,
    getActiveTerms,
    getAllTerms,
    getSingleTerms,
    updateTerms,
    deleteTerms,
};
//# sourceMappingURL=terms.controller.js.map