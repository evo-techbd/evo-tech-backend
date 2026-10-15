import { Types } from "mongoose";
import { TPaymentLogEntityType, TPaymentLogEvent, TPaymentLogSource, TPaymentSnapshot } from "./payment-log.interface";
interface TLogPaymentChangeInput {
    entityType: TPaymentLogEntityType;
    entityId: unknown;
    entityLabel?: string;
    before: TPaymentSnapshot;
    after: TPaymentSnapshot;
    source: TPaymentLogSource;
    event?: TPaymentLogEvent;
    method?: string;
    transactionId?: string;
    performedBy?: unknown;
    note?: string;
}
type TEntityLogOptions = Omit<TLogPaymentChangeInput, "entityType" | "entityId" | "entityLabel" | "before" | "after">;
export declare const PaymentLogServices: {
    logPaymentChange: (input: TLogPaymentChangeInput) => Promise<void>;
    logOrderPaymentChange: (before: TPaymentSnapshot, order: any, options: TEntityLogOptions) => Promise<void>;
    logSalePaymentChange: (before: TPaymentSnapshot, sale: any, options: TEntityLogOptions) => Promise<void>;
    orderPaymentSnapshot: (order: any) => TPaymentSnapshot;
    salePaymentSnapshot: (sale: any) => TPaymentSnapshot;
    getPaymentLogsForEntity: (entityType: TPaymentLogEntityType, entityId: string) => Promise<(import("mongoose").FlattenMaps<{
        _id?: string | undefined;
        entityType: TPaymentLogEntityType;
        entityId: Types.ObjectId;
        entityLabel?: string | undefined;
        event: TPaymentLogEvent;
        fromStatus?: string | undefined;
        toStatus?: string | undefined;
        amount?: number | undefined;
        amountPaidBefore?: number | undefined;
        amountPaidAfter?: number | undefined;
        method?: string | undefined;
        transactionId?: string | undefined;
        source: TPaymentLogSource;
        performedBy?: Types.ObjectId | undefined;
        note?: string | undefined;
        createdAt?: Date | undefined;
    }> & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
};
export {};
//# sourceMappingURL=payment-log.service.d.ts.map