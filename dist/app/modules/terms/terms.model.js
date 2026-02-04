"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terms = void 0;
const mongoose_1 = require("mongoose");
const termsSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: [true, "Terms and conditions content is required"],
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
termsSchema.index({ isActive: 1, updatedAt: -1 });
exports.Terms = (0, mongoose_1.model)("Terms", termsSchema);
//# sourceMappingURL=terms.model.js.map