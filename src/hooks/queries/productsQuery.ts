import { useMutation, useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

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
  sku?: string;
  stock?: number;
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
  priceMin?: string;
  priceMax?: string;
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

export interface ProductFilters {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
}

const getProductFilters = async (): Promise<ProductFilters> => {
  const { data } = await api.get("/products/filters");
  return data.data;
};

export const useProductFilters = () => {
  return useQuery({
    queryKey: ["products", "filters"],
    queryFn: getProductFilters,
  });
};

export const useCompareProducts = (ids: string[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["product", id],
      queryFn: () => getProduct(id),
      enabled: !!id,
    })),
  });
};

const getTraderProducts = async (traderId: string | number): Promise<Product[]> => {
  const { data } = await api.get("/products", { params: { traderId, limit: 1000 } });
  return data.data?.products ?? [];
};

export const useTraderProducts = () => {
  const user = useAuthStore.getState().user;
  return useQuery({
    queryKey: ["trader-products", user?.id],
    queryFn: () => getTraderProducts(user!.id),
    enabled: !!user?.id,
  });
};

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  brandId?: string;
  images: { url: string; color: string }[];
  sizes: string[];
  colors: string[];
  sku?: string;
  stock?: number;
  isMustHave?: boolean;
  isFlashDeals?: boolean;
  flashDealPrice?: number | null;
  flashDealEndsAt?: string | null;
}

const createProduct = async (body: ProductFormData) => {
  const { data } = await api.post("/products", body);
  return data.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

const updateProduct = async ({ id, ...body }: Partial<ProductFormData> & { id: string }) => {
  const { data } = await api.patch(`/products/${id}`, body);
  return data.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};