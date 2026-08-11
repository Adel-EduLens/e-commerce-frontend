export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
}

export interface BrandFormModalProps {
  brand?: Brand | null;
  onSave: (data: BrandFormData) => void;
  onClose: () => void;
}
