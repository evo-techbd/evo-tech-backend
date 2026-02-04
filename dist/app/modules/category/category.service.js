"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const category_model_1 = require("./category.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const slugify_1 = require("../../utils/slugify");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const subcategory_model_1 = require("../subcategory/subcategory.model");
const getAllCategoriesFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
    if (query.search) {
        searchQuery.name = { $regex: query.search, $options: "i" };
    }
    if (query.isActive !== undefined) {
        searchQuery.isActive = query.isActive === "true";
    }
    const result = await category_model_1.Category.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ sortOrder: 1, createdAt: -1 });
    // Count subcategories and brands for each category
    const categoriesWithCounts = await Promise.all(result.map(async (category) => {
        const subcategoriesCount = await subcategory_model_1.Subcategory.countDocuments({
            category: category._id,
        });
        return {
            ...category.toObject(),
            subcategories_count: subcategoriesCount,
            brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
        };
    }));
    const total = await category_model_1.Category.countDocuments(searchQuery);
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
const getSingleCategoryFromDB = async (id) => {
    const category = await category_model_1.Category.findById(id);
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Count subcategories for this category
    const subcategoriesCount = await subcategory_model_1.Subcategory.countDocuments({
        category: category._id,
    });
    return {
        ...category.toObject(),
        subcategories_count: subcategoriesCount,
        brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
    };
};
const getCategoryBySlugFromDB = async (slug) => {
    const category = await category_model_1.Category.findOne({ slug });
    if (!category) {
        // Log all available category slugs to help debug
        const allCategories = await category_model_1.Category.find({}, 'slug name').limit(20);
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Count subcategories for this category
    const subcategoriesCount = await subcategory_model_1.Subcategory.countDocuments({
        category: category._id,
    });
    return {
        ...category.toObject(),
        subcategories_count: subcategoriesCount,
        brands_count: 0, // TODO: Add brands count when brand-category relationship is implemented
    };
};
const createCategoryIntoDB = async (payload, imageBuffer) => {
    // Generate unique slug
    payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, category_model_1.Category);
    // Upload image if provided
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "categories");
        payload.image = imageUrl;
    }
    const result = await category_model_1.Category.create(payload);
    // Return with counts (new category will have 0 subcategories)
    return {
        ...result.toObject(),
        subcategories_count: 0,
        brands_count: 0,
    };
};
const updateCategoryIntoDB = async (id, payload, imageBuffer) => {
    const category = await category_model_1.Category.findById(id);
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Update slug if name changed
    if (payload.name && payload.name !== category.name) {
        payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, category_model_1.Category);
    }
    // Upload new image if provided
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "categories");
        payload.image = imageUrl;
    }
    const result = await category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Count subcategories for the updated category
    const subcategoriesCount = await subcategory_model_1.Subcategory.countDocuments({
        category: result._id,
    });
    return {
        ...result.toObject(),
        subcategories_count: subcategoriesCount,
        brands_count: 0,
    };
};
const deleteCategoryFromDB = async (id) => {
    const category = await category_model_1.Category.findById(id);
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    const result = await category_model_1.Category.findByIdAndDelete(id);
    return result;
};
exports.CategoryServices = {
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
    getCategoryBySlugFromDB,
    createCategoryIntoDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};
//# sourceMappingURL=category.service.js.map