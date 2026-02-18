"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Privacy = void 0;
const mongoose_1 = require("mongoose");
const privacySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: [true, "Privacy policy content is required"],
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
privacySchema.index({ isActive: 1, updatedAt: -1 });
exports.Privacy = (0, mongoose_1.model)("Privacy", privacySchema);
//# sourceMappingURL=privacy.model.js.map