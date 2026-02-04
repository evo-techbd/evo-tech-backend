import { Subcategory } from "./subcategory.model";
import { TSubcategory } from "./subcategory.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getAllSubcategoriesFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.name = { $regex: query.search, $options: "i" };
  }

  if (query.isActive !== undefined) {
    searchQuery.isActive = query.isActive === "true";
  }

  if (query.category) {
    searchQuery.category = query.category;
  }

  const result = await Subcategory.find(searchQuery)
    .populate("category")
    .skip(skip)
    .limit(limit)
    .sort({ sortOrder: 1, createdAt: -1 });

  const total = await Subcategory.countDocuments(searchQuery);

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

const getSingleSubcategoryFromDB = async (id: string) => {
  const subcategory = await Subcategory.findById(id).populate("category");
  if (!subcategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }
  return subcategory;
};

const getSubcategoryBySlugFromDB = async (slug: string) => {
  const subcategory = await Subcategory.findOne({ slug }).populate("category");
  if (!subcategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }
  return subcategory;
};

const createSubcategoryIntoDB = async (
  payload: TSubcategory,
  imageBuffer?: Buffer
) => {
  payload.slug = await generateUniqueSlug(payload.name, Subcategory);

  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "subcategories");
    payload.image = imageUrl;
  }

  const result = await Subcategory.create(payload);
  return result;
};

const updateSubcategoryIntoDB = async (
  id: string,
  payload: Partial<TSubcategory>,
  imageBuffer?: Buffer
) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  if (payload.name && payload.name !== subcategory.name) {
    payload.slug = await generateUniqueSlug(payload.name, Subcategory);
  }

  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "subcategories");
    payload.image = imageUrl;
  }

  const result = await Subcategory.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("category");
  return result;
};

const deleteSubcategoryFromDB = async (id: string) => {
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  const result = await Subcategory.findByIdAndDelete(id);
  return result;
};

export const SubcategoryServices = {
  getAllSubcategoriesFromDB,
  getSingleSubcategoryFromDB,
  getSubcategoryBySlugFromDB,
  createSubcategoryIntoDB,
  updateSubcategoryIntoDB,
  deleteSubcategoryFromDB,
};
