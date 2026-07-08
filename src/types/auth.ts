export interface User {
  id: string
  name?: string
  email?: string
  role: 'user' | 'trader' | 'admin'
  avatar?: string
  phone?: string
  address?: string
  createdAt: string
  status: 'active' | 'suspended'
}
export interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  updateUser: (user: User) => void
  clearAuth: () => void
  getToken: () => string | null
}
