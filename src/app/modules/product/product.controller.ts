import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products Retrieved Successfully",
    data: products.result,
    meta: products.meta,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const product = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product Retrieved Successfully",
    data: product,
  });
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await ProductServices.getProductBySlugFromDB(req.params.slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product Retrieved Successfully",
    data: product,
  });
});

const createProduct = catchAsync(async (req, res) => {
  console.log("🎯 [CREATE PRODUCT] Controller started");
  console.log("📝 Content-Type:", req.headers["content-type"]);
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log("📁 Files received:", files ? Object.keys(files) : "none");
  
  const mainImageBuffer = files?.mainImage?.[0]?.buffer;
  const additionalImagesBuffers =
    files?.additionalImages?.map((file) => file.buffer) || [];
  
  console.log("🖼️ Main image size:", mainImageBuffer?.length || 0, "bytes");
  console.log("🖼️ Additional images:", additionalImagesBuffers.length);

  if (req.body.colors && typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      console.error("❌ Error parsing colors JSON:", error);
    }
  }

  if (req.body.faqs && typeof req.body.faqs === "string") {
    try {
      req.body.faqs = JSON.parse(req.body.faqs);
    } catch (error) {
      console.error("❌ Error parsing faqs JSON:", error);
    }
  }

  console.log("🚀 Calling createProductIntoDB...");
  const result = await ProductServices.createProductIntoDB(
    req.body,
    mainImageBuffer,
    additionalImagesBuffers
  );
  console.log("✅ Product created, sending response...");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const mainImageBuffer = files?.mainImage?.[0]?.buffer;
  const additionalImagesBuffers =
    files?.additionalImages?.map((file) => file.buffer) || [];

  console.log(`[UpdateProduct] ID: ${id}`);
  console.log(`[UpdateProduct] Content-Type: ${req.headers["content-type"]}`);
  console.log(`[UpdateProduct] Main Image: ${mainImageBuffer ? 'Yes' : 'No'}`);
  console.log(`[UpdateProduct] Additional Images Count: ${additionalImagesBuffers.length}`);

  if (req.body.colors && typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      // console.error("Error parsing colors JSON:", error);
    }
  }

  if (req.body.faqs && typeof req.body.faqs === "string") {
    try {
      req.body.faqs = JSON.parse(req.body.faqs);
    } catch (error) {
      // console.error("Error parsing faqs JSON:", error);
    }
  }

  const result = await ProductServices.updateProductIntoDB(
    id,
    req.body,
    mainImageBuffer,
    additionalImagesBuffers
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: null,
  });
});

// Product Images
const getProductImages = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getProductImagesFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product images retrieved successfully",
    data: result,
  });
});

const addProductImage = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;

  if (!imageBuffer) {
    throw new Error("Image file is required");
  }

  const result = await ProductServices.addProductImageIntoDB(
    productId,
    imageBuffer,
    req.body.sortOrder
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product image added successfully",
    data: result,
  });
});

const deleteProductImage = catchAsync(async (req, res) => {
  const { imageId } = req.params;
  await ProductServices.deleteProductImageFromDB(imageId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product image deleted successfully",
    data: null,
  });
});

// Feature Headers
const getFeatureHeaders = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getFeatureHeadersFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature headers retrieved successfully",
    data: result,
  });
});

const addFeatureHeader = catchAsync(async (req, res) => {
  console.log(`[addFeatureHeader] Request received for product: ${req.params.productId}`);
  console.log(`[addFeatureHeader] Content-Type: ${req.headers['content-type']}`);
  console.log(`[addFeatureHeader] File present: ${!!req.file}`);
  console.log(`[addFeatureHeader] File size: ${req.file?.size || 0} bytes`);
  console.log(`[addFeatureHeader] Body:`, JSON.stringify(req.body));
  
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;
  
  console.log(`[addFeatureHeader] Starting service call...`);
  const result = await ProductServices.addFeatureHeaderIntoDB(
    productId,
    req.body,
    imageBuffer
  );
  console.log(`[addFeatureHeader] Service call completed successfully`);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature header added successfully",
    data: result,
  });
});

const updateFeatureHeader = catchAsync(async (req, res) => {
  const { headerId } = req.params;
  const result = await ProductServices.updateFeatureHeaderIntoDB(
    headerId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature header updated successfully",
    data: result,
  });
});

const deleteFeatureHeader = catchAsync(async (req, res) => {
  const { headerId } = req.params;
  await ProductServices.deleteFeatureHeaderFromDB(headerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature header deleted successfully",
    data: null,
  });
});

// Feature Subsections
const getFeatureSubsections = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getFeatureSubsectionsFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature subsections retrieved successfully",
    data: result,
  });
});

const addFeatureSubsection = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await ProductServices.addFeatureSubsectionIntoDB(
    productId,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature subsection added successfully",
    data: result,
  });
});

const updateFeatureSubsection = catchAsync(async (req, res) => {
  const { subsectionId } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await ProductServices.updateFeatureSubsectionIntoDB(
    subsectionId,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature subsection updated successfully",
    data: result,
  });
});

const deleteFeatureSubsection = catchAsync(async (req, res) => {
  const { subsectionId } = req.params;
  await ProductServices.deleteFeatureSubsectionFromDB(subsectionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature subsection deleted successfully",
    data: null,
  });
});

// Specifications
const getSpecifications = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getSpecificationsFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specifications retrieved successfully",
    data: result,
  });
});

const addSpecification = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.addSpecificationIntoDB(
    productId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Specification added successfully",
    data: result,
  });
});

const updateSpecification = catchAsync(async (req, res) => {
  const { specId } = req.params;
  const result = await ProductServices.updateSpecificationIntoDB(
    specId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specification updated successfully",
    data: result,
  });
});

const deleteSpecification = catchAsync(async (req, res) => {
  const { specId } = req.params;
  await ProductServices.deleteSpecificationFromDB(specId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specification deleted successfully",
    data: null,
  });
});

// Color Variations
const getColorVariations = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getColorVariationsFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Color variations retrieved successfully",
    data: result,
  });
});

const addColorVariation = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.addColorVariationIntoDB(
    productId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Color variation added successfully",
    data: result,
  });
});

const updateColorVariation = catchAsync(async (req, res) => {
  const { colorId } = req.params;
  const result = await ProductServices.updateColorVariationIntoDB(
    colorId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Color variation updated successfully",
    data: result,
  });
});

const deleteColorVariation = catchAsync(async (req, res) => {
  const { colorId } = req.params;
  await ProductServices.deleteColorVariationFromDB(colorId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Color variation deleted successfully",
    data: null,
  });
});

// Get all unique colors
const getAllUniqueColors = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllUniqueColorsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Unique colors retrieved successfully",
    data: result,
  });
});

// Featured Sections (Homepage Sections)
const getAllFeaturedSections = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllFeaturedSectionsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Featured sections retrieved successfully",
    data: result,
  });
});

const createFeaturedSection = catchAsync(async (req, res) => {
  const result = await ProductServices.createFeaturedSectionIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Featured section created successfully",
    data: result,
  });
});

const updateFeaturedSection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateFeaturedSectionIntoDB(
    id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Featured section updated successfully",
    data: result,
  });
});

const deleteFeaturedSection = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProductServices.deleteFeaturedSectionFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Featured section deleted successfully",
    data: null,
  });
});

export const ProductControllers = {
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
