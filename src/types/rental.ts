import type { Product } from "../hooks/queries/productsQuery";

export type RentalProduct = Product & {
  discountPrice?: number;
  userRating?: number;
  myRating?: number;
  averageRating?: number;
  isWishlisted?: boolean;
};

export type RetailProduct = RentalProduct;
