import { createBrowserRouter } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import AccountLayout from '../layouts/AccountLayout'
import UserLayout from '../layouts/UserLayout'
import HomePage from '../pages/HomePage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import SeasonMustHavesPage from '../pages/SeasonMustHavesPage'
import MenCollectionPage from '../pages/MenCollectionPage'
import BagPage from '../pages/BagPage'
import ContactDetailsPage from '../pages/ContactDetailsPage'
import NotificationsPage from '../pages/NotificationsPage'
import NotifyMeListPage from '../pages/NotifyMeListPage'
import SettingsPage from '../pages/SettingsPage'
import AuthPage from '../pages/AuthPage'
import AdminDashboard from '../pages/dashboards/AdminDashboard'
import PrizeControllerPage from '../pages/dashboards/PrizeControllerPage'
import TraderDashboard from '../pages/dashboards/TraderDashboard'
import UserDashboard from '../pages/dashboards/UserDashboard'
import MyOrdersPage from '../pages/MyOrdersPage'
import HelpCenterPage from '../pages/HelpCenterPage'
import WalletRewardsPage from '../pages/WalletRewardsPage'
import CheckoutPage from '../pages/CheckoutPage'
import DropshippingPage from '../pages/DropshippingPage'
import FavoritesPage from '../pages/FavoritesPage'
import WholesalePage from '../pages/WholesalePage'
import DesignLabPage from '../pages/DesignLabPage'
import ProtectedRoute from '../components/ProtectedRoute'

import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminLayout from '../layouts/AdminLayout'

import PrizeWheel from '../pages/TestPage'

export const router = createBrowserRouter([
  {
    path: '/',
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
        path: 'product-details',
        element: (
          <UserLayout>
            <ProductDetailsPage />
          </UserLayout>
        ),
      },
      {
        path: 'season-must-haves',
        element: (
          <UserLayout>
            <SeasonMustHavesPage />
          </UserLayout>
        ),
      },
      {
        path: 'collections/:category',
        element: (
          <UserLayout>
            <MenCollectionPage />
          </UserLayout>
        ),
      },
      {
        path: 'bag',
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
            path: 'contact-details',
            element: <ContactDetailsPage />,
            handle: {
              footer: {
                top: 'top-0',
                style: { top: 970 },
              },
            },
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
            handle: {
              footer: {
                top: 'top-[863px]',
              },
            },
          },
          {
            path: 'notify-me-list',
            element: <NotifyMeListPage />,
            handle: {
              footer: {
                top: 'top-[863px]',
              },
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            handle: {
              footer: {
                top: 'top-[917px]',
              },
            },
          },
          {
            path: 'my-orders',
            element: <MyOrdersPage />,
            handle: {
              footer: {
                top: 'top-[950px]',
              },
            },
          },
          {
            path: 'help-center',
            element: <HelpCenterPage />,
            handle: {
              footer: {
                top: 'top-[917px]',
              },
            },
          },
          {
            path: 'wallet-rewards',
            element: <WalletRewardsPage />,
            handle: {
              footer: {
                top: 'top-[894px]',
              },
            },
          },
        ],
      },
      {
        path: 'random',
        element: <PrizeWheel />,
      },
      {
        path: 'login',
        element: <AuthPage mode="login" />,
      },
      {
        path: 'signup',
        element: <AuthPage mode="signup" />,
      },
      {
        path: 'dashboard/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/admin/login',
        element: <AdminLoginPage />,
      },
      {
        path: 'dashboard/admin/prizes',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <PrizeControllerPage />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/trader',
        element: (
          <ProtectedRoute allowedRoles={['trader']}>
            <TraderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/user',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <UserLayout>
              <CheckoutPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dropshipping',
        element: (
          <ProtectedRoute>
            <UserLayout>
              <DropshippingPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <UserLayout>
              <FavoritesPage />
            </UserLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'wholesale',
        element: (
          <ProtectedRoute>
            <UserLayout>
              <WholesalePage />
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
])
