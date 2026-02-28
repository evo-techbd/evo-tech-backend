"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPoint = void 0;
const mongoose_1 = require("mongoose");
const pickupPointSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Pickup point name is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    hours: {
        type: String,
        trim: true,
        default: "10:00 AM - 6:00 PM",
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
pickupPointSchema.index({ sortOrder: 1, isActive: 1 });
exports.PickupPoint = (0, mongoose_1.model)("PickupPoint", pickupPointSchema);
//# sourceMappingURL=pickuppoint.model.js.map