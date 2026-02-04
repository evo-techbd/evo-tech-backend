import { Request, Response } from "express";
export declare const PaymentControllers: {
    createBkashPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    executeBkashPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    queryBkashPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    handleBkashCallback: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    handleBkashWebhook: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=payment.controller.d.ts.map