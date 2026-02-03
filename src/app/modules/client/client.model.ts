import { Schema, model } from "mongoose";
import { IClient } from "./client.interface";

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "Client logo is required"],
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
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
clientSchema.index({ sortOrder: 1, isActive: 1 });

export const Client = model<IClient>("Client", clientSchema);
