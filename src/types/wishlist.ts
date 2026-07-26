import type { Product } from './product'

export type WishlistProductType = 'RENTAL' | 'RETAIL' | 'WHOLESALE' | 'SHOP' | 'BLANK'

export interface WishlistItem {
  id: number | string
  productType: WishlistProductType
  productId?: number | string | null
  product?: Product | null
  createdAt?: string
}

export interface WishlistStatusResponse {
  success: boolean
  isWishlisted: boolean
  action?: string
}

export type WishlistToggleResponse = WishlistStatusResponse;
