import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Wholesale {
  id: string;
  name: string;
  description: string;
  price: number;
  minOrder: number;
  isBestDeal: boolean;
  isMostPopular: boolean;
  isPremiumCollection: boolean;
  brand: string;
  rating: number;
  traderId: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  images: {
    id: string;
    url: string;
    color?: string;
    wholesaleId: string;
  }[];

  sizes: {
    id: string;
    size: string;
    wholesaleId: string;
  }[];

  colors: {
    id: string;
    color: string;
    wholesaleId: string;
  }[];
}

const getWholesale = async (id: string): Promise<Wholesale> => {
  const { data } = await api.get(`/wholesales/${id}`);
  return data.data;
};

export const useWholesale = (id?: string) => {
  return useQuery({
    queryKey: ["wholesale", id],
    queryFn: () => getWholesale(id!),
    enabled: !!id,
  });
};

const getWholesales = async (filters?: { isBestDeal?: boolean; isMostPopular?: boolean; isPremiumCollection?: boolean; categoryId?: string; category?: string }): Promise<Wholesale[]> => {
  const params: Record<string, string> = {};
  if (filters?.isBestDeal !== undefined) params.isBestDeal = String(filters.isBestDeal);
  if (filters?.isMostPopular !== undefined) params.isMostPopular = String(filters.isMostPopular);
  if (filters?.isPremiumCollection !== undefined) params.isPremiumCollection = String(filters.isPremiumCollection);
  if (filters?.categoryId) params.categoryId = filters.categoryId;
  if (filters?.category) params.category = filters.category;
  const { data } = await api.get("/wholesales", { params });
  return data.data;
};

const getTraderWholesales = async (): Promise<Wholesale[]> => {
  const { data } = await api.get("/wholesales/trader");
  return data.data;
};

export const useWholesales = (filters?: { isBestDeal?: boolean; isMostPopular?: boolean; isPremiumCollection?: boolean; categoryId?: string; category?: string }) => {
  return useQuery({
    queryKey: ["wholesales", filters],
    queryFn: () => getWholesales(filters),
  });
};

export const useTraderWholesales = () => {
  return useQuery({
    queryKey: ["trader-wholesales"],
    queryFn: getTraderWholesales,
  });
};

export interface WholesaleFormData {
  name: string;
  description: string;
  price: number;
  minOrder: number;
  brand: string;
  categoryId: string;
  isBestDeal: boolean;
  isMostPopular: boolean;
  isPremiumCollection: boolean;
  images: { url: string; color?: string }[];
  sizes: string[];
  colors: string[];
}

const createWholesale = async (body: WholesaleFormData) => {
  const { data } = await api.post("/wholesales", body);
  return data.data;
};
export const useCreateWholesale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWholesale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-wholesales"] });
      queryClient.invalidateQueries({ queryKey: ["wholesales"] });
    },
  });
};

const updateWholesale = async ({ id, ...body }: WholesaleFormData & { id: string }) => {
  const { data } = await api.patch(`/wholesales/${id}`, body);
  return data.data;
};
export const useUpdateWholesale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWholesale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-wholesales"] });
      queryClient.invalidateQueries({ queryKey: ["wholesales"] });
    },
  });
};

const deleteWholesale = async (id: string) => {
  const { data } = await api.delete(`/wholesales/${id}`);
  return data.data;
};
export const useDeleteWholesale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWholesale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-wholesales"] });
      queryClient.invalidateQueries({ queryKey: ["wholesales"] });
    },
  });
};
