"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintPricingSettings = void 0;
const mongoose_1 = require("mongoose");
const printMaterialSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    description: { type: String, trim: true },
    density: { type: Number, required: true, min: 0.1 },
    pricePerGram: { type: Number, required: true, min: 0 },
    colors: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
}, { _id: false });
const printPricingSettingsSchema = new mongoose_1.Schema({
    materials: { type: [printMaterialSchema], default: [] },
    machineRatePerHour: { type: Number, min: 0, default: 0 },
    setupFee: { type: Number, min: 0, default: 0 },
    minimumCharge: { type: Number, min: 0, default: 0 },
}, { timestamps: true });
exports.PrintPricingSettings = (0, mongoose_1.model)("PrintPricingSettings", printPricingSettingsSchema);
//# sourceMappingURL=print-pricing.model.js.map