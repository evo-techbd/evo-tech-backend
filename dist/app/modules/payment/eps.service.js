"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const REQUEST_TIMEOUT_MS = 30000;
// Refresh the bearer token a minute before EPS says it expires
const TOKEN_EXPIRY_SKEW_MS = 60000;
/**
 * Client for the EPS payment gateway REST API.
 *
 * Every request carries an `x-hash` header: base64(HMAC-SHA512(value, hashKey))
 * where `value` is the username (GetToken) or the merchantTransactionId
 * (InitializeEPS / CheckMerchantTransactionStatus).
 */
class EpsService {
    constructor() {
        this.tokenCache = {
            token: null,
            expiresAt: 0,
        };
        this.config = {
            base_url: config_1.default.eps_base_url,
            username: config_1.default.eps_username,
            password: config_1.default.eps_password,
            hash_key: config_1.default.eps_hash_key,
            merchant_id: config_1.default.eps_merchant_id,
            store_id: config_1.default.eps_store_id,
        };
    }
    isConfigured() {
        const { username, password, hash_key, merchant_id, store_id } = this.config;
        return Boolean(username && password && hash_key && merchant_id && store_id);
    }
    assertConfigured() {
        if (!this.isConfigured()) {
            throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, "Online payment is temporarily unavailable. Please choose another payment method.");
        }
    }
    generateHash(value) {
        return crypto_1.default
            .createHmac("sha512", Buffer.from(this.config.hash_key, "utf8"))
            .update(value, "utf8")
            .digest("base64");
    }
    async request(path, init) {
        let response;
        try {
            response = await fetch(`${this.config.base_url}${path}`, {
                method: init.method,
                headers: { "Content-Type": "application/json", ...init.headers },
                body: init.body === undefined ? undefined : JSON.stringify(init.body),
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
                // EPS answers an expired/invalid token with a 302 to a login page;
                // following it would turn the rejection into an empty 200
                redirect: "manual",
            });
        }
        catch (error) {
            console.error(`EPS ${path} request failed:`, error);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Could not reach the payment gateway. Please try again.");
        }
        if (response.status === 401 ||
            (response.status >= 300 && response.status < 400)) {
            // A rejected token must not be reused by the next attempt
            this.tokenCache = { token: null, expiresAt: 0 };
            console.error(`EPS ${path} rejected the token (HTTP ${response.status})`);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Payment gateway authentication failed.");
        }
        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        }
        catch {
            console.error(`EPS ${path} returned non-JSON (${response.status}):`, text);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Unexpected response from the payment gateway.");
        }
        if (!response.ok) {
            console.error(`EPS ${path} HTTP ${response.status}:`, data);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, data?.ErrorMessage || data?.errorMessage || "Payment gateway error");
        }
        return data;
    }
    readTokenExpiry(token) {
        try {
            const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
            return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
        }
        catch {
            return 0;
        }
    }
    async getToken() {
        if (this.tokenCache.token && Date.now() < this.tokenCache.expiresAt) {
            return this.tokenCache.token;
        }
        const data = await this.request("/Auth/GetToken", {
            method: "POST",
            headers: { "x-hash": this.generateHash(this.config.username) },
            body: { userName: this.config.username, password: this.config.password },
        });
        if (!data.token || data.errorCode || data.errorMessage) {
            console.error("EPS GetToken failed:", data.errorCode, data.errorMessage);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Payment gateway authentication failed.");
        }
        // Use the JWT's own exp claim: expireDate is Bangladesh local time with no
        // offset, so it reads 6h late on a UTC server. The sandbox issues tokens
        // whose exp is the issue time (they die ~5 min later), which this treats
        // as uncacheable — a fresh token per request.
        this.tokenCache = {
            token: data.token,
            expiresAt: this.readTokenExpiry(data.token) - TOKEN_EXPIRY_SKEW_MS,
        };
        return data.token;
    }
    /**
     * Create a payment session and get the hosted payment page URL.
     */
    async initializePayment(params) {
        this.assertConfigured();
        const token = await this.getToken();
        const body = {
            merchantId: this.config.merchant_id,
            storeId: this.config.store_id,
            CustomerOrderId: params.customerOrderId,
            merchantTransactionId: params.merchantTransactionId,
            transactionTypeId: 1, // 1 = Web
            financialEntityId: 0, // 0 = customer picks the channel on the EPS page
            transitionStatusId: 0,
            totalAmount: params.totalAmount,
            ipAddress: params.ipAddress || "0.0.0.0",
            version: "1",
            successUrl: params.successUrl,
            failUrl: params.failUrl,
            cancelUrl: params.cancelUrl,
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            CustomerAddress: params.customerAddress,
            CustomerAddress2: "",
            CustomerCity: params.customerCity,
            CustomerState: params.customerState,
            CustomerPostcode: params.customerPostcode,
            CustomerCountry: "BD",
            CustomerPhone: params.customerPhone,
            ShipmentName: "",
            ShipmentAddress: "",
            ShipmentAddress2: "",
            ShipmentCity: "",
            ShipmentState: "",
            ShipmentPostcode: "",
            ShipmentCountry: "",
            ValueA: params.valueA || "",
            ValueB: "",
            ValueC: "",
            ValueD: "",
            ShippingMethod: "NO",
            NoOfItem: String(params.noOfItem),
            ProductName: params.productName,
            ProductProfile: "general",
            ProductCategory: "general",
            ProductList: params.productList,
        };
        const data = await this.request("/EPSEngine/InitializeEPS", {
            method: "POST",
            headers: {
                "x-hash": this.generateHash(params.merchantTransactionId),
                Authorization: `Bearer ${token}`,
            },
            body,
        });
        if (!data.RedirectURL || data.ErrorCode || data.ErrorMessage) {
            console.error("EPS InitializeEPS failed:", data.ErrorCode, data.ErrorMessage);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, data.ErrorMessage || "Could not start the online payment.");
        }
        return data;
    }
    /**
     * Ask EPS for the authoritative status of a transaction. Never trust the
     * browser redirect alone — always call this before marking an order paid.
     */
    async verifyPayment(merchantTransactionId) {
        this.assertConfigured();
        const token = await this.getToken();
        const query = new URLSearchParams({ merchantTransactionId });
        return this.request(`/EPSEngine/CheckMerchantTransactionStatus?${query.toString()}`, {
            method: "GET",
            headers: {
                "x-hash": this.generateHash(merchantTransactionId),
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
exports.default = new EpsService();
//# sourceMappingURL=eps.service.js.map