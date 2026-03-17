import { Schema, model } from "mongoose";
import { TOrder, TOrderItem } from "./order.interface";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new Schema<TOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () =>
        `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    user: {
      type: String,
      required: false, // Optional for guest orders
    },
    guestEmail: {
      type: String,
      required: false, // Store guest email for linking later
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    houseStreet: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subdistrict: {
      type: String,
    },
    postcode: {
      type: String,
      required: false,
      default: "",
    },
    country: {
      type: String,
      required: true,
      default: "Bangladesh",
    },
    shippingType: {
      type: String,
      required: true,
    },
    pickupPointId: {
      type: Schema.Types.ObjectId,
      ref: "PickupPoint",
      set: function (v: any) {
        // Convert empty strings to null to avoid cast errors during populate
        if (v === "" || v === null || v === undefined) {
          return null;
        }
        return v;
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
    },
    bkashTransactionId: {
      type: String,
    },
    bkashPaymentID: {
      type: String,
    },
    terms: {
      type: Boolean,
      required: true,
      default: false,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    additionalCharge: {
      type: Number,
      default: 0,
    },
    totalPayable: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    amountDue: {
      type: Number,
      default: 0,
    },
    isPreOrderOrder: {
      type: Boolean,
      default: false,
    },
    preOrderItemsCount: {
      type: Number,
      default: 0,
    },
    depositDue: {
      type: Number,
      default: 0,
    },
    depositPaid: {
      type: Number,
      default: 0,
    },
    depositStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    balanceDue: {
      type: Number,
      default: 0,
    },
    balancePaid: {
      type: Number,
      default: 0,
    },
    balanceStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    trackingCode: {
      type: String,
      set: function (v: string) {
        // Trim whitespace
        return v ? v.trim() : v;
      },
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    unpaidNotified: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const orderItemSchema = new Schema<TOrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedColor: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Common admin dashboard query paths
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ email: 1 });
orderSchema.index({ phone: 1 });
orderSchema.index({ trackingCode: 1 });

// Common order item lookup paths
orderItemSchema.index({ order: 1 });
orderItemSchema.index({ product: 1 });

export const Order = model<TOrder>("Order", orderSchema);
export const OrderItem = model<TOrderItem>("OrderItem", orderItemSchema);
