"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const page_content_model_1 = require("./page-content.model");
// Create new page content (deactivates previous active of same type)
const createPageContentIntoDB = async (type, payload) => {
    // Deactivate all existing content of same type
    await page_content_model_1.PageContent.updateMany({ type }, { isActive: false });
    // Create new content
    const result = await page_content_model_1.PageContent.create({ ...payload, type, isActive: true });
    return result;
};
// Get active content by type (public)
const getActivePageContentFromDB = async (type) => {
    const result = await page_content_model_1.PageContent.findOne({ type, isActive: true }).sort({
        updatedAt: -1,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `${type} content not found`);
    }
    return result;
};
// Get all content history by type (admin)
const getAllPageContentFromDB = async (type) => {
    const result = await page_content_model_1.PageContent.find({ type }).sort({ updatedAt: -1 });
    return result;
};
// Get single content by ID
const getSinglePageContentFromDB = async (id) => {
    const result = await page_content_model_1.PageContent.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found");
    }
    return result;
};
// Update content
const updatePageContentIntoDB = async (id, payload) => {
    const content = await page_content_model_1.PageContent.findById(id);
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found");
    }
    // If setting this version as active, deactivate all others of same type
    if (payload.isActive === true) {
        await page_content_model_1.PageContent.updateMany({ type: content.type, _id: { $ne: id } }, { isActive: false });
    }
    const result = await page_content_model_1.PageContent.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete content
const deletePageContentFromDB = async (id) => {
    const content = await page_content_model_1.PageContent.findById(id);
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found");
    }
    // Don't allow deletion of active content
    if (content.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete active content. Please activate another version first.");
    }
    const result = await page_content_model_1.PageContent.findByIdAndDelete(id);
    return result;
};
exports.PageContentService = {
    createPageContentIntoDB,
    getActivePageContentFromDB,
    getAllPageContentFromDB,
    getSinglePageContentFromDB,
    updatePageContentIntoDB,
    deletePageContentFromDB,
};
//# sourceMappingURL=page-content.service.js.map