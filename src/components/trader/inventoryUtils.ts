import { api } from "../../lib/axios";

// ─── Asset helper ──────────────────────────────────────────────────────────────
export const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;

// ─── Types ─────────────────────────────────────────────────────────────────────
export type InventoryStatus = "Active" | "Low Stock" | "Out of Stock";
export type ProductType = "product" | "wholesale" | "retail" | "blank" | "gift_card";

export interface InventoryItem {
  id: string;
  image: string;
  imagesByColor: { url: string; color?: string; direction?: string }[];
  product: string;
  categories: { id: string, name: string }[];
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
  type: ProductType;
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
}

// ─── Constants ─────────────────────────────────────────────────────────────────
export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow",
  "Orange", "Purple", "Pink", "Gray", "Brown", "Beige", "Navy",
];
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getStatus(stock: number): InventoryStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= 20) return "Low Stock";
  return "Active";
}

export function statusPill(status: InventoryStatus) {
  if (status === "Active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Low Stock") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

export function typePill(type: ProductType) {
  return type === "wholesale"
    ? { bg: "bg-blue-50", text: "text-blue-700", label: "Wholesale" }
    : { bg: "bg-violet-50", text: "text-violet-700", label: "Product" };
}

export function getColorVar(colorName: string | undefined): string {
  if (!colorName) return "transparent";
  const formatted = colorName.toLowerCase().replace(/\s+/g, '-');
  return `var(--color-${formatted}, ${colorName.toLowerCase()})`;
}

// ─── Upload helper ─────────────────────────────────────────────────────────────
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload/product-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url;
}
