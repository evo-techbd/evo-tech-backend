"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
const getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categories = await category_service_1.CategoryServices.getAllCategoriesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Categories Retrieved Successfully",
        data: categories.result,
        meta: categories.meta,
    });
});
const getSingleCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await category_service_1.CategoryServices.getSingleCategoryFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category Retrieved Successfully",
        data: category,
    });
});
const getCategoryBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await category_service_1.CategoryServices.getCategoryBySlugFromDB(req.params.slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category Retrieved Successfully",
        data: category,
    });
});
const createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const imageBuffer = req.file?.buffer;
    const result = await category_service_1.CategoryServices.createCategoryIntoDB(req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Category created successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await category_service_1.CategoryServices.updateCategoryIntoDB(id, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await category_service_1.CategoryServices.deleteCategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category deleted successfully",
        data: null,
    });
});
exports.CategoryControllers = {
    getAllCategories,
    getSingleCategory,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=category.controller.js.map