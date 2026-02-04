import { Types } from "mongoose";

export type TFinanceTransactionType = "investment" | "withdraw" | "expense";

export interface TFinanceTransaction {
  type: TFinanceTransactionType;
  amount: number;
  description: string;
  date: Date;
  createdBy: Types.ObjectId;
}
