import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  traderId: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  sizeguide?: string;
  isMustHave?: boolean;
  isFlashDeals?: boolean;
  flashDealPrice?: number;
  flashDealEndsAt?: string;
  brand: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
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
    productId: string;
  }[];

  sizes: {
    id: string;
    size: string;
    productId: string;
  }[];

  colors: {
    id: string;
    color: string;
    productId: string;
  }[];
}

export type ProductsQuery = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  filter?: string;
  size?: string;
  color?: string;
  price? : string;
  sortBy?: "name" | "price" | "rating";
  sortOrder?: "asc" | "desc";

  page?: number;
  limit?: number;
};


type ProductsResponse = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const getProducts = async (
  params: ProductsQuery
): Promise<ProductsResponse> => {
  const { data } = await api.get("/products", {
    params,
  });

  return data.data;
};

export const useProducts = (params: ProductsQuery) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });
};
