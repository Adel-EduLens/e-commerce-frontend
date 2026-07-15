import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import retailApi from '../services/retailApi'
import { useTranslation } from 'react-i18next'

export function useRetailNotifyMe(userId?: string | number) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('notify')

  const query = useQuery({
    queryKey: ['retailNotifyMe', userId],
    queryFn: () => retailApi.getRetailNotifyMe(userId),
    enabled: Boolean(userId),
  })

  const mutation = useMutation({
    mutationFn: async (payload: { retailProductId: string | number; userId?: string | number }) => {
      const state = (await import('../store/useAuthStore')).useAuthStore.getState()

      return retailApi.createRetailNotifyMe(payload)
    },
    onSuccess: () => {
      toast.success(t('addedToNotifyList'))
      queryClient.invalidateQueries({ queryKey: ['retailNotifyMe'] })
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
    },
    onError: (error: any) => {

      toast.error(error?.response?.data?.message ?? error?.message ?? t('unableToSaveRequest'))
    },
  })

  return { ...query, ...mutation }
}

export default useRetailNotifyMe
