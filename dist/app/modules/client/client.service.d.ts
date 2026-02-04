import { IClient } from "./client.interface";
export declare const ClientService: {
    createClientIntoDB: (payload: Partial<IClient>, file: Express.Multer.File) => Promise<import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveClientsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllClientsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleClientFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateClientIntoDB: (id: string, payload: Partial<IClient>, file?: Express.Multer.File) => Promise<(import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteClientFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    toggleClientStatus: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IClient, {}, {}> & IClient & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=client.service.d.ts.map