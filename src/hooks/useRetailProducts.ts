import { useQuery } from '@tanstack/react-query'
import retailApi from '../services/retailApi'

export function useRetailProducts(params: Record<string, any> = {}) {
  const filtered: Record<string, any> = {}
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
  })
}

export default useRetailProducts
