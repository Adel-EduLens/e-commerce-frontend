import { useState } from "react";
import { ArrowLeft, Tags } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import TraderProductsPage from "./TraderProductsPage";
import TraderRetailProductsPage from "./TraderRetailProductsPage";
import TraderBlankProductsPage from "./TraderBlankProductsPage";
import TraderGiftCardsPage from "./TraderGiftCardsPage";
import TraderBrandsPage from "./TraderBrandsPage";
import { TraderWholeSaleProductsTable } from "../../../components/trader/TraderWholeSaleProductsTable";
import { UnifiedProductModal } from "../../../components/trader/UnifiedProductModal";
import { GiftCardModal } from "../../../components/trader/GiftCardModal";
import type { InventoryItem } from "../../../components/trader/inventoryUtils";
import { asset } from "../../../components/trader/inventoryUtils";

const SHOP_TABS = [
  "products",
  "retail",
  "wholesale",
  "blank",
  "giftCards",
  "brands",
] as const;

type ShopTab = (typeof SHOP_TABS)[number];

const isShopTab = (value: string | null): value is ShopTab =>
  value != null && SHOP_TABS.includes(value as ShopTab);

export default function TraderShopPage() {
  const { t } = useTranslation("traderShopPage");
  const { t: tShared } = useTranslation("traderInventoryShared");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const activeTab = isShopTab(searchParams.get("tab"))
    ? (searchParams.get("tab") as ShopTab)
    : "products";

  const isGiftCardModal = activeTab === "giftCards" || editItem?.type === "gift_card";
  const isBrandsTab = activeTab === "brands";

  const handleTabChange = (tab: ShopTab) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (tab === "products") {
        nextParams.delete("tab");
      } else {
        nextParams.set("tab", tab);
      }

      return nextParams;
    });
  };

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
            { value: "brands" as const, label: t("brands") },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
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

        <div className="flex flex-wrap items-center gap-2">
          {!isBrandsTab ? (
            <>
              <button
                type="button"
                onClick={() => handleTabChange("brands")}
                className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <Tags size={16} />
                {tShared("manageBrands", "Manage Brands")}
              </button>

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
                {activeTab === "giftCards" ? t("addGiftCard") : t("addProduct")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleTabChange("products")}
              className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft size={16} />
              {t("backToProducts")}
            </button>
          )}
        </div>
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
        {activeTab === "brands" && (
          <TraderBrandsPage />
        )}
      </div>
    </div>
  );
}
