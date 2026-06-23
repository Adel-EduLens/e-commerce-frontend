export interface User {
  id: string
  name?: string
  email?: string
  role?: string
  avatar?: string
  [key: string]: unknown
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
