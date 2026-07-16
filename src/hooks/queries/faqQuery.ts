import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
};

export const usePublicFAQs = () => {
  return useQuery<FAQ[]>({
    queryKey: ['faqs', 'public'],
    queryFn: async () => {
      const { data } = await api.get('/trader/faqs/questions/public');
      return data?.data || [];
    },
  });
};

export const useFAQs = () => {
  return useQuery<FAQ[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data } = await api.get('/trader/faqs/questions');
      return data?.data || [];
    },
  });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { question: string; answer: string }) => {
      const { data } = await api.post('/trader/faqs/questions', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs', 'public'] });
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: { question: string; answer: string } }) => {
      const { data } = await api.put(`/trader/faqs/questions/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs', 'public'] });
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/trader/faqs/questions/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs', 'public'] });
    },
  });
};
