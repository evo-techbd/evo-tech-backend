import { Schema, model } from "mongoose";
import {
  IContactSettings,
  IDeliveryChargeSettings,
} from "./settings.interface";

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

const contactSettingsSchema = new Schema<IContactSettings>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const ContactSettings = model<IContactSettings>(
  "ContactSettings",
  contactSettingsSchema
);
