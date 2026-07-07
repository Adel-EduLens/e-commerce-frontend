import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartApi } from '../services/cartApi'
import { useCartStore } from '../store/useCartStore'
import type { AddRetailCartPayload } from '../types/cart'
import type { CartItem } from '../types/cart'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await cartApi.getCart()
      return data
    },
  })
}

export function useAddRetailProductToCart() {
  const queryClient = useQueryClient()
  const addItem = useCartStore((state) => state.addItem)

  return useMutation<CartItem, Error, { cartItem: CartItem; apiPayload: AddRetailCartPayload }>(
    {
      mutationFn: async (payload) => {
        await cartApi.addRetailProductToCart(payload.apiPayload)
        return payload.cartItem
      },
      onSuccess: (cartItem: CartItem) => {
        addItem(cartItem)
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        toast.success('Added to cart')
      },
      onError: (error: Error) => {
        toast.error(`Failed to add to cart: ${error?.message ?? 'Unknown error'}`)
      },
    }
  )
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation<any, Error, { itemId: string | number; quantity: number }>(
    {
      mutationFn: async ({ itemId, quantity }) => {
        const data = await cartApi.updateCartItem(itemId, quantity)
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        toast.success('Cart updated')
      },
      onError: (error: Error) => {
        toast.error(`Failed to update cart item: ${error?.message ?? 'Unknown error'}`)
      },
    }
  )
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation<any, Error, string | number>(
    {
      mutationFn: async (itemId) => {
        const data = await cartApi.removeCartItem(itemId)
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        toast.success('Item removed from cart')
      },
      onError: (error: Error) => {
        toast.error(`Failed to remove cart item: ${error?.message ?? 'Unknown error'}`)
      },
    }
  )
}
