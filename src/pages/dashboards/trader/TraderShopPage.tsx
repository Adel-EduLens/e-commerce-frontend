import { useState } from "react";
import { useTranslation } from "react-i18next";
import TraderProductsPage from "./TraderProductsPage";
import TraderRetailProductsPage from "./TraderRetailProductsPage";
import TraderBlankProductsPage from "./TraderBlankProductsPage";
import TraderGiftCardsPage from "./TraderGiftCardsPage";
import { TraderWholeSaleProductsTable } from "../../../components/trader/TraderWholeSaleProductsTable";
import { UnifiedProductModal } from "../../../components/trader/UnifiedProductModal";
import { GiftCardModal } from "../../../components/trader/GiftCardModal";
import type { InventoryItem } from "../../../components/trader/inventoryUtils";
import { asset } from "../../../components/trader/inventoryUtils";

type ShopTab = "products" | "retail" | "wholesale" | "blank" | "giftCards";

export default function TraderShopPage() {
  const { t } = useTranslation("traderShopPage");
  const [activeTab, setActiveTab] = useState<ShopTab>("products");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const isGiftCardModal = activeTab === "giftCards" || editItem?.type === "gift_card";

  return (
    <div className="space-y-4">
      {(showAddModal || editItem) && (
        isGiftCardModal ? (
          <GiftCardModal
            item={editItem}
            onClose={() => {
              setShowAddModal(false);
              setEditItem(null);
            }}
          />
        ) : (
          <UnifiedProductModal
            item={editItem}
            onClose={() => {
              setShowAddModal(false);
              setEditItem(null);
            }}
          />
        )
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-fit items-center gap-1 rounded-xl border border-stroke bg-white p-1">
          {[
            { value: "products" as const, label: t("products") },
            { value: "retail" as const, label: t("retail") },
            { value: "wholesale" as const, label: t("wholesale") },
            { value: "blank" as const, label: t("blankProducts") },
            { value: "giftCards" as const, label: t("giftCards") || "Gift Cards" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-3 py-2 font-['Montserrat'] text-sm font-medium transition ${
                activeTab === tab.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-text hover:bg-background hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-['Montserrat'] text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={asset("ic_round-plus.svg")}
            alt=""
          />
          {t("addProduct")}
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "products" && (
          <TraderProductsPage onEdit={setEditItem} />
        )}
        {activeTab === "retail" && (
          <TraderRetailProductsPage onEdit={setEditItem} />
        )}
        {activeTab === "wholesale" && (
          <TraderWholeSaleProductsTable onEdit={setEditItem} />
        )}
        {activeTab === "blank" && (
          <TraderBlankProductsPage onEdit={setEditItem} />
        )}
        {activeTab === "giftCards" && (
          <TraderGiftCardsPage onEdit={setEditItem} />
        )}
      </div>
    </div>
  );
}
