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
  mode: "0011" | "0001"; // 0011 for checkout, 0001 for instant checkout
  payerReference: string; // Customer's mobile number or reference
  callbackURL: string;
  amount: string;
  currency: "BDT";
  intent: "sale" | "authorization";
  merchantInvoiceNumber: string; // Unique invoice/order ID
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

// ---------------------------------------------------------------------------
// EPS (Easy Payment System) gateway
// ---------------------------------------------------------------------------

export interface EpsConfig {
  base_url: string;
  username: string;
  password: string;
  hash_key: string;
  merchant_id: string;
  store_id: string;
}

export interface EpsGetTokenResponse {
  token: string;
  expireDate: string;
  errorMessage: string | null;
  errorCode: string | null;
}

export interface EpsProductItem {
  ProductName: string;
  NoOfItem: string;
  ProductProfile: string;
  ProductCategory: string;
  ProductPrice: string;
}

export interface EpsInitializeParams {
  customerOrderId: string;
  merchantTransactionId: string;
  totalAmount: number;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPostcode: string;
  customerPhone: string;
  productName: string;
  noOfItem: number;
  productList: EpsProductItem[];
  ipAddress?: string;
  // Free-form reference echoed back by EPS on verification
  valueA?: string;
}

export interface EpsInitializeResponse {
  TransactionId: string;
  RedirectURL: string;
  ErrorMessage: string | null;
  ErrorCode: string | null;
}

// Shape confirmed against the EPS sandbox. An unpaid session whose payment
// page is still open reports Status "Cancel".
export interface EpsVerifyResponse {
  MerchantTransactionId: string;
  EPSTransactionId: string;
  Status: string; // Success | Failed | Cancel | ...
  TotalAmount: string;
  StoreAmount?: string;
  TransactionDate: string;
  FinancialEntity: string | null;
  ValueA?: string;
  ErrorMessage: string | null;
  ErrorCode: string | null;
}
