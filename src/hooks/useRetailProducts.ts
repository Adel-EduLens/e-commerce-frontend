import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import retailApi from '../services/retailApi'
import type { RetailProduct } from '../types/retail'

export function useRetailProducts(params: Record<string, string | number | boolean | undefined | null> = {}, options?: any) {
  const filtered: Record<string, string | number | boolean> = {}
  Object.keys(params || {}).forEach((k) => {
    const v = params[k]
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.trim() === '') return
    filtered[k] = v
  })

  return useQuery({
    queryKey: ['retailProducts', JSON.stringify(filtered)],
    queryFn: async () => {
      const data = await retailApi.getRetailProducts(filtered)
      return data
    },
    ...options
  })
}

export function useRetailProductById(id: string | number) {
  return useQuery({
    queryKey: ['retailProduct', 'id', id],
    queryFn: async () => {
      const data = await retailApi.getRetailProductById(id)
      return data
    },
    enabled: !!id,
  })
}

export function useTraderRetailProducts(params: Record<string, string | number | boolean | undefined | null> = {}) {
  const filtered: Record<string, string | number | boolean> = {}
  Object.keys(params || {}).forEach((k) => {
    const v = params[k]
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.trim() === '') return
    filtered[k] = v
  })

  return useQuery({
    queryKey: ['traderRetailProducts', JSON.stringify(filtered)],
    queryFn: async () => {
      const data = await retailApi.getRetailProducts(filtered)
      return data
    },
  })
}

export function useCreateRetailProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<RetailProduct> | FormData | Record<string, unknown>) => retailApi.createRetailProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
      queryClient.invalidateQueries({ queryKey: ['traderRetailProducts'] })
    },
  })
}

export function useUpdateRetailProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: { id: string | number; data: Partial<RetailProduct> | FormData | Record<string, unknown> }) => retailApi.updateRetailProduct(args),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
      queryClient.invalidateQueries({ queryKey: ['traderRetailProducts'] })
      queryClient.invalidateQueries({ queryKey: ['retailProduct', 'id', variables.id] })
    },
  })
}

export function useDeleteRetailProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => retailApi.deleteRetailProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retailProducts'] })
      queryClient.invalidateQueries({ queryKey: ['traderRetailProducts'] })
    },
  })
}

export default useRetailProducts
