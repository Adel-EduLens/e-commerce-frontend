import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import AccountLayout from "../layouts/AccountLayout";
import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import SeasonMustHavesPage from "../pages/SeasonMustHavesPage";
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
import UserDashboard from "../pages/dashboards/UserDashboard";
import MyOrdersPage from "../pages/MyOrdersPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import WalletRewardsPage from "../pages/WalletRewardsPage";
import CheckoutPage from "../pages/CheckoutPage";
import DropshippingPage from "../pages/DropshippingPage";
import FavoritesPage from "../pages/FavoritesPage";
import WholesalePage from "../pages/WholesalePage";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminLayout from "../layouts/AdminLayout";

import PrizeWheel from "../pages/TestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "product-details",
        element: <ProductDetailsPage />,
      },
      {
        path: "season-must-haves",
        element: <SeasonMustHavesPage />,
      },
      {
        path: "collections/:category",
        element: <MenCollectionPage />,
      },
      {
        path: "bag",
        element: <BagPage />,
      },
      {
        element: <AccountLayout />,
        children: [
          {
            path: "contact-details",
            element: <ContactDetailsPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "notify-me-list",
            element: <NotifyMeListPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "my-orders",
            element: <MyOrdersPage />,
          },
          {
            path: "help-center",
            element: <HelpCenterPage />,
          },
          {
            path: "wallet-rewards",
            element: <WalletRewardsPage />,
          },
        ],
      },
      {
        path: "random",
        element: <PrizeWheel />,
      },
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
        path: "dashboard/admin/login",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLoginPage />
          </ProtectedRoute>
        ),
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
        path: "dashboard/trader",
        element: (
          <ProtectedRoute allowedRoles={["trader"]}>
            <TraderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/user",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dropshipping",
        element: (
          <ProtectedRoute>
            <DropshippingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "wholesale",
        element: (
          <ProtectedRoute>
            <WholesalePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
