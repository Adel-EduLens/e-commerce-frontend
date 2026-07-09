import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

export const useTopCategories = (limit = 3) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<string[]>({
    queryKey: ["recommendation", "top-categories", limit],
    queryFn: async () => {
      const { data } = await api.get(`/recommend/top-categories?limit=${limit}`);
      return data?.data || [];
    },
    enabled: isAuthenticated,
  });
};

export const useAddSignalMutation = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useMutation({
    mutationFn: async (payload: { productId: string; categoryId: string; type: "view" | "purchase" }) => {
      if (!isAuthenticated) return null;
      const { data } = await api.post("/recommend", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendation", "top-categories"] });
    },
  });
};

export const useClearSignalsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete("/recommend");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendation", "top-categories"] });
    },
  });
};
