import { TProduct, TProductImage, TFeaturesSectionHeader, TFeaturesSectionSubsection, TSpecification, TProductColorVariation } from "./product.interface";
export declare const Product: import("mongoose").Model<TProduct, {}, {}, {}, import("mongoose").Document<unknown, {}, TProduct, {}, {}> & TProduct & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const ProductImage: import("mongoose").Model<TProductImage, {}, {}, {}, import("mongoose").Document<unknown, {}, TProductImage, {}, {}> & TProductImage & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const FeaturesSectionHeader: import("mongoose").Model<TFeaturesSectionHeader, {}, {}, {}, import("mongoose").Document<unknown, {}, TFeaturesSectionHeader, {}, {}> & TFeaturesSectionHeader & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const FeaturesSectionSubsection: import("mongoose").Model<TFeaturesSectionSubsection, {}, {}, {}, import("mongoose").Document<unknown, {}, TFeaturesSectionSubsection, {}, {}> & TFeaturesSectionSubsection & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const Specification: import("mongoose").Model<TSpecification, {}, {}, {}, import("mongoose").Document<unknown, {}, TSpecification, {}, {}> & TSpecification & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const ProductColorVariation: import("mongoose").Model<TProductColorVariation, {}, {}, {}, import("mongoose").Document<unknown, {}, TProductColorVariation, {}, {}> & TProductColorVariation & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=product.model.d.ts.map