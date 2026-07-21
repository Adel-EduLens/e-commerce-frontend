import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface WholesaleColorSize {
  id: string;
  size: string;
}

export interface WholesaleColor {
  id: string;
  color: string;
  minOrder?: number;
  stock?: number;
  sizes: WholesaleColorSize[];
}

export interface WholesaleImage {
  id: string;
  url: string;
  color?: string | null;
}

export interface WholesaleProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  minOrder: number;
  isBestDeal: boolean;
  isMostPopular: boolean;
  isPremiumCollection: boolean;
  brand?: string | null;
  rating: number;
  sku?: string | null;
  stock: number;
  category: {
    id: string;
    name: string;
  };
  images: WholesaleImage[];
  wholesaleColors: WholesaleColor[];
  createdAt: string;
  updatedAt: string;
}

const getWholesale = async (id: string): Promise<WholesaleProduct> => {
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
