import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { DashboardServices } from "./dashboard.service";

const parseLimit = (value: unknown, defaultLimit = 5, maxLimit = 50) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) return defaultLimit;

  return Math.min(Math.floor(parsed), maxLimit);
};

const getDashboardStats = catchAsync(async (req, res) => {
  const { range } = req.query;
  const result = await DashboardServices.getDashboardStats(
    range as "today" | "this-week" | "this-month" | "all-time",
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully!",
    data: result,
  });
});

const getSalesData = catchAsync(async (req, res) => {
  const { period } = req.query;
  const result = await DashboardServices.getSalesData(period as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales data retrieved successfully!",
    data: result,
  });
});

const getRecentOrders = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const result = await DashboardServices.getRecentOrders(parseLimit(limit));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent orders retrieved successfully!",
    data: result,
  });
});

const getTopProducts = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const result = await DashboardServices.getTopProducts(parseLimit(limit));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top products retrieved successfully!",
    data: result,
  });
});

const getEarningsReport = catchAsync(async (req, res) => {
  const result = await DashboardServices.getEarningsReport();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Earnings report retrieved successfully!",
    data: result,
  });
});

const getPendingOrdersCount = catchAsync(async (req, res) => {
  const result = await DashboardServices.getPendingOrdersCount();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending orders count retrieved successfully!",
    data: result,
  });
});

const getMonthlyProfitBreakdown = catchAsync(async (req, res) => {
  const { year } = req.query;
  const result = await DashboardServices.getMonthlyProfitBreakdown(
    year ? Number(year) : undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly profit breakdown retrieved successfully!",
    data: result,
  });
});

const getOrdersWithProfit = catchAsync(async (req, res) => {
  const { year, month, page, limit } = req.query;
  const result = await DashboardServices.getOrdersWithProfit(
    Number(year) || new Date().getFullYear(),
    Number(month) || new Date().getMonth() + 1,
    Number(page) || 1,
    Number(limit) || 50,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders with profit retrieved successfully!",
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
  getEarningsReport,
  getPendingOrdersCount,
  getMonthlyProfitBreakdown,
  getOrdersWithProfit,
};
