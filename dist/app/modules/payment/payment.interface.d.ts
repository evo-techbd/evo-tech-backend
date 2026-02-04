export interface BkashConfig {
    app_key: string;
    app_secret: string;
    username: string;
    password: string;
    base_url: string;
}
export interface BkashGrantTokenResponse {
    statusCode: string;
    statusMessage: string;
    id_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}
export interface BkashCreatePaymentRequest {
    mode: "0011" | "0001";
    payerReference: string;
    callbackURL: string;
    amount: string;
    currency: "BDT";
    intent: "sale" | "authorization";
    merchantInvoiceNumber: string;
}
export interface BkashCreatePaymentResponse {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    bkashURL: string;
    callbackURL: string;
    successCallbackURL: string;
    failureCallbackURL: string;
    cancelledCallbackURL: string;
    amount: string;
    intent: string;
    currency: string;
    paymentCreateTime: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
}
export interface BkashExecutePaymentRequest {
    paymentID: string;
}
export interface BkashExecutePaymentResponse {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    trxID: string;
    transactionStatus: string;
    amount: string;
    currency: string;
    intent: string;
    paymentExecuteTime: string;
    merchantInvoiceNumber: string;
    payerType: string;
    payerReference: string;
    customerMsisdn: string;
}
export interface BkashQueryPaymentRequest {
    paymentID: string;
}
export interface BkashQueryPaymentResponse {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    trxID?: string;
    transactionStatus: string;
    amount: string;
    currency: string;
    intent: string;
    merchantInvoiceNumber: string;
    paymentExecuteTime?: string;
}
export interface BkashRefundRequest {
    paymentID: string;
    amount: string;
    trxID: string;
    sku: string;
    reason: string;
}
export interface BkashRefundResponse {
    statusCode: string;
    statusMessage: string;
    originalTrxID: string;
    refundTrxID: string;
    transactionStatus: string;
    amount: string;
    currency: string;
    charge: string;
}
//# sourceMappingURL=payment.interface.d.ts.map