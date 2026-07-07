import { api } from '../lib/axios'
import type { RetailProduct } from '../types/retail'

const API_PREFIX = '/retail'

function normalizeProductResponse(response: any): RetailProduct | null {
  if (!response) return null
  if (response.product) return response.product
  if (response.data?.product) return response.data.product
  if (response.data) return response.data
  return response
}

export const retailApi = {
  async getRetailProducts(params: Record<string, any> = {}) {
    const response = await api.get(`${API_PREFIX}/products`, { params })
    return response.data
  },

  async getRetailProductById(id: string | number) {
    const response = await api.get(`${API_PREFIX}/products/${id}`)
    return normalizeProductResponse(response.data)
  },

  async getRetailProductBySlug(slug: string) {
    const response = await api.get(`${API_PREFIX}/products/slug/${encodeURIComponent(slug)}`)
    return normalizeProductResponse(response.data)
  },

  async getRetailCategories() {
    const response = await api.get(`${API_PREFIX}/categories`)
    return response.data
  },

  async getRetailNotifyMe(userId?: string | number) {
    if (!userId) return []
    const response = await api.get(`${API_PREFIX}/notify-me/user/${userId}`)
    return response.data
  },

  async createRetailNotifyMe(payload: { retailProductId: string | number; userId?: string | number }) {
    const response = await api.post(`${API_PREFIX}/notify-me`, payload)
    return response.data
  },
}

export default retailApi
