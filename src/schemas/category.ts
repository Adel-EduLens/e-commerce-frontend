export type CategoryFilter = string | boolean | "all" | undefined;

export interface Category {
  id: string;
  name: string;
  image?: string;
  appearOnHome: boolean;
  isWholesale?: boolean;
  isRental?: boolean;
  isRetail?: boolean;
  isShop?: boolean;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  image?: string;
  appearOnHome: boolean;
  types?: string[];
  isWholesale?: boolean;
}

export interface CategoryFormModalProps {
  category?: Category;
  onSave: (data: {
    name: string;
    image: string;
    appearOnHome: boolean;
    types: string[];
    isWholesale?: boolean;
  }) => void;
  onClose: () => void;
}

export interface WholesaleCategory {
  id: string;
  name: string;
  image?: string;
  appearOnHome: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WholesaleCategoryFormModalProps {
  category?: WholesaleCategory;
  onSave: (data: {
    name: string;
    image: string;
    appearOnHome: boolean;
  }) => void;
  onClose: () => void;
}
