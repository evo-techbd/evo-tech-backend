export declare const AuthControllers: {
    registerUser: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    loginUser: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    handleOAuthLogin: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    logout: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    refreshToken: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    forgotPassword: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    resetPassword: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    getCurrentUser: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map