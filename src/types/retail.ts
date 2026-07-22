import type { Product } from "../hooks/queries/productsQuery";

export type RetailProduct = Product & {
  discountPrice?: number;
  userRating?: number;
  myRating?: number;
  averageRating?: number;
  isWishlisted?: boolean;
};
