export type Coupon = {
  id: string;
  code: string;
  discount: number;
  categoryId?: string | number | null;
  productId?: string | number | null;
  retailCategoryId?: string | number | null;
  retailProductId?: string | number | null;
  type?: "trader" | "influencer";
};

type CartItem = {
  categoryIds?: (number | string)[] | null;
  productId?: number | string | null;
  [key: string]: any;
};

export function couponAppliesToItem(coupon: Coupon, item: CartItem): boolean {
  if (!coupon) return false;

  const itemCategoryIds = item.categoryIds || [];
  const itemProductId = item.productId;

  if (!coupon.categoryId && !coupon.productId && !coupon.retailCategoryId && !coupon.retailProductId) return true;
  if (coupon.productId && String(itemProductId) === String(coupon.productId)) return true;
  if (coupon.categoryId && itemCategoryIds.some(id => String(id) === String(coupon.categoryId))) return true;
  if (coupon.retailProductId && String(itemProductId) === String(coupon.retailProductId)) return true;
  if (coupon.retailCategoryId && itemCategoryIds.some(id => String(id) === String(coupon.retailCategoryId))) return true;

  return false;
}
