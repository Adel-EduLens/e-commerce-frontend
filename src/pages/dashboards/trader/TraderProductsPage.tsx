import { useState } from "react";
import { type InventoryItem, getStatus } from "../../../components/trader/inventoryUtils";
import { InventoryTablePanel } from "../../../components/trader/InventoryShared";
import { useTraderProducts, useDeleteProduct } from "../../../hooks/queries/productsQuery";
import { useTranslation } from "react-i18next";

export default function TraderProductsPage({ onEdit }: { onEdit: (item: InventoryItem) => void }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useTranslation("traderProduct");

  const {
    data: traderProducts = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderProducts("SHOP");

  const deleteProduct = useDeleteProduct();

  const items: InventoryItem[] = traderProducts.map((p) => {
    const allImages = p.colors?.flatMap((c) =>
      (c.images || []).map((img) => ({
        url: img.url || img.imageUrl || "",
        color: c.colorName,
      }))
    ) ?? [];

    const calculatedColorStock = p.colors?.reduce((sum, c) => {
      const colorStock = (c.variants && c.variants.length > 0)
        ? c.variants.reduce((s, v) => s + (v.quantity ?? 0), 0)
        : (c.stock ?? 0);
      return sum + colorStock;
    }, 0);

    const totalStock = (p.colors && p.colors.length > 0 && calculatedColorStock !== undefined)
      ? calculatedColorStock
      : (p.stock ?? 0);

    const uniqueSizes = Array.from(new Set(p.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? []));
    const uniqueColors = Array.from(new Set(p.colors?.map((c) => c.colorName) ?? []));

    return {
      id: p.id,
      image: allImages[0]?.url ?? "",
      imagesByColor: allImages,
      product: p.name,
      categories: p.categories?.map(c => ({ id: c.id, name: c.name })) || [],
      categoryIds: p.categories?.map(c => String(c.id)) || [],
      brandId: p.brand?.id ?? "",
      stock: totalStock,
      sku: p.sku ?? "",
      price: `$${p.shopPrice ?? p.price ?? 0}`,
      priceNum: p.shopPrice ?? p.price ?? 0,
      date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(p.createdAt).getTime(),
      status: getStatus(totalStock),
      type: "product" as const,
      description: p.description ?? "",
      sizes: uniqueSizes,
      colors: uniqueColors,
      minOrder: 1,
      isMustHave: p.isMustHave ?? false,
      isFlashDeals: p.isFlashDeals ?? false,
      flashDealPrice: p.flashDealPrice ?? null,
      flashDealEndsAt: p.flashDealEndsAt ?? null,
      isBestDeal: false,
      isMostPopular: false,
      isPremiumCollection: false,
    };
  });

  const errRes = errorMsg as { response?: { data?: { message?: string } }; message?: string } | null;
  const errorMessages = isError
    ? [errRes?.response?.data?.message ?? errRes?.message ?? "Failed to load products"]
    : [];

  return (
    <>

      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onEdit={onEdit}
        onDelete={(item) => setDeleteId(item.id)}
        showTypeFilter={false}
        title="productsTable"
        addLabel="addProduct"
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4 shadow-xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("deleteProduct")}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteConfirmation")}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct.mutate(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:bg-red-700"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
