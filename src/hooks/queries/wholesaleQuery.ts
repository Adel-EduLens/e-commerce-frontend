import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { transformProduct, type Product } from "./productsQuery";

export interface WholesaleColorSize {
  id: string;
  size: string;
  quantity?: number;
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

export type WholesaleProductDetails = Product & {
  wholesaleColors: WholesaleColor[];
};

const getWholesale = async (id: string): Promise<WholesaleProductDetails> => {
  const { data } = await api.get(`/products/${id}`);
  const raw = data.data;
  const product = transformProduct(raw);
  return {
    ...product,
    wholesaleColors: (product.colors || []).map((c) => ({
      id: c.id,
      color: c.colorName || c.color || "",
      sizes: (c.variants || []).map((v) => ({
        id: v.id,
        size: v.size,
        quantity: v.quantity,
      })),
      stock: c.stock ?? product.stock,
      minOrder: c.minOrder ?? product.minOrder,
    })),
  };
};

export const useWholesale = (id?: string) => {
  return useQuery({
    queryKey: ["wholesale", id],
    queryFn: () => getWholesale(id!),
    enabled: !!id,
  });
};
