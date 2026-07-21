import {
  useMutation,
  useQuery,
  useQueries,
  useQueryClient,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

export interface ProductColor {
  id: string;
  colorName: string;
  color?: string;
  colorCode?: string | null;
  images: {
    id: string;
    imageUrl: string;
    isPrimary?: boolean;
    url?: string;
    direction?: string;
  }[];
  variants: {
    id: string;
    size: string;
    quantity: number;
    sku?: string | null;
  }[];
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  traderId: number;
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
  categories: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  materials?: {
    id: string;
    material: string;
  }[];

  images: {
    id: string;
    url: string;
    color?: string;
    productId: string;
  }[];
  stock: number;
  colors: ProductColor[];
  price?: number;
  shopPrice?: number;
  retailPrice?: number;
  wholesalePrice?: number;
  blankPrice?: number;
  depositAmount?: number;
  securityDeposit?: number;
  termsAndConditions?: string;
  privacyPolicy?: string;
  minOrder?: number;
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
  collectionId?: string;
  type?: string;
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

type RawImage = { id?: string; url?: string; imageUrl?: string; color?: string; direction?: string };
type RawSize = { id?: string; size?: string; quantity?: number; color?: string };
type RawColor = { id?: string; colorName?: string; color?: string; images?: RawImage[] };

/** Transform flat API response into the nested colors structure the frontend expects */
export function transformProduct(raw: Record<string, unknown>): Product {
  if (!raw || typeof raw !== 'object') return raw as unknown as Product;
  const flatImages = (raw.images as RawImage[]) || [];
  const flatSizes = (raw.sizes as RawSize[]) || [];
  const flatColors = (raw.colors as RawColor[]) || [];
  const productStock = (raw.stock as number) ?? 0;

  // If colors already have nested images/variants, return as-is
  if (flatColors.length > 0 && flatColors[0].images) {
    return raw as unknown as Product;
  }

  const hasColorSpecificSizes = flatSizes.some(
    (s) => s.color !== null && s.color !== undefined && s.color !== "",
  );

  const colors: ProductColor[] = flatColors.map((c) => {
    const colorName = c.colorName || c.color || "";
    return {
      ...c,
      id: c.id || "",
      images: flatImages
        .filter((img) => img.color === colorName)
        .map((img) => ({
          id: img.id || "",
          imageUrl: img.url || img.imageUrl || "",
          url: img.url || img.imageUrl || "",
          direction: img.direction,
        })),
      variants: flatSizes
        .filter((s) =>
          hasColorSpecificSizes
            ? s.color === colorName
            : !s.color || s.color === colorName,
        )
        .map((s) => ({
          id: s.id || "",
          size: s.size || "",
          quantity: s.quantity ?? productStock,
        })),
    } as ProductColor;
  });

  return { ...raw, colors } as unknown as Product;
}

const getProducts = async (
  params: ProductsQuery,
): Promise<ProductsResponse> => {
    console.log("getProducts");
  const { data } = await api.get("/products", {
    params,
  });

  const result = data.data;
  if (result?.products) {
    result.products = result.products.map(transformProduct);
  }
  return result;
};

export const useProducts = (
  params: ProductsQuery,
  options?: Omit<UseQueryOptions<ProductsResponse, Error, ProductsResponse, unknown[]>, "queryKey" | "queryFn">
): UseQueryResult<ProductsResponse, Error> => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    ...options,
  });
};
const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return transformProduct(data.data);
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

type RawProductItem = {
  categories?: { name?: string }[];
  brand?: { name?: string };
  sizes?: { size?: string }[];
  colors?: { colorName?: string; color?: string }[];
};

const getProductFilters = async (
  params?: ProductsQuery,
): Promise<ProductFilters> => {
  const { data } = await api.get("/products", {
    params: { ...params, limit: 1000 },
  });
  const products: RawProductItem[] = data.data?.products ?? [];

  const categories = Array.from(
    new Set(products.flatMap((p) => p.categories?.map(c => c.name)).filter(Boolean)),
  ) as string[];
  const brands = Array.from(
    new Set(products.map((p) => p.brand?.name).filter(Boolean)),
  ) as string[];
  const sizes = Array.from(
    new Set(
      products
        .flatMap((p) => (p.sizes || []).map((s) => s.size))
        .filter(Boolean),
    ),
  ) as string[];
  const colors = Array.from(
    new Set(
      products
        .flatMap((p) =>
          (p.colors || []).map((c) => c.colorName || c.color),
        )
        .filter(Boolean),
    ),
  ) as string[];

  return { categories, brands, sizes, colors };
};

