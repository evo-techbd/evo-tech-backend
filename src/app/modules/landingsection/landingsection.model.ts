import { Schema, model } from "mongoose";
import { ILandingSection } from "./landingsection.interface";

const landingSectionSchema = new Schema<ILandingSection>(
  {
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    sectionType: {
      type: String,
      enum: ["featured", "new_arrival", "best_seller", "trending", "custom"],
      default: "custom",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
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
  }
);

// Index for efficient sorting and filtering
landingSectionSchema.index({ sortOrder: 1, isActive: 1 });

export const LandingSection = model<ILandingSection>(
  "LandingSection",
  landingSectionSchema
);
