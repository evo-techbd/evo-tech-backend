import { Schema, model } from "mongoose";
import { IPrivacy } from "./privacy.interface";

const privacySchema = new Schema<IPrivacy>(
  {
    content: {
      type: String,
      required: [true, "Privacy policy content is required"],
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
privacySchema.index({ isActive: 1, updatedAt: -1 });

export const Privacy = model<IPrivacy>("Privacy", privacySchema);
