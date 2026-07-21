import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/axios'
import { useTranslation } from 'react-i18next'

export function useRetailNotifyMe(userId?: string | number) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('notify')

  const query = useQuery({
    queryKey: ['notifyMe', userId],
    queryFn: async () => {
      const { data } = await api.get('/notify-me');
      return data.data;
    },
    enabled: Boolean(userId),
  })

  const mutation = useMutation({
    mutationFn: async (payload: { retailProductId: string | number; userId?: string | number }) => {
      const { data } = await api.post('/notify-me', {
        targetType: 'product',
        targetId: String(payload.retailProductId)
      });
      return data.data;
    },
    onSuccess: () => {
      toast.success(t('addedToNotifyList'))
      queryClient.invalidateQueries({ queryKey: ['notifyMe'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? t('unableToSaveRequest'))
    },
  })

  return { ...query, ...mutation }
}

export default useRetailNotifyMe
