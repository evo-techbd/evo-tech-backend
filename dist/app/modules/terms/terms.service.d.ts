import { ITerms } from "./terms.interface";
export declare const TermsService: {
    createOrUpdateTermsIntoDB: (payload: Partial<ITerms>) => Promise<import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveTermsFromDB: () => Promise<import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllTermsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleTermsFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateTermsIntoDB: (id: string, payload: Partial<ITerms>) => Promise<(import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteTermsFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ITerms, {}, {}> & ITerms & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=terms.service.d.ts.map