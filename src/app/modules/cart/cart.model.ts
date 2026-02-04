import { Schema, model } from "mongoose";
import { TCart, TWishlist } from "./cart.interface";

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    selectedColor: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const wishlistSchema = new Schema<TWishlist>(
  {
    user: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for cart
cartSchema.index({ user: 1, product: 1 }, { unique: true });

// Create compound index for wishlist
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export const Cart = model<TCart>("Cart", cartSchema);
export const Wishlist = model<TWishlist>("Wishlist", wishlistSchema);
