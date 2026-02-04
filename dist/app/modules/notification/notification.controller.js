"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
const getStockNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await notification_service_1.NotificationServices.getStockNotificationsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Notifications retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const markNotificationAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updated = await notification_service_1.NotificationServices.markNotificationAsReadIntoDB(id, req.user?._id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Notification updated",
        data: updated,
    });
});
const resolveNotification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updated = await notification_service_1.NotificationServices.resolveNotificationIntoDB(id, req.user?._id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Notification resolved",
        data: updated,
    });
});
exports.NotificationControllers = {
    getStockNotifications,
    markNotificationAsRead,
    resolveNotification,
};
//# sourceMappingURL=notification.controller.js.map