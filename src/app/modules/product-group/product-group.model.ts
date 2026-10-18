import { Schema, model } from "mongoose";
import { TProductGroup, TProductGroupMember } from "./product-group.interface";

const productGroupMemberSchema = new Schema<TProductGroupMember>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    label: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const productGroupSchema = new Schema<TProductGroup>(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    members: {
      type: [productGroupMemberSchema],
      default: [],
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

// A product belongs to at most one group. Validation requires at least two
// members, so no group has an empty array (which would index as null and collide).
productGroupSchema.index({ "members.product": 1 }, { unique: true });

export const ProductGroup = model<TProductGroup>(
  "ProductGroup",
  productGroupSchema,
);
