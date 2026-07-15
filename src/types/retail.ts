export interface RetailCategory {
  id: number | string;
  name: string;
  image?: string;
  appearOnHome: boolean;
}

export interface RetailProductImage {
  id: number | string;
  url: string;
  color?: string;
  productId?: number | string;
}

export interface RetailProductColor {
  id: number | string;
  color: string;
  productId?: number | string;
}

export interface RetailProductSize {
  id: number | string;
  size: string;
  quantity: number;
  color?: string;
  productId?: number | string;
}

export interface RetailProduct {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  brandId?: string;
  brand?: { id: string; name: string };
  isFeatured: boolean;
  categoryId: number | string;
  category?: RetailCategory;
  images?: RetailProductImage[];
  colors?: RetailProductColor[];
  sizes?: RetailProductSize[];
  depositAmount?: number;
  securityDeposit?: number;
  termsAndConditions?: string;
  privacyPolicy?: string;
  rating: number;
  averageRating?: number;
  userRating?: number;
  myRating?: number;
  discountPrice?: number;
  traderId?: number | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export interface RetailProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: RetailProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
