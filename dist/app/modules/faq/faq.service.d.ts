import { IFaq } from "./faq.interface";
export declare const FaqService: {
    createFaqIntoDB: (payload: Partial<IFaq>) => Promise<import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveFaqsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllFaqsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleFaqFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateFaqIntoDB: (id: string, payload: Partial<IFaq>) => Promise<(import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteFaqFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IFaq, {}, {}> & IFaq & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=faq.service.d.ts.map