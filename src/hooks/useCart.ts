import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "../services/cartApi";
import { useCartStore } from "../store/useCartStore";
import { useWholesaleCartStore } from "../store/useWholesaleCartStore";

import type { CartItem } from "../types/cart";

import { useAuthStore } from "../store/useAuthStore";

export function useCart() {
  const setItems = useCartStore((state) => state.setItems);
  const setWholesaleItems = useWholesaleCartStore((state) => state.setItems);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["cart", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      const data = await cartApi.getCart();
      if (data && data.data && data.data.items) {
        const mappedItems = data.data.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          categoryIds: item.categoryIds,
          title: item.title,
          unitPrice: item.price,
          currency: "EGP",
          size: item.size || "",
          color: item.color || "",
          colorHex: item.color || "",
          imageSrc: item.imageSrc || item.image || "",
          quantity: item.quantity,
          minOrder: item.minOrder,
          productType: item.productType,
        }));

        setItems(mappedItems.filter((i: any) => i.productType !== "WHOLESALE"));
        setWholesaleItems(mappedItems.filter((i: any) => i.productType === "WHOLESALE"));
      }
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddProductToCart() {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, { cartItem: CartItem; apiPayload: any }>({
    mutationFn: async (payload) => {
      await cartApi.addProductToCart(payload.apiPayload);
      return payload.cartItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to add to cart: ${error?.message ?? "Unknown error"}`,
      );
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { itemId: string | number; quantity: number }
  >({
    mutationFn: async ({ itemId, quantity }) => {
      const data = await cartApi.updateCartItem(itemId, quantity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart updated");
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to update cart item: ${error?.message ?? "Unknown error"}`,
      );
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string | number>({
    mutationFn: async (itemId) => {
      const data = await cartApi.removeCartItem(itemId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to remove cart item: ${error?.message ?? "Unknown error"}`,
      );
    },
  });
}
