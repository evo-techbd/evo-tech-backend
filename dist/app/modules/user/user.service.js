"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const order_model_1 = require("../order/order.model");
const order_service_1 = require("../order/order.service");
const getAllUsersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
    // Filter by userType if provided (for staff/customers separation)
    if (query.userType) {
        if (typeof query.userType === 'string' && query.userType.includes(',')) {
            // Handle comma-separated userTypes
            searchQuery.userType = { $in: query.userType.split(',').map((t) => t.trim()) };
        }
        else if (Array.isArray(query.userType)) {
            searchQuery.userType = { $in: query.userType };
        }
        else {
            searchQuery.userType = query.userType;
        }
    }
    // Filter by isActive status if provided
    if (query.isActive !== undefined) {
        searchQuery.isActive = query.isActive === 'true' || query.isActive === true;
    }
    if (query.search) {
        searchQuery.$or = [
            { email: { $regex: query.search, $options: "i" } },
            { firstName: { $regex: query.search, $options: "i" } },
            { lastName: { $regex: query.search, $options: "i" } },
        ];
    }
    const result = await user_model_1.User.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await user_model_1.User.countDocuments(searchQuery);
    return {
        result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getSingleUserFromDB = async (id) => {
    const user = await user_model_1.User.findById(id);
    return user;
};
const getSingleUserByUuidFromDB = async (uuid) => {
    const user = await user_model_1.User.findOne({ uuid });
    return user;
};
const updateUserIntoDB = async (payload, id) => {
    //console.log('📝 Updating user:', { id, payload });
    const result = await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    // console.log('✅ User updated:', result);
    return result;
};
const deleteUserFromDB = async (id) => {
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
const getUserDashboardStatsFromDB = async (userUuid) => {
    const [userOrders, recentOrdersResponse, user] = await Promise.all([
        order_model_1.Order.find({ user: userUuid }).lean(),
        order_service_1.OrderServices.getUserOrdersFromDB(userUuid, { limit: 5 }),
        user_model_1.User.findOne({ uuid: userUuid }).lean(),
    ]);
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
    const recentOrders = (recentOrdersResponse?.result || []).map((order) => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        totalPayable: order.totalPayable,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        itemsCount: order.itemsCount ?? 0,
        lineItemsCount: order.lineItemsCount ?? 0,
    }));
    return {
        totalOrders: userOrders.length,
        totalSpent,
        recentOrders,
        rewardPoints: user?.rewardPoints || 0,
        memberSince: user?.createdAt,
    };
};
const getUserOrdersFromDB = async (userUuid, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    return await order_service_1.OrderServices.getUserOrdersFromDB(userUuid, {
        page,
        limit,
    });
};
const createStaffIntoDB = async (payload) => {
    // Ensure userType is either admin or employee
    if (!payload.userType || !['admin', 'employee'].includes(payload.userType)) {
        throw new Error('Invalid userType. Must be either admin or employee');
    }
    const newStaff = await user_model_1.User.create(payload);
    return newStaff;
};
exports.UserServices = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    getSingleUserByUuidFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
    getUserDashboardStatsFromDB,
    getUserOrdersFromDB,
    createStaffIntoDB,
};
//# sourceMappingURL=user.service.js.map