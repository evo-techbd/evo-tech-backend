import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrintingSaleServices } from "./printing-sale.service";

const createSale = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.createSale({
    ...req.body,
    createdBy: req.user._id,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "3D Printing sale created successfully",
    data: result,
  });
});

const getAllSales = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.getAllSales(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sales retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const getSingleSale = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.getSingleSale(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sale retrieved successfully",
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.updateSalePaymentStatus(
    req.params.id,
    req.body.paymentStatus,
    req.user?._id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment status updated successfully",
    data: result,
  });
});

const deleteSale = catchAsync(async (req, res) => {
  await PrintingSaleServices.deleteSale(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sale deleted successfully",
    data: null,
  });
});

const updateSale = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.updateSale(
    req.params.id,
    req.body,
    req.user?._id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sale updated successfully",
    data: result,
  });
});

const getArchiveSummary = catchAsync(async (req, res) => {
  const year = req.query.year ? Number(req.query.year) : undefined;
  const result = await PrintingSaleServices.getArchiveSummary(year);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sale archive summary retrieved successfully",
    data: result,
  });
});

const getArchiveYears = catchAsync(async (req, res) => {
  const result = await PrintingSaleServices.getArchiveYears();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Printing sale archive years retrieved successfully",
    data: result,
  });
});

export const PrintingSaleControllers = {
  createSale,
  getAllSales,
  getSingleSale,
  updatePaymentStatus,
  updateSale,
  deleteSale,
  getArchiveSummary,
  getArchiveYears,
};
