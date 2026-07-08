import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Address {
  id: string;
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment?: string;
}

export interface UpdateAddressData {
  country?: string;
  city?: string;
  area?: string;
  streetAddress?: string;
  apartment?: string;
}

// GET MY ADDRESSES

const getMyAddresses = async (): Promise<Address[]> => {
  const { data } = await api.get("/address/my");

  return data.data;
};

export const useMyAddresses = () => {
  return useQuery({
    queryKey: ["my-addresses"],
    queryFn: getMyAddresses,
  });
};

// ADD ADDRESS

const addAddress = async (data: CreateAddressData) => {
  const response = await api.post("/address", data);

  return response.data.data;
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-addresses"],
      });
    },
  });
};

// UPDATE ADDRESS

const updateAddress = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateAddressData;
}) => {
  const response = await api.patch(`/address/${id}`, data);

  return response.data.data;
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-addresses"],
      });
    },
  });
};

// DELETE ADDRESS

const deleteAddress = async (id: string) => {
  await api.delete(`/address/${id}`);
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-addresses"],
      });
    },
  });
};
