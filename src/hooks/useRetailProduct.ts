import { useQuery } from '@tanstack/react-query'
import retailApi from '../services/retailApi'

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

export function useRetailProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['retailProduct', 'slug', slug],
    queryFn: async () => {
      const data = await retailApi.getRetailProductBySlug(slug)
      return data
    },
    enabled: !!slug,
  })
}

export default useRetailProductById
