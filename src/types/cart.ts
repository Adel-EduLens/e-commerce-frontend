import type { RetailProduct, RetailProductColor, RetailProductSize } from './retail'

export interface CartItem {
  id: string
  productId?: string | number | null
  retailProductId?: string | number | null
  title: string
  unitPrice: number
  currency: 'EGP'
  size?: string
  color?: string
  colorHex?: string
  imageSrc: string
  quantity: number
  retailColorId?: string | number | null
  retailSizeId?: string | number | null
  product?: any
  retailProduct?: RetailProduct | null
}

export interface AddRetailCartPayload {
  retailProductId: string | number
  quantity: number
  retailColorId?: string | number | null
  retailSizeId?: string | number | null
}

export interface AddCartItemPayload {
  productId: string | number
  quantity: number
  colorId?: string | number | null
  sizeId?: string | number | null
}
