"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetToken = void 0;
const mongoose_1 = require("mongoose");
const passwordResetTokenSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
// Index for automatic token cleanup after expiration
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.PasswordResetToken = (0, mongoose_1.model)("PasswordResetToken", passwordResetTokenSchema);
//# sourceMappingURL=passwordResetToken.model.js.map