"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const placeOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user.uuid;
    const result = await order_service_1.OrderServices.placeOrderIntoDB(req.body, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Order placed successfully",
        data: result,
    });
});
const placeGuestOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await order_service_1.OrderServices.placeGuestOrderIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Guest order placed successfully",
        data: result,
    });
});
const linkGuestOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user.uuid;
    const { email } = req.body;
    const result = await order_service_1.OrderServices.linkGuestOrdersToUserIntoDB(email, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: `${result.linked} guest order(s) linked to your account`,
        data: result,
    });
});
const getUserOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user.uuid;
    const orders = await order_service_1.OrderServices.getUserOrdersFromDB(userUuid, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders Retrieved Successfully",
        data: orders.result,
        meta: orders.meta,
    });
});
const getAllOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const orders = await order_service_1.OrderServices.getAllOrdersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders Retrieved Successfully",
        data: orders.result,
        meta: orders.meta,
    });
});
const getSingleOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userUuid = req.user?.uuid;
    const isAdmin = req.user?.role === "admin";
    const order = await order_service_1.OrderServices.getSingleOrderFromDB(id, isAdmin ? undefined : userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order Retrieved Successfully",
        data: order,
    });
});
const updateOrderStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await order_service_1.OrderServices.updateOrderStatusIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status updated successfully",
        data: result,
    });
});
const deleteOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await order_service_1.OrderServices.deleteOrderFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order deleted successfully",
        data: null,
    });
});
const trackOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { trackingCode } = req.params;
    const result = await order_service_1.OrderServices.trackOrderByTrackingCode(trackingCode);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order tracking information retrieved successfully",
        data: result,
    });
});
const getOrderItemsForReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userUuid = req.user?.uuid;
    const result = await order_service_1.OrderServices.getOrderItemsForReviewFromDB(id, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order items retrieved successfully",
        data: result,
    });
});
exports.OrderControllers = {
    placeOrder,
    placeGuestOrder,
    linkGuestOrders,
    getUserOrders,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    deleteOrder,
    trackOrder,
    getOrderItemsForReview,
};
//# sourceMappingURL=order.controller.js.map