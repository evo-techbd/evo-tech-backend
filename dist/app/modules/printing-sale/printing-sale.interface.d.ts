import { Types } from "mongoose";
export interface TPrintingSaleItem {
    productName: string;
    unitPrice: number;
    quantity: number;
    price: number;
}
export interface TPrintingSale {
    _id?: string;
    saleNumber: string;
    invoiceSerial?: string;
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    country: string;
    notes?: string;
    items: TPrintingSaleItem[];
    totalPrice: number;
    paymentStatus: "pending" | "paid" | "cancelled";
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TPrintingSaleArchiveMonthSummary {
    month: number;
    monthName: string;
    saleCount: number;
    totalAmount: number;
}
export interface TPrintingSaleArchiveSummary {
    year: number;
    months: TPrintingSaleArchiveMonthSummary[];
    totals: {
        saleCount: number;
        totalAmount: number;
    };
}
//# sourceMappingURL=printing-sale.interface.d.ts.map