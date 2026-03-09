"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintingSaleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const printing_sale_service_1 = require("./printing-sale.service");
const createSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await printing_sale_service_1.PrintingSaleServices.createSale({
        ...req.body,
        createdBy: req.user._id,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "3D Printing sale created successfully",
        data: result,
    });
});
const getAllSales = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await printing_sale_service_1.PrintingSaleServices.getAllSales(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Printing sales retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const getSingleSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await printing_sale_service_1.PrintingSaleServices.getSingleSale(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Printing sale retrieved successfully",
        data: result,
    });
});
const updatePaymentStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await printing_sale_service_1.PrintingSaleServices.updateSalePaymentStatus(req.params.id, req.body.paymentStatus);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment status updated successfully",
        data: result,
    });
});
const deleteSale = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await printing_sale_service_1.PrintingSaleServices.deleteSale(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Printing sale deleted successfully",
        data: null,
    });
});
exports.PrintingSaleControllers = {
    createSale,
    getAllSales,
    getSingleSale,
    updatePaymentStatus,
    deleteSale,
};
//# sourceMappingURL=printing-sale.controller.js.map