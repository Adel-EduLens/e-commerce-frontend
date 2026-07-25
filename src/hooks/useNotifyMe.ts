import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMeApi, type NotifyMeTargetType } from '../services/notifyMeApi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/useAuthStore'

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
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: notifyMeKeys.check(targetType, targetId),
    queryFn: async () => {
      const data = await notifyMeApi.check(targetType, targetId)
      const resVal = data.data
      const isSubscribed = typeof resVal === 'object' && resVal !== null ? Boolean(resVal.isSubscribed) : Boolean(resVal)
      return { isSubscribed }
    },
    enabled: !!targetId && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes cache to eliminate refetch flickering
  })
}

export function useNotifyMeSubscribe() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('notify')
  return useMutation({
    mutationFn: ({ targetType, targetId }: { targetType: NotifyMeTargetType; targetId: string }) =>
      notifyMeApi.subscribe(targetType, targetId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(notifyMeKeys.check(variables.targetType, variables.targetId), { isSubscribed: true })
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.list() })
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
    onSuccess: (_, variables) => {
      queryClient.setQueryData(notifyMeKeys.check(variables.targetType, variables.targetId), { isSubscribed: false })
      queryClient.invalidateQueries({ queryKey: notifyMeKeys.list() })
      toast.success(t('unsubscribedToast'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('failedToUnsubscribe'))
    },
  })
}
