"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const trash_model_1 = require("./trash.model");
// Import all relevant models for restore
const product_model_1 = require("../product/product.model");
const brand_model_1 = require("../brand/brand.model");
const category_model_1 = require("../category/category.model");
const subcategory_model_1 = require("../subcategory/subcategory.model");
const coupon_model_1 = require("../coupon/coupon.model");
const review_model_1 = require("../review/review.model");
const user_model_1 = require("../user/user.model");
const getModelForEntityType = (entityType) => {
    switch (entityType) {
        case "product": return product_model_1.Product;
        case "brand": return brand_model_1.Brand;
        case "category": return category_model_1.Category;
        case "subcategory": return subcategory_model_1.Subcategory;
        case "coupon": return coupon_model_1.Coupon;
        case "review": return review_model_1.Review;
        case "user": return user_model_1.User;
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Unknown entity type: ${entityType}`);
    }
};
const getTrashItemsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const entityType = query.entityType;
    const filter = {};
    if (entityType) {
        filter.entityType = entityType;
    }
    const [items, total] = await Promise.all([
        trash_model_1.TrashItem.find(filter)
            .populate("deletedBy", "firstName lastName email")
            .sort({ deletedAt: -1 })
            .skip(skip)
            .limit(limit),
        trash_model_1.TrashItem.countDocuments(filter),
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
const restoreTrashItemFromDB = async (trashId) => {
    const trashItem = await trash_model_1.TrashItem.findById(trashId);
    if (!trashItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Trash item not found");
    }
    const Model = getModelForEntityType(trashItem.entityType);
    const restoredId = new mongoose_1.Types.ObjectId(trashItem.originalId);
    // Check if an item with this ID already exists (was re-created after deletion)
    const existing = await Model.findById(restoredId);
    if (existing) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `A ${trashItem.entityType} with the same ID already exists. Cannot restore.`);
    }
    // Strip mongoose-added fields from stored data to avoid conflicts
    const restoreData = { ...trashItem.data };
    delete restoreData.__v;
    restoreData._id = restoredId;
    // Re-insert the document with the original _id
    const restored = await Model.create(restoreData);
    // For products, also restore related data
    if (trashItem.entityType === "product" && trashItem.relatedData) {
        const related = trashItem.relatedData;
        if (related.images?.length) {
            await product_model_1.ProductImage.insertMany(related.images.map((img) => ({ ...img, _id: new mongoose_1.Types.ObjectId(img._id), product: restoredId })));
        }
        if (related.specs?.length) {
            await product_model_1.Specification.insertMany(related.specs.map((s) => ({ ...s, _id: new mongoose_1.Types.ObjectId(s._id), product: restoredId })));
        }
        if (related.featureHeaders?.length) {
            await product_model_1.FeaturesSectionHeader.insertMany(related.featureHeaders.map((h) => ({ ...h, _id: new mongoose_1.Types.ObjectId(h._id), product: restoredId })));
        }
        if (related.featureSubsections?.length) {
            await product_model_1.FeaturesSectionSubsection.insertMany(related.featureSubsections.map((s) => ({ ...s, _id: new mongoose_1.Types.ObjectId(s._id), product: restoredId })));
        }
        if (related.colorVariations?.length) {
            await product_model_1.ProductColorVariation.insertMany(related.colorVariations.map((c) => ({ ...c, _id: new mongoose_1.Types.ObjectId(c._id), product: restoredId })));
        }
    }
    // For coupons, also restore usage records if stored
    if (trashItem.entityType === "coupon" && trashItem.relatedData?.usageRecords?.length) {
        await coupon_model_1.CouponUsage.insertMany(trashItem.relatedData.usageRecords.map((u) => ({
            ...u,
            _id: new mongoose_1.Types.ObjectId(u._id),
            couponId: restoredId,
        })));
    }
    // Remove from trash
    await trash_model_1.TrashItem.findByIdAndDelete(trashId);
    return restored;
};
const permanentlyDeleteTrashItemFromDB = async (trashId) => {
    const trashItem = await trash_model_1.TrashItem.findByIdAndDelete(trashId);
    if (!trashItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Trash item not found");
    }
    return trashItem;
};
const clearTrashFromDB = async (entityType) => {
    const filter = {};
    if (entityType) {
        filter.entityType = entityType;
    }
    const result = await trash_model_1.TrashItem.deleteMany(filter);
    return result;
};
const getTrashStatisticsFromDB = async () => {
    const stats = await trash_model_1.TrashItem.aggregate([
        {
            $group: {
                _id: "$entityType",
                count: { $sum: 1 },
            },
        },
    ]);
    const total = await trash_model_1.TrashItem.countDocuments();
    return {
        total,
        byType: stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}),
    };
};
exports.TrashServices = {
    getTrashItemsFromDB,
    restoreTrashItemFromDB,
    permanentlyDeleteTrashItemFromDB,
    clearTrashFromDB,
    getTrashStatisticsFromDB,
};
//# sourceMappingURL=trash.service.js.map