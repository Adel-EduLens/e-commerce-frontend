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
  _productType?: 'SHOP' | 'WHOLESALE' | 'RENTAL' | 'RETAIL';
  [key: string]: unknown;
}

export type Product = BagProduct;
