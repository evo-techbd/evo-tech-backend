"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Banner title is required"],
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Banner image is required"],
    },
    button_text: {
        type: String,
        trim: true,
        default: "SHOP NOW",
    },
    button_url: {
        type: String,
        trim: true,
        default: "/products",
    },
    more_text: {
        type: String,
        trim: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Index for efficient sorting and filtering
bannerSchema.index({ sortOrder: 1, isActive: 1 });
exports.Banner = (0, mongoose_1.model)("Banner", bannerSchema);
//# sourceMappingURL=banner.model.js.map