export const useProductFilters = (params?: ProductsQuery) => {
  return useQuery({
    queryKey: ["products", "filters", params],
    queryFn: () => getProductFilters(params),
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



const getTraderProducts = async (
  traderId: string | number,
  type?: string
): Promise<Product[]> => {
  const { data } = await api.get("/products", {
    params: { traderId, limit: 1000, type },
  });
  return (data.data?.products ?? []).map(transformProduct);
};

export const useTraderProducts = (type?: string) => {
  const user = useAuthStore.getState().user;
  return useQuery({
    queryKey: ["trader-products", user?.id, type],
    queryFn: () => getTraderProducts(user!.id, type),
    enabled: !!user?.id,
  });
};

export interface ProductColorPayload {
  color: string;
  name: string;
  code: string;
  minOrder?: number;
  stock?: number;
  sizes?: { size: string; quantity: number }[];
}

export interface ProductFormData {
  name: string;
  description?: string;
  price?: number;
  shopPrice?: number;
  wholesalePrice?: number;
  categoryIds?: string[];
  brandId?: string;
  images: { url: string; color: string; direction?: string }[];
  sizes?: string[] | { size: string; quantity: number }[];
  colors: string[] | ProductColorPayload[];
  materials?: { material: string }[];
  isActive?: boolean;
  productTypes?: string[];
  sku?: string;
  stock?: number;
  isMustHave?: boolean;
  isFlashDeals?: boolean;
  flashDealPrice?: number | null;
  flashDealEndsAt?: string | null;
  depositAmount?: number;
  securityDeposit?: number;
  termsAndConditions?: string;
  privacyPolicy?: string;
  isFeatured?: boolean;
  minOrder?: number;
  isBestDeal?: boolean;
  isMostPopular?: boolean;
  isPremiumCollection?: boolean;
  sizeguide?: string;
  blankPrice?: number;
  retailPrice?: number;
}

const createProduct = async (body: ProductFormData | FormData) => {
  const isFormData = body instanceof FormData;
  const { data } = await api.post(
    isFormData ? "/trader/products" : "/products",
    body,
  );
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

const updateProduct = async ({
  id,
  ...body
}:
  | (Partial<ProductFormData> & { id: string })
  | (FormData & { id: string })) => {
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
    mutationFn: async ({
      productId,
      formData,
    }: {
      productId: string;
      formData: FormData;
    }) => {
      const { data } = await api.post(
        `/trader/products/${productId}/colors`,
        formData,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      colorId,
    }: {
      colorId: string;
      productId?: string;
    }) => {
      const { data } = await api.delete(`/trader/products/colors/${colorId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useReplaceProductColorImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      colorId,
      formData,
    }: {
      colorId: string;
      formData: FormData;
      productId?: string;
    }) => {
      const { data } = await api.put(
        `/trader/products/colors/${colorId}/images`,
        formData,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProductColorImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      colorId,
      formData,
    }: {
      colorId: string;
      formData: FormData;
      productId?: string;
    }) => {
      const { data } = await api.post(
        `/trader/products/colors/${colorId}/images`,
        formData,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageId,
    }: {
      imageId: string;
      productId?: string;
    }) => {
      const { data } = await api.delete(`/trader/products/images/${imageId}`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductSizeQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
      productId?: string;
    }) => {
      const { data } = await api.patch(
        `/trader/products/variants/${variantId}`,
        { quantity },
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProductSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      colorId,
      size,
      quantity,
      sku,
    }: {
      colorId: string;
      size: string;
      quantity: number;
      sku?: string;
      productId?: string;
    }) => {
      const { data } = await api.post(
        `/trader/products/colors/${colorId}/sizes`,
        { size, quantity, sku },
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProductSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      variantId,
    }: {
      variantId: string;
      productId?: string;
    }) => {
      const { data } = await api.delete(
        `/trader/products/variants/${variantId}`,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["product", variables.productId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProductDetails = (id?: string) => {
  return useProduct(id);
};

export type RecommendedProductsQuery = {
  categories?: string | string[];
  limit?: number;
  excludeId?: string;
  categoryId?: string;
  size?: string;
  color?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const getRecommendedProducts = async (
  params: RecommendedProductsQuery,
): Promise<ProductsResponse> => {
  const queryParams: Record<string, unknown> = { ...params };
  if (Array.isArray(queryParams.categories)) {
    queryParams.categories = queryParams.categories.join(",");
  }

  const { data } = await api.get("/products/recommendations", {
    params: queryParams,
  });

  const result = data.data;
  if (result?.products) {
    result.products = result.products.map(transformProduct);
  }
  return result;
};

export const useRecommendedProducts = (params: RecommendedProductsQuery) => {
  return useQuery({
    queryKey: ["products", "recommendations", params],
    queryFn: () => getRecommendedProducts(params),
  });
};
