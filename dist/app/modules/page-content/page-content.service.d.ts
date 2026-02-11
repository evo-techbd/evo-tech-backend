import { IPageContent, PageContentType } from "./page-content.interface";
export declare const PageContentService: {
    createPageContentIntoDB: (type: PageContentType, payload: Partial<IPageContent>) => Promise<import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActivePageContentFromDB: (type: PageContentType) => Promise<import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllPageContentFromDB: (type: PageContentType) => Promise<(import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSinglePageContentFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePageContentIntoDB: (id: string, payload: Partial<IPageContent>) => Promise<(import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deletePageContentFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IPageContent, {}, {}> & IPageContent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=page-content.service.d.ts.map