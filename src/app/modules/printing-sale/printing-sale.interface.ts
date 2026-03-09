import { Types } from "mongoose";

export interface TPrintingSaleItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  price: number; // unitPrice * quantity (total for this line item)
}

export interface TPrintingSale {
  _id?: string;
  saleNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  items: TPrintingSaleItem[];
  totalPrice: number; // sum of all items' price
  paymentStatus: "pending" | "paid" | "cancelled";
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
