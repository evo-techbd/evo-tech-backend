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
declare class EmailService {
    private transporter;
    private isConfigured;
    constructor();
    private initialize;
    sendOrderConfirmation(orderData: OrderEmailData): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map