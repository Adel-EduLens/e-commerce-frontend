export type Coupon = {
  id: string;
  code: string;
  discount: number;
  categoryId?: string | number | null;
  productId?: string | number | null;
};

type CartItem = {
  categoryId?: number | string | null;
  productId?: number | string | null;
  [key: string]: any;
};

export function couponAppliesToItem(coupon: Coupon, item: CartItem): boolean {
  if (!coupon) return false;

  const itemCategoryId = item.categoryId;
  const itemProductId = item.productId;

  if (!coupon.categoryId && !coupon.productId) return true;
  if (coupon.productId && String(itemProductId) === String(coupon.productId)) return true;
  if (coupon.categoryId && String(itemCategoryId) === String(coupon.categoryId)) return true;

  return false;
}
