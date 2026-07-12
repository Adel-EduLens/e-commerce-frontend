import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import wishlistApi from '../services/wishlistApi'
import { useAuthStore } from '../store/useAuthStore'
import type { WishlistProductType } from '../types/wishlist'

export function useWishlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getWishlist(),
    enabled: isAuthenticated,
  })
}

export function useWishlistStatus(productType: WishlistProductType, productId: number | string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['wishlistStatus', productType, productId],
    queryFn: () => wishlistApi.getWishlistStatus(productType, productId),
    enabled: Boolean(productType && productId && isAuthenticated),
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productType, productId }: { productType: WishlistProductType; productId: number | string }) => {
      const { user, token } = useAuthStore.getState()

      return wishlistApi.toggleWishlist({ productType, productId })
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlistStatus'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlistStatus', variables.productType, variables.productId] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }),
      ])
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Unable to update wishlist')
    },
  })
}

export default useWishlist
