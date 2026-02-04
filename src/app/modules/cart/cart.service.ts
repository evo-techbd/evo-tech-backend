import { Cart, Wishlist } from "./cart.model";
import { TCart, TWishlist } from "./cart.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Product } from "../product/product.model";

// Cart Services
const getCartFromDB = async (userUuid: string) => {
  const cart = await Cart.find({ user: userUuid }).populate("product");
  return cart;
};

const addToCartIntoDB = async (payload: TCart) => {
  // Check if product exists
  const product = await Product.findById(payload.product);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check if product already in cart
  const existingItem = await Cart.findOne({
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
  const result = await Cart.create(payload);
  return result;
};

const updateCartItemIntoDB = async (
  cartItemId: string,
  userUuid: string,
  payload: Partial<TCart>
) => {
  const cartItem = await Cart.findOne({ _id: cartItemId, user: userUuid });
  if (!cartItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  const result = await Cart.findByIdAndUpdate(cartItemId, payload, {
    new: true,
  }).populate("product");

  return result;
};

const removeCartItemFromDB = async (cartItemId: string, userUuid: string) => {
  const cartItem = await Cart.findOne({ _id: cartItemId, user: userUuid });
  if (!cartItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  const result = await Cart.findByIdAndDelete(cartItemId);
  return result;
};

const clearCartFromDB = async (userUuid: string) => {
  const result = await Cart.deleteMany({ user: userUuid });
  return result;
};

// Wishlist Services
const getWishlistFromDB = async (userUuid: string) => {
  const wishlist = await Wishlist.find({ user: userUuid }).populate("product");
  return wishlist;
};

const addToWishlistIntoDB = async (payload: TWishlist) => {
  // Check if product exists
  const product = await Product.findById(payload.product);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check if product already in wishlist
  const existingItem = await Wishlist.findOne({
    user: payload.user,
    product: payload.product,
  });

  if (existingItem) {
    throw new AppError(httpStatus.CONFLICT, "Product already in wishlist");
  }

  const result = await Wishlist.create(payload);
  return result;
};

const removeFromWishlistIntoDB = async (
  wishlistItemId: string,
  userUuid: string
) => {
  const wishlistItem = await Wishlist.findOne({
    _id: wishlistItemId,
    user: userUuid,
  });

  if (!wishlistItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist item not found");
  }

  const result = await Wishlist.findByIdAndDelete(wishlistItemId);
  return result;
};

const clearWishlistFromDB = async (userUuid: string) => {
  const result = await Wishlist.deleteMany({ user: userUuid });
  return result;
};

export const CartServices = {
  getCartFromDB,
  addToCartIntoDB,
  updateCartItemIntoDB,
  removeCartItemFromDB,
  clearCartFromDB,
};

export const WishlistServices = {
  getWishlistFromDB,
  addToWishlistIntoDB,
  removeFromWishlistIntoDB,
  clearWishlistFromDB,
};
