"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.Schema({
    uuid: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
        required: true,
    },
    userType: {
        type: String,
        enum: ["admin", "user", "employee"],
        default: "user",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: {
        type: String,
    },
    defaultShippingAddressId: {
        type: String,
    },
    defaultBillingAddressId: {
        type: String,
    },
    emailVerifiedAt: {
        type: Date,
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    rewardPoints: {
        type: Number,
        default: 0,
    },
    newsletterOptIn: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    // Only hash password if it exists and has been modified
    if (user.password && user.isModified("password")) {
        user.password = await bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    next();
});
// Post-save middleware to clear password
userSchema.post("save", function (doc, next) {
    if (doc.password) {
        doc.password = "";
    }
    next();
});
// Static method to check if user exists by email
userSchema.statics.isUserExistsByEmail = async function (email) {
    return await exports.User.findOne({ email }).select("+password");
};
// Static method to check if password matches
userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcryptjs_1.default.compare(plainTextPassword, hashedPassword);
};
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map