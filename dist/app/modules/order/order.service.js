"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = exports.normalizeOrderObject = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const trash_model_1 = require("../trash/trash.model");
const product_model_1 = require("../product/product.model");
const mongoose_1 = __importStar(require("mongoose"));
const notification_service_1 = require("../notification/notification.service");
const emailService_1 = require("../../utils/emailService");
const review_model_1 = require("../review/review.model");
const pickuppoint_model_1 = require("../pickuppoint/pickuppoint.model");
const settings_service_1 = require("../settings/settings.service");
const counter_1 = require("../../utils/counter");
const coupon_service_1 = require("../coupon/coupon.service");
const payment_log_service_1 = require("../payment-log/payment-log.service");
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
const toValidObjectId = (value) => {
    if (!value)
        return null;
    if (value instanceof mongoose_1.Types.ObjectId) {
        return value;
    }
    if (typeof value === "string" && mongoose_1.Types.ObjectId.isValid(value)) {
        return new mongoose_1.Types.ObjectId(value);
    }
    if (typeof value === "object" && value !== null && "_id" in value) {
        const nestedId = value._id;
        if (nestedId instanceof mongoose_1.Types.ObjectId) {
            return nestedId;
        }
        if (typeof nestedId === "string" && mongoose_1.Types.ObjectId.isValid(nestedId)) {
            return new mongoose_1.Types.ObjectId(nestedId);
        }
    }
    return null;
};
const hydratePickupPointsForOrders = async (orders) => {
    if (!orders.length)
        return orders;
    const uniquePickupIds = Array.from(new Set(orders
        .map((order) => toValidObjectId(order.pickupPointId))
        .filter(Boolean)
        .map((id) => id.toString())));
    if (!uniquePickupIds.length)
        return orders;
    const pickupPoints = await pickuppoint_model_1.PickupPoint.find({
        _id: { $in: uniquePickupIds.map((id) => new mongoose_1.Types.ObjectId(id)) },
    })
        .select("name address city phone hours")
        .lean();
    const pickupPointMap = new Map(pickupPoints.map((point) => [point._id.toString(), point]));
    return orders.map((order) => {
        const pickupId = toValidObjectId(order.pickupPointId);
        if (!pickupId)
            return order;
        const pickupPoint = pickupPointMap.get(pickupId.toString());
        if (!pickupPoint)
            return order;
        return {
            ...order,
            pickupPointId: pickupPoint,
        };
    });
};
const roundToTwo = (value) => Math.round(value * 100) / 100;
// Group Buy is live only while the admin toggle is on and the Group Buy price
// is a real discount — mirrors frontend/utils/product-pricing.ts.
const isGroupBuyActive = (product) => product?.isPreOrder === true &&
    typeof product.preOrderPrice === "number" &&
    product.preOrderPrice > 0 &&
    product.preOrderPrice < (product.price || 0);
