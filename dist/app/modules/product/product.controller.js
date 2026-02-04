"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const getAllProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await product_service_1.ProductServices.getAllProductsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products Retrieved Successfully",
        data: products.result,
        meta: products.meta,
    });
});
const getSingleProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await product_service_1.ProductServices.getSingleProductFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Retrieved Successfully",
        data: product,
    });
});
const getProductBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await product_service_1.ProductServices.getProductBySlugFromDB(req.params.slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Retrieved Successfully",
        data: product,
    });
});
const createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("🎯 [CREATE PRODUCT] Controller started");
    console.log("📝 Content-Type:", req.headers["content-type"]);
    const files = req.files;
    console.log("📁 Files received:", files ? Object.keys(files) : "none");
    const mainImageBuffer = files?.mainImage?.[0]?.buffer;
    const additionalImagesBuffers = files?.additionalImages?.map((file) => file.buffer) || [];
    console.log("🖼️ Main image size:", mainImageBuffer?.length || 0, "bytes");
    console.log("🖼️ Additional images:", additionalImagesBuffers.length);
    if (req.body.colors && typeof req.body.colors === "string") {
        try {
            req.body.colors = JSON.parse(req.body.colors);
        }
        catch (error) {
            console.error("❌ Error parsing colors JSON:", error);
        }
    }
    if (req.body.faqs && typeof req.body.faqs === "string") {
        try {
            req.body.faqs = JSON.parse(req.body.faqs);
        }
        catch (error) {
            console.error("❌ Error parsing faqs JSON:", error);
        }
    }
    console.log("🚀 Calling createProductIntoDB...");
    const result = await product_service_1.ProductServices.createProductIntoDB(req.body, mainImageBuffer, additionalImagesBuffers);
    console.log("✅ Product created, sending response...");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully",
        data: result,
    });
});
const updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    const mainImageBuffer = files?.mainImage?.[0]?.buffer;
    const additionalImagesBuffers = files?.additionalImages?.map((file) => file.buffer) || [];
    console.log(`[UpdateProduct] ID: ${id}`);
    console.log(`[UpdateProduct] Content-Type: ${req.headers["content-type"]}`);
    console.log(`[UpdateProduct] Main Image: ${mainImageBuffer ? 'Yes' : 'No'}`);
    console.log(`[UpdateProduct] Additional Images Count: ${additionalImagesBuffers.length}`);
    if (req.body.colors && typeof req.body.colors === "string") {
        try {
            req.body.colors = JSON.parse(req.body.colors);
        }
        catch (error) {
            // console.error("Error parsing colors JSON:", error);
        }
    }
    if (req.body.faqs && typeof req.body.faqs === "string") {
        try {
            req.body.faqs = JSON.parse(req.body.faqs);
        }
        catch (error) {
            // console.error("Error parsing faqs JSON:", error);
        }
    }
    const result = await product_service_1.ProductServices.updateProductIntoDB(id, req.body, mainImageBuffer, additionalImagesBuffers);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully",
        data: result,
    });
});
const deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await product_service_1.ProductServices.deleteProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully",
        data: null,
    });
});
// Product Images
const getProductImages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.getProductImagesFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product images retrieved successfully",
        data: result,
    });
});
const addProductImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) {
        throw new Error("Image file is required");
    }
    const result = await product_service_1.ProductServices.addProductImageIntoDB(productId, imageBuffer, req.body.sortOrder);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product image added successfully",
        data: result,
    });
});
const deleteProductImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { imageId } = req.params;
    await product_service_1.ProductServices.deleteProductImageFromDB(imageId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product image deleted successfully",
        data: null,
    });
});
// Feature Headers
const getFeatureHeaders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.getFeatureHeadersFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature headers retrieved successfully",
        data: result,
    });
});
const addFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log(`[addFeatureHeader] Request received for product: ${req.params.productId}`);
    console.log(`[addFeatureHeader] Content-Type: ${req.headers['content-type']}`);
    console.log(`[addFeatureHeader] File present: ${!!req.file}`);
    console.log(`[addFeatureHeader] File size: ${req.file?.size || 0} bytes`);
    console.log(`[addFeatureHeader] Body:`, JSON.stringify(req.body));
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    console.log(`[addFeatureHeader] Starting service call...`);
    const result = await product_service_1.ProductServices.addFeatureHeaderIntoDB(productId, req.body, imageBuffer);
    console.log(`[addFeatureHeader] Service call completed successfully`);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Feature header added successfully",
        data: result,
    });
});
const updateFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { headerId } = req.params;
    const result = await product_service_1.ProductServices.updateFeatureHeaderIntoDB(headerId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature header updated successfully",
        data: result,
    });
});
const deleteFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { headerId } = req.params;
    await product_service_1.ProductServices.deleteFeatureHeaderFromDB(headerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature header deleted successfully",
        data: null,
    });
});
// Feature Subsections
const getFeatureSubsections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.getFeatureSubsectionsFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature subsections retrieved successfully",
        data: result,
    });
});
const addFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await product_service_1.ProductServices.addFeatureSubsectionIntoDB(productId, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Feature subsection added successfully",
        data: result,
    });
});
const updateFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subsectionId } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await product_service_1.ProductServices.updateFeatureSubsectionIntoDB(subsectionId, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature subsection updated successfully",
        data: result,
    });
});
const deleteFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subsectionId } = req.params;
    await product_service_1.ProductServices.deleteFeatureSubsectionFromDB(subsectionId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature subsection deleted successfully",
        data: null,
    });
});
// Specifications
const getSpecifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.getSpecificationsFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Specifications retrieved successfully",
        data: result,
    });
});
const addSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.addSpecificationIntoDB(productId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Specification added successfully",
        data: result,
    });
});
const updateSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { specId } = req.params;
    const result = await product_service_1.ProductServices.updateSpecificationIntoDB(specId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Specification updated successfully",
        data: result,
    });
});
const deleteSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { specId } = req.params;
    await product_service_1.ProductServices.deleteSpecificationFromDB(specId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Specification deleted successfully",
        data: null,
    });
});
// Color Variations
const getColorVariations = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.getColorVariationsFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Color variations retrieved successfully",
        data: result,
    });
});
const addColorVariation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.addColorVariationIntoDB(productId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Color variation added successfully",
        data: result,
    });
});
const updateColorVariation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { colorId } = req.params;
    const result = await product_service_1.ProductServices.updateColorVariationIntoDB(colorId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Color variation updated successfully",
        data: result,
    });
});
const deleteColorVariation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { colorId } = req.params;
    await product_service_1.ProductServices.deleteColorVariationFromDB(colorId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Color variation deleted successfully",
        data: null,
    });
});
// Get all unique colors
const getAllUniqueColors = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_service_1.ProductServices.getAllUniqueColorsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Unique colors retrieved successfully",
        data: result,
    });
});
// Featured Sections (Homepage Sections)
const getAllFeaturedSections = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_service_1.ProductServices.getAllFeaturedSectionsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Featured sections retrieved successfully",
        data: result,
    });
});
const createFeaturedSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await product_service_1.ProductServices.createFeaturedSectionIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Featured section created successfully",
        data: result,
    });
});
const updateFeaturedSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await product_service_1.ProductServices.updateFeaturedSectionIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Featured section updated successfully",
        data: result,
    });
});
const deleteFeaturedSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await product_service_1.ProductServices.deleteFeaturedSectionFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Featured section deleted successfully",
        data: null,
    });
});
exports.ProductControllers = {
    getAllProducts,
    getSingleProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductImages,
    addProductImage,
    deleteProductImage,
    getFeatureHeaders,
    addFeatureHeader,
    updateFeatureHeader,
    deleteFeatureHeader,
    getFeatureSubsections,
    addFeatureSubsection,
    updateFeatureSubsection,
    deleteFeatureSubsection,
    getSpecifications,
    addSpecification,
    updateSpecification,
    deleteSpecification,
    getColorVariations,
    addColorVariation,
    updateColorVariation,
    deleteColorVariation,
    getAllUniqueColors,
    getAllFeaturedSections,
    createFeaturedSection,
    updateFeaturedSection,
    deleteFeaturedSection,
};
//# sourceMappingURL=product.controller.js.map