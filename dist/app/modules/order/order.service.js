"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = exports.normalizeOrderObject = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../product/product.model");
const mongoose_1 = require("mongoose");
const notification_service_1 = require("../notification/notification.service");
const emailService_1 = require("../../utils/emailService");
const review_model_1 = require("../review/review.model");
const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `ORD-${timestamp}-${random}`;
};
// Generate unique tracking ID with date format: YYYYMMDD-XXXXX (8-10 digits)
const generateTrackingId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");
    return `${year}${month}${day}${random}`; // e.g., 2025111412345 (13 digits total)
};
// Normalize phone number: convert +8801234567890 to 01234567890
const normalizePhoneNumber = (phone) => {
    if (!phone)
        return phone;
    // Remove all spaces and dashes
    let normalized = phone.replace(/[\s-]/g, "");
    // If starts with +880, replace with 0
    if (normalized.startsWith("+880")) {
        normalized = "0" + normalized.slice(4);
    }
    // If starts with 880, replace with 0
    else if (normalized.startsWith("880")) {
        normalized = "0" + normalized.slice(3);
    }
    return normalized;
};
const normalizeOrderObject = (orderDoc) => {
    if (!orderDoc)
        return orderDoc;
    const obj = orderDoc.toObject ? orderDoc.toObject() : { ...orderDoc };
    // prefer existing camelCase if present, otherwise map from lowercase
    obj.firstName = obj.firstName || obj.firstname || "";
    obj.lastName = obj.lastName || obj.lastname || "";
    // also keep the original lowercase fields to avoid breaking consumers
    obj.firstname = obj.firstname || obj.firstName || "";
    obj.lastname = obj.lastname || obj.lastName || "";
    return obj;
};
exports.normalizeOrderObject = normalizeOrderObject;
const roundToTwo = (value) => Math.round(value * 100) / 100;
const calculateDepositBreakdown = (productDetails, totalPayable) => {
    let preOrderItemsCount = 0;
    let preOrderSubtotal = 0;
    productDetails.forEach(({ product, quantity }) => {
        if (product?.isPreOrder) {
            preOrderItemsCount += quantity;
            const unitPrice = typeof product.preOrderPrice === "number" &&
                !isNaN(product.preOrderPrice)
                ? product.preOrderPrice
                : product.price;
            preOrderSubtotal += unitPrice * quantity;
        }
    });
    const preOrderDepositPortion = preOrderItemsCount > 0 ? preOrderSubtotal * 0.5 : 0;
    const deferredPreOrderPortion = roundToTwo(preOrderItemsCount > 0
        ? Math.max(preOrderSubtotal - preOrderDepositPortion, 0)
        : 0);
    const normalizedTotal = typeof totalPayable === "number" ? totalPayable : 0;
    const depositDue = roundToTwo(Math.max(normalizedTotal - deferredPreOrderPortion, 0));
    const balanceDue = deferredPreOrderPortion;
    return {
        isPreOrderOrder: preOrderItemsCount > 0,
        preOrderItemsCount,
        depositDue,
        balanceDue,
        depositStatus: depositDue > 0 ? "pending" : "paid",
        balanceStatus: balanceDue > 0 ? "pending" : "paid",
    };
};
const placeOrderIntoDB = async (payload, userUuid) => {
    const { items, ...orderData } = payload;
    // Cart is managed in frontend Redux, use items from request body
    if (!items || items.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    // Validate stock availability for all items (except preorder items)
    for (const item of items) {
        const product = await product_model_1.Product.findById(item.item_id);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        // Skip stock validation for preorder items
        if (!product.isPreOrder) {
            const requestedQty = item.item_quantity;
            const availableStock = product.stock ?? 0;
            if (!product.inStock || availableStock < requestedQty) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for "${product.name}". Requested: ${requestedQty}, Available: ${availableStock}`);
            }
        }
    }
    // Process items and create product details
    const productDetails = await Promise.all(items.map(async (item) => {
        const product = await product_model_1.Product.findById(item.item_id);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        return {
            product,
            quantity: item.item_quantity,
            selectedColor: item.item_color || "",
            subtotal: product.price * item.item_quantity,
        };
    }));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number and tracking ID
    orderData.orderNumber = generateOrderNumber();
    orderData.trackingCode = generateTrackingId();
    orderData.user = userUuid;
    orderData.isGuest = false;
    const depositInfo = calculateDepositBreakdown(productDetails, orderData.totalPayable || 0);
    Object.assign(orderData, depositInfo, {
        depositPaid: 0,
        balancePaid: 0,
    });
    // Create order
    const order = await order_model_1.Order.create(orderData);
    // Create order items
    const orderItemsData = productDetails.map((detail) => ({
        order: order._id,
        product: detail.product._id,
        productName: detail.product.name,
        productPrice: detail.product.price,
        quantity: detail.quantity,
        selectedColor: detail.selectedColor,
        subtotal: detail.subtotal,
    }));
    await order_model_1.OrderItem.insertMany(orderItemsData);
    // Update product stock quantities
    for (const detail of productDetails) {
        await product_model_1.Product.findByIdAndUpdate(detail.product._id, {
            $inc: { stock: -detail.quantity },
        });
        await notification_service_1.NotificationServices.evaluateStockForProduct(detail.product._id);
    }
    // Get full order with items
    const fullOrder = await order_model_1.Order.findById(order._id);
    const orderItems = await order_model_1.OrderItem.find({ order: order._id }).populate("product");
    // Send order confirmation email
    try {
        await emailService_1.emailService.sendOrderConfirmation({
            customerEmail: orderData.email,
            customerName: `${orderData.firstname} ${orderData.lastname || ''}`.trim(),
            orderNumber: orderData.orderNumber,
            trackingCode: orderData.trackingCode || '',
            orderDate: new Date(fullOrder?.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            items: orderItems.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.productPrice,
                subtotal: item.subtotal,
                selectedColor: item.selectedColor,
            })),
            subtotal: orderData.subtotal || 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            totalPayable: orderData.totalPayable || 0,
            shippingAddress: {
                fullName: `${orderData.firstname} ${orderData.lastname || ''}`.trim(),
                phone: orderData.phone,
                address: orderData.houseStreet,
                city: orderData.city,
                subdistrict: orderData.subdistrict || '',
            },
            isPreOrderOrder: depositInfo.isPreOrderOrder,
            depositDue: depositInfo.depositDue,
            balanceDue: depositInfo.balanceDue,
        });
    }
    catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't throw - we don't want to fail the order if email fails
    }
    return {
        order: (0, exports.normalizeOrderObject)(fullOrder),
        items: orderItems,
    };
};
const getUserOrdersFromDB = async (userUuid, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = { user: userUuid };
    if (query.orderStatus) {
        searchQuery.orderStatus = query.orderStatus;
    }
    if (query.paymentStatus) {
        searchQuery.paymentStatus = query.paymentStatus;
    }
    const result = await order_model_1.Order.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
    let itemCountMap = new Map();
    if (result.length) {
        const orderIds = result
            .map((order) => order._id)
            .filter(Boolean)
            .map((id) => typeof id === "string" ? new mongoose_1.Types.ObjectId(id) : id);
        if (orderIds.length) {
            const counts = await order_model_1.OrderItem.aggregate([
                { $match: { order: { $in: orderIds } } },
                {
                    $group: {
                        _id: "$order",
                        quantity: { $sum: "$quantity" },
                        lines: { $sum: 1 },
                    },
                },
            ]);
            itemCountMap = new Map(counts.map((entry) => [
                entry._id.toString(),
                { quantity: entry.quantity, lines: entry.lines },
            ]));
        }
    }
    const total = await order_model_1.Order.countDocuments(searchQuery);
    return {
        result: result.map((r) => {
            const normalized = (0, exports.normalizeOrderObject)(r);
            const countInfo = itemCountMap.get(r._id?.toString?.() || "");
            return {
                ...normalized,
                itemsCount: countInfo?.quantity ?? 0,
                lineItemsCount: countInfo?.lines ?? 0,
            };
        }),
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getAllOrdersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
    if (query.search) {
        searchQuery.$or = [
            { orderNumber: { $regex: query.search, $options: "i" } },
            { email: { $regex: query.search, $options: "i" } },
            { phone: { $regex: query.search, $options: "i" } },
        ];
    }
    if (query.orderStatus) {
        searchQuery.orderStatus = query.orderStatus;
    }
    if (query.paymentStatus) {
        searchQuery.paymentStatus = query.paymentStatus;
    }
    if (query.user) {
        searchQuery.user = query.user;
    }
    const result = await order_model_1.Order.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await order_model_1.Order.countDocuments(searchQuery);
    // Populate order items with product data including category
    const ordersWithItems = await Promise.all(result.map(async (order) => {
        const orderItems = await order_model_1.OrderItem.find({ order: order._id })
            .populate({
            path: 'product',
            populate: {
                path: 'category',
                select: 'name slug'
            }
        });
        return {
            ...(0, exports.normalizeOrderObject)(order),
            orderItems: orderItems.map(item => ({
                _id: item._id,
                order: item.order,
                product: item.product,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                subtotal: item.subtotal,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            }))
        };
    }));
    return {
        result: ordersWithItems,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getSingleOrderFromDB = async (orderId, userUuid) => {
    const query = { _id: orderId };
    if (userUuid) {
        query.user = userUuid;
    }
    const order = await order_model_1.Order.findOne(query);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const orderItems = await order_model_1.OrderItem.find({ order: orderId }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(order),
        items: orderItems,
    };
};
const updateOrderStatusIntoDB = async (orderId, payload) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // If order is being marked as delivered, set deliveredAt
    if (payload.orderStatus === "delivered" && !order.deliveredAt) {
        payload.deliveredAt = new Date();
    }
    // Calculate amountDue and auto-update payment status if amountPaid is provided
    if (payload.amountPaid !== undefined) {
        const totalPayable = payload.totalPayable || order.totalPayable;
        const amountPaid = payload.amountPaid;
        payload.amountDue = totalPayable - amountPaid;
        // Auto-calculate payment status based on amount paid
        if (amountPaid >= totalPayable) {
            payload.paymentStatus = "paid";
        }
        else if (amountPaid > 0) {
            payload.paymentStatus = "partial";
        }
        else {
            payload.paymentStatus = "pending";
        }
    }
    const result = await order_model_1.Order.findByIdAndUpdate(orderId, payload, {
        new: true,
    });
    return result;
};
const deleteOrderFromDB = async (orderId) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Delete order items
    await order_model_1.OrderItem.deleteMany({ order: orderId });
    // Delete order
    const result = await order_model_1.Order.findByIdAndDelete(orderId);
    return result;
};
// Guest checkout - no authentication required
const placeGuestOrderIntoDB = async (payload) => {
    const { items, ...orderData } = payload;
    if (!items || items.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    if (!orderData.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email is required for guest checkout");
    }
    // Validate stock availability for all items (except preorder items)
    for (const item of items) {
        const product = await product_model_1.Product.findById(item.item_id || item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        // Skip stock validation for preorder items
        if (!product.isPreOrder) {
            const requestedQty = item.item_quantity || item.quantity;
            const availableStock = product.stock ?? 0;
            if (!product.inStock || availableStock < requestedQty) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for "${product.name}". Requested: ${requestedQty}, Available: ${availableStock}`);
            }
        }
    }
    // console.log("📦 Backend received order data:", {
    //   subtotal: orderData.subtotal,
    //   totalPayable: orderData.totalPayable,
    //   deliveryCharge: orderData.deliveryCharge,
    //   additionalCharge: orderData.additionalCharge,
    //   discount: orderData.discount,
    //   itemsCount: items.length,
    // });
    // Process items and create product details
    const productDetails = await Promise.all(items.map(async (item) => {
        const product = await product_model_1.Product.findById(item.item_id || item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        const itemTotal = product.price * (item.item_quantity || item.quantity);
        return {
            product,
            quantity: item.item_quantity || item.quantity,
            selectedColor: item.item_color || item.selectedColor,
            subtotal: itemTotal,
        };
    }));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number and tracking ID
    orderData.orderNumber = generateOrderNumber();
    orderData.trackingCode = generateTrackingId();
    orderData.isGuest = true;
    orderData.guestEmail = orderData.email;
    // Compute deposit/balance data for guest orders
    const depositInfo = calculateDepositBreakdown(productDetails, orderData.totalPayable || 0);
    Object.assign(orderData, depositInfo, {
        depositPaid: 0,
        balancePaid: 0,
    });
    // Create order
    const order = await order_model_1.Order.create(orderData);
    // Create order items
    const orderItemsData = productDetails.map((detail) => ({
        order: order._id,
        product: detail.product._id,
        productName: detail.product.name,
        productPrice: detail.product.price,
        quantity: detail.quantity,
        selectedColor: detail.selectedColor,
        subtotal: detail.subtotal,
    }));
    await order_model_1.OrderItem.insertMany(orderItemsData);
    // Update product stock quantities
    for (const detail of productDetails) {
        await product_model_1.Product.findByIdAndUpdate(detail.product._id, {
            $inc: { stock: -detail.quantity },
        });
        await notification_service_1.NotificationServices.evaluateStockForProduct(detail.product._id);
    }
    // Get full order with items
    const fullOrder = await order_model_1.Order.findById(order._id);
    const orderItems = await order_model_1.OrderItem.find({ order: order._id }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(fullOrder),
        items: orderItems,
    };
};
// Link guest orders to user account when they register/login
const linkGuestOrdersToUserIntoDB = async (email, userUuid) => {
    // Find all guest orders with this email
    const guestOrders = await order_model_1.Order.find({
        guestEmail: email,
        isGuest: true,
    });
    if (guestOrders.length === 0) {
        return { linked: 0, orders: [] };
    }
    // Update all guest orders to link them to the user
    await order_model_1.Order.updateMany({ guestEmail: email, isGuest: true }, {
        $set: {
            user: userUuid,
            isGuest: false,
        },
    });
    return {
        linked: guestOrders.length,
        orders: guestOrders.map((o) => o.orderNumber),
    };
};
// Track order by tracking code - public endpoint (no auth required)
const trackOrderByTrackingCode = async (trackingCode) => {
    const order = await order_model_1.Order.findOne({ trackingCode }).lean();
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found with this tracking code");
    }
    // Get order items
    const orderItems = await order_model_1.OrderItem.find({ order: order._id })
        .populate("product", "name price images")
        .lean();
    // Return sanitized order info (hide sensitive customer details for public access)
    return {
        order: {
            orderNumber: order.orderNumber,
            trackingCode: order.trackingCode,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            shippingType: order.shippingType,
            city: order.city,
            subtotal: order.subtotal,
            discount: order.discount,
            deliveryCharge: order.deliveryCharge,
            additionalCharge: order.additionalCharge,
            totalPayable: order.totalPayable,
            createdAt: order.createdAt,
            deliveredAt: order.deliveredAt,
            // Partially mask sensitive info
            customerName: `${order.firstname} ${order.lastname?.charAt(0)}***`,
            phone: order.phone
                ? `${order.phone.slice(0, 3)}****${order.phone.slice(-2)}`
                : "",
        },
        items: orderItems.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            subtotal: item.subtotal,
            product: item.product,
        })),
    };
};
// Get order items for review with review status
const getOrderItemsForReviewFromDB = async (orderId, userUuid) => {
    // First verify the order belongs to the user and is delivered
    const order = await order_model_1.Order.findById(orderId).lean();
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Verify order belongs to user
    if (order.user !== userUuid) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to access this order");
    }
    // Check if order is delivered
    if (order.orderStatus !== "delivered") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Reviews can only be submitted for delivered orders");
    }
    // Get order items
    const orderItems = await order_model_1.OrderItem.find({ order: order._id })
        .populate("product", "name slug mainImage")
        .lean();
    // Get reviews for this order
    const reviews = await review_model_1.Review.find({ order: order._id }).lean();
    const reviewedProductIds = new Set(reviews.map(r => r.product.toString()));
    // Map items with review status
    const itemsWithReviewStatus = orderItems.map(item => ({
        _id: item._id,
        product: item.product,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        subtotal: item.subtotal,
        hasReview: reviewedProductIds.has(item.product._id.toString()),
    }));
    return {
        order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            deliveredAt: order.deliveredAt,
        },
        items: itemsWithReviewStatus,
    };
};
exports.OrderServices = {
    placeOrderIntoDB,
    placeGuestOrderIntoDB,
    linkGuestOrdersToUserIntoDB,
    getUserOrdersFromDB,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    updateOrderStatusIntoDB,
    deleteOrderFromDB,
    trackOrderByTrackingCode,
    getOrderItemsForReviewFromDB,
};
//# sourceMappingURL=order.service.js.map