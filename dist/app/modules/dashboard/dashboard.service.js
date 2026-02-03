"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = void 0;
const user_model_1 = require("../user/user.model");
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const getDashboardStats = async () => {
    // Get current date and date ranges
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    // Get total counts
    const [totalUsers, totalProducts, currentMonthOrders, lastMonthOrders] = await Promise.all([
        user_model_1.User.countDocuments({ userType: "user" }),
        product_model_1.Product.countDocuments({ published: true }),
        order_model_1.Order.find({
            createdAt: { $gte: startOfMonth, $lte: now }
        }),
        order_model_1.Order.find({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        })
    ]);
    // Calculate revenue
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    const currentMonthOrderIds = currentMonthOrders.map(order => order._id);
    const currentMonthOrderItems = await order_model_1.OrderItem.find({ order: { $in: currentMonthOrderIds } }).populate("product");
    let totalCost = 0; // Total buying cost
    let itemsWithoutBuyingPrice = 0;
    // Calculate total buying cost for all items
    for (const item of currentMonthOrderItems) {
        let product = item.product;
        // Fallback: If product is null (deleted?), try to find by name
        if (!product) {
            const productByName = await product_model_1.Product.findOne({ name: item.productName });
            if (productByName) {
                product = productByName;
            }
        }
        const buyingPrice = product?.buyingPrice || 0;
        const quantity = item.quantity;
        const itemCost = buyingPrice * quantity;
        if (!product?.buyingPrice) {
            itemsWithoutBuyingPrice++;
        }
        totalCost += itemCost;
    }
    // Profit = Actual Revenue (after discounts) - Total Cost
    // Revenue is currentMonthRevenue which already accounts for discounts
    const totalProfit = currentMonthRevenue - totalCost;
    // Calculate Last Month Profit for growth comparison
    const lastMonthOrderIds = lastMonthOrders.map(order => order._id);
    const lastMonthOrderItems = await order_model_1.OrderItem.find({ order: { $in: lastMonthOrderIds } }).populate("product");
    let lastMonthCost = 0;
    for (const item of lastMonthOrderItems) {
        let product = item.product;
        if (!product) {
            product = await product_model_1.Product.findOne({ name: item.productName });
        }
        const buyingPrice = product?.buyingPrice || 0;
        const itemCost = buyingPrice * item.quantity;
        lastMonthCost += itemCost;
    }
    const lastMonthProfit = lastMonthRevenue - lastMonthCost;
    const profitGrowth = lastMonthProfit > 0
        ? ((totalProfit - lastMonthProfit) / lastMonthProfit) * 100
        : 0;
    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;
    const ordersGrowth = lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0;
    // Get customer growth (users created this month vs last month)
    const currentMonthUsers = await user_model_1.User.countDocuments({
        userType: "user",
        createdAt: { $gte: startOfMonth, $lte: now }
    });
    const lastMonthUsers = await user_model_1.User.countDocuments({
        userType: "user",
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const customersGrowth = lastMonthUsers > 0
        ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
        : 0;
    // Get product growth
    const currentMonthProducts = await product_model_1.Product.countDocuments({
        isActive: true,
        createdAt: { $gte: startOfMonth, $lte: now }
    });
    const lastMonthProducts = await product_model_1.Product.countDocuments({
        isActive: true,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const productsGrowth = lastMonthProducts > 0
        ? ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100
        : 0;
    return {
        totalRevenue: currentMonthRevenue,
        totalProfit: totalProfit,
        profitGrowth: Math.round(profitGrowth * 100) / 100,
        totalOrders: currentMonthOrders.length,
        totalCustomers: totalUsers,
        totalProducts: totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
        customersGrowth: Math.round(customersGrowth * 100) / 100,
        productsGrowth: Math.round(productsGrowth * 100) / 100,
        profitWarning: itemsWithoutBuyingPrice > 0 ? {
            message: `${itemsWithoutBuyingPrice} order item(s) are missing buying prices. Profit calculation may be inaccurate.`,
            itemsAffected: itemsWithoutBuyingPrice
        } : null,
    };
};
const getSalesData = async (period = "30d") => {
    const now = new Date();
    let startDate;
    let dateFormat;
    switch (period) {
        case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFormat = "%Y-%m-%d";
            break;
        case "90d":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            dateFormat = "%Y-%m-%d";
            break;
        default: // 30d
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFormat = "%Y-%m-%d";
            break;
    }
    const salesData = await order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: now },
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: dateFormat, date: "$createdAt" }
                },
                sales: {
                    $sum: {
                        $ifNull: ["$totalPayable", 0]
                    }
                },
                orders: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        },
        {
            $project: {
                date: "$_id",
                sales: 1,
                orders: 1,
                _id: 0
            }
        }
    ]);
    return salesData;
};
const getRecentOrders = async (limit = 10) => {
    // Get all orders and sort: pending first, then by creation date
    const orders = await order_model_1.Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("user", "firstName lastName email")
        .lean();
    // Sort to show pending orders first
    const sortedOrders = orders.sort((a, b) => {
        if (a.orderStatus === 'pending' && b.orderStatus !== 'pending')
            return -1;
        if (a.orderStatus !== 'pending' && b.orderStatus === 'pending')
            return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sortedOrders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber || `ORD-${order._id}`,
        customer: (() => {
            if (order.user) {
                const first = order.user.firstName || order.user.firstname || "";
                const last = order.user.lastName || order.user.lastname || "";
                const full = `${first} ${last}`.trim();
                if (full)
                    return full;
            }
            const firstName = order.firstname || order.firstName || "";
            const lastName = order.lastname || order.lastName || "";
            const fullFallback = `${firstName} ${lastName}`.trim();
            return fullFallback || order.email || "Unknown";
        })(),
        customerEmail: order.user ? order.user.email : order.email || "",
        total: order.totalPayable || 0,
        status: order.orderStatus || "pending",
        createdAt: order.createdAt
    }));
};
const getTopProducts = async (limit = 10) => {
    // This would require order items collection to get actual sales data
    // For now, we'll return products sorted by creation date as a placeholder
    const products = await product_model_1.Product.find({ published: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return products.map((product, index) => ({
        id: product._id,
        name: product.name,
        image: product.mainImage || "/placeholder-product.jpg",
        category: product.category || "Uncategorized",
        price: product.price || 0,
        sold: Math.floor(Math.random() * 100) + 1, // Mock data for now
        revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 1),
        stock: product.stock || 0,
        trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'
    }));
};
const getEarningsReport = async () => {
    const now = new Date();
    // Get all time earnings
    const allOrders = await order_model_1.Order.find({ orderStatus: { $ne: "cancelled" } });
    const totalEarnings = allOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    // Get current year earnings
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const yearOrders = await order_model_1.Order.find({
        createdAt: { $gte: startOfYear, $lte: now },
        orderStatus: { $ne: "cancelled" }
    });
    const yearlyEarnings = yearOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    // Get current month earnings
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthOrders = await order_model_1.Order.find({
        createdAt: { $gte: startOfMonth, $lte: now },
        orderStatus: { $ne: "cancelled" }
    });
    const monthlyEarnings = monthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    // Get last month for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthOrders = await order_model_1.Order.find({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        orderStatus: { $ne: "cancelled" }
    });
    const lastMonthEarnings = lastMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    // Get last year for comparison
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
    const lastYearOrders = await order_model_1.Order.find({
        createdAt: { $gte: startOfLastYear, $lte: endOfLastYear },
        orderStatus: { $ne: "cancelled" }
    });
    const lastYearEarnings = lastYearOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    // Calculate growth
    const monthlyGrowth = lastMonthEarnings > 0
        ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
        : 0;
    const yearlyGrowth = lastYearEarnings > 0
        ? ((yearlyEarnings - lastYearEarnings) / lastYearEarnings) * 100
        : 0;
    // Get monthly breakdown for current year
    const monthlyBreakdown = await order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfYear, $lte: now },
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                earnings: { $sum: "$totalPayable" },
                orders: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);
    // Get yearly breakdown for last 5 years
    const fiveYearsAgo = new Date(now.getFullYear() - 4, 0, 1);
    const yearlyBreakdown = await order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: { $gte: fiveYearsAgo, $lte: now },
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: { $year: "$createdAt" },
                earnings: { $sum: "$totalPayable" },
                orders: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);
    return {
        total: {
            earnings: totalEarnings,
            orders: allOrders.length
        },
        yearly: {
            earnings: yearlyEarnings,
            orders: yearOrders.length,
            growth: Math.round(yearlyGrowth * 100) / 100,
            breakdown: yearlyBreakdown.map(item => ({
                year: item._id,
                earnings: item.earnings,
                orders: item.orders
            }))
        },
        monthly: {
            earnings: monthlyEarnings,
            orders: monthOrders.length,
            growth: Math.round(monthlyGrowth * 100) / 100,
            breakdown: monthlyBreakdown.map(item => ({
                month: item._id,
                earnings: item.earnings,
                orders: item.orders
            }))
        },
        avgOrderValue: allOrders.length > 0 ? totalEarnings / allOrders.length : 0
    };
};
const getPendingOrdersCount = async () => {
    // Get count of orders that are pending (not processed yet)
    const pendingCount = await order_model_1.Order.countDocuments({
        orderStatus: "pending"
    });
    return {
        count: pendingCount
    };
};
exports.DashboardServices = {
    getDashboardStats,
    getSalesData,
    getRecentOrders,
    getTopProducts,
    getEarningsReport,
    getPendingOrdersCount,
};
//# sourceMappingURL=dashboard.service.js.map