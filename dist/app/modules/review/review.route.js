"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Configure multer for memory storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all reviews for a product
router.get("/products/:productId/reviews", review_controller_1.ReviewControllers.getReviewsByProduct);
// Add a new review for a product (with optional image upload) - requires authentication
router.post("/products/:productId/reviews", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), upload.single("userImage"), review_controller_1.ReviewControllers.addReview);
// Update a review (with optional image upload) - requires authentication
router.put("/reviews/:reviewId", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), upload.single("userImage"), review_controller_1.ReviewControllers.updateReview);
// Delete a review - requires authentication
router.delete("/reviews/:reviewId", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), review_controller_1.ReviewControllers.deleteReview);
exports.ReviewRoutes = router;
//# sourceMappingURL=review.route.js.map