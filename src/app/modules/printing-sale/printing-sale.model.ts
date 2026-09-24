import { Schema, model } from "mongoose";
import { TPrintingSale, TPrintingSaleItem } from "./printing-sale.interface";
import { v4 as uuidv4 } from "uuid";

const printingSaleItemSchema = new Schema<TPrintingSaleItem>(
  {
    productName: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const printingSaleSchema = new Schema<TPrintingSale>(
  {
    saleNumber: {
      type: String,
      unique: true,
      default: () =>
        `PS-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`,
    },
    invoiceSerial: {
      // Resets every month (e.g. "09001"), so it is NOT unique across the
      // whole collection — only within the month it was issued.
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Bangladesh",
    },
    notes: {
      type: String,
    },
    items: {
      type: [printingSaleItemSchema],
      required: true,
      validate: {
        validator: (v: TPrintingSaleItem[]) => v.length > 0,
        message: "At least one item is required",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

printingSaleSchema.index({ invoiceSerial: 1 });

export const PrintingSale = model<TPrintingSale>(
  "PrintingSale",
  printingSaleSchema,
);
