import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "../services/cartApi";
import { useAuthStore } from "./useAuthStore";
import type { CartItem } from "./useCartStore";

export type WholesaleCartItem = CartItem;

type WholesaleCartStore = {
  items: WholesaleCartItem[];
  addItem: (item: WholesaleCartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  incrementQuantity: (itemId: string) => Promise<void>;
  decrementQuantity: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setItems: (items: WholesaleCartItem[]) => void;
};

export const useWholesaleCartStore = create<WholesaleCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (item) => {
        const wholesaleItem = { ...item, productType: "WHOLESALE" };

        set((state) => {
          const existingItem = state.items.find(
            (currentItem) =>
              currentItem.id === wholesaleItem.id ||
              (currentItem.productId === wholesaleItem.productId &&
                (currentItem.color || "").toLowerCase() === (wholesaleItem.color || "").toLowerCase())
          );

          if (existingItem) {
            return {
              items: state.items.map((currentItem) =>
                currentItem.id === existingItem.id
                  ? {
                      ...currentItem,
                      quantity: currentItem.quantity + wholesaleItem.quantity,
                    }
                  : currentItem
              ),
            };
          }

          return {
            items: [...state.items, wholesaleItem],
          };
        });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await cartApi.addProductToCart({
              productId: wholesaleItem.productId,
              quantity: wholesaleItem.quantity,
              colorId: wholesaleItem.color,
              sizeId: wholesaleItem.size,
              productType: "WHOLESALE",
            });
          } catch (error) {
            console.error("Failed to sync wholesale add item to DB:", error);
          }
        }
      },

      removeItem: async (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await cartApi.removeCartItem(itemId);
          } catch (error) {
            console.error("Failed to sync remove wholesale item from DB:", error);
          }
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await cartApi.updateCartItem(itemId, quantity);
          } catch (error) {
            console.error("Failed to sync update wholesale quantity to DB:", error);
          }
        }
      },

      incrementQuantity: async (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (item) {
          await get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      decrementQuantity: async (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (item) {
          await get().updateQuantity(itemId, Math.max(1, item.quantity - 1));
        }
      },

      clearCart: async () => {
        set({ items: [] });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          try {
            await cartApi.clearCart();
          } catch (error) {
            console.error("Failed to sync clear wholesale cart to DB:", error);
          }
        }
      },

      setItems: (items) => {
        const wholesaleItems = items.filter((item) => item.productType === "WHOLESALE");
        const sortedItems = [...wholesaleItems].sort((a, b) => a.id.localeCompare(b.id));
        const currentItems = get().items;
        if (JSON.stringify(currentItems) !== JSON.stringify(sortedItems)) {
          set({ items: sortedItems });
        }
      },
    }),
    {
      name: "wholesale-cart-storage",
    }
  )
);

export const useWholesaleCartItems = () =>
  useWholesaleCartStore((state) => state.items);

export const useWholesaleCartCount = () =>
  useWholesaleCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

export const useWholesaleCartSubtotal = () =>
  useWholesaleCartStore((state) =>
    state.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    )
  );

// Reset wholesale cart on logout
useAuthStore.subscribe((state) => {
  if (!state.isAuthenticated) {
    useWholesaleCartStore.getState().clearCart();
  }
});
