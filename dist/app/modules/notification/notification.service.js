"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const notification_model_1 = require("./notification.model");
const product_model_1 = require("../product/product.model");
const STOCK_NOTIFICATION_TYPES = [
    "low_stock",
    "out_of_stock",
];
const DEFAULT_THRESHOLD = 5;
const buildPaginationMeta = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});
const getStockNotificationsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filters = {
        type: { $in: STOCK_NOTIFICATION_TYPES },
    };
    if (query.status) {
        filters.status = query.status;
    }
    if (query.isRead !== undefined) {
        filters.isRead = query.isRead === "true";
    }
    const notifications = await notification_model_1.Notification.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await notification_model_1.Notification.countDocuments(filters);
    return {
        result: notifications,
        meta: buildPaginationMeta(page, limit, total),
    };
};
const markNotificationAsReadIntoDB = async (id, readerId) => {
    const existing = await notification_model_1.Notification.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notification not found");
    }
    const notification = await notification_model_1.Notification.findByIdAndUpdate(id, {
        isRead: true,
        metadata: {
            ...(existing.metadata || {}),
            ...(readerId ? { lastReadBy: readerId } : {}),
        },
    }, { new: true });
    return notification;
};
const resolveNotificationIntoDB = async (id, resolverId) => {
    const notification = await notification_model_1.Notification.findByIdAndUpdate(id, {
        status: "resolved",
        resolvedAt: new Date(),
        resolvedBy: resolverId ? new mongoose_1.Types.ObjectId(resolverId) : undefined,
        isRead: true,
    }, { new: true });
    if (!notification) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Notification not found");
    }
    return notification;
};
const upsertStockNotification = async (product, currentStock, type, message, severity, threshold) => {
    await notification_model_1.Notification.findOneAndUpdate({
        product: product._id,
        type,
        status: "open",
    }, {
        title: type === "out_of_stock"
            ? `${product.name} is out of stock`
            : `${product.name} is running low`,
        message,
        severity,
        currentStock,
        threshold,
        productName: product.name,
        productSlug: product.slug,
        isRead: false,
        status: "open",
    }, { upsert: true, new: true });
};
const resolveStockNotifications = async (productId, types) => {
    await notification_model_1.Notification.updateMany({
        product: productId,
        status: "open",
        type: { $in: types },
    }, {
        status: "resolved",
        resolvedAt: new Date(),
        isRead: true,
    });
};
const evaluateStockForProduct = async (productId) => {
    const product = await product_model_1.Product.findById(productId).select("name slug stock lowStockThreshold inStock");
    if (!product) {
        return null;
    }
    const currentStock = typeof product.stock === "number" ? product.stock : 0;
    const threshold = typeof product.lowStockThreshold === "number" &&
        product.lowStockThreshold > 0
        ? product.lowStockThreshold
        : DEFAULT_THRESHOLD;
    const shouldBeInStock = currentStock > 0;
    if (product.inStock !== shouldBeInStock) {
        await product_model_1.Product.updateOne({ _id: product._id }, { inStock: shouldBeInStock });
    }
    if (currentStock <= 0) {
        await upsertStockNotification(product, currentStock, "out_of_stock", `${product.name} has sold out. Restock this item to resume sales.`, "critical", threshold);
        await resolveStockNotifications(product._id, ["low_stock"]);
    }
    else if (currentStock <= threshold) {
        await upsertStockNotification(product, currentStock, "low_stock", `Only ${currentStock} unit${currentStock === 1 ? "" : "s"} remaining (threshold ${threshold}).`, currentStock <= 2 ? "critical" : "warning", threshold);
        await resolveStockNotifications(product._id, ["out_of_stock"]);
    }
    else {
        await resolveStockNotifications(product._id, STOCK_NOTIFICATION_TYPES);
    }
    return true;
};
exports.NotificationServices = {
    getStockNotificationsFromDB,
    markNotificationAsReadIntoDB,
    resolveNotificationIntoDB,
    evaluateStockForProduct,
};
//# sourceMappingURL=notification.service.js.map