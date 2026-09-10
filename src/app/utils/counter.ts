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

// Invoice serials reset every calendar month, shop-style: MM + a 3-digit
// sequence, e.g. 09001, 09002, ... then 06001 the following June. The
// counter is keyed by year+month internally so two different Septembers a
// year apart never collide, even though only the month shows up in the
// printed number. The full formatted string (not just the running number)
// is what gets stored on the order, so printing it never depends on
// re-deriving the month from createdAt later.
const getMonthlyInvoiceSerialKey = (date: Date): string =>
  `invoiceSerial-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatInvoiceSerial = (date: Date, sequence: number): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}${String(sequence).padStart(3, "0")}`;
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
