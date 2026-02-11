import { Schema, model } from "mongoose";
import { IPageContent } from "./page-content.interface";

const pageContentSchema = new Schema<IPageContent>(
  {
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: [
        "privacy-policy",
        "warranty-policy",
        "shipping-return-policy",
        "student-discount",
        "shop-shape-tomorrow",
      ],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
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

// Compound index for efficient querying by type
pageContentSchema.index({ type: 1, isActive: 1, updatedAt: -1 });

export const PageContent = model<IPageContent>("PageContent", pageContentSchema);
