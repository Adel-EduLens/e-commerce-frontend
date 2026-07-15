import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  comment?: string;
}

const getReviews = async (productId: string): Promise<Review[]> => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data.data || [];
};

const createReview = async (input: CreateReviewInput): Promise<Review> => {
  const { data } = await api.post(`/reviews`, input);
  return data.data;
};

const updateReview = async ({ id, ...input }: UpdateReviewInput): Promise<Review> => {
  const { data } = await api.patch(`/reviews/${id}`, input);
  return data.data;
};

export const useReviews = (productId?: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId!),
    enabled: !!productId,
  });
};

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // يعمل ريفريش لليست بعد الإضافة
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
};

export const useUpdateReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};

export const useProductReviews = (productId?: string) => {
  return useReviews(productId);
};