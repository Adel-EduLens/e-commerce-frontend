import { Suspense, lazy, type ComponentType, type ReactElement } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ProtectedRoute from "../components/ProtectedRoute";
import InfluencerLayout from "../components/layout/InfluencerLayout";
import TraderLayout from "../components/layout/TraderLayout";
import AccountLayout from "../layouts/AccountLayout";
import StudentLayout from "../layouts/StudentLayout";
import UserLayout from "../layouts/UserLayout";

type LazyPageLoader<P extends object = Record<string, never>> = () => Promise<{
  default: ComponentType<P>;
}>;

const RouteFallback = () => (
  <LoadingSpinner containerClassName="min-h-[40vh]" className="h-8 w-8" />
);

const renderLazyPage = <P extends object>(
  load: LazyPageLoader<P>,
  props?: P,
): ReactElement => {
  const Page = lazy(load);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Page {...((props ?? {}) as P)} />
    </Suspense>
  );
};

const renderUserPage = <P extends object>(
  load: LazyPageLoader<P>,
  props?: P,
): ReactElement => <UserLayout>{renderLazyPage(load, props)}</UserLayout>;

const renderProtectedUserPage = <P extends object>(
  load: LazyPageLoader<P>,
  props?: P,
): ReactElement => (
  <ProtectedRoute>{renderUserPage(load, props)}</ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: renderUserPage(() => import("../pages/shop/HomePage")),
      },
      {
        path: "trader/login",
        element: renderLazyPage(() => import("../pages/auth/TraderLoginPage")),
      },
      {
        path: "product-details/:id",
        element: renderUserPage(
          () => import("../pages/shop/ProductDetailsPage"),
        ),
      },
      {
        path: "giftcard/:id",
        element: renderUserPage(
          () => import("../pages/shop/GiftCardDetailsPage"),
        ),
      },
      {
        path: "gift-card/:id",
        element: renderUserPage(
          () => import("../pages/shop/GiftCardDetailsPage"),
        ),
      },
      {
        path: "products",
        element: renderUserPage(() => import("../pages/shop/ProductsPage")),
      },
      {
        path: "createYourDesign",
        element: renderUserPage(
          () => import("../pages/custom-design/CreateYourDesignPage"),
        ),
      },
      {
        path: "/createYourDesign/:id",
        element: renderUserPage(
          () => import("../pages/custom-design/CreateYourDesignDetailPage"),
        ),
      },
      {
        path: "compare",
        element: renderUserPage(() => import("../pages/shop/ComparePage")),
      },
      {
        path: "rental",
        element: renderUserPage(() => import("../pages/rental/RentalPage")),
      },
      {
        path: "rental/shop",
        element: renderUserPage(() => import("../pages/rental/RentalShopPage")),
      },
      {
        path: "rental/shop/:id",
        element: renderUserPage(
          () => import("../pages/rental/RentalProductDetailsPage"),
        ),
      },
      {
        path: "collections/:category",
        element: renderUserPage(
          () => import("../pages/shop/MenCollectionPage"),
        ),
      },
      {
        path: "bag",
        element: renderUserPage(() => import("../pages/cart/BagPage")),
      },
      {
        path: "wholesale-bag",
        element: renderUserPage(
          () => import("../pages/cart/WholesaleBagPage"),
        ),
      },
      {
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard/user",
            element: renderLazyPage(
              () => import("../pages/dashboards/user/UserDashboard"),
            ),
          },
          {
            path: "prize-wheel",
            element: renderLazyPage(() => import("../components/ui/PrizeWheel")),
          },
          {
            path: "recently-viewed",
            element: renderLazyPage(
              () => import("../pages/shop/RecentlyViewedPage"),
            ),
          },
          {
            path: "contact-details",
            element: renderLazyPage(
              () => import("../pages/user/ContactDetailsPage"),
            ),
            handle: {
              footer: {
                top: "top-0",
                style: { top: 970 },
              },
            },
          },
          {
            path: "notifications",
            element: renderLazyPage(
              () => import("../pages/user/NotificationsPage"),
            ),
            handle: {
              footer: {
                top: "top-[863px]",
              },
            },
          },
          {
            path: "notify-me-list",
            element: renderLazyPage(
              () => import("../pages/user/NotifyMeListPage"),
            ),
            handle: {
              footer: {
                top: "top-[863px]",
              },
            },
          },
          {
            path: "settings",
            element: renderLazyPage(() => import("../pages/user/SettingsPage")),
            handle: {
              footer: {
                top: "top-[917px]",
              },
            },
          },
          {
            path: "my-orders",
            element: renderLazyPage(() => import("../pages/user/MyOrdersPage")),
            handle: {
              footer: {
                top: "top-[950px]",
              },
            },
          },
          {
            path: "my-gift-cards",
            element: renderLazyPage(
              () => import("../pages/user/MyGiftCardsPage"),
            ),
            handle: {
              footer: {
                top: "top-[917px]",
              },
            },
          },
          {
            path: "help-center",
            children: [
              {
                index: true,
                element: renderLazyPage(
                  () => import("../pages/help/HelpCenterPage"),
                ),
              },
              {
                path: ":category",
                element: renderLazyPage(
                  () => import("../pages/help/HelpCenterCategorie"),
                ),
              },
            ],
          },
          {
            path: "wallet-rewards",
            element: renderLazyPage(
              () => import("../pages/user/WalletRewardsPage"),
            ),
            handle: {
              footer: {
                top: "top-[894px]",
              },
            },
          },
        ],
      },
      ...(import.meta.env.DEV
        ? [
            {
              path: "random",
              element: renderLazyPage(() => import("../pages/dev/TestPage")),
            },
          ]
        : []),
      {
        path: "login",
        element: renderLazyPage(() => import("../pages/auth/AuthPage"), {
          mode: "login",
        }),
      },
      {
        path: "signup",
        element: renderLazyPage(() => import("../pages/auth/AuthPage"), {
          mode: "signup",
        }),
      },
      {
        path: "terms",
        element: renderLazyPage(() => import("../pages/terms/TermsPage")),
      },
      {
        path: "privacy",
        element: renderLazyPage(() => import("../pages/privacy/PrivacyPage")),
      },
      {
        path: "dashboard/trader",
        element: (
          <ProtectedRoute allowedRoles={["trader"]}>
            <TraderLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderDashboard"),
            ),
          },
          {
            path: "rental",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderRentalPage"),
            ),
          },
          {
            path: "blank-products",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderBlankProductsPage"),
            ),
          },
          {
            path: "categories",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderCategoriesPage"),
            ),
          },
          {
            path: "faqs",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderWebsiteSettingsPage"),
              { defaultTab: "faqs" },
            ),
          },
          {
            path: "rentalProducts",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderRentalProductsPage"),
            ),
          },
          {
            path: "products",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderShopPage"),
            ),
          },
          {
            path: "coupons",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderCouponsPage"),
            ),
          },
          {
            path: "customers",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderCustomersPage"),
            ),
          },
          {
            path: "shop-banner",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderWebsiteSettingsPage"),
              { defaultTab: "shop-banners" },
            ),
          },
          {
            path: "home-banner",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderWebsiteSettingsPage"),
              { defaultTab: "home-banners" },
            ),
          },
          {
            path: "orders",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderOrdersPage"),
            ),
          },
          {
            path: "collections",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderCollectionsPage"),
            ),
          },
          {
            path: "influencers",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderInfluencersPage"),
            ),
          },
          {
            path: "inventory",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderInventoryPage"),
            ),
          },
          {
            path: "finance",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderFinancePage"),
            ),
          },
          {
            path: "analytics",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderAnalyticsPage"),
            ),
          },
          {
            path: "dropshipping",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderDropshippingPage"),
            ),
          },
          {
            path: "wholesale",
            element: (
              <Navigate to="/dashboard/trader/orders?tab=wholesale" replace />
            ),
          },
          {
            path: "brand-partners",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderBrandPartnersPage"),
            ),
          },
          {
            path: "notifications",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderNotificationsPage"),
            ),
          },
          {
            path: "settings",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderStoreSettingsPage"),
            ),
          },
          {
            path: "help-center",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderWebsiteSettingsPage"),
              { defaultTab: "help-center" },
            ),
          },
          {
            path: "website-settings",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderWebsiteSettingsPage"),
            ),
          },
          {
            path: "preferences",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/trader/TraderPreferencesPage"),
            ),
          },
          {
            path: "designs",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/TraderDesignPage"),
            ),
          },
          {
            path: "prizes",
            element: renderLazyPage(
              () => import("../pages/dashboards/trader/PrizeControllerPage"),
            ),
          },
        ],
      },
      {
        path: "influencer/login",
        element: renderLazyPage(
          () => import("../pages/auth/InfluencerLoginPage"),
        ),
      },
      {
        path: "dashboard/influencer",
        element: (
          <ProtectedRoute allowedRoles={["influencer"]}>
            <InfluencerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: renderLazyPage(
              () => import("../pages/dashboards/influencer/InfluencerDashboard"),
            ),
          },
          {
            path: "coupon-users",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/influencer/InfluencerCouponUsersPage"),
            ),
          },
          {
            path: "earnings",
            element: renderLazyPage(
              () =>
                import("../pages/dashboards/influencer/InfluencerEarningsPage"),
            ),
          },
        ],
      },
      {
        path: "checkout",
        element: renderProtectedUserPage(
          () => import("../pages/cart/CheckoutPage"),
        ),
      },
      {
        path: "wholesale-checkout",
        element: renderProtectedUserPage(
          () => import("../pages/cart/WholesaleCheckoutPage"),
        ),
      },
      {
        path: "dropshipping",
        element: renderUserPage(
          () => import("../pages/dropshipping/DropshippingPage"),
        ),
      },
      {
        path: "favorites",
        element: renderProtectedUserPage(
          () => import("../pages/shop/FavoritesPage"),
        ),
      },
      {
        path: "wholesale",
        element: renderUserPage(() => import("../pages/wholesale/WholesalePage")),
      },
      {
        path: "wholesale/:id",
        element: renderProtectedUserPage(
          () => import("../pages/wholesale/WholesaleDetailsPage"),
        ),
      },
      {
        path: "design-lab",
        element: renderUserPage(
          () => import("../pages/custom-design/DesignLabPage"),
        ),
      },
    ],
  },
]);
