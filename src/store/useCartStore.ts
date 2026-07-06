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
  getItemCount: () => number;
  getSubtotal: () => number;
};

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "plain-maxi-tabard-dress-M-Black",
    productId: "plain-maxi-tabard-dress",
    title: "Plain Maxi Tabard Dress",
    unitPrice: 1000,
    currency: "EGP",
    size: "M",
    color: "Black",
    colorHex: "#1A1A1A",
    imageSrc: "/home%20page/image%2011.png",
    quantity: 1,
  },
];

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

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        ),
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
