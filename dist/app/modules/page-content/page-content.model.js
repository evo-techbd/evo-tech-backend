"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContent = void 0;
const mongoose_1 = require("mongoose");
const pageContentSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Content type is required"],
        enum: [
            "privacy-policy",
            "warranty-policy",
            "shipping-return-policy",
            "student-discount",
            "shop-shape-tomorrow",
        ],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },
    version: {
        type: String,
        required: [true, "Version is required"],
        trim: true,
        default: "1.0",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Compound index for efficient querying by type
pageContentSchema.index({ type: 1, isActive: 1, updatedAt: -1 });
exports.PageContent = (0, mongoose_1.model)("PageContent", pageContentSchema);
//# sourceMappingURL=page-content.model.js.map