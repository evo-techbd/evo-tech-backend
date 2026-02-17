import { Schema, model } from "mongoose";
import { IWarranty } from "./warranty.interface";

const warrantySchema = new Schema<IWarranty>(
  {
    content: {
      type: String,
      required: [true, "Warranty information content is required"],
      trim: true,
    },
    version: {
      type: String,
      required: [true, "Version is required"],
      trim: true,
      default: "1.0",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
warrantySchema.index({ isActive: 1, updatedAt: -1 });

export const Warranty = model<IWarranty>("Warranty", warrantySchema);
