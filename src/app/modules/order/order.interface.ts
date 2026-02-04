import { Types } from "mongoose";

export interface TOrder {
  _id?: string;
  orderNumber: string;
  user?: string; // UUID - optional for guest orders
  guestEmail?: string; // Email for guest checkout - used to link orders when user registers
  isGuest?: boolean; // Flag to identify guest orders
  firstname: string;
  lastname?: string; // Optional - no longer collected
  phone: string;
  email: string;
  houseStreet: string;
  city: string;
  subdistrict?: string;
  postcode?: string; // Optional - no longer collected
  country: string;
  shippingType: string;
  pickupPointId?: string;
  paymentMethod: string;
  transactionId?: string;
  bkashTransactionId?: string; // bKash specific transaction ID
  bkashPaymentID?: string; // bKash payment ID
  terms: boolean;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  additionalCharge: number;
  totalPayable: number;
  amountPaid?: number;
  amountDue?: number;
  isPreOrderOrder?: boolean; // flag if any line item is pre-order
  depositDue?: number;
  depositPaid?: number;
  depositStatus?: "pending" | "paid";
  balanceDue?: number;
  balancePaid?: number;
  balanceStatus?: "pending" | "paid";
  preOrderItemsCount?: number;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "partial" | "paid" | "failed" | "refunded";
  notes?: string;
  trackingCode?: string;
  viewed: boolean;
  unpaidNotified: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TOrderItem {
  _id?: string;
  order: Types.ObjectId;
  product: Types.ObjectId;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}
