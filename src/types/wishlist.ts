export type WishlistProductType = 'RETAIL' | 'WHOLESALE' | 'SHOP'

export interface WishlistItem {
  id: number | string
  productType: WishlistProductType
  retailProductId?: number | string | null
  wholesaleProductId?: number | string | null
  shopProductId?: number | string | null
  retailProduct?: Record<string, any> | null
  wholesaleProduct?: Record<string, any> | null
  shopProduct?: Record<string, any> | null
  product?: Record<string, any> | null
  createdAt?: string
}

export interface WishlistStatusResponse {
  success: boolean
  isWishlisted: boolean
  action?: string
}

export interface WishlistToggleResponse extends WishlistStatusResponse {}
