import { Types } from "mongoose";

export interface TPickupPoint {
  _id: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  hours?: string;
}

// One redirect to the EPS hosted payment page. A customer may retry a failed
// or abandoned payment, so an order can accumulate several attempts; each has
// its own merchantTransactionId, which is what EPS reports back on.
export interface TEpsPaymentAttempt {
  merchantTransactionId: string;
  epsTransactionId?: string; // EPS's own reference, known after initialize
  amount: number;
  status: "initiated" | "success" | "failed" | "cancelled" | "amount_mismatch";
  financialEntity?: string; // Channel the customer paid with (bKash, card, ...)
  verifiedAt?: Date;
  createdAt?: Date;
}

export interface TOrder {
  _id?: string;
  orderNumber: string;
  // Small, human-friendly number printed on invoices: MM + a 3-digit
  // sequence that resets every calendar month (e.g. "09001", "09002",
  // then "06001" the following June). Distinct from orderNumber, which is
  // a long unique system reference. Not globally unique — the sequence
  // resets monthly, so different months legitimately share small numbers.
  invoiceSerial?: string;
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
  pickupPointId?: string | TPickupPoint; // Can be ID string or populated object
  paymentMethod: string;
  transactionId?: string;
  bkashTransactionId?: string; // bKash specific transaction ID
  bkashPaymentID?: string; // bKash payment ID
  epsPayments?: TEpsPaymentAttempt[];
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

export interface TArchiveMonthSummary {
  month: number; // 1-12
  monthName: string;
  orderCount: number;
  totalAmountPaid: number;
  totalPayable: number;
}

export interface TArchiveSummary {
  year: number;
  months: TArchiveMonthSummary[];
  totals: { orderCount: number; totalAmountPaid: number; totalPayable: number };
}

export interface TOrderItem {
  _id?: string;
  order: Types.ObjectId;
  product: Types.ObjectId;
  productName: string;
  productPrice: number;
  buyingPrice: number;
  quantity: number;
  selectedColor?: string;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}
