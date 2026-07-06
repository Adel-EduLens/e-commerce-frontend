import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

const getReviews = async (productId: string): Promise<Review[]> => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data.data || [];
};

export const useReviews = (productId?: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId!),
    enabled: !!productId,
  });
};