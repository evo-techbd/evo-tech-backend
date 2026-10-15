import { Types } from "mongoose";

export type TPaymentLogEntityType = "order" | "printing-sale";

export type TPaymentLogEvent =
  | "created"
  | "status_change"
  | "payment_received"
  | "payment_failed"
  | "refund"
  | "amount_adjusted";

export type TPaymentLogSource = "admin" | "gateway" | "system";

// Append-only record of one change to an order's or 3D printing sale's
// payment state. Never updated or deleted, so it survives the entity itself.
export interface TPaymentLog {
  _id?: string;
  entityType: TPaymentLogEntityType;
  entityId: Types.ObjectId;
  entityLabel?: string;
  event: TPaymentLogEvent;
  fromStatus?: string;
  toStatus?: string;
  amount?: number;
  amountPaidBefore?: number;
  amountPaidAfter?: number;
  method?: string;
  transactionId?: string;
  source: TPaymentLogSource;
  performedBy?: Types.ObjectId;
  note?: string;
  createdAt?: Date;
}

// The two fields a log entry is derived from, read before and after a change.
export interface TPaymentSnapshot {
  paymentStatus?: string;
  amountPaid?: number;
}
