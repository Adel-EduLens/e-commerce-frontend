import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

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
    range51Plus: number;
  };
  scopeBreakdown: {
    global: number;
    category: number;
    product: number;
  };
  monthlyTrend: {
    monthKey: string;
    defaultMonth: string;
    usages: number;
  }[];
  topCoupons: {
    id: string;
    code: string;
    discount: number;
    usedCount: number;
    usageLimit: number | null;
    validUntil: string;
    isActive: boolean;
    restriction: string | null;
    scope: 'global' | 'category' | 'product';
  }[];
}

export const useCoupons = () => {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data?.data || [];
    },
  });
};

export const useCouponAnalytics = () => {
  return useQuery<CouponAnalyticsData>({
    queryKey: ['couponAnalytics'],
    queryFn: async () => {
      const { data } = await api.get('/coupons/analytics');
      return data?.data;
    },
  });
};

