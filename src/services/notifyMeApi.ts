import { api } from '../lib/axios'

export type NotifyMeTargetType = 'SHOP_RESTOCK' | 'RENTAL_RESTOCK' | 'RETAIL_RESTOCK' | 'WHOLESALE_RESTOCK' | 'CATEGORY'

export const notifyMeApi = {
  async getSubscriptions() {
    const response = await api.get('/notify-me')
    return response.data
  },

  async check(targetType: NotifyMeTargetType, targetId: string) {
    const response = await api.get('/notify-me/check', { params: { targetType, targetId } })
    return response.data
  },

  async subscribe(targetType: NotifyMeTargetType, targetId: string) {
    const response = await api.post('/notify-me', { targetType, targetId })
    return response.data
  },

  async unsubscribe(targetType: NotifyMeTargetType, targetId: string) {
    const response = await api.delete('/notify-me', { data: { targetType, targetId } })
    return response.data
  },
}
