import { useMutation, useQuery, useQueryClient, type UseQueryResult, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  image?: string;
  appearOnHome: boolean;
  isWholesale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryFilter = boolean | "all" | undefined;

const getCategories = async (isWholesale?: CategoryFilter): Promise<Category[]> => {
  const { data } = await api.get("/categories", {
    params:
      isWholesale === "all"
        ? { all: true }
        : isWholesale !== undefined
          ? { isWholesale }
          : undefined,
  });
  return data.data;
};

export const useCategories = (
  isWholesale?: CategoryFilter,
  options?: Omit<UseQueryOptions<Category[], Error, Category[], (string | boolean | undefined)[]>, "queryKey" | "queryFn">
): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: ["categories", isWholesale],
    queryFn: () => getCategories(isWholesale),
    ...options
  });
};

const createCategory = async (data: {
  name: string;
  image?: string;
  appearOnHome: boolean;
  isWholesale?: boolean;
}) => {
  const res = await api.post("/categories", data);
  return res.data.data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onMutate: () => {
      return { toastId: toast.loading("Creating category...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Category created successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create category";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

const updateCategory = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name?: string;
    image?: string;
    appearOnHome?: boolean;
    isWholesale?: boolean;
  };
}) => {
  const res = await api.patch(`/categories/${id}`, data);
  return res.data.data;
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onMutate: () => {
      return { toastId: toast.loading("Updating category...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Category updated successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update category";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

const deleteCategory = async (id: string) => {
  await api.delete(`/categories/${id}`);
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onMutate: () => {
      return { toastId: toast.loading("Deleting category...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Category deleted successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: AxiosError<{ message: string }>, __, context) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete category";
      toast.error(msg, { id: context?.toastId });
    },
  });
};
