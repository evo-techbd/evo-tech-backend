import { TLoginUser, TOAuthUser, TRegisterUser, TForgotPassword, TResetPassword } from "./auth.interface";
export declare const AuthServices: {
    registerUser: (payload: TRegisterUser) => Promise<{
        user: any;
        accessToken: string;
    }>;
    loginUser: (payload: TLoginUser) => Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    handleOAuthUser: (payload: TOAuthUser) => Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    forgotPassword: (payload: TForgotPassword) => Promise<{
        resetToken: string;
        resetLink: string;
        message: string;
    }>;
    resetPassword: (payload: TResetPassword) => Promise<{
        message: string;
    }>;
    getCurrentUser: (userPayload: {
        _id: string;
        email: string;
        role: string;
    }) => Promise<{
        user: import("mongoose").Document<unknown, {}, import("../user/user.interface").TUser, {}, {}> & import("../user/user.interface").TUser & Required<{
            _id: string;
        }> & {
            __v: number;
        };
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map