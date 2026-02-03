import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FinanceServices } from "./finance.service";

const addTransaction = catchAsync(async (req, res) => {
  const result = await FinanceServices.addTransactionIntoDB({
    ...req.body,
    createdBy: req.user._id, // Uses _id as defined in auth middleware
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Transaction added successfully",
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req, res) => {
  const result = await FinanceServices.getAllTransactionsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transactions retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const getFinanceStats = catchAsync(async (req, res) => {
  const result = await FinanceServices.getFinanceStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Finance stats retrieved successfully",
    data: result,
  });
});

const getSalesProfitTransactions = catchAsync(async (req, res) => {
  const result = await FinanceServices.getSalesProfitTransactionsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sales profit transactions retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

export const FinanceControllers = {
  addTransaction,
  getAllTransactions,
  getFinanceStats,
  getSalesProfitTransactions,
};
