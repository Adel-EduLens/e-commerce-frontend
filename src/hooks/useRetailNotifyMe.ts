import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import retailApi from '../services/retailApi'

export function useRetailNotifyMe(userId?: string | number) {
  const queryClient = useQueryClient()

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
      toast.success('Added to your notify list')
      queryClient.invalidateQueries({ queryKey: ['retailNotifyMe'] })
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
    },
    onError: (error: any) => {

      toast.error(error?.response?.data?.message ?? error?.message ?? 'Unable to save notify me request.')
    },
  })

  return { ...query, ...mutation }
}

export default useRetailNotifyMe
