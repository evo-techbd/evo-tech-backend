import { Schema, model } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    button_text: {
      type: String,
      trim: true,
      default: "SHOP NOW",
    },
    button_url: {
      type: String,
      trim: true,
      default: "/products",
    },
    more_text: {
      type: String,
      trim: true,
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
  }
);

// Index for efficient sorting and filtering
bannerSchema.index({ sortOrder: 1, isActive: 1 });

export const Banner = model<IBanner>("Banner", bannerSchema);
