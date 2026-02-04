import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartServices, WishlistServices } from "./cart.service";

// Cart Controllers
const getCart = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  const cart = await CartServices.getCartFromDB(userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart Retrieved Successfully",
    data: cart,
  });
});

const addToCart = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  const result = await CartServices.addToCartIntoDB({
    ...req.body,
    user: userUuid,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Item added to cart successfully",
    data: result,
  });
});

const updateCartItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  const result = await CartServices.updateCartItemIntoDB(
    itemId,
    userUuid,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item updated successfully",
    data: result,
  });
});

const removeCartItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  await CartServices.removeCartItemFromDB(itemId, userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item removed successfully",
    data: null,
  });
});

const clearCart = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  await CartServices.clearCartFromDB(userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart cleared successfully",
    data: null,
  });
});

// Wishlist Controllers
const getWishlist = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  const wishlist = await WishlistServices.getWishlistFromDB(userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist Retrieved Successfully",
    data: wishlist,
  });
});

const addToWishlist = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  const result = await WishlistServices.addToWishlistIntoDB({
    ...req.body,
    user: userUuid,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Item added to wishlist successfully",
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const { itemId } = req.params;
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  await WishlistServices.removeFromWishlistIntoDB(itemId, userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item removed from wishlist successfully",
    data: null,
  });
});

const clearWishlist = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  await WishlistServices.clearWishlistFromDB(userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wishlist cleared successfully",
    data: null,
  });
});

export const CartControllers = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export const WishlistControllers = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
