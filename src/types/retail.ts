export interface RetailCategory {
  id: number | string
  name: string
  image?: string
  appearOnHome: boolean
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
  description?: string
  price: number
  stock: number
  sku?: string
  brandId?: string
  brand?: { id: string, name: string }
  isFeatured: boolean
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
