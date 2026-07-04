import { Eye, EyeOff, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../../lib/axios'
import { useAuthStore } from '../../store/useAuthStore'
import { AxiosError } from 'axios'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { setAuth, user } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') navigate('/dashboard/admin')
  }, [user, navigate])

  if (user?.role === 'admin') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
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
      if (error instanceof AxiosError) {
        if (!error.response) {
          toast.error('Network error. Please check your connection.')
        } else if (error.response.status === 401) {
          toast.error('Invalid email or password')
        } else {
          toast.error('Server error. Please try again later.')
        }
      } else {
        toast.error('An unexpected error occurred')
      }
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
