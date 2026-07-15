import { create } from "zustand";
import { cartApi } from "../services/cartApi";
import { useAuthStore } from "./useAuthStore";

export type CartItem = {
  id: string;
  productId: string;
  retailProductId?: string | number | null;
  wholesaleProductId?: string | number | null;
  categoryId?: string;
  title: string;
  unitPrice: number;
  currency: "EGP";
  size: string;
  color: string;
  colorHex: string;
  imageSrc: string;
  quantity: number;
  minOrder?: number;
  productType?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  incrementQuantity: (itemId: string) => Promise<void>;
  decrementQuantity: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
};

const INITIAL_CART_ITEMS: CartItem[] = [];

export const useCartStore = create<CartStore>()((set, get) => ({
  items: INITIAL_CART_ITEMS,

  addItem: async (item) => {
    // 1. Optimistic local state update
    set((state) => {
      const existingItem = state.items.find(
        (currentItem) =>
          currentItem.id === item.id ||
          (currentItem.productId === item.productId &&
            (currentItem.size || "") === (item.size || "") &&
            (currentItem.color || "") === (item.color || ""))
      );

      if (existingItem) {
        return {
          items: state.items.map((currentItem) =>
            currentItem.id === existingItem.id
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

    // 2. Sync to database if logged in
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      try {
        const isRetail = item.id.includes('retail') || !isNaN(Number(item.productId));
        let res;
        if (isRetail) {
          res = await cartApi.addRetailProductToCart({
            retailProductId: item.productId,
            quantity: item.quantity,
            retailColorId: item.color,
            retailSizeId: item.size,
          });
        } else {
          res = await cartApi.addProductToCart({
            productId: item.productId,
            quantity: item.quantity,
            colorId: item.color,
            sizeId: item.size,
          });
        }

        if (res && res.data && res.data.items) {
          get().setItems(
            res.data.items.map((dbItem: any) => ({
              id: dbItem.id,
              productId: dbItem.productId,
              categoryId: dbItem.categoryId,
              title: dbItem.title,
              unitPrice: dbItem.price,
              currency: "EGP",
              size: dbItem.size || "",
              color: dbItem.color || "",
              colorHex: dbItem.color || "",
              imageSrc: dbItem.imageSrc || "",
              quantity: dbItem.quantity,
              minOrder: dbItem.minOrder,
              productType: dbItem.productType,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to sync add item to DB:", error);
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
        const res = await cartApi.removeCartItem(itemId);
        if (res && res.data && res.data.items) {
          get().setItems(
            res.data.items.map((dbItem: any) => ({
              id: dbItem.id,
              productId: dbItem.productId,
              categoryId: dbItem.categoryId,
              title: dbItem.title,
              unitPrice: dbItem.price,
              currency: "EGP",
              size: dbItem.size || "",
              color: dbItem.color || "",
              colorHex: dbItem.color || "",
              imageSrc: dbItem.imageSrc || "",
              quantity: dbItem.quantity,
              minOrder: dbItem.minOrder,
              productType: dbItem.productType,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to sync remove item from DB:", error);
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
        const res = await cartApi.updateCartItem(itemId, quantity);
        if (res && res.data && res.data.items) {
          get().setItems(
            res.data.items.map((dbItem: any) => ({
              id: dbItem.id,
              productId: dbItem.productId,
              categoryId: dbItem.categoryId,
              title: dbItem.title,
              unitPrice: dbItem.price,
              currency: "EGP",
              size: dbItem.size || "",
              color: dbItem.color || "",
              colorHex: dbItem.color || "",
              imageSrc: dbItem.imageSrc || "",
              quantity: dbItem.quantity,
              minOrder: dbItem.minOrder,
              productType: dbItem.productType,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to sync update quantity to DB:", error);
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
        console.error("Failed to sync clear cart to DB:", error);
      }
    }
  },

  setItems: (items) => {
    const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id));
    const currentItems = get().items;
    if (JSON.stringify(currentItems) !== JSON.stringify(sortedItems)) {
      set({ items: sortedItems });
    }
  },
}));

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

// Clear cart items when user logs out
useAuthStore.subscribe((state) => {
  if (!state.isAuthenticated) {
    useCartStore.setState({ items: [] });
  }
});
