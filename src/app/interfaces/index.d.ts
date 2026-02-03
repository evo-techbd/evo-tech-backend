import { AuthJwtPayload } from "../utils/verifyJWT";

declare global {
  namespace Express {
    interface Request {
      user: AuthJwtPayload & { userType?: string };
    }
  }
}
