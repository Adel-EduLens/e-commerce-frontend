import { createBrowserRouter, Navigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import AccountLayout from "../layouts/AccountLayout";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/shop/HomePage";
import ProductDetailsPage from "../pages/shop/ProductDetailsPage";
import MenCollectionPage from "../pages/shop/MenCollectionPage";
import BagPage from "../pages/cart/BagPage";
import WholesaleBagPage from "../pages/cart/WholesaleBagPage";
import ContactDetailsPage from "../pages/user/ContactDetailsPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import NotifyMeListPage from "../pages/user/NotifyMeListPage";
import SettingsPage from "../pages/user/SettingsPage";
import AuthPage from "../pages/auth/AuthPage";
import WholesaleCheckoutPage from "../pages/cart/WholesaleCheckoutPage";


import TraderDashboard from "../pages/dashboards/trader/TraderDashboard";
import TraderCustomersPage from "../pages/dashboards/trader/TraderCustomersPage";
import TraderOrdersPage from "../pages/dashboards/trader/TraderOrdersPage";
import TraderInventoryPage from "../pages/dashboards/trader/TraderInventoryPage";
import TraderFinancePage from "../pages/dashboards/trader/TraderFinancePage";
import TraderAnalyticsPage from "../pages/dashboards/trader/TraderAnalyticsPage";
import TraderDropshippingPage from "../pages/dashboards/trader/TraderDropshippingPage";
import TraderWholesalePage from "../pages/dashboards/trader/TraderWholesalePage";
import TraderBrandPartnersPage from "../pages/dashboards/trader/TraderBrandPartnersPage";
import TraderNotificationsPage from "../pages/dashboards/trader/TraderNotificationsPage";
import TraderStoreSettingsPage from "../pages/dashboards/trader/TraderStoreSettingsPage";
import TraderPreferencesPage from "../pages/dashboards/trader/TraderPreferencesPage";
import TraderRentalPage from "../pages/dashboards/trader/TraderRentalPage";
import TraderLayout from "../components/layout/TraderLayout";
import TraderCouponsPage from "../pages/dashboards/trader/TraderCouponsPage";
import UserDashboard from "../pages/dashboards/user/UserDashboard";
import RecentlyViewedPage from "../pages/shop/RecentlyViewedPage";
import MyOrdersPage from "../pages/user/MyOrdersPage";
import MyGiftCardsPage from "../pages/user/MyGiftCardsPage";
import HelpCenterPage from "../pages/help/HelpCenterPage";
import WalletRewardsPage from "../pages/user/WalletRewardsPage";
import CheckoutPage from "../pages/cart/CheckoutPage";
import DropshippingPage from "../pages/dropshipping/DropshippingPage";
import FavoritesPage from "../pages/shop/FavoritesPage";
import WholesalePage from "../pages/wholesale/WholesalePage";
import WholesaleDetailsPage from "../pages/wholesale/WholesaleDetailsPage";
import DesignLabPage from "../pages/custom-design/DesignLabPage";
import ProtectedRoute from "../components/ProtectedRoute";

import TestPage from "../pages/dev/TestPage";
import HelpCenterCategorie from "../pages/help/HelpCenterCategorie";
import TraderDesignPage from "../pages/dashboards/trader/TraderDesignPage";
import TraderLoginPage from "../pages/auth/TraderLoginPage";

import ProductsPage from "../pages/shop/ProductsPage";
import RentalPage from "../pages/rental/RentalPage";
import RentalProductDetailsPage from "../pages/rental/RentalProductDetailsPage";

import ComparePage from "../pages/shop/ComparePage";

import TraderCategoriesPage from "../pages/dashboards/trader/TraderCategoriesPage";
import TraderWebsiteSettingsPage from "../pages/dashboards/trader/TraderWebsiteSettingsPage";

import CreateYourDesignPage from "../pages/custom-design/CreateYourDesignPage";
import CreateYourDesignDetailPage from "../pages/custom-design/CreateYourDesignDetailPage";

import TraderRentalProductsPage from "../pages/dashboards/trader/TraderRentalProductsPage";
import TraderCollectionsPage from "../pages/dashboards/trader/TraderCollectionsPage";
import TraderBlankProductsPage from "../pages/dashboards/trader/TraderBlankProductsPage";
import RentalShopPage from "../pages/rental/RentalShopPage";

import InfluencerLoginPage from "../pages/auth/InfluencerLoginPage";
import InfluencerLayout from "../components/layout/InfluencerLayout";
import InfluencerDashboard from "../pages/dashboards/influencer/InfluencerDashboard";
import InfluencerCouponUsersPage from "../pages/dashboards/influencer/InfluencerCouponUsersPage";
import InfluencerEarningsPage from "../pages/dashboards/influencer/InfluencerEarningsPage";
import TraderInfluencersPage from "../pages/dashboards/trader/TraderInfluencersPage";
import TraderShopPage from "../pages/dashboards/trader/TraderShopPage";
import GiftCardDetailsPage from "../pages/shop/GiftCardDetailsPage";
import PrizeWheel from "../components/ui/PrizeWheel";
import PrizeControllerPage from "../pages/dashboards/trader/PrizeControllerPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: (
          <UserLayout>
            <HomePage />
          </UserLayout>
        ),
      },
      {
        path: "trader/login",
        element: <TraderLoginPage />,
      },
      {
        path: "product-details/:id",
        element: (
          <UserLayout>
            <ProductDetailsPage />
          </UserLayout>
        ),
      },
      {
        path: "giftcard/:id",
        element: (
          <UserLayout>
            <GiftCardDetailsPage />
          </UserLayout>
        ),
      },
      {
        path: "gift-card/:id",
        element: (
          <UserLayout>
            <GiftCardDetailsPage />
          </UserLayout>
        ),
      },
      // {
      //   path: "season-must-haves",
      //   element: (
      //     <UserLayout>
      //       <SeasonMustHavesPage />
      //     </UserLayout>
      //   ),
      // },
      {
        path: "products",
        element: (
          <UserLayout>
            <ProductsPage />
          </UserLayout>
        ),
      },
      {
        path: "createYourDesign",
        element: (
          <UserLayout>
            <CreateYourDesignPage />
          </UserLayout>
        ),
      },
      {
        path: "/createYourDesign/:id",
        element: (
          <UserLayout>
            <CreateYourDesignDetailPage />
          </UserLayout>
        ),
      },
      {
        path: "compare",
        element: (
          <UserLayout>
            <ComparePage />
          </UserLayout>
        ),
      },
      {
        path: "rental",
        element: (
          <UserLayout>
            <RentalPage />
          </UserLayout>
        ),
      },
      {
        path: "rental/shop",
        element: (
          <UserLayout>
            <RentalShopPage />
          </UserLayout>
        ),
      },
      {
        path: "rental/shop/:id",
        element: (
          <UserLayout>
            <RentalProductDetailsPage />
          </UserLayout>
        ),
      },
      {
        path: "collections/:category",
        element: (
          <UserLayout>
            <MenCollectionPage />
          </UserLayout>
        ),
      },
      {
        path: "bag",
        element: (
          <UserLayout>
            <BagPage />
          </UserLayout>
        ),
      },
      {
        path: "wholesale-bag",
        element: (
          <UserLayout>
            <WholesaleBagPage />
          </UserLayout>
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
            element: <UserDashboard />,
          },
          {
            path: "prize-wheel",
            element: <PrizeWheel />,
          },
          {
            path: "recently-viewed",
            element: <RecentlyViewedPage />,
          },
          {
            path: "contact-details",
            element: <ContactDetailsPage />,
            handle: {
              footer: {
                top: "top-0",
                style: { top: 970 },
              },
            },
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
            handle: {
              footer: {
                top: "top-[863px]",
              },
            },
          },
          {
            path: "notify-me-list",
            element: <NotifyMeListPage />,
            handle: {
              footer: {
                top: "top-[863px]",
              },
            },
          },
          {
            path: "settings",
            element: <SettingsPage />,
            handle: {
              footer: {
                top: "top-[917px]",
              },
            },
          },
          {
            path: "my-orders",
            element: <MyOrdersPage />,
            handle: {
              footer: {
                top: "top-[950px]",
              },
            },
          },
          {
            path: "my-gift-cards",
            element: <MyGiftCardsPage />,
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
                element: <HelpCenterPage />,
              },
              {
                path: ":category",
                element: <HelpCenterCategorie />,
              },
            ],
          },
          {
            path: "wallet-rewards",
            element: <WalletRewardsPage />,
            handle: {
              footer: {
                top: "top-[894px]",
              },
            },
          },
        ],
      },
      ...(import.meta.env.DEV
        ? [{ path: "random", element: <TestPage /> }]
        : []),
      {
        path: "login",
        element: <AuthPage mode="login" />,
      },
      {
        path: "signup",
        element: <AuthPage mode="signup" />,
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
            element: <TraderDashboard />,
          },
          {
            path: "rental",
            element: <TraderRentalPage />,
          },
          {
            path: "blank-products",
            element: <TraderBlankProductsPage />
          },
          {
            path: "categories",
            element: <TraderCategoriesPage />,
          },
          {
            path: "faqs",
            element: <TraderWebsiteSettingsPage defaultTab="faqs" />,
          },
          {
            path: "rentalProducts",
            element: <TraderRentalProductsPage />,
          },
          {
            path: "products",
            element: <TraderShopPage />
          },
          {
            path: "coupons",
            element: <TraderCouponsPage />,
          },
          {
            path: "customers",

            element: <TraderCustomersPage />,
          },
          {
            path: "shop-banner",
            element: <TraderWebsiteSettingsPage defaultTab="shop-banners" />,
          },
          {
            path: "home-banner",
            element: <TraderWebsiteSettingsPage defaultTab="home-banners" />,
          },
          {
            path: "orders",
            element: <TraderOrdersPage />,
          },
          {
            path: "collections",
            element: <TraderCollectionsPage />,
          },
          {
            path: "influencers",
            element: <TraderInfluencersPage />,
          },
          {
            path: "inventory",
            element: <TraderInventoryPage />,
          },
          {
            path: "finance",
            element: <TraderFinancePage />,
          },
          {
            path: "analytics",
            element: <TraderAnalyticsPage />,
          },
          {
            path: "dropshipping",
            element: <TraderDropshippingPage />,
          },
          {
            path: "wholesale",
            element: <Navigate to="/dashboard/trader/orders?tab=wholesale" replace />,
          },
          {
            path: "brand-partners",
            element: <TraderBrandPartnersPage />,
          },
          {
            path: "notifications",
            element: <TraderNotificationsPage />,
          },
          {
            path: "settings",
            element: <TraderStoreSettingsPage />,
          },
          {
            path: "help-center",
            element: <TraderWebsiteSettingsPage defaultTab="help-center" />,
          },
          {
            path: "website-settings",
            element: <TraderWebsiteSettingsPage />,
          },
          {
            path: "preferences",
            element: <TraderPreferencesPage />,
          },
          {
            path: "designs",
            element: <TraderDesignPage />,
          },
          {
            path: "prizes",
            element: <PrizeControllerPage />,
          },
        ],
      },
      {
        path: "influencer/login",
        element: <InfluencerLoginPage />,
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
            element: <InfluencerDashboard />,
          },
          {
            path: "coupon-users",
            element: <InfluencerCouponUsersPage />,
          },
          {
            path: "earnings",
            element: <InfluencerEarningsPage />,
          },
        ],
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <UserLayout>
              <CheckoutPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "wholesale-checkout",
        element: (
          <ProtectedRoute>
            <UserLayout>
              <WholesaleCheckoutPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "dropshipping",
        element: (
          <UserLayout>
            <DropshippingPage />
          </UserLayout>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <UserLayout>
              <FavoritesPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "wholesale",
        element: (
          <UserLayout>
            <WholesalePage />
          </UserLayout>
        ),
      },
      {
        path: "wholesale/:id",
        element: (
          <ProtectedRoute>
            <UserLayout>
              <WholesaleDetailsPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "design-lab",
        element: (
          <UserLayout>
            <DesignLabPage />
          </UserLayout>
        ),
      },
    ],
  },
]);
