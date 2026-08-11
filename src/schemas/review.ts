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

export interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export interface ReviewsSectionProps {
  productId: string;
  productName?: string;
}
