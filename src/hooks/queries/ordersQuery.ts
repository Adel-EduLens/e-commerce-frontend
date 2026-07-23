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
  status: string;
  payment?: string;
  items: OrderItem[];
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
