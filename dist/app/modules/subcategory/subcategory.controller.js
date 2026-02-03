"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const subcategory_service_1 = require("./subcategory.service");
const getAllSubcategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subcategories = await subcategory_service_1.SubcategoryServices.getAllSubcategoriesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Subcategories Retrieved Successfully",
        data: subcategories.result,
        meta: subcategories.meta,
    });
});
const getSingleSubcategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subcategory = await subcategory_service_1.SubcategoryServices.getSingleSubcategoryFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Subcategory Retrieved Successfully",
        data: subcategory,
    });
});
const getSubcategoryBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subcategory = await subcategory_service_1.SubcategoryServices.getSubcategoryBySlugFromDB(req.params.slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Subcategory Retrieved Successfully",
        data: subcategory,
    });
});
const createSubcategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const imageBuffer = req.file?.buffer;
    const result = await subcategory_service_1.SubcategoryServices.createSubcategoryIntoDB(req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Subcategory created successfully",
        data: result,
    });
});
const updateSubcategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await subcategory_service_1.SubcategoryServices.updateSubcategoryIntoDB(id, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Subcategory updated successfully",
        data: result,
    });
});
const deleteSubcategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await subcategory_service_1.SubcategoryServices.deleteSubcategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Subcategory deleted successfully",
        data: null,
    });
});
exports.SubcategoryControllers = {
    getAllSubcategories,
    getSingleSubcategory,
    getSubcategoryBySlug,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
};
//# sourceMappingURL=subcategory.controller.js.map