export interface RetailCategory {
  id: number | string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
}

export interface RetailProductImage {
  id: number | string
  url: string
  alt?: string
  isMain: boolean
}

export interface RetailProductColor {
  id: number | string
  name: string
  hexCode?: string
}

export interface RetailProductSize {
  id: number | string
  name: string
  stock?: number
}

export interface RetailProduct {
  id: number | string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  discountPrice?: number
  stock: number
  sku?: string
  brand?: string
  isFeatured: boolean
  isActive: boolean
  categoryId: number | string
  category?: RetailCategory
  images: RetailProductImage[]
  colors: RetailProductColor[]
  sizes: RetailProductSize[]
  depositAmount: number
  securityDeposit: number
  termsAndConditions?: string
  privacyPolicy?: string
}
