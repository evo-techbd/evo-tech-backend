import "../category/category.model";
type DateRange = "today" | "this-week" | "this-month" | "all-time";
type MissingBuyingPrice = {
    productId: string | null;
    slug: string | null;
    name: string;
    unitsSold: number;
};
export declare const DashboardServices: {
    getDashboardStats: (range?: DateRange) => Promise<{
        totalRevenue: any;
        totalProfit: number;
        totalCost: any;
        totalOrders: any;
        totalCustomers: number;
        totalProducts: number;
        revenueGrowth: number | null;
        profitGrowth: number | null;
        ordersGrowth: number | null;
        customersGrowth: number | null;
        productsGrowth: number | null;
        orderBreakdown: Record<string, number>;
        revenueBreakdown: {
            orderRevenue: number;
            printingRevenue: any;
            orderCount: number;
            printingSalesCount: any;
        };
        cashCollected: any;
        receivables: {
            amount: any;
            ordersWithDue: any;
            partialOrders: any;
        };
        excludedFees: {
            deliveryFees: number;
            additionalCharges: number;
        };
        profitWarning: {
            message: string;
            itemsAffected: number;
            products: MissingBuyingPrice[];
        } | null;
    }>;
    getSalesData: (period?: string) => Promise<{
        date: string;
        sales: any;
        orders: any;
        orderSales: any;
        printingSales: any;
    }[]>;
    getRecentOrders: (limit?: number) => Promise<{
        id: string;
        orderNumber: string;
        customer: string;
        customerEmail: any;
        total: number;
        status: "cancelled" | "pending" | "confirmed" | "processing" | "shipped" | "delivered";
        createdAt: Date | undefined;
    }[]>;
    getTopProducts: (limit?: number) => Promise<{
        id: string;
        name: any;
        image: any;
        category: any;
        price: any;
        sold: number;
        revenue: number;
        stock: any;
        periodDays: number;
    }[]>;
    getEarningsReport: () => Promise<{
        total: {
            earnings: any;
            orders: any;
        };
        yearly: {
            growth: number | null;
            breakdown: {
                earnings: number;
                orders: number;
            }[];
            earnings: any;
            orders: any;
        };
        monthly: {
            growth: number | null;
            breakdown: {
                earnings: number;
                orders: number;
            }[];
            earnings: any;
            orders: any;
        };
        avgOrderValue: number;
    }>;
    getPendingOrdersCount: () => Promise<{
        count: number;
    }>;
    getMonthlyProfitBreakdown: (year?: number) => Promise<{
        year: number;
        months: {
            month: number;
            monthName: string;
            orders: number;
            revenue: number;
            cost: number;
            profit: number;
            deliveryFees: number;
            additionalCharges: number;
            printingRevenue: number;
            printingOrders: number;
        }[];
        totals: {
            orders: number;
            revenue: number;
            cost: number;
            profit: number;
            deliveryFees: number;
            additionalCharges: number;
            printingRevenue: number;
            printingOrders: number;
        };
        profitWarning: {
            message: string;
            itemsAffected: number;
            products: MissingBuyingPrice[];
        } | null;
    }>;
    getOrdersWithProfit: (year: number, month: number, page?: number, limit?: number) => Promise<{
        orders: {
            _id: string;
            orderNumber: string;
            customerName: string;
            email: string;
            phone: string;
            orderDate: Date | undefined;
            orderStatus: "cancelled" | "pending" | "confirmed" | "processing" | "shipped" | "delivered";
            paymentStatus: "partial" | "failed" | "pending" | "paid" | "refunded";
            revenue: number;
            cost: any;
            profit: number;
            deliveryCharge: number;
            additionalCharge: number;
            discount: number;
            amountPaid: number;
            totalPayable: number;
            itemCount: number;
            items: {
                productName: any;
                sellingPrice: number;
                buyingPrice: any;
                quantity: any;
                subtotal: number;
                itemProfit: number;
                selectedColor: any;
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
};
export {};
//# sourceMappingURL=dashboard.service.d.ts.map