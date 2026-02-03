"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const brand_service_1 = require("./brand.service");
const getAllBrands = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const brands = await brand_service_1.BrandServices.getAllBrandsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Brands Retrieved Successfully",
        data: brands.result,
        meta: brands.meta,
    });
});
const getSingleBrand = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const brand = await brand_service_1.BrandServices.getSingleBrandFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Brand Retrieved Successfully",
        data: brand,
    });
});
const getBrandBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const brand = await brand_service_1.BrandServices.getBrandBySlugFromDB(req.params.slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Brand Retrieved Successfully",
        data: brand,
    });
});
const createBrand = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const logoBuffer = req.file?.buffer;
    const result = await brand_service_1.BrandServices.createBrandIntoDB(req.body, logoBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Brand created successfully",
        data: result,
    });
});
const updateBrand = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const logoBuffer = req.file?.buffer;
    const result = await brand_service_1.BrandServices.updateBrandIntoDB(id, req.body, logoBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Brand updated successfully",
        data: result,
    });
});
const deleteBrand = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await brand_service_1.BrandServices.deleteBrandFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Brand deleted successfully",
        data: null,
    });
});
exports.BrandControllers = {
    getAllBrands,
    getSingleBrand,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand,
};
//# sourceMappingURL=brand.controller.js.map