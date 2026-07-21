/**
 * A normalized shape shared by ProductDetailsPage and WholesaleDetailsPage
 * so gallery, info-panel, etc. can be reused across both.
 */
export type DetailItem = {
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

  categories?: {
    id: string | number;
    name: string;
  }[];

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
  }[];
};
