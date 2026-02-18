"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warranty = void 0;
const mongoose_1 = require("mongoose");
const warrantySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: [true, "Warranty information content is required"],
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
// Index for efficient querying
warrantySchema.index({ isActive: 1, updatedAt: -1 });
exports.Warranty = (0, mongoose_1.model)("Warranty", warrantySchema);
//# sourceMappingURL=warranty.model.js.map