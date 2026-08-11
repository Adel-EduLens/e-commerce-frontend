export type ProductType = "SHOP" | "WHOLESALE" | "RENTAL" | "BLANK";

export interface ProductImageReference {
  id?: string | number;
  url?: string;
  imageUrl?: string;
  isMain?: boolean;
  color?: string;
}

export interface ProductSizeReference {
  id?: string | number;
  size?: string;
  name?: string;
}

export interface ProductVariantReference {
  id?: string | number;
  size?: string;
  name?: string;
}

export interface ProductColorReference {
  id?: string | number;
  color?: string;
  colorName?: string;
  name?: string;
  imageUrl?: string;
  images?: Array<ProductImageReference | string>;
  variants?: ProductVariantReference[];
}

export interface ProductImageItem {
  id?: string;
  file?: File;
  url?: string;
  imageUrl?: string;
  isPrimary?: boolean;
  direction?: string;
  color?: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  quantity: number;
  sku?: string | null;
}

export interface ProductColor {
  id: string;
  colorName: string;
  color?: string;
  colorCode?: string | null;
  minOrder?: number;
  images: {
    id: string;
    imageUrl: string;
    isPrimary?: boolean;
    url?: string;
    direction?: string;
  }[];
  variants: ProductVariant[];
  stock?: number;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  traderId?: number;
  price?: number;
  discountPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  sizeguide?: string;
  sku?: string;
  isMustHave?: boolean;
  isFlashDeals?: boolean;
  isBestDeal?: boolean;
  isMostPopular?: boolean;
  isPremiumCollection?: boolean;
  isActive?: boolean;
  flashDealPrice?: number;
  flashDealEndsAt?: string;
  brandId?: string;
  brand?: {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
  categories?: {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
  materials?: {
    id: string;
    name: string;
  }[];
  tags?: {
    id: string;
    name: string;
  }[];
  colors?: ProductColor[];
  sizes?: {
    id: string;
    size: string;
  }[];
  images?: {
    id: string;
    url: string;
    isMain?: boolean;
    color?: string;
  }[];
  productTypes?: (ProductType | { type: ProductType })[];
  [key: string]: any;
}

export interface BagProduct {
  id?: string | number;
  title?: string;
  name?: string;
  price?: string | number;
  unitPrice?: number;
  sizeLabel?: string;
  sizes?: Array<ProductSizeReference | string>;
  colors?: Array<ProductColorReference | string>;
  imageSrc?: string;
  image?: string;
  images?: Array<ProductImageReference | string>;
  imageUrl?: string;
  featured?: boolean;
  rating?: number;
  _productType?: "SHOP" | "WHOLESALE" | "RENTAL" | "RETAIL";
  [key: string]: unknown;
}

export interface DetailItem {
  id: string | number;
  name: string;
  description?: string | null;
  price: number;
  rating: number;
  averageRating?: number;
  discountPrice?: number;
  brandName?: string | null;
  sizeguide?: string | null;
  minOrder?: number;
  stock?: number;
  giftCardAmounts?: string | null;

  categories?: {
    id: string | number;
    name: string;
  }[];
  category?: {
    id: string | number;
    name: string;
  } | null;
  categoryId?: string | number;

  images: {
    id: string | number;
    url: string;
    color?: string | null;
  }[];

  sizes: {
    id: string | number;
    size: string;
  }[];

  colors: {
    id: string | number;
    color: string;
    colorHex?: string | null;
    minOrder?: number;
    sizes?: {
      id?: string | number;
      size: string;
      quantity?: number;
    }[];
  }[];
}

export interface CompareItem {
  id: string | number;
  name: string;
  price: number;
  rating: number;
  image: string;
  brand?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  brandId?: string;
  categoryIds?: string[];
  productTypes?: ProductType[];
  colors?: {
    color: string;
    images?: string[];
    variants?: {
      size: string;
      quantity: number;
      sku?: string;
    }[];
  }[];
  [key: string]: any;
}
