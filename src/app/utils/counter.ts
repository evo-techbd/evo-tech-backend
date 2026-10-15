import { Schema, model } from "mongoose";

interface TCounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<TCounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = model<TCounter>("Counter", counterSchema);

// Atomically returns the next value in a named sequence, creating it
// starting at 1 the first time it's used. Safe under concurrent calls.
export const getNextSequence = async (name: string): Promise<number> => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
};

// Bumps a sequence up to at least `value` without going backwards — used by
// the invoice-serial backfill migration so newly created records continue
// counting up from the highest backfilled number instead of restarting at 1.
export const ensureSequenceAtLeast = async (
  name: string,
  value: number,
): Promise<void> => {
  await Counter.findByIdAndUpdate(
    name,
    { $max: { seq: value } },
    { upsert: true },
  );
};

// Invoice serials reset every calendar month, shop-style: YY + MM + a 3-digit
// sequence, e.g. 2610001, 2610002, ... then 2611001 the following month. The
// counter is keyed by year+month so each month starts again from 001. The
// full formatted string (not just the running number) is what gets stored on
// the order, so printing it never depends on re-deriving the month from
// createdAt later.
const getMonthlyInvoiceSerialKey = (date: Date): string =>
  `invoiceSerial-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const formatInvoiceSerial = (date: Date, sequence: number): string => {
  const year = String(date.getFullYear() % 100).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}${String(sequence).padStart(3, "0")}`;
};

export const getNextInvoiceSerial = async (
  date: Date = new Date(),
): Promise<string> => {
  const sequence = await getNextSequence(getMonthlyInvoiceSerialKey(date));
  return formatInvoiceSerial(date, sequence);
};

export const ensureInvoiceSerialAtLeast = async (
  date: Date,
  value: number,
): Promise<void> =>
  ensureSequenceAtLeast(getMonthlyInvoiceSerialKey(date), value);
