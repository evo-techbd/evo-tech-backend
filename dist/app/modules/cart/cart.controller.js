"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistControllers = exports.CartControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const cart_service_1 = require("./cart.service");
// Cart Controllers
const getCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const cart = await cart_service_1.CartServices.getCartFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Cart Retrieved Successfully",
        data: cart,
    });
});
const addToCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await cart_service_1.CartServices.addToCartIntoDB({
        ...req.body,
        user: userUuid,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Item added to cart successfully",
        data: result,
    });
});
const updateCartItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { itemId } = req.params;
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await cart_service_1.CartServices.updateCartItemIntoDB(itemId, userUuid, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Cart item updated successfully",
        data: result,
    });
});
const removeCartItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { itemId } = req.params;
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    await cart_service_1.CartServices.removeCartItemFromDB(itemId, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Cart item removed successfully",
        data: null,
    });
});
const clearCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    await cart_service_1.CartServices.clearCartFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Cart cleared successfully",
        data: null,
    });
});
// Wishlist Controllers
const getWishlist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const wishlist = await cart_service_1.WishlistServices.getWishlistFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist Retrieved Successfully",
        data: wishlist,
    });
});
const addToWishlist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await cart_service_1.WishlistServices.addToWishlistIntoDB({
        ...req.body,
        user: userUuid,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Item added to wishlist successfully",
        data: result,
    });
});
const removeFromWishlist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { itemId } = req.params;
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    await cart_service_1.WishlistServices.removeFromWishlistIntoDB(itemId, userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Item removed from wishlist successfully",
        data: null,
    });
});
const clearWishlist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    await cart_service_1.WishlistServices.clearWishlistFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wishlist cleared successfully",
        data: null,
    });
});
exports.CartControllers = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};
exports.WishlistControllers = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
};
//# sourceMappingURL=cart.controller.js.map