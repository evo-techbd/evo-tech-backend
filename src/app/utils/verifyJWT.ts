import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  role: string;
  uuid?: string;
}

export const createToken = (
  jwtPayload: AuthJwtPayload,
  secret: Secret,
  expiresIn: string
): string => {
  return jwt.sign(jwtPayload as string | object | Buffer, secret as Secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: Secret): AuthJwtPayload => {
  return jwt.verify(token, secret) as AuthJwtPayload;
};
