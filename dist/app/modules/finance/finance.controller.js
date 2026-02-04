"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const finance_service_1 = require("./finance.service");
const addTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await finance_service_1.FinanceServices.addTransactionIntoDB({
        ...req.body,
        createdBy: req.user._id, // Uses _id as defined in auth middleware
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Transaction added successfully",
        data: result,
    });
});
const getAllTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await finance_service_1.FinanceServices.getAllTransactionsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transactions retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const getFinanceStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await finance_service_1.FinanceServices.getFinanceStatsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Finance stats retrieved successfully",
        data: result,
    });
});
const getSalesProfitTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await finance_service_1.FinanceServices.getSalesProfitTransactionsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Sales profit transactions retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
exports.FinanceControllers = {
    addTransaction,
    getAllTransactions,
    getFinanceStats,
    getSalesProfitTransactions,
};
//# sourceMappingURL=finance.controller.js.map