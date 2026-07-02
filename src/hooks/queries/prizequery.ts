import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { toast } from "sonner";
export interface Prize {
  id: string;
  name: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}
// api/prize.api.ts

export const usePrizes = () => {
  const getPrizes = async  () :Promise<Prize[]>=> {
    const { data } = await api.get("/prizes");
    return data.data;
  };

  return useQuery({
    queryKey: ["prizes"],
    queryFn: getPrizes,
  });
};

export const useAddPrize = () => {
  const queryClient = useQueryClient();

  const addPrize = async (body: { name: string; weight: number }) => {
    const { data } = await api.post("/prizes", body);
    return data.data;
  };

  return useMutation({
    mutationFn: addPrize,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prizes"],
      });
    },
  });
};

export const useDeletePrize = () => {
  const queryClient = useQueryClient();
  const deletePrize = async (id: string) => {
    const { data } = await api.delete(`/prizes/${id}`);
    return data.data;
  };

  return useMutation({
    mutationFn: deletePrize,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prizes"],
      });
    },
  });
};

export const useSpinPrize = () => {
  const spinPrize = async () => {
    const { data } = await api.post("/prizes/spin");
    return data.data;
  };
  return useMutation({
    mutationFn: spinPrize,
  });
};
