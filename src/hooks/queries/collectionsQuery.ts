import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { Product } from "./productsQuery";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  image: string;
  appearOnHome: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

const getCollections = async (appearOnHome?: boolean): Promise<Collection[]> => {
  const { data } = await api.get("/collections", {
    params: appearOnHome !== undefined ? { appearOnHome } : undefined,
  });
  return data.data;
};

export const useCollections = (appearOnHome?: boolean) => {
  return useQuery({
    queryKey: ["collections", appearOnHome],
    queryFn: () => getCollections(appearOnHome),
  });
};

const getCollection = async (id: string): Promise<Collection> => {
  const { data } = await api.get(`/collections/${id}`);
  return data.data;
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => getCollection(id),
    enabled: !!id,
  });
};

const createCollection = async (data: {
  name: string;
  description?: string;
  image: string;
  appearOnHome: boolean;
  productIds?: string[];
}) => {
  const res = await api.post("/collections", data);
  return res.data.data;
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onMutate: () => {
      return { toastId: toast.loading("Creating collection...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Collection created successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create collection";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

const updateCollection = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name?: string;
    description?: string;
    image?: string;
    appearOnHome?: boolean;
    productIds?: string[];
  };
}) => {
  const res = await api.patch(`/collections/${id}`, data);
  return res.data.data;
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCollection,
    onMutate: () => {
      return { toastId: toast.loading("Updating collection...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Collection updated successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update collection";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

const deleteCollection = async (id: string) => {
  await api.delete(`/collections/${id}`);
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onMutate: () => {
      return { toastId: toast.loading("Deleting collection...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Collection deleted successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete collection";
      toast.error(msg, { id: context?.toastId });
    },
  });
};
