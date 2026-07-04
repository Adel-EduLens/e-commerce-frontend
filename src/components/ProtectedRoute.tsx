import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'user' | 'trader' | 'admin'>
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  console.log('[ProtectedRoute]', { isAuthenticated, role: user?.role, allowedRoles })

  if (!isAuthenticated || !user) {
    const fallbackRoute = allowedRoles?.includes('admin')
      ? '/dashboard/admin/login'
      : '/login'
    return <Navigate to={fallbackRoute} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
