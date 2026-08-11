import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
export interface Prize {
  id: string;
  name: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

const getPrizes = async (): Promise<Prize[]> => {
  const { data } = await api.get("/prizes");
  return data.data;
};
export const usePrizes = () => {
  return useQuery({
    queryKey: ["prizes"],
    queryFn: getPrizes,
  });
};

const addPrize = async (body: { name: string; weight: number }) => {
  const { data } = await api.post("/prizes", body);
  return data.data;
};
export const useAddPrize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPrize,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prizes"],
      });
    },
  });
};

const deletePrize = async (id: string) => {
  const { data } = await api.delete(`/prizes/${id}`);
  return data.data;
};
export const useDeletePrize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrize,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prizes"],
      });
    },
  });
};

const spinPrize = async () => {
  const { data } = await api.post("/prizes/spin");
  return data.data;
};
export const useSpinPrize = () => {
  return useMutation({
    mutationFn: spinPrize,
  });
};
