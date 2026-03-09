import { TPrintingSale } from "./printing-sale.interface";
export declare const PrintingSaleServices: {
    createSale: (payload: TPrintingSale) => Promise<import("mongoose").Document<unknown, {}, TPrintingSale, {}, {}> & TPrintingSale & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllSales: (query: Record<string, unknown>) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        result: (import("mongoose").FlattenMaps<{
            _id?: string | undefined;
            saleNumber: string;
            customerName: string;
            phone: string;
            email?: string | undefined;
            address: string;
            city: string;
            country: string;
            notes?: string | undefined;
            items: {
                productName: string;
                unitPrice: number;
                quantity: number;
                price: number;
            }[];
            totalPrice: number;
            paymentStatus: "pending" | "paid" | "cancelled";
            createdBy: import("mongoose").Types.ObjectId;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }> & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    getSingleSale: (id: string) => Promise<(import("mongoose").FlattenMaps<{
        _id?: string | undefined;
        saleNumber: string;
        customerName: string;
        phone: string;
        email?: string | undefined;
        address: string;
        city: string;
        country: string;
        notes?: string | undefined;
        items: {
            productName: string;
            unitPrice: number;
            quantity: number;
            price: number;
        }[];
        totalPrice: number;
        paymentStatus: "pending" | "paid" | "cancelled";
        createdBy: import("mongoose").Types.ObjectId;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }> & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateSalePaymentStatus: (id: string, paymentStatus: string) => Promise<(import("mongoose").Document<unknown, {}, TPrintingSale, {}, {}> & TPrintingSale & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteSale: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TPrintingSale, {}, {}> & TPrintingSale & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=printing-sale.service.d.ts.map