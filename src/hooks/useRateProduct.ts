import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rateProduct, type RateProductPayload, type RateProductResponse } from '../services/ratingApi'

export function useRateProduct() {
  const queryClient = useQueryClient()

  return useMutation<RateProductResponse, unknown, RateProductPayload>({
    mutationFn: rateProduct,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
      queryClient.invalidateQueries({ queryKey: ['wholesaleProducts'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['retailProduct', 'id', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['retailProduct', 'slug', String(variables.productId)] })
      queryClient.invalidateQueries({ queryKey: ['wholesaleProduct', 'id', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['wholesaleProduct', 'slug', String(variables.productId)] })
    },
    onError: (error: any) => {
      console.error('Rating failed:', error)
      toast.error(error?.response?.data?.message ?? 'Unable to save rating.')
    },
  })
}
