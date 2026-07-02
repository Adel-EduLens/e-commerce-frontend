import { Eye, EyeOff, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../../lib/axios'
import { useAuthStore } from '../../store/useAuthStore'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated, user } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/dashboard/admin', { replace: true })
    }
  }, [isAuthenticated, navigate, user?.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('/admin/auth/login', {
        email: email.trim(),
        password,
      })

      const { token, admin } = response?.data?.data || {}

      if (!token || !admin) {
        throw new Error('Invalid admin response')
      }

      setAuth(admin, token)
      toast.success('Welcome back, admin')
      navigate('/dashboard/admin', { replace: true })
    } catch (error) {
      console.error('Admin login error:', error)
      toast.error('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter'] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-stroke bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-bold font-['Montserrat']">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-text">
            Access the admin dashboard securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-stroke bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-stroke bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
