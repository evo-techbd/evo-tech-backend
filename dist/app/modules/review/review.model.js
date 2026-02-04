"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
    },
    userName: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
        required: true,
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
//# sourceMappingURL=review.model.js.map