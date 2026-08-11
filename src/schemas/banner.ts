export interface ShopBanner {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  backgroundColor: string;
  isActive: boolean;
  order: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopBannerData {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  backgroundColor: string;
  isActive?: boolean;
  order?: number;
  type?: string;
}

export interface UpdateShopBannerData {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  backgroundColor?: string;
  isActive?: boolean;
  order?: number;
  type?: string;
}

export interface ShopBannerFormModalProps {
  banner?: ShopBanner;
  onSave: (data: {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    image: string;
    backgroundColor: string;
    isActive: boolean;
    order: number;
  }) => void;
  onClose: () => void;
}
