import { useState } from "react";
import { useTranslation } from "react-i18next";
import TraderProductsPage from "./TraderProductsPage";
import TraderRetailProductsPage from "./TraderRetailProductsPage";
import TraderBlankProductsPage from "./TraderBlankProductsPage";
import { TraderWholeSaleProductsTable } from "../../components/trader/TraderWholeSaleProductsTable";

type ShopTab = "products" | "retail" | "wholesale" | "blank";

export default function TraderShopPage() {
  const { t } = useTranslation("traderShopPage");
  const [activeTab, setActiveTab] = useState<ShopTab>("products");

  return (
    <div className="space-y-4">
      <div className="flex w-fit items-center gap-1 rounded-xl border border-stroke bg-white p-1">
        {[
          { value: "products" as const, label: t("products") },
          { value: "retail" as const, label: t("retail") },
          { value: "wholesale" as const, label: t("wholesale") },
          { value: "blank" as const, label: t("blankProducts") },
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

      <div className="mt-4">
        {activeTab === "products" && <TraderProductsPage />}
        {activeTab === "retail" && <TraderRetailProductsPage />}
        {activeTab === "wholesale" && <TraderWholeSaleProductsTable />}
        {activeTab === "blank" && <TraderBlankProductsPage />}
      </div>
    </div>
  );
}