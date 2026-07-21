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

export const useCoupons = () => {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data?.data || [];
    },
  });
};
