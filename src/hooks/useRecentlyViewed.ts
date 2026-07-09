import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import recentlyViewedApi from '../services/recentlyViewedApi'
import { useAuthStore } from '../store/useAuthStore'

export function useRecentlyViewed() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['recentlyViewed'],
    queryFn: () => recentlyViewedApi.getRecentlyViewed(),
    enabled: isAuthenticated,
  })
}

export function useAddRecentlyViewed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productType, productId }: { productType: string; productId: number | string }) => {
      return recentlyViewedApi.addRecentlyViewed({ productType, productId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentlyViewed'] })
    },
    onError: (error: any) => {
      console.error('Failed to add recently viewed product', error)
    },
  })
}

export default useRecentlyViewed
