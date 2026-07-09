import { api } from '../lib/axios'

export const recentlyViewedApi = {
  async getRecentlyViewed() {
    const response = await api.get('/recently-viewed')
    return response.data
  },

  async addRecentlyViewed(payload: { productType: string; productId: number | string }) {
    const response = await api.post('/recently-viewed/add', payload)
    return response.data
  },
}

export default recentlyViewedApi
