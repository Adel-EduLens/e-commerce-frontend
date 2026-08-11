import type { Product } from "./product";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  image: string;
  appearOnHome: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFormData {
  name: string;
  description?: string;
  image: string;
  appearOnHome: boolean;
  productIds?: string[];
}

export interface CollectionFormModalProps {
  collection?: Collection;
  onSave: (data: {
    name: string;
    description: string;
    image: string;
    appearOnHome: boolean;
    productIds: string[];
  }) => void;
  onClose: () => void;
}
