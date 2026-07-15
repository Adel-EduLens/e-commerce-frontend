import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export interface AppNotification {
  id: number
  title: string
  body?: string
  message?: string
  imageUrl?: string
  productId?: string
  categoryId?: string
  isRead: boolean
  createdAt: string
}

const getNotifications = async () => {
  const { data } = await api.get('/notifications')
  // Backend returns { success, data: UserNotification[] }
  const notifications: AppNotification[] = data.data || []
  const unread = notifications.filter((n) => !n.isRead).length
  return { notifications, unread }
}

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: getNotifications })

const getSubscriptions = async () => {
  const { data } = await api.get('/notify-me')
  const subs = (data.data || []) as { targetType: string; targetId: string; isActive: boolean }[]
  return subs.filter(s => s.targetType === 'CATEGORY' && s.isActive).map(s => s.targetId)
}

export const useCategorySubscriptions = () =>
  useQuery({ queryKey: ['notification-subscriptions'], queryFn: getSubscriptions })

const subscribe = async (categoryId: string) => {
  await api.post('/notify-me', { targetType: 'CATEGORY', targetId: categoryId })
}

const unsubscribe = async (categoryId: string) => {
  await api.delete('/notify-me', { data: { targetType: 'CATEGORY', targetId: categoryId } })
}

export const useToggleCategorySubscription = () => {
  const qc = useQueryClient()
  const { t } = useTranslation('notifications')
  const sub = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-subscriptions'] })
      toast.success(t('subscribedToCategory'))
    },
    onError: () => {
      toast.error(t('subscriptionError'))
    },
  })
  const unsub = useMutation({
    mutationFn: unsubscribe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-subscriptions'] })
      toast.success(t('unsubscribedFromCategory'))
    },
    onError: () => {
      toast.error(t('subscriptionError'))
    },
  })
  return { subscribe: sub.mutate, unsubscribe: unsub.mutate }
}

const markRead = async (id: number) => {
  await api.patch(`/notifications/${id}/read`)
}

const markAllRead = async () => {
  await api.patch('/notifications/read-all')
}

export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['userNotifications'] })
    },
  })
}

export const useMarkAllRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['userNotifications'] })
    },
  })
}
