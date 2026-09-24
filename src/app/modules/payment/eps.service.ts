import crypto from "crypto";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import {
  EpsConfig,
  EpsGetTokenResponse,
  EpsInitializeParams,
  EpsInitializeResponse,
  EpsVerifyResponse,
} from "./payment.interface";

const REQUEST_TIMEOUT_MS = 30_000;
// Refresh the bearer token a minute before EPS says it expires
const TOKEN_EXPIRY_SKEW_MS = 60_000;

/**
 * Client for the EPS payment gateway REST API.
 *
 * Every request carries an `x-hash` header: base64(HMAC-SHA512(value, hashKey))
 * where `value` is the username (GetToken) or the merchantTransactionId
 * (InitializeEPS / CheckMerchantTransactionStatus).
 */
class EpsService {
  private config: EpsConfig;
  private tokenCache: { token: string | null; expiresAt: number } = {
    token: null,
    expiresAt: 0,
  };

  constructor() {
    this.config = {
      base_url: config.eps_base_url,
      username: config.eps_username as string,
      password: config.eps_password as string,
      hash_key: config.eps_hash_key as string,
      merchant_id: config.eps_merchant_id as string,
      store_id: config.eps_store_id as string,
    };
  }

  isConfigured(): boolean {
    const { username, password, hash_key, merchant_id, store_id } =
      this.config;
    return Boolean(username && password && hash_key && merchant_id && store_id);
  }

  private assertConfigured() {
    if (!this.isConfigured()) {
      throw new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "Online payment is temporarily unavailable. Please choose another payment method.",
      );
    }
  }

  private generateHash(value: string): string {
    return crypto
      .createHmac("sha512", Buffer.from(this.config.hash_key, "utf8"))
      .update(value, "utf8")
      .digest("base64");
  }

  private async request<T>(
    path: string,
    init: {
      method: "GET" | "POST";
      headers: Record<string, string>;
      body?: unknown;
    },
  ): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.config.base_url}${path}`, {
        method: init.method,
        headers: { "Content-Type": "application/json", ...init.headers },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      console.error(`EPS ${path} request failed:`, error);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Could not reach the payment gateway. Please try again.",
      );
    }

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error(`EPS ${path} returned non-JSON (${response.status}):`, text);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Unexpected response from the payment gateway.",
      );
    }

    if (!response.ok) {
      console.error(`EPS ${path} HTTP ${response.status}:`, data);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        data?.ErrorMessage || data?.errorMessage || "Payment gateway error",
      );
    }

    return data as T;
  }

  private async getToken(): Promise<string> {
    if (this.tokenCache.token && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    const data = await this.request<EpsGetTokenResponse>("/Auth/GetToken", {
      method: "POST",
      headers: { "x-hash": this.generateHash(this.config.username) },
      body: { userName: this.config.username, password: this.config.password },
    });

    if (!data.token || data.errorCode || data.errorMessage) {
      console.error("EPS GetToken failed:", data.errorCode, data.errorMessage);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Payment gateway authentication failed.",
      );
    }

    const expiry = new Date(data.expireDate).getTime();
    this.tokenCache = {
      token: data.token,
      expiresAt: Number.isFinite(expiry)
        ? expiry - TOKEN_EXPIRY_SKEW_MS
        : Date.now() + 10 * 60_000,
    };
    return data.token;
  }

  /**
   * Create a payment session and get the hosted payment page URL.
   */
  async initializePayment(
    params: EpsInitializeParams,
  ): Promise<EpsInitializeResponse> {
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

    const data = await this.request<EpsInitializeResponse>(
      "/EPSEngine/InitializeEPS",
      {
        method: "POST",
        headers: {
          "x-hash": this.generateHash(params.merchantTransactionId),
          Authorization: `Bearer ${token}`,
        },
        body,
      },
    );

    if (!data.RedirectURL || data.ErrorCode || data.ErrorMessage) {
      console.error(
        "EPS InitializeEPS failed:",
        data.ErrorCode,
        data.ErrorMessage,
      );
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        data.ErrorMessage || "Could not start the online payment.",
      );
    }

    return data;
  }

  /**
   * Ask EPS for the authoritative status of a transaction. Never trust the
   * browser redirect alone — always call this before marking an order paid.
   */
  async verifyPayment(
    merchantTransactionId: string,
  ): Promise<EpsVerifyResponse> {
    this.assertConfigured();
    const token = await this.getToken();

    const query = new URLSearchParams({ merchantTransactionId });
    return this.request<EpsVerifyResponse>(
      `/EPSEngine/CheckMerchantTransactionStatus?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "x-hash": this.generateHash(merchantTransactionId),
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}

export default new EpsService();
