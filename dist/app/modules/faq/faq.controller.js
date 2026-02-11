"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const faq_service_1 = require("./faq.service");
// Create FAQ
const createFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.createFaqIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "FAQ created successfully",
        data: result,
    });
});
// Get active FAQs (public)
const getActiveFaqs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.getActiveFaqsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active FAQs retrieved successfully",
        data: result,
    });
});
// Get all FAQs (admin)
const getAllFaqs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.getAllFaqsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All FAQs retrieved successfully",
        data: result,
    });
});
// Get single FAQ
const getSingleFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.getSingleFaqFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "FAQ retrieved successfully",
        data: result,
    });
});
// Update FAQ
const updateFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.updateFaqIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "FAQ updated successfully",
        data: result,
    });
});
// Delete FAQ
const deleteFaq = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await faq_service_1.FaqService.deleteFaqFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "FAQ deleted successfully",
        data: result,
    });
});
exports.FaqController = {
    createFaq,
    getActiveFaqs,
    getAllFaqs,
    getSingleFaq,
    updateFaq,
    deleteFaq,
};
//# sourceMappingURL=faq.controller.js.map