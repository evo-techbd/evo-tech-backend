"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryChargeSettings = void 0;
const mongoose_1 = require("mongoose");
const deliveryChargeSettingsSchema = new mongoose_1.Schema({
    insideDhakaCharge: {
        type: Number,
        required: [true, "Inside Dhaka charge is required"],
        min: 0,
        default: 70,
    },
    outsideDhakaCharge: {
        type: Number,
        required: [true, "Outside Dhaka charge is required"],
        min: 0,
        default: 120,
    },
    additionalChargePerKg: {
        type: Number,
        required: [true, "Additional charge per kg is required"],
        min: 0,
        default: 20,
    },
    expressInsideDhakaCharge: {
        type: Number,
        required: [true, "Express delivery charge (inside Dhaka) is required"],
        min: 0,
        default: 150,
    },
    expressOutsideDhakaCharge: {
        type: Number,
        required: [true, "Express delivery charge (outside Dhaka) is required"],
        min: 0,
        default: 250,
    },
}, {
    timestamps: true,
});
exports.DeliveryChargeSettings = (0, mongoose_1.model)("DeliveryChargeSettings", deliveryChargeSettingsSchema);
//# sourceMappingURL=settings.model.js.map