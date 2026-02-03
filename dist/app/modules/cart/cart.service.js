"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistServices = exports.CartServices = void 0;
const cart_model_1 = require("./cart.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../product/product.model");
// Cart Services
const getCartFromDB = async (userUuid) => {
    const cart = await cart_model_1.Cart.find({ user: userUuid }).populate("product");
    return cart;
};
const addToCartIntoDB = async (payload) => {
    // Check if product exists
    const product = await product_model_1.Product.findById(payload.product);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Check if product already in cart
    const existingItem = await cart_model_1.Cart.findOne({
        user: payload.user,
        product: payload.product,
        selectedColor: payload.selectedColor,
    });
    if (existingItem) {
        // Update quantity
        existingItem.quantity += payload.quantity || 1;
        await existingItem.save();
        return existingItem;
    }
    // Add new item to cart
    const result = await cart_model_1.Cart.create(payload);
    return result;
};
const updateCartItemIntoDB = async (cartItemId, userUuid, payload) => {
    const cartItem = await cart_model_1.Cart.findOne({ _id: cartItemId, user: userUuid });
    if (!cartItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart item not found");
    }
    const result = await cart_model_1.Cart.findByIdAndUpdate(cartItemId, payload, {
        new: true,
    }).populate("product");
    return result;
};
const removeCartItemFromDB = async (cartItemId, userUuid) => {
    const cartItem = await cart_model_1.Cart.findOne({ _id: cartItemId, user: userUuid });
    if (!cartItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart item not found");
    }
    const result = await cart_model_1.Cart.findByIdAndDelete(cartItemId);
    return result;
};
const clearCartFromDB = async (userUuid) => {
    const result = await cart_model_1.Cart.deleteMany({ user: userUuid });
    return result;
};
// Wishlist Services
const getWishlistFromDB = async (userUuid) => {
    const wishlist = await cart_model_1.Wishlist.find({ user: userUuid }).populate("product");
    return wishlist;
};
const addToWishlistIntoDB = async (payload) => {
    // Check if product exists
    const product = await product_model_1.Product.findById(payload.product);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Check if product already in wishlist
    const existingItem = await cart_model_1.Wishlist.findOne({
        user: payload.user,
        product: payload.product,
    });
    if (existingItem) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Product already in wishlist");
    }
    const result = await cart_model_1.Wishlist.create(payload);
    return result;
};
const removeFromWishlistIntoDB = async (wishlistItemId, userUuid) => {
    const wishlistItem = await cart_model_1.Wishlist.findOne({
        _id: wishlistItemId,
        user: userUuid,
    });
    if (!wishlistItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wishlist item not found");
    }
    const result = await cart_model_1.Wishlist.findByIdAndDelete(wishlistItemId);
    return result;
};
const clearWishlistFromDB = async (userUuid) => {
    const result = await cart_model_1.Wishlist.deleteMany({ user: userUuid });
    return result;
};
exports.CartServices = {
    getCartFromDB,
    addToCartIntoDB,
    updateCartItemIntoDB,
    removeCartItemFromDB,
    clearCartFromDB,
};
exports.WishlistServices = {
    getWishlistFromDB,
    addToWishlistIntoDB,
    removeFromWishlistIntoDB,
    clearWishlistFromDB,
};
//# sourceMappingURL=cart.service.js.map