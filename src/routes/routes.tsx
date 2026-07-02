import { createBrowserRouter } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import HomePage from '../pages/HomePage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import SeasonMustHavesPage from '../pages/SeasonMustHavesPage'
import BagPage from '../pages/BagPage'
import ContactDetailsPage from '../pages/ContactDetailsPage'
import NotificationsPage from '../pages/NotificationsPage'
import AuthPage from '../pages/AuthPage'
import AdminDashboard from '../pages/dashboards/AdminDashboard'
import TraderDashboard from '../pages/dashboards/TraderDashboard'
import UserDashboard from '../pages/dashboards/UserDashboard'
import MyOrdersPage from '../pages/MyOrdersPage'
import ProtectedRoute from '../components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product-details',
        element: <ProductDetailsPage />,
      },
      {
        path: 'season-must-haves',
        element: <SeasonMustHavesPage />,
      },
      {
        path: 'bag',
        element: <BagPage />,
      },
      {
        path: 'contact-details',
        element: <ContactDetailsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
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
            <AdminDashboard />
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
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
