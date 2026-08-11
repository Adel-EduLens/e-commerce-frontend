import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "../../lib/axios";

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getBrands = async (): Promise<Brand[]> => {
  const { data } = await api.get("/brands");
  return data.data;
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
};

const createBrand = async (data: { name: string }) => {
  const response = await api.post("/brands", data);
  return response.data.data as Brand;
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onMutate: () => ({ toastId: toast.loading("Creating brand...") }),
    onSuccess: (_, __, context) => {
      toast.success("Brand created successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error: AxiosError<{ message?: string }>, __, context) => {
      toast.error(
        error.response?.data?.message || error.message || "Failed to create brand",
        { id: context?.toastId },
      );
    },
  });
};

const updateBrand = async ({
  id,
  data,
}: {
  id: string;
  data: { name: string };
}) => {
  const response = await api.patch(`/brands/${id}`, data);
  return response.data.data as Brand;
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onMutate: () => ({ toastId: toast.loading("Updating brand...") }),
    onSuccess: (_, __, context) => {
      toast.success("Brand updated successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
    },
    onError: (error: AxiosError<{ message?: string }>, __, context) => {
      toast.error(
        error.response?.data?.message || error.message || "Failed to update brand",
        { id: context?.toastId },
      );
    },
  });
};

const deleteBrand = async (id: string) => {
  await api.delete(`/brands/${id}`);
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,
    onMutate: () => ({ toastId: toast.loading("Deleting brand...") }),
    onSuccess: (_, __, context) => {
      toast.success("Brand deleted successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });
    },
    onError: (error: AxiosError<{ message?: string }>, __, context) => {
      toast.error(
        error.response?.data?.message || error.message || "Failed to delete brand",
        { id: context?.toastId },
      );
    },
  });
};
