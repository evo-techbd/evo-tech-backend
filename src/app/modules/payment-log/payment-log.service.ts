import { Types } from "mongoose";
import { PaymentLog } from "./payment-log.model";
import {
  TPaymentLogEntityType,
  TPaymentLogEvent,
  TPaymentLogSource,
  TPaymentSnapshot,
} from "./payment-log.interface";

const toTwoDecimals = (value: number) => Math.round(value * 100) / 100;

const toObjectId = (id: unknown) => {
  if (!id) return undefined;
  if (id instanceof Types.ObjectId) return id;
  const str = String(id);
  return Types.ObjectId.isValid(str) ? new Types.ObjectId(str) : undefined;
};

interface TLogPaymentChangeInput {
  entityType: TPaymentLogEntityType;
  entityId: unknown;
  entityLabel?: string;
  before: TPaymentSnapshot;
  after: TPaymentSnapshot;
  source: TPaymentLogSource;
  // Forces an entry (and its event type) even when nothing changed, e.g. a
  // rejected gateway payment that leaves the order as it was.
  event?: TPaymentLogEvent;
  method?: string;
  transactionId?: string;
  performedBy?: unknown;
  note?: string;
}

const deriveEvent = (
  fromStatus: string | undefined,
  toStatus: string | undefined,
  amountDelta: number,
  source: TPaymentLogSource,
): TPaymentLogEvent => {
  if (fromStatus !== toStatus) {
    if (toStatus === "refunded") return "refund";
    if (toStatus === "failed") return "payment_failed";
  }
  if (source === "gateway" && amountDelta > 0) return "payment_received";
  if (fromStatus !== toStatus) return "status_change";
  return "amount_adjusted";
};

/**
 * Record a change to an entity's payment state. Writes nothing when neither
 * the status nor the amount paid moved (unless an event is forced), so
 * no-op saves don't clutter the history.
 *
 * Best effort: a failed log write is reported but never thrown, so it can't
 * break an admin save or a gateway callback that already succeeded.
 */
const logPaymentChange = async (input: TLogPaymentChangeInput) => {
  try {
    const fromStatus = input.before.paymentStatus;
    const toStatus = input.after.paymentStatus;
    const amountPaidBefore = toTwoDecimals(input.before.amountPaid ?? 0);
    const amountPaidAfter = toTwoDecimals(input.after.amountPaid ?? 0);
    const amountDelta = toTwoDecimals(amountPaidAfter - amountPaidBefore);

    const changed = fromStatus !== toStatus || Math.abs(amountDelta) >= 0.01;
    if (!changed && !input.event) return;

    await PaymentLog.create({
      entityType: input.entityType,
      entityId: toObjectId(input.entityId),
      entityLabel: input.entityLabel,
      event:
        input.event ??
        deriveEvent(fromStatus, toStatus, amountDelta, input.source),
      fromStatus,
      toStatus,
      amount: amountDelta,
      amountPaidBefore,
      amountPaidAfter,
      method: input.method,
      transactionId: input.transactionId || undefined,
      source: input.source,
      performedBy: toObjectId(input.performedBy),
      note: input.note,
    });
  } catch (error) {
    console.error("Failed to write payment log:", {
      entityType: input.entityType,
      entityId: String(input.entityId),
      error,
    });
  }
};

const orderPaymentSnapshot = (order: any): TPaymentSnapshot => ({
  paymentStatus: order?.paymentStatus,
  amountPaid: order?.amountPaid ?? 0,
});

// Sales have no partial payments: the full total counts as paid only while
// the status is "paid".
const salePaymentSnapshot = (sale: any): TPaymentSnapshot => ({
  paymentStatus: sale?.paymentStatus,
  amountPaid: sale?.paymentStatus === "paid" ? sale?.totalPrice ?? 0 : 0,
});

type TEntityLogOptions = Omit<
  TLogPaymentChangeInput,
  "entityType" | "entityId" | "entityLabel" | "before" | "after"
>;

const logOrderPaymentChange = (
  before: TPaymentSnapshot,
  order: any,
  options: TEntityLogOptions,
) =>
  logPaymentChange({
    entityType: "order",
    entityId: order._id,
    entityLabel: order.invoiceSerial || order.orderNumber,
    before,
    after: orderPaymentSnapshot(order),
    ...options,
    method: options.method ?? order.paymentMethod,
  });

const logSalePaymentChange = (
  before: TPaymentSnapshot,
  sale: any,
  options: TEntityLogOptions,
) =>
  logPaymentChange({
    entityType: "printing-sale",
    entityId: sale._id,
    entityLabel: sale.invoiceSerial || sale.saleNumber,
    before,
    after: salePaymentSnapshot(sale),
    ...options,
    method: options.method ?? "manual",
  });

const getPaymentLogsForEntity = async (
  entityType: TPaymentLogEntityType,
  entityId: string,
) => {
  const id = toObjectId(entityId);
  if (!id) return [];
  return PaymentLog.find({ entityType, entityId: id })
    .sort({ createdAt: -1, _id: -1 })
    .populate("performedBy", "firstName lastName email")
    .lean();
};

export const PaymentLogServices = {
  logPaymentChange,
  logOrderPaymentChange,
  logSalePaymentChange,
  orderPaymentSnapshot,
  salePaymentSnapshot,
  getPaymentLogsForEntity,
};
