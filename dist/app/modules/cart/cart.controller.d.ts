export declare const CartControllers: {
    getCart: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    addToCart: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    updateCartItem: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    removeCartItem: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    clearCart: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
};
export declare const WishlistControllers: {
    getWishlist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    addToWishlist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    removeFromWishlist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    clearWishlist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=cart.controller.d.ts.map