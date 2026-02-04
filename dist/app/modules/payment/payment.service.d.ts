import { BkashCreatePaymentRequest, BkashCreatePaymentResponse, BkashExecutePaymentResponse, BkashQueryPaymentResponse } from "./payment.interface";
declare class BkashService {
    private config;
    private tokenCache;
    constructor();
    /**
     * Get authentication token from bKash
     * Implements token caching to avoid unnecessary API calls
     */
    getToken(): Promise<string>;
    /**
     * Create a new payment
     */
    createPayment(paymentData: BkashCreatePaymentRequest): Promise<BkashCreatePaymentResponse>;
    /**
     * Execute a payment after user authorization
     */
    executePayment(paymentID: string): Promise<BkashExecutePaymentResponse>;
    /**
     * Query payment status
     */
    queryPayment(paymentID: string): Promise<BkashQueryPaymentResponse>;
    /**
     * Refresh authentication token
     */
    refreshToken(refresh_token: string): Promise<string>;
}
declare const _default: BkashService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map