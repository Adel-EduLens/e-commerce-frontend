import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { toast } from "sonner";

export interface GiftCard {
  id: string;
  name: string;
  description?: string;
  amount: number;
  balance: number;
  amounts?: string;
  image?: string;
  status: string;
  stock?: number;
  traderId: number;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  message?: string;
  createdAt: string;
}

export interface GiftCardFormData {
  name: string;
  description?: string;
  amount?: number;
  amounts?: string;
  image?: string;
  stock?: number;
}

export const useTraderGiftCards = (search?: string) => {
  return useQuery({
    queryKey: ["traderGiftCards", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await api.get(`/gift-cards/trader/all?${params.toString()}`);
      return data.data as GiftCard[];
    },
  });
};

export const useReceivedGiftCards = () => {
  return useQuery({
    queryKey: ["receivedGiftCards"],
    queryFn: async () => {
      const { data } = await api.get("/gift-cards/received/me");
      return data.data as GiftCard[];
    },
  });
};

export const useSentGiftCards = () => {
  return useQuery({
    queryKey: ["sentGiftCards"],
    queryFn: async () => {
      const { data } = await api.get("/gift-cards/sent/me");
      return data.data as GiftCard[];
    },
  });
};

export const useGiftCards = (search?: string) => {
  return useQuery({
    queryKey: ["giftCards", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await api.get(`/gift-cards?${params.toString()}`);
      return data.data as GiftCard[];
    },
  });
};

export const useGiftCard = (id?: string) => {
  return useQuery({
    queryKey: ["giftCard", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/gift-cards/${id}`);
      return data.data as GiftCard;
    },
    enabled: !!id,
  });
};

export const useCreateGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GiftCardFormData) => {
      const { data } = await api.post("/gift-cards", payload);
      return data.data as GiftCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traderGiftCards"] });
    },
  });
};

export const useUpdateGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: GiftCardFormData & { id: string }) => {
      const { data } = await api.patch(`/gift-cards/${id}`, payload);
      return data.data as GiftCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traderGiftCards"] });
    },
  });
};

export const useDeleteGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/gift-cards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traderGiftCards"] });
    },
  });
};

export const useRedeemGiftCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/gift-cards/${id}/redeem`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedGiftCards"] });
      queryClient.invalidateQueries({ queryKey: ["sentGiftCards"] });
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      toast.success("Gift card redeemed successfully!");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || "Failed to redeem gift card";
      toast.error(errMsg);
    },
  });
};
