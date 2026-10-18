"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSettings = exports.DeliveryChargeSettings = void 0;
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
const contactSettingsSchema = new mongoose_1.Schema({
    email: { type: String, trim: true, default: "" },
    phones: { type: [String], default: [] },
    whatsapp: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    businessHours: { type: String, trim: true, default: "" },
    mapUrl: { type: String, trim: true, default: "" },
    facebook: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },
}, {
    timestamps: true,
});
exports.ContactSettings = (0, mongoose_1.model)("ContactSettings", contactSettingsSchema);
//# sourceMappingURL=settings.model.js.map