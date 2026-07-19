import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface WholesaleOrderItem {
  id: string;
  productId: string;
  product: string;
  quantity: number;
  price: string;
  subtotal: string;
  size: string | null;
  color: string | null;
  image: string;
}

export interface WholesaleOrder {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  mapAddress: string | null;
  latitude: string | null;
  longitude: string | null;
  date: string;
  time: string;
  payment: string;
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  status: string;
  items: WholesaleOrderItem[];
}

export const useTraderWholesaleOrders = () => {
  return useQuery<WholesaleOrder[], Error>({
    queryKey: ["trader-wholesale-orders"],
    queryFn: async () => {
      const { data } = await api.get("/wholesale-orders/trader");
      return data?.data || [];
    },
  });
};

export const useUpdateWholesaleOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data } = await api.patch(`/wholesale-orders/trader/${orderId}/status`, { status });
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-wholesale-orders"] });
    },
  });
};

export const useDeleteWholesaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.delete(`/wholesale-orders/trader/${orderId}`);
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-wholesale-orders"] });
    },
  });
};
