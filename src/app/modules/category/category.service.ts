import { Category } from "./category.model";
import { TCategory } from "./category.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload";
import { Subcategory } from "../subcategory/subcategory.model";

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
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

  const result = await Category.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ sortOrder: 1, createdAt: -1 });

  // Count subcategories and brands for each category
  const categoriesWithCounts = await Promise.all(
    result.map(async (category) => {
      const subcategoriesCount = await Subcategory.countDocuments({
        category: category._id,
      });

      return {
        ...category.toObject(),
        subcategories_count: subcategoriesCount,
        brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
      };
    })
  );

  const total = await Category.countDocuments(searchQuery);

  return {
    result: categoriesWithCounts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Count subcategories for this category
  const subcategoriesCount = await Subcategory.countDocuments({
    category: category._id,
  });

  return {
    ...category.toObject(),
    subcategories_count: subcategoriesCount,
    brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
  };
};

const getCategoryBySlugFromDB = async (slug: string) => {
  
  const category = await Category.findOne({ slug });
  
  if (!category) {
    
    // Log all available category slugs to help debug
    const allCategories = await Category.find({}, 'slug name').limit(20);
    
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  

  // Count subcategories for this category
  const subcategoriesCount = await Subcategory.countDocuments({
    category: category._id,
  });

  return {
    ...category.toObject(),
    subcategories_count: subcategoriesCount,
    brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
  };
};

const createCategoryIntoDB = async (
  payload: TCategory,
  imageBuffer?: Buffer
) => {
  // Generate unique slug
  payload.slug = await generateUniqueSlug(payload.name, Category);

  // Upload image if provided
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "categories");
    payload.image = imageUrl;
  }

  const result = await Category.create(payload);

  // Return with counts (new category will have 0 subcategories)
  return {
    ...result.toObject(),
    subcategories_count: 0,
    brands_count: 0,
  };
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
  imageBuffer?: Buffer
) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Update slug if name changed
  if (payload.name && payload.name !== category.name) {
    payload.slug = await generateUniqueSlug(payload.name, Category);
  }

  // Upload new image if provided
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "categories");
    payload.image = imageUrl;
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Count subcategories for the updated category
  const subcategoriesCount = await Subcategory.countDocuments({
    category: result._id,
  });

  return {
    ...result.toObject(),
    subcategories_count: subcategoriesCount,
    brands_count: 0,
  };
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryServices = {
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  getCategoryBySlugFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
