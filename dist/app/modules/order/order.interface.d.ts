import { Types } from "mongoose";
export interface TPickupPoint {
    _id: string;
    name: string;
    address: string;
    city?: string;
    phone?: string;
    hours?: string;
}
export interface TEpsPaymentAttempt {
    merchantTransactionId: string;
    epsTransactionId?: string;
    amount: number;
    status: "initiated" | "success" | "failed" | "cancelled" | "amount_mismatch";
    financialEntity?: string;
    verifiedAt?: Date;
    createdAt?: Date;
}
export interface TOrder {
    _id?: string;
    orderNumber: string;
    invoiceSerial?: string;
    user?: string;
    guestEmail?: string;
    isGuest?: boolean;
    firstname: string;
    lastname?: string;
    phone: string;
    email: string;
    houseStreet: string;
    city: string;
    subdistrict?: string;
    postcode?: string;
    country: string;
    shippingType: string;
    pickupPointId?: string | TPickupPoint;
    paymentMethod: string;
    transactionId?: string;
    bkashTransactionId?: string;
    bkashPaymentID?: string;
    epsPayments?: TEpsPaymentAttempt[];
    terms: boolean;
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    additionalCharge: number;
    totalPayable: number;
    amountPaid?: number;
    amountDue?: number;
    isPreOrderOrder?: boolean;
    depositDue?: number;
    depositPaid?: number;
    depositStatus?: "pending" | "paid";
    balanceDue?: number;
    balancePaid?: number;
    balanceStatus?: "pending" | "paid";
    preOrderItemsCount?: number;
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
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
    month: number;
    monthName: string;
    orderCount: number;
    totalAmountPaid: number;
    totalPayable: number;
}
export interface TArchiveSummary {
    year: number;
    months: TArchiveMonthSummary[];
    totals: {
        orderCount: number;
        totalAmountPaid: number;
        totalPayable: number;
    };
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
//# sourceMappingURL=order.interface.d.ts.map