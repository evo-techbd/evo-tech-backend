"use strict";
// Shared by every payment channel that settles an order online.
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPaymentProgress = exports.getOutstandingAmounts = exports.toTwoDecimals = void 0;
const toTwoDecimals = (value) => Math.round(value * 100) / 100;
exports.toTwoDecimals = toTwoDecimals;
const getOutstandingAmounts = (order) => {
    const depositDue = order.depositDue ?? 0;
    const depositPaid = order.depositPaid ?? 0;
    const balanceDue = order.balanceDue ?? Math.max((order.totalPayable ?? 0) - depositDue, 0);
    const balancePaid = order.balancePaid ?? 0;
    return {
        depositOutstanding: Math.max(depositDue - depositPaid, 0),
        balanceOutstanding: Math.max(balanceDue - balancePaid, 0),
    };
};
exports.getOutstandingAmounts = getOutstandingAmounts;
const applyPaymentProgress = (order, paymentAmount) => {
    let remaining = paymentAmount;
    const depositDue = order.depositDue ?? 0;
    const balanceDue = order.balanceDue ?? Math.max((order.totalPayable ?? 0) - depositDue, 0);
    const depositPaid = order.depositPaid ?? 0;
    const balancePaid = order.balancePaid ?? 0;
    order.depositStatus =
        order.depositStatus || (depositDue > 0 ? "pending" : "paid");
    order.balanceStatus =
        order.balanceStatus || (balanceDue > 0 ? "pending" : "paid");
    const depositOutstanding = Math.max(depositDue - depositPaid, 0);
    if (depositOutstanding > 0 && remaining > 0) {
        const applied = Math.min(remaining, depositOutstanding);
        order.depositPaid = (0, exports.toTwoDecimals)(depositPaid + applied);
        remaining -= applied;
        if (Math.max(depositDue - order.depositPaid, 0) <= 0.01) {
            order.depositStatus = "paid";
        }
    }
    const balanceOutstanding = Math.max(balanceDue - (order.balancePaid ?? 0), 0);
    if (remaining > 0 && balanceOutstanding > 0) {
        const applied = Math.min(remaining, balanceOutstanding);
        order.balancePaid = (0, exports.toTwoDecimals)(balancePaid + applied);
        remaining -= applied;
        if (Math.max(balanceDue - order.balancePaid, 0) <= 0.01) {
            order.balanceStatus = "paid";
        }
    }
    // Keep the flat totals (used by finance/archive reports) in step with the
    // deposit/balance split.
    order.amountPaid = (0, exports.toTwoDecimals)((order.amountPaid ?? 0) + paymentAmount);
    order.amountDue = (0, exports.toTwoDecimals)(Math.max((order.totalPayable ?? 0) - order.amountPaid, 0));
    if ((depositDue === 0 || order.depositStatus === "paid") &&
        order.balanceStatus === "paid") {
        order.paymentStatus = "paid";
    }
    else if ((order.depositPaid ?? 0) > 0 || (order.balancePaid ?? 0) > 0) {
        order.paymentStatus = "partial";
    }
    else {
        order.paymentStatus = "pending";
    }
};
exports.applyPaymentProgress = applyPaymentProgress;
//# sourceMappingURL=payment.utils.js.map