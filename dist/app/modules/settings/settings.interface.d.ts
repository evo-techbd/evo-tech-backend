import { Document } from "mongoose";
export interface IDeliveryChargeSettings extends Document {
    insideDhakaCharge: number;
    outsideDhakaCharge: number;
    additionalChargePerKg: number;
    expressInsideDhakaCharge: number;
    expressOutsideDhakaCharge: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IContactSettings extends Document {
    email: string;
    phones: string[];
    whatsapp: string;
    address: string;
    businessHours: string;
    mapUrl: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=settings.interface.d.ts.map