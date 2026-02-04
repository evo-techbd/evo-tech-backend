import { Schema, model } from "mongoose";
import { ITerms } from "./terms.interface";

const termsSchema = new Schema<ITerms>(
  {
    content: {
      type: String,
      required: [true, "Terms and conditions content is required"],
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
termsSchema.index({ isActive: 1, updatedAt: -1 });

export const Terms = model<ITerms>("Terms", termsSchema);
