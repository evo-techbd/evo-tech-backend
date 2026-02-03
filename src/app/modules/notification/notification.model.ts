import { Schema, model } from "mongoose";
import { TNotification } from "./notification.interface";

const notificationSchema = new Schema<TNotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["low_stock", "out_of_stock"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    productName: {
      type: String,
    },
    productSlug: {
      type: String,
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    threshold: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ type: 1, product: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model<TNotification>(
  "Notification",
  notificationSchema
);
