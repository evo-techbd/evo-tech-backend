interface TPasswordResetToken {
    email: string;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
}
export declare const PasswordResetToken: import("mongoose").Model<TPasswordResetToken, {}, {}, {}, import("mongoose").Document<unknown, {}, TPasswordResetToken, {}, {}> & TPasswordResetToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=passwordResetToken.model.d.ts.map