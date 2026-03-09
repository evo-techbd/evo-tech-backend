"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashItem = void 0;
const mongoose_1 = require("mongoose");
const trashSchema = new mongoose_1.Schema({
    entityType: {
        type: String,
        required: true,
        enum: ["product", "brand", "category", "subcategory", "coupon", "review", "user"],
        index: true,
    },
    originalId: {
        type: String,
        required: true,
    },
    entityLabel: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    relatedData: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: Date.now,
    },
    deletedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        index: { expireAfterSeconds: 0 },
    },
}, {
    timestamps: true,
});
exports.TrashItem = (0, mongoose_1.model)("TrashItem", trashSchema);
//# sourceMappingURL=trash.model.js.map