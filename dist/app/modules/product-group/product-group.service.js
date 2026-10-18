"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductGroupService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const product_group_model_1 = require("./product-group.model");
const MEMBER_PRODUCT_FIELDS = "name slug mainImage price previousPrice preOrderPrice isPreOrder inStock published";
// Every member must be a real product, listed once, and not already in another group
const assertMembersAvailable = async (members, excludeGroupId) => {
    const ids = members.map((m) => String(m.product));
    if (new Set(ids).size !== ids.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A product is listed twice in the group");
    }
    const existingCount = await product_model_1.Product.countDocuments({ _id: { $in: ids } });
    if (existingCount !== ids.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "One or more products were not found");
    }
    const conflict = await product_group_model_1.ProductGroup.findOne({
        ...(excludeGroupId ? { _id: { $ne: excludeGroupId } } : {}),
        "members.product": { $in: ids },
    }).lean();
    if (conflict) {
        const conflictIds = new Set(conflict.members.map((m) => String(m.product)));
        const takenId = ids.find((id) => conflictIds.has(id));
        const taken = await product_model_1.Product.findById(takenId).select("name").lean();
        throw new AppError_1.default(http_status_1.default.CONFLICT, `"${taken?.name ?? "A product"}" is already in the group "${conflict.name}"`);
    }
};
const createProductGroupIntoDB = async (payload) => {
    await assertMembersAvailable(payload.members);
    return product_group_model_1.ProductGroup.create(payload);
};
const getAllProductGroupsFromDB = async () => {
    return product_group_model_1.ProductGroup.find()
        .populate({ path: "members.product", select: MEMBER_PRODUCT_FIELDS })
        .sort({ createdAt: -1 });
};
const getSingleProductGroupFromDB = async (id) => {
    const group = await product_group_model_1.ProductGroup.findById(id).populate({
        path: "members.product",
        select: MEMBER_PRODUCT_FIELDS,
    });
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product group not found");
    }
    return group;
};
const updateProductGroupIntoDB = async (id, payload) => {
    const group = await product_group_model_1.ProductGroup.findById(id);
    if (!group) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product group not found");
    }
    if (payload.members) {
        await assertMembersAvailable(payload.members, id);
    }
    return product_group_model_1.ProductGroup.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};
const deleteProductGroupFromDB = async (id) => {
    const result = await product_group_model_1.ProductGroup.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product group not found");
    }
    return result;
};
// Storefront: the group a product belongs to, with only published members.
// Deleted (trashed) products populate as null and drop out here, so a restored
// product reappears in its group without any cleanup.
const getGroupForProductFromDB = async (productId) => {
    if (!mongoose_1.Types.ObjectId.isValid(productId))
        return null;
    const group = await product_group_model_1.ProductGroup.findOne({
        isActive: true,
        "members.product": productId,
    })
        .populate({ path: "members.product", select: MEMBER_PRODUCT_FIELDS })
        .lean();
    if (!group)
        return null;
    const members = group.members
        .filter((m) => m.product && m.product.published)
        .map((m) => ({
        _id: m.product._id,
        name: m.product.name,
        label: m.label || "",
        slug: m.product.slug,
        mainImage: m.product.mainImage,
        price: m.product.price,
        previousPrice: m.product.previousPrice,
        preOrderPrice: m.product.preOrderPrice,
        isPreOrder: m.product.isPreOrder,
        inStock: m.product.inStock,
    }));
    // A "group" of just the current product has nothing to show
    if (members.length < 2)
        return null;
    return { _id: group._id, title: group.title || "", members };
};
exports.ProductGroupService = {
    createProductGroupIntoDB,
    getAllProductGroupsFromDB,
    getSingleProductGroupFromDB,
    updateProductGroupIntoDB,
    deleteProductGroupFromDB,
    getGroupForProductFromDB,
};
//# sourceMappingURL=product-group.service.js.map