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

export type DesignVoter = {
  id: number;
  userId: number;
  userRole: string;
  name: string;
  email: string;
  phone?: string | null;
  votedAt: string;
};

export type DesignVotesData = {
  design: {
    id: string;
    description: string;
    imagePath: string;
    votes: number;
    totalVoters: number;
  };
  voters: DesignVoter[];
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

export const useDesignVotes = (id: string | undefined) => {
  return useQuery<DesignVotesData>({
    queryKey: ['design-votes', id],
    queryFn: async () => {
      if (!id) throw new Error('Design ID is required');
      const { data } = await api.get(`/trader/designs/${id}/votes`);
      return data?.data;
    },
    enabled: Boolean(id),
  });
};
