"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductGroupController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_group_service_1 = require("./product-group.service");
// Create product group
const createProductGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.createProductGroupIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Product group created successfully",
        data: result,
    });
});
// Get all product groups (admin)
const getAllProductGroups = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.getAllProductGroupsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product groups retrieved successfully",
        data: result,
    });
});
// Get single product group (admin)
const getSingleProductGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.getSingleProductGroupFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product group retrieved successfully",
        data: result,
    });
});
// Update product group
const updateProductGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.updateProductGroupIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product group updated successfully",
        data: result,
    });
});
// Delete product group
const deleteProductGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.deleteProductGroupFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product group deleted successfully",
        data: result,
    });
});
// Get the group a product belongs to (public, product details page)
const getGroupForProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_group_service_1.ProductGroupService.getGroupForProductFromDB(req.params.productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result
            ? "Product group retrieved successfully"
            : "Product is not in a group",
        data: result,
    });
});
exports.ProductGroupController = {
    createProductGroup,
    getAllProductGroups,
    getSingleProductGroup,
    updateProductGroup,
    deleteProductGroup,
    getGroupForProduct,
};
//# sourceMappingURL=product-group.controller.js.map