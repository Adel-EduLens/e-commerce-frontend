/**
 * A normalized shape shared by ProductDetailsPage and WholesaleDetailsPage
 * so gallery, info-panel, etc. can be reused across both.
 */
export type DetailItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  rating: number;
  brandName?: string | null;
  sizeguide?: string | null;
  minOrder?: number;

  category: {
    id: string;
    name: string;
  };

  images: {
    id: string;
    url: string;
    color?: string | null;
  }[];

  sizes: {
    id: string;
    size: string;
  }[];

  colors: {
    id: string;
    color: string;
  }[];
};
