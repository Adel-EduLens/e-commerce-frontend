import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type InventoryItem,
  getStatus,
} from "../../components/trader/inventoryUtils";
import {
  InventoryTablePanel,
} from "../../components/trader/InventoryShared";
import { useTraderProducts, useDeleteProduct } from "../../hooks/queries/productsQuery";

export function TraderWholeSaleProductsTable({ onEdit }: { onEdit: (item: InventoryItem) => void }) {
  const { t } = useTranslation("traderWholesale");

  const {
    data: traderWholesales = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderProducts("WHOLESALE");
  const deleteWholesale = useDeleteProduct();

  const items: InventoryItem[] = traderWholesales.map((w) => ({
    id: w.id,
    image: w.images[0]?.url ?? "",
    imagesByColor: w.images.map((img) => ({
      url: img.url,
      color: img.color ?? undefined,
    })),
    product: w.name,
    categories: w.categories?.map(c => ({ id: c.id, name: c.name })) || [],
    categoryIds: w.categories?.map(c => String(c.id)) || [],
    brandId: "",
    stock: w.stock ?? 0,
    sku: w.sku ?? "",
    price: `$${w.wholesalePrice ?? w.price ?? 0}`,
    priceNum: w.wholesalePrice ?? w.price ?? 0,
    date: new Date(w.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    createdAtRaw: new Date(w.createdAt).getTime(),
    status: getStatus(w.stock ?? 0),
    type: "wholesale" as const,
    description: w.description ?? "",
    sizes: Array.from(new Set(w.colors?.flatMap(wc => wc.variants?.map(s => s.size)) || [])),
    colors: w.colors?.map(wc => wc.colorName || wc.color) || [],
    minOrder: w.colors?.[0]?.minOrder ?? 1,
    isMustHave: false,
    isFlashDeals: false,
    flashDealPrice: null,
    flashDealEndsAt: null,
    isBestDeal: w.isBestDeal ?? false,
    isMostPopular: w.isMostPopular ?? false,
    isPremiumCollection: w.isPremiumCollection ?? false,
  }));

  const errorMessages = isError
    ? [
      (
        errorMsg as {
          response?: { data?: { message?: string } };
          message?: string;
        }
      )?.response?.data?.message ?? "Failed to load wholesales",
    ]
    : [];

  return (
    <>
      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onEdit={onEdit}
        onDelete={(item) => deleteWholesale.mutate(item.id)}
        showTypeFilter={false}
        title={t("wholesaleProducts")}
        addLabel={t("addWholesale")}
      />
    </>
  );
}
