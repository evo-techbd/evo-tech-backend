import { TFinanceTransaction } from "./finance.interface";
export declare const FinanceServices: {
    addTransactionIntoDB: (payload: TFinanceTransaction) => Promise<import("mongoose").Document<unknown, {}, TFinanceTransaction, {}, {}> & TFinanceTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTransactionsFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        result: (import("mongoose").Document<unknown, {}, TFinanceTransaction, {}, {}> & TFinanceTransaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getFinanceStatsFromDB: () => Promise<{
        totalInvestment: number;
        totalWithdraw: number;
        totalExpense: number;
        totalSalesProfit: any;
        currentBalance: number;
    }>;
    getSalesProfitTransactionsFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
        result: any;
    }>;
};
//# sourceMappingURL=finance.service.d.ts.map