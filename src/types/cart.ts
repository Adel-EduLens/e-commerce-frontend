import type { Product } from './product'

export interface CartItem {
  id: string
  productId?: string | number | null
  retailProductId?: string | number | null
  productType?: string
  categoryId?: string
  categoryIds?: string[]
  title: string
  unitPrice: number
  currency: 'EGP'
  size?: string
  color?: string
  colorHex?: string
  imageSrc: string
  quantity: number
  minOrder?: number
  retailColorId?: string | number | null
  retailSizeId?: string | number | null
  product?: Product | null
}

export interface AddCartItemPayload {
  productId: string | number
  quantity: number
  colorId?: string | number | null
  sizeId?: string | number | null
  productType?: string
}

export interface ApiCartItem {
  id: string
  productId: string
  categoryIds?: string[]
  title: string
  price: number
  size?: string
  color?: string
  imageSrc?: string
  quantity: number
  minOrder?: number
  productType?: string
}
