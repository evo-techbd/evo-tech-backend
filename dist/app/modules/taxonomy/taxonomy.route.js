"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_model_1 = require("../category/category.model");
const subcategory_model_1 = require("../subcategory/subcategory.model");
const brand_model_1 = require("../brand/brand.model");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
const getTaxonomyAllData = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const [categories, subcategories, brands] = await Promise.all([
        category_model_1.Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
        subcategory_model_1.Subcategory.find({ isActive: true })
            .populate("category")
            .sort({ sortOrder: 1, name: 1 }),
        brand_model_1.Brand.find({ isActive: true })
            .populate("categories")
            .populate("subcategories")
            .sort({ sortOrder: 1, name: 1 }),
    ]);
    // Create brand-category and brand-subcategory maps from stored relationships
    const categoryBrandsMap = new Map();
    const subcategoryBrandsMap = new Map();
    brands.forEach((brand) => {
        const brandId = brand._id.toString();
        // Map brand to its categories
        if (brand.categories && Array.isArray(brand.categories)) {
            brand.categories.forEach((category) => {
                const categoryId = typeof category === "object"
                    ? category._id.toString()
                    : String(category);
                if (!categoryBrandsMap.has(categoryId)) {
                    categoryBrandsMap.set(categoryId, new Set());
                }
                categoryBrandsMap.get(categoryId).add(brandId);
            });
        }
        // Map brand to its subcategories
        if (brand.subcategories && Array.isArray(brand.subcategories)) {
            brand.subcategories.forEach((subcategory) => {
                const subcategoryId = typeof subcategory === "object"
                    ? subcategory._id.toString()
                    : String(subcategory);
                if (!subcategoryBrandsMap.has(subcategoryId)) {
                    subcategoryBrandsMap.set(subcategoryId, new Set());
                }
                subcategoryBrandsMap.get(subcategoryId).add(brandId);
            });
        }
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Taxonomy data retrieved successfully",
        data: {
            categories,
            subcategories,
            brands,
            categoryBrandsMap: Object.fromEntries(Array.from(categoryBrandsMap.entries()).map(([key, value]) => [
                key,
                Array.from(value),
            ])),
            subcategoryBrandsMap: Object.fromEntries(Array.from(subcategoryBrandsMap.entries()).map(([key, value]) => [
                key,
                Array.from(value),
            ])),
        },
    });
});
router.get("/alldata", getTaxonomyAllData);
exports.TaxonomyRoutes = router;
//# sourceMappingURL=taxonomy.route.js.map