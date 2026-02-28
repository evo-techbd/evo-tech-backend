import { Schema, model } from "mongoose";
import { IPickupPoint } from "./pickuppoint.interface";

const pickupPointSchema = new Schema<IPickupPoint>(
  {
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
  },
  {
    timestamps: true,
  },
);

// Index for efficient sorting and filtering
pickupPointSchema.index({ sortOrder: 1, isActive: 1 });

export const PickupPoint = model<IPickupPoint>(
  "PickupPoint",
  pickupPointSchema,
);
