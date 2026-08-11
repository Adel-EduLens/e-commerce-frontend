import axios from 'axios'
import { env } from '../config/env'
import { useAuthStore } from '../store/useAuthStore'

export const api = axios.create({
  baseURL: env.API_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.token = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login')
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
