import { useQuery } from '@tanstack/react-query';
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
      const { data } = await api.get('/admin/faqs/questions/public');
      return data?.data || [];
    },
  });
};
