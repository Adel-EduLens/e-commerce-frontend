import { api } from '../lib/axios'
import type { AddRetailCartPayload, AddCartItemPayload } from '../types/cart'

export const cartApi = {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  },

  async addProductToCart(payload: AddCartItemPayload) {
    const response = await api.post('/cart/items', payload)
    return response.data
  },

  async addRetailProductToCart(payload: AddRetailCartPayload) {
    try {
      const response = await api.post('/cart/retail-items', payload)
      return response.data
    } catch (error) {
      // Fallback to unified cart endpoint if the backend uses a shared cart API.
      const response = await api.post('/cart/items', payload)
      return response.data
    }
  },

  async updateCartItem(itemId: string | number, quantity: number) {
    const response = await api.patch(`/cart/items/${itemId}`, { quantity })
    return response.data
  },

  async removeCartItem(itemId: string | number) {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },

  async clearCart() {
    return api.delete('/cart/items')
  },
}
