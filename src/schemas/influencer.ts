export interface InfluencerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status?: string;
  createdAt?: string;
}

export interface InfluencerCouponData {
  id?: string;
  code: string;
  discountPercent: number;
  commissionPercent: number;
  isActive: boolean;
  totalUsages: number;
}

export interface InfluencerEarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  eligibleEarnings: number;
  settledEarnings: number;
  currentMonthEarnings: number;
}

export interface InfluencerDashboardData {
  influencer: InfluencerProfile;
  coupon: InfluencerCouponData | null;
  earnings: InfluencerEarningsSummary;
}

export interface InfluencerOrderItem {
  title: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  imageSrc: string | null;
}

export interface CouponUser {
  userId: number;
  userName: string | null;
  userEmail: string;
  userPhone: string | null;
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  commissionAmount: number;
  orderItems: InfluencerOrderItem[];
  usedAt: string;
}

export interface Commission {
  id: string;
  orderId: string;
  orderTotal: number;
  commissionPercent: number;
  commissionAmount: number;
  status: string;
  eligibleAt: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
    createdAt: string;
  };
  settlement: {
    id: string;
    periodStart: string;
    periodEnd: string;
  } | null;
}

export interface Settlement {
  id: string;
  totalAmount: number;
  periodStart: string;
  periodEnd: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  _count: { commissions: number };
}

export interface TraderInfluencerItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  coupon: {
    id: string;
    code: string;
    discountPercent: number;
    commissionPercent: number;
    isActive: boolean;
    totalUsages: number;
  } | null;
  totalEarnings?: number;
  pendingEarnings?: number;
  settledEarnings?: number;
}
