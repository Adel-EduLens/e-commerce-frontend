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
      console.log('[NotifyMe] user:', state.user)
      console.log('[NotifyMe] token:', state.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null))
      console.log('Wishlist payload', payload)
      return retailApi.createRetailNotifyMe(payload)
    },
    onSuccess: () => {
      toast.success('Added to your notify list')
      queryClient.invalidateQueries({ queryKey: ['retailNotifyMe'] })
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
    },
    onError: (error: any) => {
      console.log(error.response?.status)
      console.log(error.response?.data)
      console.log(error.config?.url)
      console.log(error.config?.method)
      console.log(error.config?.headers)
      console.log(error.config?.data)
      toast.error(error?.response?.data?.message ?? error?.message ?? 'Unable to save notify me request.')
    },
  })

  return { ...query, ...mutation }
}

export default useRetailNotifyMe
