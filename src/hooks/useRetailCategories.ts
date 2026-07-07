import { useQuery } from '@tanstack/react-query'
import retailApi from '../services/retailApi'

export function useRetailCategories() {
  return useQuery({
    queryKey: ['retailCategories'],
    queryFn: async () => {
      const data = await retailApi.getRetailCategories()
      return data
    },
  })
}

export default useRetailCategories
