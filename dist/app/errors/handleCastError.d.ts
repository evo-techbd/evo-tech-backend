import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.interface";
declare const handleCastError: (err: mongoose.Error.CastError) => TGenericErrorResponse;
export default handleCastError;
//# sourceMappingURL=handleCastError.d.ts.map