import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { SubcategoryRoutes } from "../modules/subcategory/subcategory.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { OrderRoutes } from "../modules/order/order.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { BannerRoutes } from "../modules/banner/banner.route";
import { ClientRoutes } from "../modules/client/client.route";
import { LandingSectionRoutes } from "../modules/landingsection/landingsection.route";
import { PermissionRoutes } from "../modules/permission/permission.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { TermsRoutes } from "../modules/terms/terms.route";
import { PrivacyRoutes } from "../modules/privacy/privacy.route";
import { WarrantyRoutes } from "../modules/warranty/warranty.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { FinanceRoutes } from "../modules/finance/finance.route";
import { TaxonomyRoutes } from "../modules/taxonomy/taxonomy.route";
import { PageContentRoutes } from "../modules/page-content/page-content.route";
import { FaqRoutes } from "../modules/faq/faq.route";

const router = express.Router();
const adminRouter = express.Router();

// Admin prefix aliases to match frontend expectations
adminRouter.use("/taxonomy", TaxonomyRoutes);
adminRouter.use("/taxonomy/categories", CategoryRoutes);
adminRouter.use("/taxonomy/subcategories", SubcategoryRoutes);
adminRouter.use("/taxonomy/brands", BrandRoutes);
adminRouter.use("/products", ProductRoutes);
adminRouter.use("/orders", OrderRoutes);
adminRouter.use("/users", UserRoutes);
adminRouter.use("/banners", BannerRoutes);
adminRouter.use("/coupons", CouponRoutes);
adminRouter.use("/dashboard", DashboardRoutes);
adminRouter.use("/finance", FinanceRoutes);

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/brands",
    route: BrandRoutes,
  },
  {
    path: "/subcategories",
    route: SubcategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/shopping",
    route: CartRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/banners",
    route: BannerRoutes,
  },
  {
    path: "/clients",
    route: ClientRoutes,
  },
  {
    path: "/landing-sections",
    route: LandingSectionRoutes,
  },
  {
    path: "/permissions",
    route: PermissionRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/terms",
    route: TermsRoutes,
  },
  {
    path: "/privacy",
    route: PrivacyRoutes,
  },
  {
    path: "/warranty",
    route: WarrantyRoutes,
  },
  {
    path: "/",
    route: ReviewRoutes,
  },
  {
    path: "/taxonomy",
    route: TaxonomyRoutes,
  },
  {
    path: "/page-content",
    route: PageContentRoutes,
  },
  {
    path: "/faqs",
    route: FaqRoutes,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
