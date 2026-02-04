import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const placeOrder = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const result = await OrderServices.placeOrderIntoDB(
    req.body,
    userUuid as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: result,
  });
});

const placeGuestOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.placeGuestOrderIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Guest order placed successfully",
    data: result,
  });
});

const linkGuestOrders = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const { email } = req.body;

  const result = await OrderServices.linkGuestOrdersToUserIntoDB(
    email,
    userUuid as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `${result.linked} guest order(s) linked to your account`,
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const orders = await OrderServices.getUserOrdersFromDB(
    userUuid as string,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders Retrieved Successfully",
    data: orders.result,
    meta: orders.meta,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await OrderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders Retrieved Successfully",
    data: orders.result,
    meta: orders.meta,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userUuid = req.user?.uuid;
  const isAdmin = req.user?.role === "admin";

  const order = await OrderServices.getSingleOrderFromDB(
    id,
    isAdmin ? undefined : userUuid
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Retrieved Successfully",
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.updateOrderStatusIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  await OrderServices.deleteOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order deleted successfully",
    data: null,
  });
});

const trackOrder = catchAsync(async (req, res) => {
  const { trackingCode } = req.params;
  const result = await OrderServices.trackOrderByTrackingCode(trackingCode);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order tracking information retrieved successfully",
    data: result,
  });
});

const getOrderItemsForReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userUuid = req.user?.uuid;
  
  const result = await OrderServices.getOrderItemsForReviewFromDB(id, userUuid as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order items retrieved successfully",
    data: result,
  });
});

export const OrderControllers = {
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
