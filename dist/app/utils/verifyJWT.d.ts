import { JwtPayload, Secret } from "jsonwebtoken";
export interface AuthJwtPayload extends JwtPayload {
    _id: string;
    email: string;
    role: string;
    uuid?: string;
}
export declare const createToken: (jwtPayload: AuthJwtPayload, secret: Secret, expiresIn: string) => string;
export declare const verifyToken: (token: string, secret: Secret) => AuthJwtPayload;
//# sourceMappingURL=verifyJWT.d.ts.map