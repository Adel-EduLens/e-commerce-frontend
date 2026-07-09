import { useMutation, useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

export interface ProductColor {
  id: string;
  colorName: string;
  colorCode?: string | null;
  images: {
    id: string;
    imageUrl: string;
    isPrimary?: boolean;
    url?: string;
  }[];
  variants: {
    id: string;
    size: string;
    quantity: number;
    sku?: string | null;
  }[];
}

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
  colors: ProductColor[];
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

const createProduct = async (body: ProductFormData | FormData) => {
  const isFormData = body instanceof FormData;
  const { data } = await api.post(isFormData ? "/trader/products" : "/products", body, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
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

const updateProduct = async ({ id, ...body }: Partial<ProductFormData> & { id: string } | FormData & { id: string }) => {
  const isFormData = body instanceof FormData;
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

export const useAddProductColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, formData }: { productId: string; formData: FormData }) => {
      const { data } = await api.post(`/trader/products/${productId}/colors`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ colorId }: { colorId: string; productId?: string }) => {
      const { data } = await api.delete(`/trader/products/colors/${colorId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useReplaceProductColorImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ colorId, formData }: { colorId: string; formData: FormData; productId?: string }) => {
      const { data } = await api.put(`/trader/products/colors/${colorId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProductColorImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ colorId, formData }: { colorId: string; formData: FormData; productId?: string }) => {
      const { data } = await api.post(`/trader/products/colors/${colorId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId }: { imageId: string; productId?: string }) => {
      const { data } = await api.delete(`/trader/products/images/${imageId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductSizeQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number; productId?: string }) => {
      const { data } = await api.patch(`/trader/products/variants/${variantId}`, { quantity });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProductSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ colorId, size, quantity, sku }: { colorId: string; size: string; quantity: number; sku?: string; productId?: string }) => {
      const { data } = await api.post(`/trader/products/colors/${colorId}/sizes`, { size, quantity, sku });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId }: { variantId: string; productId?: string }) => {
      const { data } = await api.delete(`/trader/products/variants/${variantId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProductDetails = (id?: string) => {
  return useProduct(id);
};

export const useRecommendedProducts = (query: ProductsQuery) => {
  return useProducts(query);
};