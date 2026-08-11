import type { Product } from "./product";

export type WishlistProductType =
  | "RENTAL"
  | "RETAIL"
  | "WHOLESALE"
  | "SHOP"
  | "BLANK"
  | "GIFT_CARD";

export interface WishlistItem {
  id: number | string;
  productType: WishlistProductType;
  productId?: number | string | null;
  product?: Product | null;
  createdAt?: string;
}

export interface WishlistStatusResponse {
  success: boolean;
  isWishlisted: boolean;
  action?: string;
}

export type WishlistToggleResponse = WishlistStatusResponse;
