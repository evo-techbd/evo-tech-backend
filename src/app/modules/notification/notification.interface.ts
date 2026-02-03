import { Types } from "mongoose";

export type NotificationType = "low_stock" | "out_of_stock";
export type NotificationSeverity = "info" | "warning" | "critical";
export type NotificationStatus = "open" | "resolved";

export type TNotification = {
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  status: NotificationStatus;
  isRead: boolean;
  product?: Types.ObjectId;
  productName?: string;
  productSlug?: string;
  currentStock?: number;
  threshold?: number;
  metadata?: Record<string, unknown>;
  resolvedAt?: Date;
  resolvedBy?: Types.ObjectId | null;
};
