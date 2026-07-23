import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface OrderItem {
  id: string;
  productId: string;
  product?: string;
  title?: string;
  name?: string;
  price: number | string;
  quantity: number;
  image?: string;
  imageSrc?: string;
  size?: string | null;
  color?: string | null;
}

export interface TraderOrder {
  id: string;
  orderId: string;
  orderType?: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  date: string;
  time?: string;
  createdAt?: string;
  total: number | string;
  subtotal?: number | string;
  shipping?: number | string;
  discount?: number | string;
  couponCode?: string | null;
  status: string;
  payment?: string;
  items: OrderItem[];
}

export interface TraderCustomer {
  email: string;
  name: string;
  phone: string | null;
  orders: number;
  totalSpent: string;
  lastPurchase: string;
  status: string;
}

export interface GetTraderOrdersParams {
  type?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
}

const getTraderDashboardOrders = async (params?: GetTraderOrdersParams): Promise<TraderOrder[]> => {
  const { data } = await api.get("/orders/trader", { params });
  return data?.data || [];
};

export const useTraderDashboardOrders = (params?: GetTraderOrdersParams) => {
  return useQuery<TraderOrder[]>({
    queryKey: [
      "trader-dashboard-orders",
      params?.type,
      params?.categoryId,
      params?.fromDate,
      params?.toDate,
    ],
    queryFn: () => getTraderDashboardOrders(params),
  });
};

export const useUpdateTraderOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data } = await api.patch(`/orders/trader/${orderId}/status`, { status });
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-dashboard-orders"] });
    },
  });
};

export const useTraderCustomers = () => {
  return useQuery<TraderCustomer[]>({
    queryKey: ["trader-customers"],
    queryFn: async () => {
      const { data } = await api.get("/orders/trader/customers");
      return data?.data || [];
    },
  });
};
