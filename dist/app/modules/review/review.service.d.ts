export declare const ReviewServices: {
    getReviewsByProductFromDB: (productId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, {}> & import("./review.interface").TReview & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addReviewIntoDB: (productId: string, payload: any, imageBuffer?: Buffer, userUuid?: string) => Promise<import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, {}> & import("./review.interface").TReview & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateReviewIntoDB: (reviewId: string, payload: any, imageBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, {}> & import("./review.interface").TReview & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteReviewFromDB: (reviewId: string) => Promise<import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, {}> & import("./review.interface").TReview & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map