import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export type HelpVideo = {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
};

export const useUserHelpCenterVideos = (category: string) => {
  return useQuery<HelpVideo[]>({
    queryKey: ['help-center', 'user', category],
    queryFn: async () => {
      const { data } = await api.get(`/user/help-center/${category}`);
      return data?.data || [];
    },
    enabled: !!category,
  });
};

export const useAdminHelpCenterVideos = () => {
  return useQuery<HelpVideo[]>({
    queryKey: ['help-center', 'admin'],
    queryFn: async () => {
      const { data } = await api.get('/admin/help-center/video');
      return data?.data || [];
    },
  });
};

export type HelpCenterCategory = {
  id: string;
  name: string;
};

export const useHelpCenterCategories = () => {
  return useQuery<HelpCenterCategory[]>({
    queryKey: ['help-center', 'admin', 'categories'],
    queryFn: async () => {
      const { data } = await api.get('/admin/help-center/category');
      return data?.data || [];
    },
  });
};

export const useUserHelpCenterCategories = () => {
  return useQuery<HelpCenterCategory[]>({
    queryKey: ['help-center', 'user', 'categories'],
    queryFn: async () => {
      const { data } = await api.get('/user/help-center/categories');
      return data?.data || [];
    },
  });
};

export const useTraderHelpCenterVideos = () => {
  return useQuery<HelpVideo[]>({
    queryKey: ['help-center', 'trader'],
    queryFn: async () => {
      const { data } = await api.get('/trader/help-center/video');
      return data?.data || [];
    },
  });
};

export const useTraderHelpCenterCategories = () => {
  return useQuery<HelpCenterCategory[]>({
    queryKey: ['help-center', 'trader', 'categories'],
    queryFn: async () => {
      const { data } = await api.get('/trader/help-center/category');
      return data?.data || [];
    },
  });
};

export const useAddTraderVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; category: string; youtubeId: string }) => {
      const { data } = await api.post('/trader/help-center/video', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-center', 'trader'] });
    },
  });
};

export const useUpdateTraderVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { title: string; category: string; youtubeId: string } }) => {
      const { data } = await api.put(`/trader/help-center/video/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-center', 'trader'] });
    },
  });
};

export const useDeleteTraderVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/trader/help-center/video/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-center', 'trader'] });
    },
  });
};

export const useAddTraderCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data } = await api.post('/trader/help-center/category', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-center', 'trader', 'categories'] });
    },
  });
};

export const useDeleteTraderCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/trader/help-center/category/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-center', 'trader', 'categories'] });
    },
  });
};
