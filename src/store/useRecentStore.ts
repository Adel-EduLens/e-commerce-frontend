import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type RecentProduct = {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  sizes: { size: string }[];
  rating?: number;
};

type RecentStore = {
  products: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
  clearRecent: () => void;
};

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) => {
        set((state) => {
          // Remove the product if it already exists to move it to the top
          const filtered = state.products.filter((p) => p.id !== product.id);
          // Keep only the most recent 12 products
          const updated = [product, ...filtered].slice(0, 12);
          return { products: updated };
        });
      },

      clearRecent: () => {
        set({ products: [] });
      },
    }),
    {
      name: "recently-viewed-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
