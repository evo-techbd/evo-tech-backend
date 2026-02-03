import { NextFunction, Request, Response } from "express";
declare const auth: (...requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map