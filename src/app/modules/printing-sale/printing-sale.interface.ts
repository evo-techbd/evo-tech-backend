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
  // Same shop-style invoice serial as orders (MM + 3-digit monthly sequence,
  // e.g. "09001"). Drawn from the same counter as orders, so orders and 3D
  // printing sales share one invoice numbering and never print the same SL.
  invoiceSerial?: string;
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

export interface TPrintingSaleArchiveMonthSummary {
  month: number; // 1-12
  monthName: string;
  saleCount: number;
  totalAmount: number;
}

export interface TPrintingSaleArchiveSummary {
  year: number;
  months: TPrintingSaleArchiveMonthSummary[];
  totals: { saleCount: number; totalAmount: number };
}
