import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMeApi, type NotifyMeTargetType } from '../services/notifyMeApi'
import { toast } from 'sonner'

export const notifyMeKeys = {
  all: ['notifyMe'] as const,
  list: () => [...notifyMeKeys.all, 'list'] as const,
  check: (targetType: string, targetId: string) => [...notifyMeKeys.all, 'check', targetType, targetId] as const,
}

export function useNotifyMeList() {
  return useQuery({
    queryKey: notifyMeKeys.list(),
    queryFn: async () => {
      const data = await notifyMeApi.getSubscriptions()
      return data.data || []
    },
  })
}

export function useNotifyMeCheck(targetType: NotifyMeTargetType, targetId: string) {
  return useQuery({
    queryKey: notifyMeKeys.check(targetType, targetId),
    queryFn: async () => {
      const data = await notifyMeApi.check(targetType, targetId)
      return data.data as { isSubscribed: boolean }
    },
    enabled: !!targetId,
  })
}

export function useNotifyMeSubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: NotifyMeTargetType; targetId: string }) =>
      notifyMeApi.subscribe(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success('You will be notified!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to subscribe')
    },
  })
}

export function useNotifyMeUnsubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: NotifyMeTargetType; targetId: string }) =>
      notifyMeApi.unsubscribe(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success('Unsubscribed')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unsubscribe')
    },
  })
}
