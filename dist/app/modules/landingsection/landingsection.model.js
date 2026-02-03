"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingSection = void 0;
const mongoose_1 = require("mongoose");
const landingSectionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Section title is required"],
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    sectionType: {
        type: String,
        enum: ["featured", "new_arrival", "best_seller", "trending", "custom"],
        default: "custom",
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    subcategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subcategory",
    },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
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
landingSectionSchema.index({ sortOrder: 1, isActive: 1 });
exports.LandingSection = (0, mongoose_1.model)("LandingSection", landingSectionSchema);
//# sourceMappingURL=landingsection.model.js.map