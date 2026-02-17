"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const faq_model_1 = require("./faq.model");
// Create FAQ
const createFaqIntoDB = async (payload) => {
    const result = await faq_model_1.Faq.create(payload);
    return result;
};
// Get all active FAQs (public)
const getActiveFaqsFromDB = async () => {
    const result = await faq_model_1.Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return result;
};
// Get all FAQs (admin)
const getAllFaqsFromDB = async () => {
    const result = await faq_model_1.Faq.find().sort({ order: 1, createdAt: -1 });
    return result;
};
// Get single FAQ by ID
const getSingleFaqFromDB = async (id) => {
    const result = await faq_model_1.Faq.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "FAQ not found");
    }
    return result;
};
// Update FAQ
const updateFaqIntoDB = async (id, payload) => {
    const faq = await faq_model_1.Faq.findById(id);
    if (!faq) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "FAQ not found");
    }
    const result = await faq_model_1.Faq.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete FAQ
const deleteFaqFromDB = async (id) => {
    const faq = await faq_model_1.Faq.findById(id);
    if (!faq) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "FAQ not found");
    }
    const result = await faq_model_1.Faq.findByIdAndDelete(id);
    return result;
};
exports.FaqService = {
    createFaqIntoDB,
    getActiveFaqsFromDB,
    getAllFaqsFromDB,
    getSingleFaqFromDB,
    updateFaqIntoDB,
    deleteFaqFromDB,
};
//# sourceMappingURL=faq.service.js.map