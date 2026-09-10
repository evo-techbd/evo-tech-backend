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
//# sourceMappingURL=settings.interface.d.ts.map