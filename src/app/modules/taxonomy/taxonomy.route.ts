import express from "express";
import { Category } from "../category/category.model";
import { Subcategory } from "../subcategory/subcategory.model";
import { Brand } from "../brand/brand.model";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const router = express.Router();

const getTaxonomyAllData = catchAsync(async (req, res) => {
  const [categories, subcategories, brands] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
    Subcategory.find({ isActive: true })
      .populate("category")
      .sort({ sortOrder: 1, name: 1 }),
    Brand.find({ isActive: true })
      .populate("categories")
      .populate("subcategories")
      .sort({ sortOrder: 1, name: 1 }),
  ]);

  // Create brand-category and brand-subcategory maps from stored relationships
  const categoryBrandsMap = new Map<string, Set<string>>();
  const subcategoryBrandsMap = new Map<string, Set<string>>();

  brands.forEach((brand) => {
    const brandId = brand._id.toString();

    // Map brand to its categories
    if (brand.categories && Array.isArray(brand.categories)) {
      brand.categories.forEach((category: any) => {
        const categoryId =
          typeof category === "object"
            ? category._id.toString()
            : String(category);

        if (!categoryBrandsMap.has(categoryId)) {
          categoryBrandsMap.set(categoryId, new Set());
        }
        categoryBrandsMap.get(categoryId)!.add(brandId);
      });
    }

    // Map brand to its subcategories
    if (brand.subcategories && Array.isArray(brand.subcategories)) {
      brand.subcategories.forEach((subcategory: any) => {
        const subcategoryId =
          typeof subcategory === "object"
            ? subcategory._id.toString()
            : String(subcategory);

        if (!subcategoryBrandsMap.has(subcategoryId)) {
          subcategoryBrandsMap.set(subcategoryId, new Set());
        }
        subcategoryBrandsMap.get(subcategoryId)!.add(brandId);
      });
    }
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Taxonomy data retrieved successfully",
    data: {
      categories,
      subcategories,
      brands,
      categoryBrandsMap: Object.fromEntries(
        Array.from(categoryBrandsMap.entries()).map(([key, value]) => [
          key,
          Array.from(value),
        ]),
      ),
      subcategoryBrandsMap: Object.fromEntries(
        Array.from(subcategoryBrandsMap.entries()).map(([key, value]) => [
          key,
          Array.from(value),
        ]),
      ),
    },
  });
});

router.get("/alldata", getTaxonomyAllData);

export const TaxonomyRoutes = router;
