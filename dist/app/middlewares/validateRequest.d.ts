import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map