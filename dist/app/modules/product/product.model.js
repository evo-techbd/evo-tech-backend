"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductColorVariation = exports.Specification = exports.FeaturesSectionSubsection = exports.FeaturesSectionHeader = exports.ProductImage = exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    buyingPrice: {
        type: Number,
    },
    previousPrice: {
        type: Number,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    features: {
        type: [String],
        default: [],
    },
    colors: {
        type: [String],
        default: [],
    },
    mainImage: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subcategory",
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
    },
    weight: {
        type: Number,
    },
    landingpageSectionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "LandingSection",
    },
    landingpageSortorder: {
        type: Number,
        default: 0,
    },
    published: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPreOrder: {
        type: Boolean,
        default: false,
    },
    preOrderDate: {
        type: Date,
    },
    preOrderPrice: {
        type: Number,
    },
    seoTitle: {
        type: String,
    },
    seoDescription: {
        type: String,
    },
    featureBanner: {
        type: String,
    },
    faqs: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});
// Product Image Schema
const productImageSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Features Section Header Schema
const featuresSectionHeaderSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    bannerImage: {
        type: String,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Features Section Subsection Schema
const featuresSectionSubsectionSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Specification Schema
const specificationSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Product Color Variation Schema
const productColorVariationSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    colorName: {
        type: String,
        required: true,
    },
    colorCode: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
exports.ProductImage = (0, mongoose_1.model)("ProductImage", productImageSchema);
exports.FeaturesSectionHeader = (0, mongoose_1.model)("FeaturesSectionHeader", featuresSectionHeaderSchema);
exports.FeaturesSectionSubsection = (0, mongoose_1.model)("FeaturesSectionSubsection", featuresSectionSubsectionSchema);
exports.Specification = (0, mongoose_1.model)("Specification", specificationSchema);
exports.ProductColorVariation = (0, mongoose_1.model)("ProductColorVariation", productColorVariationSchema);
//# sourceMappingURL=product.model.js.map