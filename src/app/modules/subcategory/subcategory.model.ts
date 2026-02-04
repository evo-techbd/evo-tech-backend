import { Schema, model } from "mongoose";
import { TSubcategory } from "./subcategory.interface";

const subcategorySchema = new Schema<TSubcategory>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Subcategory = model<TSubcategory>(
  "Subcategory",
  subcategorySchema
);
