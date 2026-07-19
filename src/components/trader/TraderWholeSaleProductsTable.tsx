import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type InventoryItem,
  getStatus,
} from "../../components/trader/inventoryUtils";
import {
  InventoryTablePanel,
  AddItemModal,
  EditItemModal,
} from "../../components/trader/InventoryShared";
import {
  useTraderWholesales,
  useDeleteWholesale,
} from "../../hooks/queries/wholesaleQuery";

export function TraderWholeSaleProductsTable() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const { t } = useTranslation("traderWholesale");

  const {
    data: traderWholesales = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderWholesales();
  const deleteWholesale = useDeleteWholesale();

  const items: InventoryItem[] = traderWholesales.map((w) => ({
    id: w.id,
    image: w.images[0]?.url ?? "",
    imagesByColor: w.images.map((img) => ({
      url: img.url,
      color: img.color ?? undefined,
    })),
    product: w.name,
    category: w.category?.name ?? "",
    categoryId: w.categoryId,
    brandId: "",
    stock: w.stock ?? 0,
    sku: w.sku ?? "",
    price: `$${w.price}`,
    priceNum: w.price,
    date: new Date(w.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    createdAtRaw: new Date(w.createdAt).getTime(),
    status: getStatus(w.stock ?? 0),
    type: "wholesale" as const,
    description: w.description ?? "",
    sizes: Array.from(new Set(w.wholesaleColors?.flatMap(wc => wc.sizes.map(s => s.size)) || [])),
    colors: w.wholesaleColors?.map(wc => wc.color) || [],
    minOrder: w.minOrder ?? 1,
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
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          lockedType="wholesale"
        />
      )}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}
      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onAdd={() => setShowAddModal(true)}
        onEdit={setEditItem}
        onDelete={(item) => deleteWholesale.mutate(item.id)}
        showTypeFilter={false}
        title={t("wholesaleProducts")}
        addLabel={t("addWholesale")}
      />
    </>
  );
}
