"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
/**
 * Helper function to make HTTPS requests
 */
function makeRequest(url, method, headers, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method,
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
        };
        const req = https_1.default.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                }
                catch (error) {
                    reject(new Error("Failed to parse response"));
                }
            });
        });
        req.on("error", (error) => {
            reject(error);
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}
class BkashService {
    constructor() {
        this.config = {
            app_key: config_1.default.bkash_app_key,
            app_secret: config_1.default.bkash_app_secret,
            username: config_1.default.bkash_username,
            password: config_1.default.bkash_password,
            base_url: config_1.default.bkash_base_url,
        };
        this.tokenCache = {
            id_token: null,
            expires_at: null,
        };
    }
    /**
     * Get authentication token from bKash
     * Implements token caching to avoid unnecessary API calls
     */
    async getToken() {
        // Check if we have a valid cached token
        if (this.tokenCache.id_token &&
            this.tokenCache.expires_at &&
            Date.now() < this.tokenCache.expires_at) {
            return this.tokenCache.id_token;
        }
        try {
            const response = await makeRequest(`${this.config.base_url}/tokenized/checkout/token/grant`, "POST", {
                "Content-Type": "application/json",
                Accept: "application/json",
                username: this.config.username,
                password: this.config.password,
            }, {
                app_key: this.config.app_key,
                app_secret: this.config.app_secret,
            });
            const { id_token, expires_in } = response;
            // Cache the token (subtract 60 seconds for safety margin)
            this.tokenCache.id_token = id_token;
            this.tokenCache.expires_at = Date.now() + (expires_in - 60) * 1000;
            return id_token;
        }
        catch (error) {
            console.error("bKash Token Error:", error.message);
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to authenticate with bKash payment gateway");
        }
    }
    /**
     * Create a new payment
     */
    async createPayment(paymentData) {
        const token = await this.getToken();
        try {
            const response = await makeRequest(`${this.config.base_url}/tokenized/checkout/create`, "POST", {
                Accept: "application/json",
                Authorization: token,
                "X-APP-Key": this.config.app_key,
            }, paymentData);
            if (response.statusCode !== "0000") {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, response.statusMessage || "Payment creation failed");
            }
            return response;
        }
        catch (error) {
            console.error("bKash Create Payment Error:", error.message);
            if (error instanceof AppError_1.default) {
                throw error;
            }
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create bKash payment");
        }
    }
    /**
     * Execute a payment after user authorization
     */
    async executePayment(paymentID) {
        const token = await this.getToken();
        try {
            const response = await makeRequest(`${this.config.base_url}/tokenized/checkout/execute`, "POST", {
                Accept: "application/json",
                Authorization: token,
                "X-APP-Key": this.config.app_key,
            }, { paymentID });
            if (response.statusCode !== "0000") {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, response.statusMessage || "Payment execution failed");
            }
            return response;
        }
        catch (error) {
            console.error("bKash Execute Payment Error:", error.message);
            if (error instanceof AppError_1.default) {
                throw error;
            }
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to execute bKash payment");
        }
    }
    /**
     * Query payment status
     */
    async queryPayment(paymentID) {
        const token = await this.getToken();
        try {
            const response = await makeRequest(`${this.config.base_url}/tokenized/checkout/payment/status`, "POST", {
                Accept: "application/json",
                Authorization: token,
                "X-APP-Key": this.config.app_key,
            }, { paymentID });
            return response;
        }
        catch (error) {
            console.error("bKash Query Payment Error:", error.message);
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to query bKash payment status");
        }
    }
    /**
     * Refresh authentication token
     */
    async refreshToken(refresh_token) {
        try {
            const response = await makeRequest(`${this.config.base_url}/tokenized/checkout/token/refresh`, "POST", {
                Accept: "application/json",
                username: this.config.username,
                password: this.config.password,
            }, {
                app_key: this.config.app_key,
                app_secret: this.config.app_secret,
                refresh_token,
            });
            const { id_token, expires_in } = response;
            // Update cache
            this.tokenCache.id_token = id_token;
            this.tokenCache.expires_at = Date.now() + (expires_in - 60) * 1000;
            return id_token;
        }
        catch (error) {
            console.error("bKash Refresh Token Error:", error.message);
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to refresh bKash token");
        }
    }
}
exports.default = new BkashService();
//# sourceMappingURL=payment.service.js.map