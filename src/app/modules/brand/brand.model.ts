import { Schema, model } from "mongoose";
import { TBrand } from "./brand.interface";

const brandSchema = new Schema<TBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    subcategories: [{
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    }],
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

export const Brand = model<TBrand>("Brand", brandSchema);
