import { api } from '../lib/axios'
import type { WishlistItem, WishlistProductType, WishlistStatusResponse, WishlistToggleResponse } from '../types/wishlist'

export const wishlistApi = {
  async getWishlist() {
    const response = await api.get('/wishlist')

    return response.data
  },

  async getWishlistStatus(productType: WishlistProductType, productId: number | string) {
    const response = await api.get('/wishlist/status', {
      params: { productType, productId },
    })
    return response.data
  },

  async toggleWishlist(payload: { productType: WishlistProductType; productId: number | string }) {
    const response = await api.post('/wishlist/toggle', payload)
    return response.data
  },
}

export type { WishlistItem, WishlistProductType, WishlistStatusResponse, WishlistToggleResponse }
export default wishlistApi
