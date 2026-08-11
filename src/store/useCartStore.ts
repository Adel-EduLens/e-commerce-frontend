import { create } from "zustand";
import { cartApi } from "../services/cartApi";
import { useAuthStore } from "./useAuthStore";
import { useWholesaleCartStore } from "./useWholesaleCartStore";

export type CartItem = {
  id: string;
  productId: string;
  categoryId?: string;
  categoryIds?: string[];
  category?: { id?: string | number; name?: string } | null;
  categories?: ({ id?: string | number; name?: string } | string | number)[] | null;
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
  depositAmount?: number;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
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

type CartDbItem = {
  id: string;
  productId: string;
  categoryIds?: string[];
  title: string;
  price: number;
  size?: string | null;
  color?: string | null;
  quantity: number;
  imageSrc?: string | null;
  image?: string | null;
  minOrder?: number;
  productType?: CartItem["productType"];
};

const mapCartDbItem = (dbItem: CartDbItem): CartItem => ({
  id: dbItem.id,
  productId: dbItem.productId,
  categoryIds: dbItem.categoryIds,
  title: dbItem.title,
  unitPrice: dbItem.price,
  currency: "EGP",
  size: dbItem.size || "",
  color: dbItem.color || "",
  colorHex: dbItem.color || "",
  imageSrc: dbItem.imageSrc || dbItem.image || "",
  quantity: dbItem.quantity,
  minOrder: dbItem.minOrder,
  productType: dbItem.productType,
});

export const useCartStore = create<CartStore>()((set, get) => ({
  items: INITIAL_CART_ITEMS,

  addItem: async (item) => {
    if (item.productType === "WHOLESALE") {
      await useWholesaleCartStore.getState().addItem(item);
      return;
    }

    // 1. Optimistic local state update
    set((state) => {
      const existingItem = state.items.find(
        (currentItem) =>
          currentItem.id === item.id ||
          (currentItem.productId === item.productId &&
            (currentItem.size || "") === (item.size || "") &&
            (currentItem.color || "") === (item.color || "") &&
            (currentItem.productType || "") === (item.productType || ""))
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
        const res = await cartApi.addProductToCart({
          productId: item.productId,
          quantity: item.quantity,
          colorId: item.color,
          sizeId: item.size,
          productType: item.productType,
        });

        if (res && res.data && res.data.items) {
          get().setItems(res.data.items.map(mapCartDbItem));
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
          get().setItems(res.data.items.map(mapCartDbItem));
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
          get().setItems(res.data.items.map(mapCartDbItem));
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
    const nonWholesaleItems = items.filter((item) => item.productType !== "WHOLESALE");
    const sortedItems = [...nonWholesaleItems].sort((a, b) => a.id.localeCompare(b.id));
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



export const useRentalCartItems = () => {
  const items = useCartStore((state) => state.items);
  return items.filter((item) => item.productType !== "WHOLESALE");
};

export const useRentalCartCount = () => {
  const items = useCartStore((state) => state.items);
  return items
    .filter((item) => item.productType !== "WHOLESALE")
    .reduce((total, item) => total + item.quantity, 0);
};

export const useRentalCartSubtotal = () => {
  const items = useCartStore((state) => state.items);
  return items
    .filter((item) => item.productType !== "WHOLESALE")
    .reduce((total, item) => total + item.unitPrice * item.quantity, 0);
};

export const useRetailCartItems = useRentalCartItems;
export const useRetailCartCount = useRentalCartCount;
export const useRetailCartSubtotal = useRentalCartSubtotal;

// Clear cart items when user logs out
useAuthStore.subscribe((state) => {
  if (!state.isAuthenticated) {
    useCartStore.setState({ items: [] });
  }
});
