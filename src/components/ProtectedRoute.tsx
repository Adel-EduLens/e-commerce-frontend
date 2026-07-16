import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'user' | 'trader' | 'influencer'>
}

type roles = 'user' | 'trader' | 'influencer'

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {


  const { isAuthenticated, user, _hasHydrated } = useAuthStore()

  if (!_hasHydrated) return null

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role as roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
