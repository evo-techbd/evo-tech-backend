import { Types } from "mongoose";
export type TPaymentLogEntityType = "order" | "printing-sale";
export type TPaymentLogEvent = "created" | "status_change" | "payment_received" | "payment_failed" | "refund" | "amount_adjusted";
export type TPaymentLogSource = "admin" | "gateway" | "system";
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
export interface TPaymentSnapshot {
    paymentStatus?: string;
    amountPaid?: number;
}
//# sourceMappingURL=payment-log.interface.d.ts.map