import { z } from "zod";
export declare const registerValidation: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        newsletterOptIn: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        phone?: string | undefined;
        newsletterOptIn?: boolean | undefined;
    }, {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        phone?: string | undefined;
        newsletterOptIn?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        phone?: string | undefined;
        newsletterOptIn?: boolean | undefined;
    };
}, {
    body: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        phone?: string | undefined;
        newsletterOptIn?: boolean | undefined;
    };
}>;
export declare const loginValidation: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const forgotPasswordValidation: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
    };
}, {
    body: {
        email: string;
    };
}>;
export declare const resetPasswordValidation: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        token: string;
    }, {
        password: string;
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        token: string;
    };
}, {
    body: {
        password: string;
        token: string;
    };
}>;
export declare const AuthValidation: {
    registerValidation: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            phone: z.ZodOptional<z.ZodString>;
            newsletterOptIn: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            phone?: string | undefined;
            newsletterOptIn?: boolean | undefined;
        }, {
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            phone?: string | undefined;
            newsletterOptIn?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            phone?: string | undefined;
            newsletterOptIn?: boolean | undefined;
        };
    }, {
        body: {
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            phone?: string | undefined;
            newsletterOptIn?: boolean | undefined;
        };
    }>;
    loginValidation: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            password: string;
        };
    }>;
    forgotPasswordValidation: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
        }, {
            email: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
        };
    }, {
        body: {
            email: string;
        };
    }>;
    resetPasswordValidation: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            password: string;
            token: string;
        }, {
            password: string;
            token: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            password: string;
            token: string;
        };
    }, {
        body: {
            password: string;
            token: string;
        };
    }>;
};
//# sourceMappingURL=auth.validation.d.ts.map