import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export type VoteDesign = {
  id: string;
  title: string;
  imagePath: string;
  votes?: number;
};

export const useDesigns = () => {
  return useQuery<VoteDesign[]>({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data } = await api.get('/upload/images');
      return data?.data?.images || [];
    },
  });
};
