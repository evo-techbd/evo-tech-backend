import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { DashboardServices } from "./dashboard.service";

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await DashboardServices.getDashboardStats();

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
  const result = await DashboardServices.getRecentOrders(Number(limit) || 10);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent orders retrieved successfully!",
    data: result,
  });
});

const getTopProducts = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const result = await DashboardServices.getTopProducts(Number(limit) || 10);

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

export const DashboardControllers = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
  getEarningsReport,
  getPendingOrdersCount,
};