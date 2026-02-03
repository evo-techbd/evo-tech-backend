"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoryServices = void 0;
const subcategory_model_1 = require("./subcategory.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const slugify_1 = require("../../utils/slugify");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const getAllSubcategoriesFromDB = async (query) => {
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
    if (query.category) {
        searchQuery.category = query.category;
    }
    const result = await subcategory_model_1.Subcategory.find(searchQuery)
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ sortOrder: 1, createdAt: -1 });
    const total = await subcategory_model_1.Subcategory.countDocuments(searchQuery);
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
const getSingleSubcategoryFromDB = async (id) => {
    const subcategory = await subcategory_model_1.Subcategory.findById(id).populate("category");
    if (!subcategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subcategory not found");
    }
    return subcategory;
};
const getSubcategoryBySlugFromDB = async (slug) => {
    const subcategory = await subcategory_model_1.Subcategory.findOne({ slug }).populate("category");
    if (!subcategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subcategory not found");
    }
    return subcategory;
};
const createSubcategoryIntoDB = async (payload, imageBuffer) => {
    payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, subcategory_model_1.Subcategory);
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "subcategories");
        payload.image = imageUrl;
    }
    const result = await subcategory_model_1.Subcategory.create(payload);
    return result;
};
const updateSubcategoryIntoDB = async (id, payload, imageBuffer) => {
    const subcategory = await subcategory_model_1.Subcategory.findById(id);
    if (!subcategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subcategory not found");
    }
    if (payload.name && payload.name !== subcategory.name) {
        payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, subcategory_model_1.Subcategory);
    }
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "subcategories");
        payload.image = imageUrl;
    }
    const result = await subcategory_model_1.Subcategory.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate("category");
    return result;
};
const deleteSubcategoryFromDB = async (id) => {
    const subcategory = await subcategory_model_1.Subcategory.findById(id);
    if (!subcategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Subcategory not found");
    }
    const result = await subcategory_model_1.Subcategory.findByIdAndDelete(id);
    return result;
};
exports.SubcategoryServices = {
    getAllSubcategoriesFromDB,
    getSingleSubcategoryFromDB,
    getSubcategoryBySlugFromDB,
    createSubcategoryIntoDB,
    updateSubcategoryIntoDB,
    deleteSubcategoryFromDB,
};
//# sourceMappingURL=subcategory.service.js.map