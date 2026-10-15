"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureInvoiceSerialAtLeast = exports.getNextInvoiceSerial = exports.formatInvoiceSerial = exports.ensureSequenceAtLeast = exports.getNextSequence = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
const Counter = (0, mongoose_1.model)("Counter", counterSchema);
// Atomically returns the next value in a named sequence, creating it
// starting at 1 the first time it's used. Safe under concurrent calls.
const getNextSequence = async (name) => {
    const counter = await Counter.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};
exports.getNextSequence = getNextSequence;
// Bumps a sequence up to at least `value` without going backwards — used by
// the invoice-serial backfill migration so newly created records continue
// counting up from the highest backfilled number instead of restarting at 1.
const ensureSequenceAtLeast = async (name, value) => {
    await Counter.findByIdAndUpdate(name, { $max: { seq: value } }, { upsert: true });
};
exports.ensureSequenceAtLeast = ensureSequenceAtLeast;
// Invoice serials reset every calendar month, shop-style: YY + MM + a 3-digit
// sequence, e.g. 2610001, 2610002, ... then 2611001 the following month. The
// counter is keyed by year+month so each month starts again from 001. The
// full formatted string (not just the running number) is what gets stored on
// the order, so printing it never depends on re-deriving the month from
// createdAt later.
const getMonthlyInvoiceSerialKey = (date) => `invoiceSerial-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const formatInvoiceSerial = (date, sequence) => {
    const year = String(date.getFullYear() % 100).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}${month}${String(sequence).padStart(3, "0")}`;
};
exports.formatInvoiceSerial = formatInvoiceSerial;
const getNextInvoiceSerial = async (date = new Date()) => {
    const sequence = await (0, exports.getNextSequence)(getMonthlyInvoiceSerialKey(date));
    return (0, exports.formatInvoiceSerial)(date, sequence);
};
exports.getNextInvoiceSerial = getNextInvoiceSerial;
const ensureInvoiceSerialAtLeast = async (date, value) => (0, exports.ensureSequenceAtLeast)(getMonthlyInvoiceSerialKey(date), value);
exports.ensureInvoiceSerialAtLeast = ensureInvoiceSerialAtLeast;
//# sourceMappingURL=counter.js.map