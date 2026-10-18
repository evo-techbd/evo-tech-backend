import { Schema, model } from "mongoose";
import { IPrintPricingSettings } from "./print-pricing.interface";

const printMaterialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    description: { type: String, trim: true },
    density: { type: Number, required: true, min: 0.1 },
    pricePerGram: { type: Number, required: true, min: 0 },
    colors: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const printPricingSettingsSchema = new Schema<IPrintPricingSettings>(
  {
    materials: { type: [printMaterialSchema], default: [] },
    machineRatePerHour: { type: Number, min: 0, default: 0 },
    setupFee: { type: Number, min: 0, default: 0 },
    minimumCharge: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

export const PrintPricingSettings = model<IPrintPricingSettings>(
  "PrintPricingSettings",
  printPricingSettingsSchema,
);
