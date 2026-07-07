import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import AccountLayout from "../layouts/AccountLayout";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import MenCollectionPage from "../pages/MenCollectionPage";
import BagPage from "../pages/BagPage";
import ContactDetailsPage from "../pages/ContactDetailsPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotifyMeListPage from "../pages/NotifyMeListPage";
import SettingsPage from "../pages/SettingsPage";
import AuthPage from "../pages/AuthPage";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import PrizeControllerPage from "../pages/dashboards/PrizeControllerPage";
import TraderDashboard from "../pages/dashboards/TraderDashboard";
import TraderProductsPage from "../pages/dashboards/TraderProductsPage";
import TraderCustomersPage from "../pages/dashboards/TraderCustomersPage";
import TraderOrdersPage from "../pages/dashboards/TraderOrdersPage";
import TraderInventoryPage from "../pages/dashboards/TraderInventoryPage";
import TraderFinancePage from "../pages/dashboards/TraderFinancePage";
import TraderAnalyticsPage from "../pages/dashboards/TraderAnalyticsPage";
import TraderDropshippingPage from "../pages/dashboards/TraderDropshippingPage";
import TraderWholesalePage from "../pages/dashboards/TraderWholesalePage";
import TraderBrandPartnersPage from "../pages/dashboards/TraderBrandPartnersPage";
import TraderNotificationsPage from "../pages/dashboards/TraderNotificationsPage";
import TraderStoreSettingsPage from "../pages/dashboards/TraderStoreSettingsPage";
import TraderRetailPage from "../pages/dashboards/TraderRetailPage";
import TraderLayout from "../components/layout/TraderLayout";
import TraderCouponsPage from "../pages/dashboards/TraderCouponsPage";
import UserDashboard from "../pages/dashboards/UserDashboard";
import MyOrdersPage from "../pages/MyOrdersPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import WalletRewardsPage from "../pages/WalletRewardsPage";
import CheckoutPage from "../pages/CheckoutPage";
import DropshippingPage from "../pages/DropshippingPage";
import FavoritesPage from "../pages/FavoritesPage";
import WholesalePage from "../pages/WholesalePage";
import WholesaleDetailsPage from "../pages/WholesaleDetailsPage";
import DesignLabPage from "../pages/DesignLabPage";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminLayout from "../layouts/AdminLayout";

import TestPage from "../pages/TestPage";
import AdminHelpCenterPage from "../pages/admin/AdminHelpCenterPage";
import HelpCenterCategorie from "../pages/HelpCenterCategorie";
import AdminDesignPage from "../pages/admin/AdminDesignPage";
import TraderLoginPage from "../pages/TraderLoginPage";

import ProductsPage from "../pages/ProductsPage";
import RetailPage from "../pages/RetailPage";
import RetailProductDetailsPage from "../pages/RetailProductDetailsPage";

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
        path: "retail",
        element: (
          <UserLayout>
            <RetailPage />
          </UserLayout>
        ),
      },
      {
        path: "retail/:slug",
        element: (
          <UserLayout>
            <RetailProductDetailsPage />
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
        path: "dashboard/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin/help-center",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminHelpCenterPage />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "dashboard/admin/prizes",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <PrizeControllerPage />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/admin/designs",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminDesignPage />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/trader',
        element: (
          <TraderLayout />
        ),
        children: [
          {
            index: true,
            element: <TraderDashboard />,
          },
          {
            path: "retail",
            element: <TraderRetailPage />,
          },
          {
            path: "products",
            element: <TraderProductsPage />,
          },
          {
            path: 'coupons',
            element: <TraderCouponsPage />,
          },
          {
            path: 'customers',

            element: <TraderCustomersPage />,
          },
          {
            path: "orders",
            element: <TraderOrdersPage />,
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
            element: <TraderWholesalePage />,
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
        path: "dropshipping",
        element: (
          <ProtectedRoute>
            <UserLayout>
              <DropshippingPage />
            </UserLayout>
          </ProtectedRoute>
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
          <ProtectedRoute>
            <UserLayout>
              <WholesalePage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'wholesale/:id',
        element: (
          <ProtectedRoute>
            <UserLayout>
              <WholesaleDetailsPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'design-lab',
        element: (
          <UserLayout>
            <DesignLabPage />
          </UserLayout>
        ),
      },
    ],
  },
]);