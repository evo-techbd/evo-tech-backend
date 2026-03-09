import { Schema, model } from "mongoose";
import { TTrashItem } from "./trash.interface";

const trashSchema = new Schema<TTrashItem>(
  {
    entityType: {
      type: String,
      required: true,
      enum: ["product", "brand", "category", "subcategory", "coupon", "review", "user"],
      index: true,
    },
    originalId: {
      type: String,
      required: true,
    },
    entityLabel: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    relatedData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const TrashItem = model<TTrashItem>("TrashItem", trashSchema);
