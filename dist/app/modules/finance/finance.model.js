"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceTransaction = void 0;
const mongoose_1 = require("mongoose");
const financeTransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["investment", "withdraw", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.FinanceTransaction = (0, mongoose_1.model)("FinanceTransaction", financeTransactionSchema);
//# sourceMappingURL=finance.model.js.map