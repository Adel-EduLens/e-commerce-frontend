import { api } from '../lib/axios'

export const notifyMeApi = {
  async getUserNotifications() {
    const response = await api.get('/notify-me/user')
    return response.data
  },

  async subscribe(productId: string) {
    const response = await api.post('/notify-me', { productId })
    return response.data
  },

  async unsubscribe(notificationId: number) {
    const response = await api.delete(`/notify-me/${notificationId}`)
    return response.data
  },

  async checkSubscription(productId: string) {
    const response = await api.get(`/notify-me/check/${productId}`)
    return response.data
  },
}
