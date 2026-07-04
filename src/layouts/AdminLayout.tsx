import { Activity, Award, BarChart2, LogOut, Shield } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Shield className="text-red-500" size={28} />
            <span className="font-extrabold font-['Montserrat'] text-xl tracking-wider">
              ADMIN<span className="text-red-500">PORTAL</span>
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-left transition-colors ${
                isActive('/dashboard/admin')
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-gray-text hover:bg-gray-light'
              }`}
            >
              <Activity size={18} />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/admin/prizes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-left transition-colors ${
                isActive('/dashboard/admin/prizes')
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-gray-text hover:bg-gray-light'
              }`}
            >
              <BarChart2 size={18} />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/admin/prizes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-left transition-colors ${
                isActive('/dashboard/admin/prizes')
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-gray-text hover:bg-gray-light'
              }`}
            >
              <Award size={18} />
              <span>Prize</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/admin/help-center')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-left transition-colors ${
                isActive('/dashboard/admin/help-center')
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-gray-text hover:bg-gray-light'
              }`}
            >
              <Award size={18} />
              <span>Help Center</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl mb-4">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {user?.name || 'Admin'}
              </p>
              <span className="text-xs text-red-500 font-semibold tracking-wider uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 hover:border-red-500/30 hover:bg-red-500/10 text-gray-text hover:text-red-500 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 p-8 overflow-y-auto bg-neutral-900">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
