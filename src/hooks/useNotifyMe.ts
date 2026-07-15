import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMeApi, type NotifyMeTargetType } from '../services/notifyMeApi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('notify')
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: NotifyMeTargetType; targetId: string }) =>
      notifyMeApi.subscribe(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success(t('youWillBeNotified'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('failedToSubscribe'))
    },
  })
}

export function useNotifyMeUnsubscribe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('notify')
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: NotifyMeTargetType; targetId: string }) =>
      notifyMeApi.unsubscribe(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.all })
      toast.success(t('unsubscribedToast'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('failedToUnsubscribe'))
    },
  })
}
