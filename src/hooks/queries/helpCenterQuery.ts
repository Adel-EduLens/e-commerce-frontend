import { useQuery } from '@tanstack/react-query';
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
