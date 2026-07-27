import { useState } from "react";
import { type InventoryItem, getStatus } from "../../../components/trader/inventoryUtils";
import { InventoryTablePanel } from "../../../components/trader/InventoryShared";
import { useTraderGiftCards, useDeleteGiftCard } from "../../../hooks/queries/giftCardsQuery";
import { useTranslation } from "react-i18next";

export default function TraderGiftCardsPage({
  onEdit,
  onAdd,
}: {
  onEdit: (item: InventoryItem) => void;
  onAdd?: () => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useTranslation("traderProduct");

  const {
    data: traderGiftCards = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderGiftCards();

  const deleteGiftCard = useDeleteGiftCard();

  const items: InventoryItem[] = traderGiftCards.map((gc) => {
    return {
      id: gc.id,
      image: gc.image || "",
      imagesByColor: [],
      product: gc.name,
      categories: [],
      categoryIds: [],
      brandId: "",
      stock: gc.stock ?? 100,
      sku: "",
      price: `${gc.amount} EGP`,
      priceNum: gc.amount,
      giftCardAmounts: gc.amounts ?? "10,15,50,75,100,150,200",
      date: new Date(gc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(gc.createdAt).getTime(),
      status: "Active",
      type: "gift_card" as const,
      description: gc.description ?? "",
      sizes: [],
      colors: [],
      minOrder: 1,
      isMustHave: false,
      isFlashDeals: false,
      flashDealPrice: null,
      flashDealEndsAt: null,
      isBestDeal: false,
      isMostPopular: false,
      isPremiumCollection: false,
    };
  });

  const errRes = errorMsg as { response?: { data?: { message?: string } }; message?: string } | null;
  const errorMessages = isError
    ? [errRes?.response?.data?.message ?? errRes?.message ?? "Failed to load gift cards"]
    : [];

  return (
    <>
      <InventoryTablePanel
        items={items}
        isLoading={isLoading}
        errorMessages={errorMessages}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={(item) => setDeleteId(item.id)}
        showTypeFilter={false}
        showCategoryFilter={false}
        showCategoryColumn={false}
        showSkuColumn={false}
        title="giftCardsTable"
        addLabel="addGiftCard"
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 space-y-4 shadow-xl">
            <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
              {t("deleteProduct") || "Delete Item"}
            </h3>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("deleteConfirmation") || "Are you sure you want to delete this gift card?"}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-stroke py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground bg-card hover:bg-background transition"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteGiftCard.mutate(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-['Montserrat'] text-sm font-bold text-white transition hover:bg-red-700"
              >
                {t("delete") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
