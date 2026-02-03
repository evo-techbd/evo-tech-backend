"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    selectedColor: {
        type: String,
    },
}, {
    timestamps: true,
});
const wishlistSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
}, {
    timestamps: true,
});
// Create compound index for cart
cartSchema.index({ user: 1, product: 1 }, { unique: true });
// Create compound index for wishlist
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });
exports.Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
//# sourceMappingURL=cart.model.js.map