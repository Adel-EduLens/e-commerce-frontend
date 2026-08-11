export type InventoryStatus = "Active" | "Low Stock" | "Out of Stock";
export type ProductInventoryType = "product" | "wholesale" | "retail" | "blank" | "gift_card";

export interface InventoryItem {
  id: string;
  image: string;
  imagesByColor: { url: string; color?: string; direction?: string }[];
  product: string;
  categories: { id: string; name: string }[];
  categoryIds: string[];
  stock: number;
  sku: string;
  price: string;
  priceNum: number;
  giftCardAmounts?: string | null;
  depositAmount?: number;
  securityDeposit?: number;
  date: string;
  createdAtRaw: number;
  status: InventoryStatus;
  type: ProductInventoryType;
  description: string;
  sizes: string[];
  colors: string[];
  minOrder: number;
  brandId?: string;
  isMustHave: boolean;
  isFlashDeals: boolean;
  flashDealPrice: number | null;
  flashDealEndsAt: string | null;
  isBestDeal: boolean;
  isMostPopular: boolean;
  isPremiumCollection: boolean;
  appearOnHome: boolean;
  sizeguide?: string | null;
  categoryNames?: string;
}

export interface BlankProductFormModalProps {
  item?: InventoryItem | null;
  onClose: () => void;
}

export interface UnifiedProductModalProps {
  item?: InventoryItem | null;
  productType?: "SHOP" | "WHOLESALE" | "RENTAL";
  onClose: () => void;
}

export interface GiftCardModalProps {
  item?: InventoryItem | null;
  onClose: () => void;
}

export interface InventoryTablePanelProps {
  activeTab: ProductInventoryType;
  items: InventoryItem[];
  isLoading: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}
