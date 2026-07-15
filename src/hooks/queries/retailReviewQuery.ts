import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface RetailReview {
  id: string;
  retailProductId: number;
  userId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string | null;
  };
}

export interface CreateRetailReviewInput {
  retailProductId: number;
  rating: number;
  comment?: string;
}

export interface UpdateRetailReviewInput {
  id: string;
  rating?: number;
  comment?: string;
}

// ================= API =================

const getRetailProductReviews = async (
  productId: number,
): Promise<RetailReview[]> => {
  const { data } = await api.get(`/retail-reviews/product/${productId}`);
  return data.data || [];
};

const createRetailReview = async (
  review: CreateRetailReviewInput,
): Promise<RetailReview> => {
  const { data } = await api.post("/retail-reviews", review);
  return data.data;
};

const updateRetailReview = async (
  review: UpdateRetailReviewInput,
): Promise<RetailReview> => {
  const { id, ...body } = review;

  const { data } = await api.patch(`/retail-reviews/${id}`, body);
  return data.data;
};

const deleteRetailReview = async (id: string) => {
  const { data } = await api.delete(`/retail-reviews/${id}`);
  return data.data;
};

// ================= Hooks =================

export function useRetailReviews(retailProductId?: number | string) {
  return useQuery({
    queryKey: ["retailReviews", retailProductId],
    queryFn: () => getRetailProductReviews(Number(retailProductId)),
    enabled: !!retailProductId,
  });
}

export function useCreateRetailReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRetailReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["retailReviews", productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["retailProduct", productId],
      });
    },
  });
}

export function useUpdateRetailReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRetailReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["retailReviews", productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["retailProduct", productId],
      });
    },
  });
}

export function useDeleteRetailReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      retailProductId,
    }: {
      id: string;
      retailProductId: number;
    }) =>
      deleteRetailReview(id).then(() => ({
        retailProductId,
      })),

    onSuccess: ({ retailProductId }) => {
      queryClient.invalidateQueries({
        queryKey: ["retailReviews", retailProductId],
      });

      queryClient.invalidateQueries({
        queryKey: ["retailProduct", retailProductId],
      });

      queryClient.invalidateQueries({
        queryKey: ["retailProducts"],
      });
    },
  });
}