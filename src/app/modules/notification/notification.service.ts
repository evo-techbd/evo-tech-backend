import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { Notification } from "./notification.model";
import {
  NotificationType,
  TNotification,
  NotificationStatus,
} from "./notification.interface";
import { Product } from "../product/product.model";

const STOCK_NOTIFICATION_TYPES: NotificationType[] = [
  "low_stock",
  "out_of_stock",
];
const DEFAULT_THRESHOLD = 5;

const buildPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

const getStockNotificationsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters: Record<string, unknown> = {
    type: { $in: STOCK_NOTIFICATION_TYPES },
  };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.isRead !== undefined) {
    filters.isRead = query.isRead === "true";
  }

  const notifications = await Notification.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filters);

  return {
    result: notifications,
    meta: buildPaginationMeta(page, limit, total),
  };
};

const markNotificationAsReadIntoDB = async (id: string, readerId?: string) => {
  const existing = await Notification.findById(id);

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    {
      isRead: true,
      metadata: {
        ...(existing.metadata || {}),
        ...(readerId ? { lastReadBy: readerId } : {}),
      },
    },
    { new: true }
  );

  return notification;
};

const resolveNotificationIntoDB = async (id: string, resolverId?: string) => {
  const notification = await Notification.findByIdAndUpdate(
    id,
    {
      status: "resolved",
      resolvedAt: new Date(),
      resolvedBy: resolverId ? new Types.ObjectId(resolverId) : undefined,
      isRead: true,
    },
    { new: true }
  );

  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  }

  return notification;
};

const upsertStockNotification = async (
  product: {
    _id: Types.ObjectId | string;
    name: string;
    slug?: string;
    stock?: number | null;
    lowStockThreshold?: number | null;
  },
  currentStock: number,
  type: NotificationType,
  message: string,
  severity: TNotification["severity"],
  threshold: number
) => {
  await Notification.findOneAndUpdate(
    {
      product: product._id,
      type,
      status: "open" satisfies NotificationStatus,
    },
    {
      title:
        type === "out_of_stock"
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
    },
    { upsert: true, new: true }
  );
};

const resolveStockNotifications = async (
  productId: Types.ObjectId | string,
  types: NotificationType[]
) => {
  await Notification.updateMany(
    {
      product: productId,
      status: "open",
      type: { $in: types },
    },
    {
      status: "resolved",
      resolvedAt: new Date(),
      isRead: true,
    }
  );
};

const evaluateStockForProduct = async (productId: Types.ObjectId | string) => {
  const product = await Product.findById(productId).select(
    "name slug stock lowStockThreshold inStock"
  );

  if (!product) {
    return null;
  }

  const currentStock = typeof product.stock === "number" ? product.stock : 0;
  const threshold =
    typeof product.lowStockThreshold === "number" &&
    product.lowStockThreshold > 0
      ? product.lowStockThreshold
      : DEFAULT_THRESHOLD;

  const shouldBeInStock = currentStock > 0;
  if (product.inStock !== shouldBeInStock) {
    await Product.updateOne({ _id: product._id }, { inStock: shouldBeInStock });
  }

  if (currentStock <= 0) {
    await upsertStockNotification(
      product,
      currentStock,
      "out_of_stock",
      `${product.name} has sold out. Restock this item to resume sales.`,
      "critical",
      threshold
    );
    await resolveStockNotifications(product._id, ["low_stock"]);
  } else if (currentStock <= threshold) {
    await upsertStockNotification(
      product,
      currentStock,
      "low_stock",
      `Only ${currentStock} unit${
        currentStock === 1 ? "" : "s"
      } remaining (threshold ${threshold}).`,
      currentStock <= 2 ? "critical" : "warning",
      threshold
    );
    await resolveStockNotifications(product._id, ["out_of_stock"]);
  } else {
    await resolveStockNotifications(product._id, STOCK_NOTIFICATION_TYPES);
  }

  return true;
};

export const NotificationServices = {
  getStockNotificationsFromDB,
  markNotificationAsReadIntoDB,
  resolveNotificationIntoDB,
  evaluateStockForProduct,
};
