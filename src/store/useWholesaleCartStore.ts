import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./useCartStore";

type WholesaleCartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
};

export const useWholesaleCartStore = create<WholesaleCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (ci) =>
              ci.id === item.id ||
              (ci.productId === item.productId &&
                (ci.color || "") === (item.color || ""))
          );
          if (existing) {
            return {
              items: state.items.map((ci) =>
                ci.id === existing.id
                  ? { ...ci, quantity: ci.quantity + item.quantity }
                  : ci
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      incrementQuantity: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (item) get().updateQuantity(itemId, item.quantity + 1);
      },

      decrementQuantity: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (item) get().updateQuantity(itemId, Math.max(1, item.quantity - 1));
      },

      clearCart: () => set({ items: [] }),

      setItems: (items) => set({ items }),
    }),
    {
      name: "wholesale-cart",
    }
  )
);

// Selectors
export const useWholesaleCartItems = () =>
  useWholesaleCartStore((s) => s.items);

export const useWholesaleCartCount = () =>
  useWholesaleCartStore((s) =>
    s.items.reduce((total, item) => total + item.quantity, 0)
  );

export const useWholesaleCartSubtotal = () =>
  useWholesaleCartStore((s) =>
    s.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  );
