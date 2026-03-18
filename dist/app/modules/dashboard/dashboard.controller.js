"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const dashboard_service_1 = require("./dashboard.service");
const parseLimit = (value, defaultLimit = 5, maxLimit = 50) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0)
        return defaultLimit;
    return Math.min(Math.floor(parsed), maxLimit);
};
const getDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { range } = req.query;
    const result = await dashboard_service_1.DashboardServices.getDashboardStats(range);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Dashboard statistics retrieved successfully!",
        data: result,
    });
});
const getSalesData = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { period } = req.query;
    const result = await dashboard_service_1.DashboardServices.getSalesData(period);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales data retrieved successfully!",
        data: result,
    });
});
const getRecentOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { limit } = req.query;
    const result = await dashboard_service_1.DashboardServices.getRecentOrders(parseLimit(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Recent orders retrieved successfully!",
        data: result,
    });
});
const getTopProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { limit } = req.query;
    const result = await dashboard_service_1.DashboardServices.getTopProducts(parseLimit(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Top products retrieved successfully!",
        data: result,
    });
});
const getEarningsReport = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.getEarningsReport();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Earnings report retrieved successfully!",
        data: result,
    });
});
const getPendingOrdersCount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.getPendingOrdersCount();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pending orders count retrieved successfully!",
        data: result,
    });
});
const getMonthlyProfitBreakdown = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { year } = req.query;
    const result = await dashboard_service_1.DashboardServices.getMonthlyProfitBreakdown(year ? Number(year) : undefined);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Monthly profit breakdown retrieved successfully!",
        data: result,
    });
});
const getOrdersWithProfit = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { year, month, page, limit } = req.query;
    const result = await dashboard_service_1.DashboardServices.getOrdersWithProfit(Number(year) || new Date().getFullYear(), Number(month) || new Date().getMonth() + 1, Number(page) || 1, Number(limit) || 50);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders with profit retrieved successfully!",
        data: result,
    });
});
exports.DashboardControllers = {
    getDashboardStats,
    getSalesData,
    getRecentOrders,
    getTopProducts,
    getEarningsReport,
    getPendingOrdersCount,
    getMonthlyProfitBreakdown,
    getOrdersWithProfit,
};
//# sourceMappingURL=dashboard.controller.js.map