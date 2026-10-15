import { Request, Response } from "express";
export declare const EpsControllers: {
    initiateEpsPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    handleEpsCallback: (req: Request, res: Response) => Promise<void>;
    verifyEpsPayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=eps.controller.d.ts.map