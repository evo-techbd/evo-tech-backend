import { Schema, model } from "mongoose";
import { TFinanceTransaction } from "./finance.interface";

const financeTransactionSchema = new Schema<TFinanceTransaction>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FinanceTransaction = model<TFinanceTransaction>(
  "FinanceTransaction",
  financeTransactionSchema
);
