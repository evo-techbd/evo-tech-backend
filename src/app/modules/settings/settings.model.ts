import { Schema, model } from "mongoose";
import { IDeliveryChargeSettings } from "./settings.interface";

const deliveryChargeSettingsSchema = new Schema<IDeliveryChargeSettings>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const DeliveryChargeSettings = model<IDeliveryChargeSettings>(
  "DeliveryChargeSettings",
  deliveryChargeSettingsSchema
);
