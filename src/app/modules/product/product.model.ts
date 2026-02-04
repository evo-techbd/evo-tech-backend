import { Schema, model } from "mongoose";
import {
  TProduct,
  TProductImage,
  TFeaturesSectionHeader,
  TFeaturesSectionSubsection,
  TSpecification,
  TProductColorVariation,
} from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    weight: {
      type: Number,
    },
    landingpageSectionId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Product Image Schema
const productImageSchema = new Schema<TProductImage>(
  {
    product: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Features Section Header Schema
const featuresSectionHeaderSchema = new Schema<TFeaturesSectionHeader>(
  {
    product: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Features Section Subsection Schema
const featuresSectionSubsectionSchema = new Schema<TFeaturesSectionSubsection>(
  {
    product: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Specification Schema
const specificationSchema = new Schema<TSpecification>(
  {
    product: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Product Color Variation Schema
const productColorVariationSchema = new Schema<TProductColorVariation>(
  {
    product: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>("Product", productSchema);
export const ProductImage = model<TProductImage>(
  "ProductImage",
  productImageSchema,
);
export const FeaturesSectionHeader = model<TFeaturesSectionHeader>(
  "FeaturesSectionHeader",
  featuresSectionHeaderSchema,
);
export const FeaturesSectionSubsection = model<TFeaturesSectionSubsection>(
  "FeaturesSectionSubsection",
  featuresSectionSubsectionSchema,
);
export const Specification = model<TSpecification>(
  "Specification",
  specificationSchema,
);
export const ProductColorVariation = model<TProductColorVariation>(
  "ProductColorVariation",
  productColorVariationSchema,
);
