import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMeApi } from '../services/notifyMeApi'
import { toast } from 'sonner'

export const notifyMeKeys = {
  all: ['notifyMe'] as const,
  list: () => [...notifyMeKeys.all, 'list'] as const,
  check: (productId: string) => [...notifyMeKeys.all, 'check', productId] as const,
}

export function useNotifyMeList() {
  return useQuery({
    queryKey: notifyMeKeys.list(),
    queryFn: async () => {
      const data = await notifyMeApi.getUserNotifications()
      return data.data || []
    },
  })
}

export function useNotifyMeCheck(productId: string) {
  return useQuery({
    queryKey: notifyMeKeys.check(productId),
    queryFn: async () => {
      const data = await notifyMeApi.checkSubscription(productId)
      return data.data as { isSubscribed: boolean; notificationId: number | null }
    },
    enabled: !!productId,
  })
}

export function useNotifyMeSubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => notifyMeApi.subscribe(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success('You will be notified when this product is back in stock!')
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to subscribe'
      toast.error(msg)
    },
  })
}

export function useNotifyMeUnsubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) => notifyMeApi.unsubscribe(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success('Notification removed')
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to unsubscribe'
      toast.error(msg)
    },
  })
}
