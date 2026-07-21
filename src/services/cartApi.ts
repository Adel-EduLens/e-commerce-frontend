import { api } from '../lib/axios'
import type { AddCartItemPayload } from '../types/cart'

export const cartApi = {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  },

  async addProductToCart(payload: AddCartItemPayload) {
    const response = await api.post('/cart/items', payload)
    return response.data
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
