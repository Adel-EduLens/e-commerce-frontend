import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface TermsSection {
  id?: string;
  title: string;
  content: string;
  order: number;
}

export interface TermsAndConditions {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: TermsSection[];
}

export const useAllTerms = () => {
  return useQuery<TermsAndConditions[]>({
    queryKey: ["terms"],
    queryFn: async () => {
      const { data } = await api.get("/terms");
      return data?.data || [];
    },
  });
};

export const useLatestTerms = () => {
  return useQuery<TermsAndConditions>({
    queryKey: ["terms", "latest"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/terms/latest");
        return data?.data || null;
      } catch (err: any) {
        if (err?.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
  });
};

export const useTermsById = (id: string) => {
  return useQuery<TermsAndConditions>({
    queryKey: ["terms", id],
    queryFn: async () => {
      const { data } = await api.get(`/terms/${id}`);
      return data?.data || null;
    },
    enabled: !!id,
  });
};

export const useAddTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { sections: TermsSection[] }) => {
      const { data } = await api.post("/terms", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "latest"] });
    },
  });
};

export const useUpdateTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { sections: TermsSection[] } }) => {
      const { data } = await api.put(`/terms/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "latest"] });
    },
  });
};

export const useDeleteTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/terms/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "latest"] });
    },
  });
};

export const useActivateTerms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/terms/${id}/activate`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      queryClient.invalidateQueries({ queryKey: ["terms", "latest"] });
    },
  });
};
