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
//# sourceMappingURL=printing-sale.interface.d.ts.map