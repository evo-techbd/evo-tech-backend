import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import { ProductGroup } from "./product-group.model";
import { TProductGroup, TProductGroupMember } from "./product-group.interface";

const MEMBER_PRODUCT_FIELDS =
  "name slug mainImage price previousPrice preOrderPrice isPreOrder inStock published";

// Every member must be a real product, listed once, and not already in another group
const assertMembersAvailable = async (
  members: TProductGroupMember[],
  excludeGroupId?: string,
) => {
  const ids = members.map((m) => String(m.product));

  if (new Set(ids).size !== ids.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "A product is listed twice in the group");
  }

  const existingCount = await Product.countDocuments({ _id: { $in: ids } });
  if (existingCount !== ids.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "One or more products were not found");
  }

  const conflict = await ProductGroup.findOne({
    ...(excludeGroupId ? { _id: { $ne: excludeGroupId } } : {}),
    "members.product": { $in: ids },
  }).lean();

  if (conflict) {
    const conflictIds = new Set(conflict.members.map((m) => String(m.product)));
    const takenId = ids.find((id) => conflictIds.has(id));
    const taken = await Product.findById(takenId).select("name").lean();
    throw new AppError(
      httpStatus.CONFLICT,
      `"${taken?.name ?? "A product"}" is already in the group "${conflict.name}"`,
    );
  }
};

const createProductGroupIntoDB = async (payload: TProductGroup) => {
  await assertMembersAvailable(payload.members);
  return ProductGroup.create(payload);
};

const getAllProductGroupsFromDB = async () => {
  return ProductGroup.find()
    .populate({ path: "members.product", select: MEMBER_PRODUCT_FIELDS })
    .sort({ createdAt: -1 });
};

const getSingleProductGroupFromDB = async (id: string) => {
  const group = await ProductGroup.findById(id).populate({
    path: "members.product",
    select: MEMBER_PRODUCT_FIELDS,
  });

  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, "Product group not found");
  }

  return group;
};

const updateProductGroupIntoDB = async (
  id: string,
  payload: Partial<TProductGroup>,
) => {
  const group = await ProductGroup.findById(id);
  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, "Product group not found");
  }

  if (payload.members) {
    await assertMembersAvailable(payload.members, id);
  }

  return ProductGroup.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteProductGroupFromDB = async (id: string) => {
  const result = await ProductGroup.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product group not found");
  }
  return result;
};

// Storefront: the group a product belongs to, with only published members.
// Deleted (trashed) products populate as null and drop out here, so a restored
// product reappears in its group without any cleanup.
const getGroupForProductFromDB = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) return null;

  const group = await ProductGroup.findOne({
    isActive: true,
    "members.product": productId,
  })
    .populate({ path: "members.product", select: MEMBER_PRODUCT_FIELDS })
    .lean();

  if (!group) return null;

  const members = group.members
    .filter((m: any) => m.product && m.product.published)
    .map((m: any) => ({
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
  if (members.length < 2) return null;

  return { _id: group._id, title: group.title || "", members };
};

export const ProductGroupService = {
  createProductGroupIntoDB,
  getAllProductGroupsFromDB,
  getSingleProductGroupFromDB,
  updateProductGroupIntoDB,
  deleteProductGroupFromDB,
  getGroupForProductFromDB,
};
