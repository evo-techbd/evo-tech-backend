import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import { TrashItem } from "./trash.model";
import { TTrashEntityType } from "./trash.interface";

// Import all relevant models for restore
import { Product, ProductImage, FeaturesSectionHeader, FeaturesSectionSubsection, Specification, ProductColorVariation } from "../product/product.model";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { Subcategory } from "../subcategory/subcategory.model";
import { Coupon, CouponUsage } from "../coupon/coupon.model";
import { Review } from "../review/review.model";
import { User } from "../user/user.model";

const getModelForEntityType = (entityType: TTrashEntityType) => {
  switch (entityType) {
    case "product":      return Product;
    case "brand":        return Brand;
    case "category":     return Category;
    case "subcategory":  return Subcategory;
    case "coupon":       return Coupon;
    case "review":       return Review;
    case "user":         return User;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, `Unknown entity type: ${entityType}`);
  }
};

const getTrashItemsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const entityType = query.entityType as TTrashEntityType | undefined;

  const filter: Record<string, any> = {};
  if (entityType) {
    filter.entityType = entityType;
  }

  const [items, total] = await Promise.all([
    TrashItem.find(filter)
      .populate("deletedBy", "firstName lastName email")
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit),
    TrashItem.countDocuments(filter),
  ]);

  return {
    result: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const restoreTrashItemFromDB = async (trashId: string) => {
  const trashItem = await TrashItem.findById(trashId);
  if (!trashItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Trash item not found");
  }

  const Model = getModelForEntityType(trashItem.entityType);
  const restoredId = new Types.ObjectId(trashItem.originalId);

  // Check if an item with this ID already exists (was re-created after deletion)
  const existing = await (Model as any).findById(restoredId);
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A ${trashItem.entityType} with the same ID already exists. Cannot restore.`
    );
  }

  // Strip mongoose-added fields from stored data to avoid conflicts
  const restoreData = { ...trashItem.data };
  delete restoreData.__v;
  restoreData._id = restoredId;

  // Re-insert the document with the original _id
  const restored = await (Model as any).create(restoreData);

  // For products, also restore related data
  if (trashItem.entityType === "product" && trashItem.relatedData) {
    const related = trashItem.relatedData as any;
    if (related.images?.length) {
      await ProductImage.insertMany(
        related.images.map((img: any) => ({ ...img, _id: new Types.ObjectId(img._id), product: restoredId }))
      );
    }
    if (related.specs?.length) {
      await Specification.insertMany(
        related.specs.map((s: any) => ({ ...s, _id: new Types.ObjectId(s._id), product: restoredId }))
      );
    }
    if (related.featureHeaders?.length) {
      await FeaturesSectionHeader.insertMany(
        related.featureHeaders.map((h: any) => ({ ...h, _id: new Types.ObjectId(h._id), product: restoredId }))
      );
    }
    if (related.featureSubsections?.length) {
      await FeaturesSectionSubsection.insertMany(
        related.featureSubsections.map((s: any) => ({ ...s, _id: new Types.ObjectId(s._id), product: restoredId }))
      );
    }
    if (related.colorVariations?.length) {
      await ProductColorVariation.insertMany(
        related.colorVariations.map((c: any) => ({ ...c, _id: new Types.ObjectId(c._id), product: restoredId }))
      );
    }
  }

  // For coupons, also restore usage records if stored
  if (trashItem.entityType === "coupon" && trashItem.relatedData?.usageRecords?.length) {
    await CouponUsage.insertMany(
      trashItem.relatedData.usageRecords.map((u: any) => ({
        ...u,
        _id: new Types.ObjectId(u._id),
        couponId: restoredId,
      }))
    );
  }

  // Remove from trash
  await TrashItem.findByIdAndDelete(trashId);

  return restored;
};

const permanentlyDeleteTrashItemFromDB = async (trashId: string) => {
  const trashItem = await TrashItem.findByIdAndDelete(trashId);
  if (!trashItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Trash item not found");
  }
  return trashItem;
};

const clearTrashFromDB = async (entityType?: TTrashEntityType) => {
  const filter: Record<string, any> = {};
  if (entityType) {
    filter.entityType = entityType;
  }
  const result = await TrashItem.deleteMany(filter);
  return result;
};

const getTrashStatisticsFromDB = async () => {
  const stats = await TrashItem.aggregate([
    {
      $group: {
        _id: "$entityType",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await TrashItem.countDocuments();

  return {
    total,
    byType: stats.reduce((acc: Record<string, number>, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
};

export const TrashServices = {
  getTrashItemsFromDB,
  restoreTrashItemFromDB,
  permanentlyDeleteTrashItemFromDB,
  clearTrashFromDB,
  getTrashStatisticsFromDB,
};
