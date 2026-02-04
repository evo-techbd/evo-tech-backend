"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Cart Routes
router.get("/cart", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), cart_controller_1.CartControllers.getCart);
router.post("/cart", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.CartControllers.addToCart);
router.put("/cart/:itemId", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.CartControllers.updateCartItem);
router.delete("/cart/:itemId", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.CartControllers.removeCartItem);
router.delete("/cart", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.CartControllers.clearCart);
// Wishlist Routes
router.get("/wishlist", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.WishlistControllers.getWishlist);
router.post("/wishlist", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.WishlistControllers.addToWishlist);
router.delete("/wishlist/:itemId", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.WishlistControllers.removeFromWishlist);
router.delete("/wishlist", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), cart_controller_1.WishlistControllers.clearWishlist);
exports.CartRoutes = router;
//# sourceMappingURL=cart.route.js.map