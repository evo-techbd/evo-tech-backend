export declare const DashboardServices: {
    getDashboardStats: () => Promise<{
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
        profitWarning: {
            message: string;
            itemsAffected: number;
        } | null;
    }>;
    getSalesData: (period?: string) => Promise<any[]>;
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
            earnings: number;
            orders: number;
        };
        yearly: {
            earnings: number;
            orders: number;
            growth: number;
            breakdown: {
                year: any;
                earnings: any;
                orders: any;
            }[];
        };
        monthly: {
            earnings: number;
            orders: number;
            growth: number;
            breakdown: {
                month: any;
                earnings: any;
                orders: any;
            }[];
        };
        avgOrderValue: number;
    }>;
    getPendingOrdersCount: () => Promise<{
        count: number;
    }>;
};
//# sourceMappingURL=dashboard.service.d.ts.map