// A cart line is a Group Buy line only when the customer chose Group Buy and
// it is still live on the product; anything else is a normal purchase.
const isGroupBuyLine = (product, item) => item?.item_isPreOrder === true && isGroupBuyActive(product);
// Unit price the customer is charged for a line.
const getUnitSellingPrice = (product, isGroupBuy) => isGroupBuy ? product.preOrderPrice : product?.price || 0;
// Subtotal and discount are derived server-side from product prices and the
// coupon — never taken from the request body, since they feed both what the
// customer is charged and every revenue figure on the admin dashboard.
const resolveOrderPricing = async (productDetails, couponCode, couponUserId) => {
    const subtotal = roundToTwo(productDetails.reduce((sum, detail) => sum + detail.subtotal, 0));
    let discount = 0;
    if (couponCode && couponUserId) {
        const { discountAmount } = await coupon_service_1.CouponService.validateCoupon(couponCode, couponUserId, subtotal);
        discount = roundToTwo(discountAmount);
    }
    return { subtotal, discount };
};
// Payment and fulfilment state always starts fresh; these fields are only
// changed by verified payment callbacks or by an admin.
const resetOrderLifecycleFields = (orderData) => {
    orderData.orderStatus = "pending";
    orderData.paymentStatus = "pending";
    orderData.amountPaid = 0;
    orderData.amountDue = orderData.totalPayable || 0;
    delete orderData.deliveredAt;
};
// Mirrors frontend/utils/essential_functions.ts#getAdditionalChargeforWeight,
// but reads the charges from admin-configurable settings instead of
// hardcoded constants, and is the authoritative value saved on the order
// (the client-submitted deliveryCharge is only used for display/estimation).
const resolveDeliveryCharge = async (shippingType, city, productDetails) => {
    // Pickup point has no delivery leg
    if (shippingType !== "regular_delivery" && shippingType !== "express_delivery") {
        return 0;
    }
    const settings = await settings_service_1.SettingsService.getDeliveryChargeSettingsFromDB();
    const isInsideDhaka = (city || "").trim().toLowerCase() === "dhaka";
    if (shippingType === "express_delivery") {
        return Math.round(isInsideDhaka
            ? settings.expressInsideDhakaCharge
            : settings.expressOutsideDhakaCharge);
    }
    const totalWeight = productDetails.reduce((acc, { product, quantity }) => {
        const weight = Number(product?.weight) || 0;
        return acc + weight * quantity;
    }, 0);
    const baseCharge = isInsideDhaka
        ? settings.insideDhakaCharge
        : settings.outsideDhakaCharge;
    if (totalWeight <= 1000) {
        return Math.round(baseCharge);
    }
    const additionalKg = Math.ceil((totalWeight - 1000) / 1000);
    return Math.round(baseCharge + additionalKg * settings.additionalChargePerKg);
};
const calculateDepositBreakdown = (productDetails, totalPayable) => {
    let preOrderItemsCount = 0;
    let preOrderSubtotal = 0;
    productDetails.forEach(({ quantity, isGroupBuy, subtotal }) => {
        if (isGroupBuy) {
            preOrderItemsCount += quantity;
            preOrderSubtotal += subtotal;
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
const VALID_PAYMENT_METHODS = ["cod", "cop", "bkash", "bank_transfer", "eps"];
const CASH_PAYMENT_METHODS = ["cod", "cop"];
// Paid on a hosted gateway after the order is placed, so there is no
// customer-entered transaction ID to validate up front.
const GATEWAY_PAYMENT_METHODS = ["eps"];
// Letters/digits/hyphen/slash, 6-25 chars, no spaces, must contain at least one digit.
// Blocks junk like "AmiPorepayKorbo" while still accepting real bKash/bank references.
const TRANSACTION_ID_REGEX = /^(?=.*\d)[A-Za-z0-9\-/]{6,25}$/;
const validateOrderPayment = (paymentMethod, transactionId, isPreOrderOrder) => {
    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payment method");
    }
    if (isPreOrderOrder && CASH_PAYMENT_METHODS.includes(paymentMethod)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cash on Delivery/Pickup is not available for Group Buy items. Please pay online, via bKash or Bank Transfer.");
    }
    if (!CASH_PAYMENT_METHODS.includes(paymentMethod) &&
        !GATEWAY_PAYMENT_METHODS.includes(paymentMethod)) {
        const trimmedId = (transactionId || "").trim();
        if (!trimmedId || !TRANSACTION_ID_REGEX.test(trimmedId)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid payment transaction ID.");
        }
    }
};
const placeOrderIntoDB = async (payload, userUuid, couponUserId) => {
    const { items, couponCode, ...orderData } = payload;
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
        // Skip stock validation for Group Buy lines
        if (!isGroupBuyLine(product, item)) {
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
        const isGroupBuy = isGroupBuyLine(product, item);
        const unitPrice = getUnitSellingPrice(product, isGroupBuy);
        return {
            product,
            quantity: item.item_quantity,
            selectedColor: item.item_color || "",
            isGroupBuy,
            unitPrice,
            subtotal: unitPrice * item.item_quantity,
        };
    }));
    Object.assign(orderData, await resolveOrderPricing(productDetails, couponCode, couponUserId));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number and tracking ID
    orderData.orderNumber = generateOrderNumber();
    orderData.invoiceSerial = await (0, counter_1.getNextInvoiceSerial)();
    orderData.trackingCode = generateTrackingId();
    orderData.user = userUuid;
    orderData.isGuest = false;
    // Recompute delivery charge server-side from admin-configured settings
    // rather than trusting the client-submitted value
    orderData.deliveryCharge = await resolveDeliveryCharge(orderData.shippingType, orderData.city, productDetails);
    orderData.totalPayable = roundToTwo(Math.max((orderData.subtotal || 0) -
        (orderData.discount || 0) +
        orderData.deliveryCharge +
        (orderData.additionalCharge || 0), 0));
    const depositInfo = calculateDepositBreakdown(productDetails, orderData.totalPayable || 0);
    validateOrderPayment(orderData.paymentMethod, orderData.transactionId, depositInfo.isPreOrderOrder);
    // Gateway orders get their transaction reference from the verified EPS
    // callback, never from the client.
    if (GATEWAY_PAYMENT_METHODS.includes(orderData.paymentMethod)) {
        orderData.transactionId = undefined;
    }
    Object.assign(orderData, depositInfo, {
        depositPaid: 0,
        balancePaid: 0,
    });
    resetOrderLifecycleFields(orderData);
    // Create order
    const order = await order_model_1.Order.create(orderData);
    await payment_log_service_1.PaymentLogServices.logOrderPaymentChange({}, order, {
        event: "created",
        source: "system",
        note: "Order placed",
    });
    // Create order items
    const orderItemsData = productDetails.map((detail) => ({
        order: order._id,
        product: detail.product._id,
        productName: detail.product.name,
        productPrice: detail.unitPrice,
        buyingPrice: detail.product.buyingPrice || 0,
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
        // Also deduct from the specific color variation if one was selected
        if (detail.selectedColor) {
            await product_model_1.ProductColorVariation.findOneAndUpdate({
                product: detail.product._id,
                colorName: { $regex: new RegExp(`^${detail.selectedColor}$`, "i") },
            }, { $inc: { stock: -detail.quantity } });
        }
        await notification_service_1.NotificationServices.evaluateStockForProduct(detail.product._id);
    }
    // Get full order with items
    const fullOrder = await order_model_1.Order.findById(order._id);
    const orderItems = await order_model_1.OrderItem.find({ order: order._id }).populate("product");
    // Send order confirmation email asynchronously in the background
    try {
        emailService_1.emailService
            .sendOrderConfirmation({
            customerEmail: orderData.email,
            customerName: `${orderData.firstname} ${orderData.lastname || ""}`.trim(),
            orderNumber: orderData.orderNumber,
            trackingCode: orderData.trackingCode || "",
            orderDate: new Date(fullOrder?.createdAt || Date.now()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
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
                fullName: `${orderData.firstname} ${orderData.lastname || ""}`.trim(),
                phone: orderData.phone,
                address: orderData.houseStreet,
                city: orderData.city,
                subdistrict: orderData.subdistrict || "",
            },
            isPreOrderOrder: depositInfo.isPreOrderOrder,
            depositDue: depositInfo.depositDue,
            balanceDue: depositInfo.balanceDue,
        })
            .catch((emailError) => {
            console.error("Failed to send order confirmation email:", emailError);
        });
    }
    catch (err) {
        console.error("Failed to dispatch order confirmation email process:", err);
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
    if (query.category) {
        const productsInCategory = await product_model_1.Product.find({
            category: query.category,
        }).select("_id");
        const productIds = productsInCategory.map((p) => p._id);
        const orderItemsWithCategory = await order_model_1.OrderItem.find({
            product: { $in: productIds },
        }).select("order");
        const orderIds = orderItemsWithCategory.map((oi) => oi.order);
        searchQuery._id = { $in: orderIds };
    }
    const result = await order_model_1.Order.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
    const ordersWithPickupPoints = await hydratePickupPointsForOrders(result);
    let itemCountMap = new Map();
    if (ordersWithPickupPoints.length) {
        const orderIds = ordersWithPickupPoints
            .map((order) => order._id)
            .filter(Boolean)
            .map((id) => typeof id === "string"
            ? new mongoose_1.Types.ObjectId(id)
            : id);
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
        result: ordersWithPickupPoints.map((r) => {
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
    const includeItems = query.includeItems === true || query.includeItems === "true";
    const searchQuery = {};
    if (query.search) {
        searchQuery.$or = [
            { orderNumber: { $regex: query.search, $options: "i" } },
            { invoiceSerial: { $regex: query.search, $options: "i" } },
            { email: { $regex: query.search, $options: "i" } },
            { phone: { $regex: query.search, $options: "i" } },
        ];
    }
    const archiveYear = query.year ? Number(query.year) : undefined;
    const archiveMonth = query.month ? Number(query.month) : undefined;
    const isArchiveView = archiveYear !== undefined && archiveMonth !== undefined;
    if (isArchiveView) {
        // Archive is delivered-only by definition — ignore any client-supplied
        // orderStatus so a stray param can't leak non-delivered orders in.
        // Bucketed by the month the order was PLACED (createdAt), not the month
        // it was delivered — an order placed in March and delivered in September
        // belongs in the March archive.
        searchQuery.orderStatus = "delivered";
        searchQuery.createdAt = {
            $gte: new Date(archiveYear, archiveMonth - 1, 1),
            $lte: new Date(archiveYear, archiveMonth, 0, 23, 59, 59, 999),
        };
    }
    else if (query.orderStatus && query.orderStatus !== "delivered") {
        searchQuery.orderStatus = query.orderStatus;
    }
    else {
        // Active Orders default: delivered orders now live only in the archive.
        // Covers both "no filter given" and a stray ?order_status=delivered, so
        // neither can leak delivered orders back into the active view/search/export.
        searchQuery.orderStatus = { $ne: "delivered" };
    }
    if (query.paymentStatus) {
        searchQuery.paymentStatus = query.paymentStatus;
    }
    if (query.user) {
        searchQuery.user = query.user;
    }
    if (query.category) {
        const productsInCategory = await product_model_1.Product.find({
            category: query.category,
        }).select("_id");
        const productIds = productsInCategory.map((p) => p._id);
        const orderItemsWithCategory = await order_model_1.OrderItem.find({
            product: { $in: productIds },
        }).select("order");
        const orderIds = orderItemsWithCategory.map((oi) => oi.order);
        searchQuery._id = { $in: orderIds };
    }
    const [result, total] = await Promise.all([
        order_model_1.Order.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(),
        order_model_1.Order.countDocuments(searchQuery),
    ]);
    const ordersWithPickupPoints = await hydratePickupPointsForOrders(result);
    let ordersWithItems = ordersWithPickupPoints.map((order) => (0, exports.normalizeOrderObject)(order));
    if (includeItems) {
        const orderIds = ordersWithPickupPoints
            .map((order) => order._id)
            .filter(Boolean)
            .map((id) => (typeof id === "string" ? new mongoose_1.Types.ObjectId(id) : id));
        let itemsByOrderId = new Map();
        if (orderIds.length) {
            const allOrderItems = await order_model_1.OrderItem.find({ order: { $in: orderIds } })
                .populate({
                path: "product",
                populate: {
                    path: "category",
                    select: "name slug",
                },
            })
                .lean();
            itemsByOrderId = allOrderItems.reduce((acc, item) => {
                const key = item.order?.toString?.();
                if (!key)
                    return acc;
                const list = acc.get(key) || [];
                list.push({
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
                });
                acc.set(key, list);
                return acc;
            }, new Map());
        }
        ordersWithItems = ordersWithPickupPoints.map((order) => ({
            ...(0, exports.normalizeOrderObject)(order),
            orderItems: itemsByOrderId.get(order._id?.toString?.() || "") || [],
        }));
    }
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
    const order = await order_model_1.Order.findOne(query).lean();
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const [hydratedOrder] = await hydratePickupPointsForOrders([order]);
    const orderItems = await order_model_1.OrderItem.find({ order: orderId }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(hydratedOrder),
        items: orderItems,
    };
};
const updateOrderStatusIntoDB = async (orderId, payload, performedBy) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const paymentBefore = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(order);
    // If order is being marked as delivered, set deliveredAt
    if (payload.orderStatus === "delivered" && !order.deliveredAt) {
        payload.deliveredAt = new Date();
    }
    // If order is being cancelled, auto-set payment status unless explicitly provided
    if (payload.orderStatus === "cancelled" &&
        payload.paymentStatus === undefined) {
        if (order.paymentStatus === "paid") {
            payload.paymentStatus = "refunded";
        }
        else if (order.paymentStatus === "partial") {
            payload.paymentStatus = "refunded";
        }
        else {
            // pending or anything else → payment never completed
            payload.paymentStatus = "failed";
        }
    }
    const pricingFieldsUpdated = payload.subtotal !== undefined ||
        payload.discount !== undefined ||
        payload.deliveryCharge !== undefined ||
        payload.additionalCharge !== undefined;
    if (pricingFieldsUpdated) {
        const subtotal = payload.subtotal ?? order.subtotal ?? 0;
        const discount = payload.discount ?? order.discount ?? 0;
        const deliveryCharge = payload.deliveryCharge ?? order.deliveryCharge ?? 0;
        const additionalCharge = payload.additionalCharge ?? order.additionalCharge ?? 0;
        payload.totalPayable = roundToTwo(Math.max(subtotal - discount + deliveryCharge + additionalCharge, 0));
        // Keep pre-order due fields consistent when payable changes.
        if (order.isPreOrderOrder) {
            const balanceDue = payload.balanceDue ?? order.balanceDue ?? 0;
            payload.depositDue = roundToTwo(Math.max((payload.totalPayable ?? 0) - balanceDue, 0));
            payload.depositStatus =
                (payload.depositPaid ?? order.depositPaid ?? 0) >=
                    (payload.depositDue ?? 0)
                    ? "paid"
                    : "pending";
            payload.balanceStatus =
                (payload.balancePaid ?? order.balancePaid ?? 0) >= balanceDue
                    ? "paid"
                    : "pending";
        }
    }
    // Marking an order "paid" (e.g. from the status dropdown) without an amount
    // means the customer settled in full — record it, or cash collected and
    // amount due would disagree with the status.
    if (payload.paymentStatus === "paid" && payload.amountPaid === undefined) {
        payload.amountPaid = payload.totalPayable ?? order.totalPayable ?? 0;
        if (order.isPreOrderOrder) {
            payload.depositPaid = payload.depositDue ?? order.depositDue ?? 0;
            payload.balancePaid = payload.balanceDue ?? order.balanceDue ?? 0;
            payload.depositStatus = "paid";
            payload.balanceStatus = "paid";
        }
    }
    // Keep amountDue/paymentStatus in sync when financial fields change.
    if (payload.amountPaid !== undefined || payload.totalPayable !== undefined) {
        const totalPayable = payload.totalPayable ?? order.totalPayable ?? 0;
        const amountPaid = payload.amountPaid ?? order.amountPaid ?? 0;
        payload.amountDue = roundToTwo(Math.max(totalPayable - amountPaid, 0));
        // Only auto-calculate payment status if not explicitly provided
        // or if explicitly set to one of the auto-calculated statuses
        // This allows admins to manually set "failed", "refunded", etc.
        if (payload.paymentStatus === undefined) {
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
    }
    const result = await order_model_1.Order.findByIdAndUpdate(orderId, payload, {
        new: true,
    });
    if (result) {
        await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(paymentBefore, result, {
            source: "admin",
            method: "manual",
            performedBy,
            note: payload.orderStatus === "cancelled" && order.orderStatus !== "cancelled"
                ? "Order cancelled"
                : undefined,
        });
    }
    return result;
};
const deleteOrderFromDB = async (orderId, deletedBy) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Get order items to save in trash
    const items = await order_model_1.OrderItem.find({ order: orderId }).lean();
    // Move to trash before deleting
    await trash_model_1.TrashItem.create({
        entityType: "order",
        originalId: orderId,
        entityLabel: order.orderNumber || "Unknown Order",
        data: order.toObject(),
        relatedData: { items },
        deletedBy: deletedBy || undefined,
    });
    // Delete order items
    await order_model_1.OrderItem.deleteMany({ order: orderId });
    // Delete order
    const result = await order_model_1.Order.findByIdAndDelete(orderId);
    return result;
};
// Guest checkout - no authentication required
const placeGuestOrderIntoDB = async (payload) => {
    // Coupons can only be validated for signed-in users, so guest orders never
    // carry a discount.
    const { items, couponCode: _couponCode, ...orderData } = payload;
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
        // Skip stock validation for Group Buy lines
        if (!isGroupBuyLine(product, item)) {
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
        const isGroupBuy = isGroupBuyLine(product, item);
        const unitPrice = getUnitSellingPrice(product, isGroupBuy);
        const quantity = item.item_quantity || item.quantity;
        return {
            product,
            quantity,
            selectedColor: item.item_color || item.selectedColor,
            isGroupBuy,
            unitPrice,
            subtotal: unitPrice * quantity,
        };
    }));
    Object.assign(orderData, await resolveOrderPricing(productDetails, undefined, undefined));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number and tracking ID
    orderData.orderNumber = generateOrderNumber();
    orderData.invoiceSerial = await (0, counter_1.getNextInvoiceSerial)();
    orderData.trackingCode = generateTrackingId();
    orderData.isGuest = true;
    orderData.guestEmail = orderData.email;
    // Recompute delivery charge server-side from admin-configured settings
    // rather than trusting the client-submitted value
    orderData.deliveryCharge = await resolveDeliveryCharge(orderData.shippingType, orderData.city, productDetails);
    orderData.totalPayable = roundToTwo(Math.max((orderData.subtotal || 0) -
        (orderData.discount || 0) +
        orderData.deliveryCharge +
        (orderData.additionalCharge || 0), 0));
    // Compute deposit/balance data for guest orders
    const depositInfo = calculateDepositBreakdown(productDetails, orderData.totalPayable || 0);
    validateOrderPayment(orderData.paymentMethod, orderData.transactionId, depositInfo.isPreOrderOrder);
    // Gateway orders get their transaction reference from the verified EPS
    // callback, never from the client.
    if (GATEWAY_PAYMENT_METHODS.includes(orderData.paymentMethod)) {
        orderData.transactionId = undefined;
    }
    Object.assign(orderData, depositInfo, {
        depositPaid: 0,
        balancePaid: 0,
    });
    resetOrderLifecycleFields(orderData);
    // Create order
    const order = await order_model_1.Order.create(orderData);
    await payment_log_service_1.PaymentLogServices.logOrderPaymentChange({}, order, {
        event: "created",
        source: "system",
        note: "Order placed",
    });
    // Create order items
    const orderItemsData = productDetails.map((detail) => ({
        order: order._id,
        product: detail.product._id,
        productName: detail.product.name,
        productPrice: detail.unitPrice,
        buyingPrice: detail.product.buyingPrice || 0,
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
    // Trim whitespace from tracking code
    const trimmedCode = trackingCode?.trim();
    if (!trimmedCode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Tracking code is required");
    }
    // Find order first without populate to avoid casting errors
    const order = await order_model_1.Order.findOne({ trackingCode: trimmedCode }).lean();
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found with this tracking code");
    }
    // Manually populate pickupPointId only if it's a valid ObjectId
    let pickupPoint = null;
    if (order.pickupPointId &&
        typeof order.pickupPointId === "string" &&
        mongoose_1.default.Types.ObjectId.isValid(order.pickupPointId)) {
        pickupPoint = await pickuppoint_model_1.PickupPoint.findById(order.pickupPointId)
            .select("name address city phone hours")
            .lean();
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
            // Address fields for express delivery
            houseStreet: order.houseStreet,
            subdistrict: order.subdistrict,
            country: order.country,
            // Pickup point details
            pickupPoint: pickupPoint,
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
    const reviewedProductIds = new Set(reviews.map((r) => r.product.toString()));
    // Map items with review status
    const itemsWithReviewStatus = orderItems.map((item) => ({
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
const getArchiveSummaryFromDB = async (year) => {
    const targetYear = year || new Date().getFullYear();
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);
    // Bucketed by the month the order was PLACED (createdAt), not delivered —
    // matches getAllOrdersFromDB's archive-view filter above.
    const raw = await order_model_1.Order.aggregate([
        {
            $match: {
                orderStatus: "delivered",
                createdAt: { $gte: startOfYear, $lte: endOfYear },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                orderCount: { $sum: 1 },
                totalAmountPaid: { $sum: "$amountPaid" },
                totalPayable: { $sum: "$totalPayable" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const rawByMonth = new Map(raw.map((r) => [r._id, r]));
    const months = monthNames.map((monthName, idx) => {
        const m = rawByMonth.get(idx + 1);
        return {
            month: idx + 1,
            monthName,
            orderCount: m?.orderCount || 0,
            totalAmountPaid: m?.totalAmountPaid || 0,
            totalPayable: m?.totalPayable || 0,
        };
    });
    const totals = months.reduce((acc, m) => ({
        orderCount: acc.orderCount + m.orderCount,
        totalAmountPaid: acc.totalAmountPaid + m.totalAmountPaid,
        totalPayable: acc.totalPayable + m.totalPayable,
    }), { orderCount: 0, totalAmountPaid: 0, totalPayable: 0 });
    return { year: targetYear, months, totals };
};
const getArchiveYearsFromDB = async () => {
    const years = await order_model_1.Order.aggregate([
        { $match: { orderStatus: "delivered" } },
        { $group: { _id: { $year: "$createdAt" } } },
        { $sort: { _id: -1 } },
    ]);
    return years.map((y) => y._id);
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
    getArchiveSummaryFromDB,
    getArchiveYearsFromDB,
};
//# sourceMappingURL=order.service.js.map