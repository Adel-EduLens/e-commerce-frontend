export interface CouponUsage {
  id: string;
  couponId: string;
  userId: number;
  usedAt: string;
  user: {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  validUntil: string;
  categoryId: string | null;
  productId: string | null;
  category?: { id: string; name: string } | null;
  product?: { id: string; name: string } | null;
  usageLimit: number | null;
  usedCount: number;
  usages?: CouponUsage[];
  isActive: boolean;
  createdAt: string;
}

export interface CouponAnalyticsData {
  summary: {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
    inactiveCoupons: number;
    totalUsages: number;
    avgDiscount: number;
  };
  discountRanges: {
    range1_15: number;
    range16_30: number;
    range31_50: number;
    range50Plus: number;
  };
}

export interface CouponFormData {
  code: string;
  discount: number;
  validUntil: string;
  categoryId?: string | null;
  productId?: string | null;
  usageLimit?: number | null;
  isActive?: boolean;
}
