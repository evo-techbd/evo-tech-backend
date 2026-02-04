interface OrderEmailData {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    trackingCode: string;
    orderDate: string;
    items: Array<{
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
        selectedColor?: string;
    }>;
    subtotal: number;
    deliveryCharge: number;
    totalPayable: number;
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        subdistrict: string;
    };
    isPreOrderOrder: boolean;
    depositDue?: number;
    balanceDue?: number;
}
export declare const orderConfirmationTemplate: (data: OrderEmailData) => string;
export {};
//# sourceMappingURL=emailTemplates.d.ts.map