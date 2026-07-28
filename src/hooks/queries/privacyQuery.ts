import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface PrivacySection {
  id?: string;
  title: string;
  content: string;
  order: number;
}

export interface PrivacyPolicy {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: PrivacySection[];
}

export const useAllPrivacy = () => {
  return useQuery<PrivacyPolicy[]>({
    queryKey: ["privacy"],
    queryFn: async () => {
      const { data } = await api.get("/privacy");
      return data?.data || [];
    },
  });
};

export const useLatestPrivacy = () => {
  return useQuery<PrivacyPolicy>({
    queryKey: ["privacy", "latest"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/privacy/latest");
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

export const usePrivacyById = (id: string) => {
  return useQuery<PrivacyPolicy>({
    queryKey: ["privacy", id],
    queryFn: async () => {
      const { data } = await api.get(`/privacy/${id}`);
      return data?.data || null;
    },
    enabled: !!id,
  });
};

export const useAddPrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { sections: PrivacySection[] }) => {
      const { data } = await api.post("/privacy", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy"] });
      queryClient.invalidateQueries({ queryKey: ["privacy", "latest"] });
    },
  });
};

export const useUpdatePrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { sections: PrivacySection[] } }) => {
      const { data } = await api.put(`/privacy/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy"] });
      queryClient.invalidateQueries({ queryKey: ["privacy", "latest"] });
    },
  });
};

export const useDeletePrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/privacy/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy"] });
      queryClient.invalidateQueries({ queryKey: ["privacy", "latest"] });
    },
  });
};

export const useActivatePrivacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/privacy/${id}/activate`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy"] });
      queryClient.invalidateQueries({ queryKey: ["privacy", "latest"] });
    },
  });
};
