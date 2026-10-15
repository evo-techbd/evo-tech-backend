"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLogControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_log_service_1 = require("./payment-log.service");
// Mounted as GET /:id/payment-logs on both the order and printing-sale routers.
const getEntityPaymentLogs = (entityType) => (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_log_service_1.PaymentLogServices.getPaymentLogsForEntity(entityType, req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment logs retrieved successfully",
        data: result,
    });
});
exports.PaymentLogControllers = {
    getOrderPaymentLogs: getEntityPaymentLogs("order"),
    getPrintingSalePaymentLogs: getEntityPaymentLogs("printing-sale"),
};
//# sourceMappingURL=payment-log.controller.js.map