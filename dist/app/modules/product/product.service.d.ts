import { TProduct } from "./product.interface";
import { Types } from "mongoose";
export declare const ProductServices: {
    getAllProductsFromDB: (query: Record<string, unknown>) => Promise<{
        result: (import("mongoose").Document<unknown, {}, TProduct, {}, {}> & TProduct & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSingleProductFromDB: (id: string) => Promise<{
        images: (import("mongoose").Document<unknown, {}, import("./product.interface").TProductImage, {}, {}> & import("./product.interface").TProductImage & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        featureHeaders: (import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        featureSubsections: (import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        specifications: (import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        colorVariations: (import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        _id: string;
        name: string;
        slug: string;
        price: number;
        buyingPrice?: number;
        previousPrice?: number;
        inStock: boolean;
        features?: string[];
        colors?: string[];
        mainImage: string;
        category: Types.ObjectId;
        subcategory?: Types.ObjectId;
        brand?: Types.ObjectId;
        weight?: number;
        landingpageSectionId?: Types.ObjectId;
        landingpageSortorder?: number;
        published: boolean;
        rating?: number;
        reviewCount?: number;
        description?: string;
        shortDescription?: string;
        sku?: string;
        stock?: number;
        lowStockThreshold?: number;
        isFeatured?: boolean;
        isPreOrder?: boolean;
        preOrderDate?: Date;
        preOrderPrice?: number;
        seoTitle?: string;
        seoDescription?: string;
        featureBanner?: string;
        faqs?: import("./product.interface").TProductFAQ[];
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    getProductBySlugFromDB: (slug: string) => Promise<{
        images: (import("mongoose").Document<unknown, {}, import("./product.interface").TProductImage, {}, {}> & import("./product.interface").TProductImage & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        featureHeaders: (import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        featureSubsections: (import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        specifications: (import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        colorVariations: (import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        _id: string;
        name: string;
        slug: string;
        price: number;
        buyingPrice?: number;
        previousPrice?: number;
        inStock: boolean;
        features?: string[];
        colors?: string[];
        mainImage: string;
        category: Types.ObjectId;
        subcategory?: Types.ObjectId;
        brand?: Types.ObjectId;
        weight?: number;
        landingpageSectionId?: Types.ObjectId;
        landingpageSortorder?: number;
        published: boolean;
        rating?: number;
        reviewCount?: number;
        description?: string;
        shortDescription?: string;
        sku?: string;
        stock?: number;
        lowStockThreshold?: number;
        isFeatured?: boolean;
        isPreOrder?: boolean;
        preOrderDate?: Date;
        preOrderPrice?: number;
        seoTitle?: string;
        seoDescription?: string;
        featureBanner?: string;
        faqs?: import("./product.interface").TProductFAQ[];
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    createProductIntoDB: (payload: any, mainImageBuffer?: Buffer, additionalImagesBuffers?: Buffer[]) => Promise<import("mongoose").Document<unknown, {}, TProduct, {}, {}> & TProduct & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateProductIntoDB: (id: string, payload: Partial<TProduct>, mainImageBuffer?: Buffer, additionalImagesBuffers?: Buffer[]) => Promise<(import("mongoose").Document<unknown, {}, TProduct, {}, {}> & TProduct & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteProductFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TProduct, {}, {}> & TProduct & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    getProductImagesFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./product.interface").TProductImage, {}, {}> & import("./product.interface").TProductImage & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addProductImageIntoDB: (productId: string, imageBuffer: Buffer, sortOrder?: number) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TProductImage, {}, {}> & import("./product.interface").TProductImage & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteProductImageFromDB: (imageId: string) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TProductImage, {}, {}> & import("./product.interface").TProductImage & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getFeatureHeadersFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addFeatureHeaderIntoDB: (productId: string, payload: any, imageBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateFeatureHeaderIntoDB: (headerId: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteFeatureHeaderFromDB: (headerId: string) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionHeader, {}, {}> & import("./product.interface").TFeaturesSectionHeader & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getFeatureSubsectionsFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addFeatureSubsectionIntoDB: (productId: string, payload: any, imageBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateFeatureSubsectionIntoDB: (subsectionId: string, payload: any, imageBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteFeatureSubsectionFromDB: (subsectionId: string) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TFeaturesSectionSubsection, {}, {}> & import("./product.interface").TFeaturesSectionSubsection & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getSpecificationsFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addSpecificationIntoDB: (productId: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateSpecificationIntoDB: (specId: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteSpecificationFromDB: (specId: string) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TSpecification, {}, {}> & import("./product.interface").TSpecification & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getColorVariationsFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addColorVariationIntoDB: (productId: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateColorVariationIntoDB: (colorId: string, payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteColorVariationFromDB: (colorId: string) => Promise<import("mongoose").Document<unknown, {}, import("./product.interface").TProductColorVariation, {}, {}> & import("./product.interface").TProductColorVariation & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllUniqueColorsFromDB: () => Promise<any[]>;
    getAllFeaturedSectionsFromDB: () => Promise<(import("mongoose").FlattenMaps<import("../landingsection/landingsection.interface").ILandingSection> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[]>;
    createFeaturedSectionIntoDB: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("../landingsection/landingsection.interface").ILandingSection, {}, {}> & import("../landingsection/landingsection.interface").ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateFeaturedSectionIntoDB: (id: string, payload: any) => Promise<(import("mongoose").Document<unknown, {}, import("../landingsection/landingsection.interface").ILandingSection, {}, {}> & import("../landingsection/landingsection.interface").ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteFeaturedSectionFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("../landingsection/landingsection.interface").ILandingSection, {}, {}> & import("../landingsection/landingsection.interface").ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=product.service.d.ts.map