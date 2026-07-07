export interface BagProduct {
  id?: string | number;
  title?: string;
  name?: string;
  price?: string | number;
  unitPrice?: number;
  sizeLabel?: string;
  sizes?: Array<{ id?: string | number; size?: string; name?: string } | string>;
  imageSrc?: string;
  image?: string;
  images?: Array<{ id?: string | number; url?: string; isMain?: boolean } | string>;
  imageUrl?: string;
  featured?: boolean;
  rating?: number;
  [key: string]: any;
}

export type Product = BagProduct;
