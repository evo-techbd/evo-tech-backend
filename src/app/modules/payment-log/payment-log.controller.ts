import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentLogServices } from "./payment-log.service";
import { TPaymentLogEntityType } from "./payment-log.interface";

// Mounted as GET /:id/payment-logs on both the order and printing-sale routers.
const getEntityPaymentLogs = (entityType: TPaymentLogEntityType) =>
  catchAsync(async (req, res) => {
    const result = await PaymentLogServices.getPaymentLogsForEntity(
      entityType,
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment logs retrieved successfully",
      data: result,
    });
  });

export const PaymentLogControllers = {
  getOrderPaymentLogs: getEntityPaymentLogs("order"),
  getPrintingSalePaymentLogs: getEntityPaymentLogs("printing-sale"),
};
