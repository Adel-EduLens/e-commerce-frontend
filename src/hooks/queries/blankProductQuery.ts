import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export type ImageDirection =
  | "FRONT"
  | "BACK"
  | "LEFT"
  | "RIGHT"
  | "TOP"
  | "BOTTOM";

export interface BlankProductMaterial {
  id: string;
  material: string;
  blankProductId: string;
  createdAt: string;
}

export interface BlankProductImage {
  id: string;
  url: string;
  direction: ImageDirection;
  colorId: string;
  createdAt: string;
}

export interface BlankProductColor {
  id: string;
  color: string;
  blankProductId: string;
  createdAt: string;

  images: BlankProductImage[];
}

export interface BlankProduct {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  isActive: boolean;

  materials: BlankProductMaterial[];
  colors: BlankProductColor[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateBlankProductData {
  name: string;

  description?: string | null;

  price?: number | null;

  isActive?: boolean;

  materials: {
    material: string;
  }[];

  colors: {
    color: string;

    images: {
      url: string;
      direction: ImageDirection;
    }[];
  }[];
}

export type UpdateBlankProductData = Partial<CreateBlankProductData>;

// ======================
// GET ALL
// ======================

const getBlankProducts = async (): Promise<BlankProduct[]> => {
  const { data } = await api.get("/blank-products");

  return data.data;
};

export const useBlankProducts = () => {
  return useQuery({
    queryKey: ["blank-products"],
    queryFn: getBlankProducts,
  });
};

// ======================
// GET BY ID
// ======================

const getBlankProduct = async (id: string): Promise<BlankProduct> => {
  const { data } = await api.get(`/blank-products/${id}`);

  return data.data;
};

export const useBlankProduct = (id: string) => {
  return useQuery({
    queryKey: ["blank-product", id],
    queryFn: () => getBlankProduct(id),
    enabled: !!id,
  });
};

// ======================
// CREATE
// ======================

const createBlankProduct = async (data: CreateBlankProductData) => {
  const response = await api.post("/blank-products", data);

  return response.data.data;
};

export const useCreateBlankProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlankProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blank-products"],
      });
    },
  });
};

// ======================
// UPDATE
// ======================

const updateBlankProduct = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateBlankProductData;
}) => {
  const response = await api.patch(`/blank-products/${id}`, data);

  return response.data.data;
};

export const useUpdateBlankProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlankProduct,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["blank-products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blank-product", variables.id],
      });
    },
  });
};

// ======================
// DELETE
// ======================

const deleteBlankProduct = async (id: string) => {
  await api.delete(`/blank-products/${id}`);
};

export const useDeleteBlankProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlankProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blank-products"],
      });
    },
  });
};