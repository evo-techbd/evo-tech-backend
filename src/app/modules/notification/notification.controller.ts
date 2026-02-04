import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NotificationServices } from "./notification.service";

const getStockNotifications = catchAsync(async (req, res) => {
  const result = await NotificationServices.getStockNotificationsFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notifications retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const markNotificationAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await NotificationServices.markNotificationAsReadIntoDB(
    id,
    req.user?._id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification updated",
    data: updated,
  });
});

const resolveNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await NotificationServices.resolveNotificationIntoDB(
    id,
    req.user?._id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notification resolved",
    data: updated,
  });
});

export const NotificationControllers = {
  getStockNotifications,
  markNotificationAsRead,
  resolveNotification,
};
