import https from "https";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import {
  BkashConfig,
  BkashGrantTokenResponse,
  BkashCreatePaymentRequest,
  BkashCreatePaymentResponse,
  BkashExecutePaymentRequest,
  BkashExecutePaymentResponse,
  BkashQueryPaymentRequest,
  BkashQueryPaymentResponse,
} from "./payment.interface";

/**
 * Helper function to make HTTPS requests
 */
function makeRequest<T>(
  url: string,
  method: string,
  headers: Record<string, string>,
  data?: any
): Promise<T> {
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

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed as T);
        } catch (error) {
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
  private config: BkashConfig;
  private tokenCache: {
    id_token: string | null;
    expires_at: number | null;
  };

  constructor() {
    this.config = {
      app_key: config.bkash_app_key as string,
      app_secret: config.bkash_app_secret as string,
      username: config.bkash_username as string,
      password: config.bkash_password as string,
      base_url: config.bkash_base_url as string,
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
  async getToken(): Promise<string> {
    // Check if we have a valid cached token
    if (
      this.tokenCache.id_token &&
      this.tokenCache.expires_at &&
      Date.now() < this.tokenCache.expires_at
    ) {
      return this.tokenCache.id_token;
    }

    try {
      const response = await makeRequest<BkashGrantTokenResponse>(
        `${this.config.base_url}/tokenized/checkout/token/grant`,
        "POST",
        {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: this.config.username,
          password: this.config.password,
        },
        {
          app_key: this.config.app_key,
          app_secret: this.config.app_secret,
        }
      );

      const { id_token, expires_in } = response;

      // Cache the token (subtract 60 seconds for safety margin)
      this.tokenCache.id_token = id_token;
      this.tokenCache.expires_at = Date.now() + (expires_in - 60) * 1000;

      return id_token;
    } catch (error: any) {
      console.error("bKash Token Error:", error.message);
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to authenticate with bKash payment gateway"
      );
    }
  }

  /**
   * Create a new payment
   */
  async createPayment(
    paymentData: BkashCreatePaymentRequest
  ): Promise<BkashCreatePaymentResponse> {
    const token = await this.getToken();

    try {
      const response = await makeRequest<BkashCreatePaymentResponse>(
        `${this.config.base_url}/tokenized/checkout/create`,
        "POST",
        {
          Accept: "application/json",
          Authorization: token,
          "X-APP-Key": this.config.app_key,
        },
        paymentData
      );

      if (response.statusCode !== "0000") {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          response.statusMessage || "Payment creation failed"
        );
      }

      return response;
    } catch (error: any) {
      console.error("bKash Create Payment Error:", error.message);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create bKash payment"
      );
    }
  }

  /**
   * Execute a payment after user authorization
   */
  async executePayment(
    paymentID: string
  ): Promise<BkashExecutePaymentResponse> {
    const token = await this.getToken();

    try {
      const response = await makeRequest<BkashExecutePaymentResponse>(
        `${this.config.base_url}/tokenized/checkout/execute`,
        "POST",
        {
          Accept: "application/json",
          Authorization: token,
          "X-APP-Key": this.config.app_key,
        },
        { paymentID }
      );

      if (response.statusCode !== "0000") {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          response.statusMessage || "Payment execution failed"
        );
      }

      return response;
    } catch (error: any) {
      console.error("bKash Execute Payment Error:", error.message);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to execute bKash payment"
      );
    }
  }

  /**
   * Query payment status
   */
  async queryPayment(paymentID: string): Promise<BkashQueryPaymentResponse> {
    const token = await this.getToken();

    try {
      const response = await makeRequest<BkashQueryPaymentResponse>(
        `${this.config.base_url}/tokenized/checkout/payment/status`,
        "POST",
        {
          Accept: "application/json",
          Authorization: token,
          "X-APP-Key": this.config.app_key,
        },
        { paymentID }
      );

      return response;
    } catch (error: any) {
      console.error("bKash Query Payment Error:", error.message);
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to query bKash payment status"
      );
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refresh_token: string): Promise<string> {
    try {
      const response = await makeRequest<BkashGrantTokenResponse>(
        `${this.config.base_url}/tokenized/checkout/token/refresh`,
        "POST",
        {
          Accept: "application/json",
          username: this.config.username,
          password: this.config.password,
        },
        {
          app_key: this.config.app_key,
          app_secret: this.config.app_secret,
          refresh_token,
        }
      );

      const { id_token, expires_in } = response;

      // Update cache
      this.tokenCache.id_token = id_token;
      this.tokenCache.expires_at = Date.now() + (expires_in - 60) * 1000;

      return id_token;
    } catch (error: any) {
      console.error("bKash Refresh Token Error:", error.message);
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to refresh bKash token"
      );
    }
  }
}

export default new BkashService();
