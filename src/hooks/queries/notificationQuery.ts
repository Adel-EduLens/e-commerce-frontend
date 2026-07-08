import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'

export interface AppNotification {
  id: number
  title: string
  body: string
  imageUrl?: string
  productId?: string
  categoryId?: string
  isRead: boolean
  createdAt: string
}

const getNotifications = async () => {
  const { data } = await api.get('/notifications')
  return data.data as { notifications: AppNotification[]; unread: number }
}

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: getNotifications })

const getSubscriptions = async () => {
  const { data } = await api.get('/notifications/subscriptions')
  return data.data as string[]
}

export const useCategorySubscriptions = () =>
  useQuery({ queryKey: ['notification-subscriptions'], queryFn: getSubscriptions })

const subscribe = async (categoryId: string) => {
  await api.post('/notifications/subscriptions', { categoryId })
}

const unsubscribe = async (categoryId: string) => {
  await api.delete(`/notifications/subscriptions/${categoryId}`)
}

export const useToggleCategorySubscription = () => {
  const qc = useQueryClient()
  const sub = useMutation({
    mutationFn: subscribe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification-subscriptions'] }),
  })
  const unsub = useMutation({
    mutationFn: unsubscribe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification-subscriptions'] }),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkAllRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
