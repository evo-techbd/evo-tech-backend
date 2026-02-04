import express from "express";
import { CartControllers, WishlistControllers } from "./cart.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Cart Routes
router.get(
  "/cart",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  CartControllers.getCart
);
router.post(
  "/cart",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CartControllers.addToCart
);
router.put(
  "/cart/:itemId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CartControllers.updateCartItem
);
router.delete(
  "/cart/:itemId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CartControllers.removeCartItem
);
router.delete(
  "/cart",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CartControllers.clearCart
);

// Wishlist Routes
router.get(
  "/wishlist",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  WishlistControllers.getWishlist
);
router.post(
  "/wishlist",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  WishlistControllers.addToWishlist
);
router.delete(
  "/wishlist/:itemId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  WishlistControllers.removeFromWishlist
);
router.delete(
  "/wishlist",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  WishlistControllers.clearWishlist
);

export const CartRoutes = router;
