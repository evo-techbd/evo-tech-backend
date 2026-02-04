"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const category_route_1 = require("../modules/category/category.route");
const brand_route_1 = require("../modules/brand/brand.route");
const subcategory_route_1 = require("../modules/subcategory/subcategory.route");
const product_route_1 = require("../modules/product/product.route");
const cart_route_1 = require("../modules/cart/cart.route");
const order_route_1 = require("../modules/order/order.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const banner_route_1 = require("../modules/banner/banner.route");
const client_route_1 = require("../modules/client/client.route");
const landingsection_route_1 = require("../modules/landingsection/landingsection.route");
const permission_route_1 = require("../modules/permission/permission.route");
const payment_route_1 = require("../modules/payment/payment.route");
const coupon_route_1 = require("../modules/coupon/coupon.route");
const notification_route_1 = require("../modules/notification/notification.route");
const terms_route_1 = require("../modules/terms/terms.route");
const review_route_1 = require("../modules/review/review.route");
const finance_route_1 = require("../modules/finance/finance.route");
const taxonomy_route_1 = require("../modules/taxonomy/taxonomy.route");
const router = express_1.default.Router();
const adminRouter = express_1.default.Router();
// Admin prefix aliases to match frontend expectations
adminRouter.use("/taxonomy", taxonomy_route_1.TaxonomyRoutes);
adminRouter.use("/taxonomy/categories", category_route_1.CategoryRoutes);
adminRouter.use("/taxonomy/subcategories", subcategory_route_1.SubcategoryRoutes);
adminRouter.use("/taxonomy/brands", brand_route_1.BrandRoutes);
adminRouter.use("/products", product_route_1.ProductRoutes);
adminRouter.use("/orders", order_route_1.OrderRoutes);
adminRouter.use("/users", user_route_1.UserRoutes);
adminRouter.use("/banners", banner_route_1.BannerRoutes);
adminRouter.use("/coupons", coupon_route_1.CouponRoutes);
adminRouter.use("/dashboard", dashboard_route_1.DashboardRoutes);
adminRouter.use("/finance", finance_route_1.FinanceRoutes);
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/brands",
        route: brand_route_1.BrandRoutes,
    },
    {
        path: "/subcategories",
        route: subcategory_route_1.SubcategoryRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/shopping",
        route: cart_route_1.CartRoutes,
    },
    {
        path: "/orders",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/dashboard",
        route: dashboard_route_1.DashboardRoutes,
    },
    {
        path: "/banners",
        route: banner_route_1.BannerRoutes,
    },
    {
        path: "/clients",
        route: client_route_1.ClientRoutes,
    },
    {
        path: "/landing-sections",
        route: landingsection_route_1.LandingSectionRoutes,
    },
    {
        path: "/permissions",
        route: permission_route_1.PermissionRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/coupons",
        route: coupon_route_1.CouponRoutes,
    },
    {
        path: "/notifications",
        route: notification_route_1.NotificationRoutes,
    },
    {
        path: "/terms",
        route: terms_route_1.TermsRoutes,
    },
    {
        path: "/",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/taxonomy",
        route: taxonomy_route_1.TaxonomyRoutes,
    },
    {
        path: "/admin",
        route: adminRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map