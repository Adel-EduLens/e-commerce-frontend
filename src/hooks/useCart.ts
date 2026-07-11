import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartApi } from '../services/cartApi'
import { useCartStore } from '../store/useCartStore'
import type { AddRetailCartPayload } from '../types/cart'
import type { CartItem } from '../types/cart'

import { useAuthStore } from '../store/useAuthStore'

export function useCart() {
  const setItems = useCartStore((state) => state.setItems);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['cart', isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      const data = await cartApi.getCart();
      if (data && data.data && data.data.items) {
        setItems(data.data.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          categoryId: item.categoryId,
          title: item.title,
          unitPrice: item.price,
          currency: 'EGP',
          size: item.size || '',
          color: item.color || '',
          colorHex: item.color || '',
          imageSrc: item.imageSrc,
          quantity: item.quantity
        })));
      }
      return data;
    },
    enabled: isAuthenticated,
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        queryClient.invalidateQueries({ queryKey: ['retailProduct'] })
        queryClient.invalidateQueries({ queryKey: ['products'] })
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
