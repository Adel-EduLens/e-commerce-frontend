import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  categoryId?: string;
  title: string;
  unitPrice: number;
  currency: "EGP";
  size: string;
  color: string;
  colorHex: string;
  imageSrc: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
};

const INITIAL_CART_ITEMS: CartItem[] = [];

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: INITIAL_CART_ITEMS,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (currentItem) => currentItem.id === item.id
          );

          if (existingItem) {
            return {
              items: state.items.map((currentItem) =>
                currentItem.id === item.id
                  ? {
                      ...currentItem,
                      quantity: currentItem.quantity + item.quantity,
                    }
                  : currentItem
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      incrementQuantity: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },

      decrementQuantity: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    )
  );
