type DateRange = "today" | "this-week" | "this-month" | "all-time";
export declare const DashboardServices: {
    getDashboardStats: (range?: DateRange) => Promise<{
        totalRevenue: number;
        totalProfit: number;
        profitGrowth: number;
        totalOrders: number;
        totalCustomers: number;
        totalProducts: number;
        revenueGrowth: number;
        ordersGrowth: number;
        customersGrowth: number;
        productsGrowth: number;
        orderBreakdown: Record<string, number>;
        revenueBreakdown: {
            orderRevenue: number;
            printingRevenue: number;
            orderCount: number;
            printingSalesCount: number;
        };
        profitWarning: {
            message: string;
            itemsAffected: number;
        } | null;
    }>;
    getSalesData: (period?: string) => Promise<{
        date: string;
        sales: number;
        orders: number;
        orderSales: number;
        printingSales: number;
    }[]>;
    getRecentOrders: (limit?: number) => Promise<{
        id: string;
        orderNumber: string;
        customer: string;
        customerEmail: any;
        total: number;
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
        createdAt: Date | undefined;
    }[]>;
    getTopProducts: (limit?: number) => Promise<{
        id: string;
        name: string;
        image: string;
        category: import("mongoose").Types.ObjectId;
        price: number;
        sold: number;
        revenue: number;
        stock: number;
        trend: string;
    }[]>;
    getEarningsReport: () => Promise<{
        total: {
            earnings: any;
            orders: number;
        };
        yearly: {
            earnings: any;
            orders: number;
            growth: number;
            breakdown: {
                [x: string]: number;
                earnings: number;
                orders: number;
            }[];
        };
        monthly: {
            earnings: any;
            orders: number;
            growth: number;
            breakdown: {
                [x: string]: number;
                earnings: number;
                orders: number;
            }[];
        };
        avgOrderValue: number;
    }>;
    getPendingOrdersCount: () => Promise<{
        count: number;
    }>;
};
export {};
//# sourceMappingURL=dashboard.service.d.ts.map