import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export type VoteDesign = {
  id: string;
  imagePath: string;
  description?: string;
  title?: string;
  votes?: number;
  hasVoted?: boolean;
};

export const useDesigns = () => {
  return useQuery<VoteDesign[]>({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data } = await api.get('/trader/designs/images');
      return data?.data?.images || [];
    },
  });
};
