import { EpsInitializeParams, EpsInitializeResponse, EpsVerifyResponse } from "./payment.interface";
/**
 * Client for the EPS payment gateway REST API.
 *
 * Every request carries an `x-hash` header: base64(HMAC-SHA512(value, hashKey))
 * where `value` is the username (GetToken) or the merchantTransactionId
 * (InitializeEPS / CheckMerchantTransactionStatus).
 */
declare class EpsService {
    private config;
    private tokenCache;
    constructor();
    isConfigured(): boolean;
    private assertConfigured;
    private generateHash;
    private request;
    private getToken;
    /**
     * Create a payment session and get the hosted payment page URL.
     */
    initializePayment(params: EpsInitializeParams): Promise<EpsInitializeResponse>;
    /**
     * Ask EPS for the authoritative status of a transaction. Never trust the
     * browser redirect alone — always call this before marking an order paid.
     */
    verifyPayment(merchantTransactionId: string): Promise<EpsVerifyResponse>;
}
declare const _default: EpsService;
export default _default;
//# sourceMappingURL=eps.service.d.ts.map