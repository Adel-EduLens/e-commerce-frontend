import { useState } from "react";
import { AxiosError } from "axios";
import {
  type InventoryItem,
  getStatus,
  asset,
} from "../../../components/trader/inventoryUtils";
import {
  InventoryTablePanel,
  AddItemModal,
  EditItemModal,
} from "../../../components/trader/InventoryShared";
import {
  useTraderProducts,
  useDeleteProduct,
} from "../../../hooks/queries/productsQuery";

import { useTranslation } from "react-i18next";
const alerts = [
  {
    title: "lowStockAlert",
    message: "alertMessageSample",
    time: "Oct 4, 10:32 AM",
  },
  {
    title: "lowStockAlert",
    message: "alertMessageSample",
    time: "Oct 4, 10:32 AM",
  },
  {
    title: "lowStockAlert",
    message: "alertMessageSample",
    time: "Oct 4, 10:32 AM",
  },
];

const activityLogs = [
  {
    title: "Hoodie – Black (+20)",
    addedBy: "addedByAhmed",
    note: "restockedFromSupplier",
    time: "Oct 3, 10:30 AM",
  },
  {
    title: "Hoodie – Black (+20)",
    addedBy: "addedByAhmed",
    note: "restockedFromSupplier",
    time: "Oct 3, 10:30 AM",
  },
  {
    title: "Hoodie – Black (+20)",
    addedBy: "addedByAhmed",
    note: "restockedFromSupplier",
    time: "Oct 3, 10:30 AM",
  },
];

type ErrorResponse = {
  message?: string;
};
export default function TraderInventoryPage() {
  const { t } = useTranslation("traderInventory");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const {
    data: traderProducts = [],
    isLoading: loadingProducts,
    isError: productsError,
    error: productsErrorMsg,
  } = useTraderProducts();
  const deleteProduct = useDeleteProduct();

  const inventoryItems: InventoryItem[] = [
    ...traderProducts.map((p) => {
      const allImages =
        p.colors?.flatMap((c) =>
          (c.images || []).map((img) => ({
            url: img.url || img.imageUrl || "",
            color: c.colorName,
          })),
        ) ?? [];

      const totalStock = p.stock ?? 0;

      const uniqueSizes = Array.from(
        new Set(
          p.colors?.flatMap((c) => c.variants?.map((v) => v.size) ?? []) ?? [],
        ),
      );
      const uniqueColors = Array.from(
        new Set(
          p.colors?.map((c) => c.colorName || c.color).filter((color): color is string => Boolean(color)) ?? [],
        ),
      );

      return {
        id: p.id,
        image: allImages[0]?.url || "",
        imagesByColor: allImages,
        product: p.name,
        categories: p.categories?.map(c => ({ id: c.id, name: c.name })) || [],
        categoryIds: p.categories?.map(c => String(c.id)) || [],
        brandId: p.brand?.id,
        stock: totalStock,
        sku: p.sku ?? "",
        price: `$${p.shopPrice ?? p.price ?? 0}`,
        priceNum: p.shopPrice ?? p.price ?? 0,
        date: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
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
    }),
  ];

  const handleDelete = (item: InventoryItem) => {
    deleteProduct.mutate(item.id);
  };

  const errorMessages: string[] = [];
  if (productsError) {
    const error = productsErrorMsg as AxiosError<ErrorResponse>;

    errorMessages.push(
      `Products: ${
        error.response?.data?.message ?? error.message ?? "Unknown error"
      }`,
    );
  }

  const inStock = inventoryItems.filter((i) => i.status === "Active").length;
  const lowStock = inventoryItems.filter(
    (i) => i.status === "Low Stock",
  ).length;
  const outOfStock = inventoryItems.filter(
    (i) => i.status === "Out of Stock",
  ).length;
  const total = inventoryItems.length || 1;
  const inStockPct = Math.round((inStock / total) * 100);
  const lowStockPct = Math.round((lowStock / total) * 100);
  const outStockPct = 100 - inStockPct - lowStockPct;

  const summaryCards = [
    { label: t("inStock"), value: String(inStock), up: true },
    { label: t("lowStock"), value: String(lowStock), up: false },
    { label: t("outOfStock"), value: String(outOfStock), up: false },
    {
      label: t("totalProducts"),
      value: String(inventoryItems.length),
      up: true,
    },
  ];
  return (
    <>
      {showModal && <AddItemModal onClose={() => setShowModal(false)} />}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                    {card.label}
                  </p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <img
                    className="h-6 w-6"
                    src={asset("material-symbols_inventory.svg")}
                    alt=""
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shared table panel */}
        <InventoryTablePanel
          items={inventoryItems}
          isLoading={loadingProducts}
          errorMessages={errorMessages}
          onAdd={() => setShowModal(true)}
          onEdit={setEditItem}
          onDelete={handleDelete}
          showTypeFilter={true}
          title={t("inventoryTable")}
          addLabel={t("addItem")}
        />

        {/* Bottom panels */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Alerts */}
          <div className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">
                {t("recentAlerts")}
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                >
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-5 w-5 shrink-0 text-emerald-700"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      {t(alert.title)}
                    </p>
                  </div>
                  <p className="mt-1.5 font-['Montserrat'] text-sm font-medium text-gray-text">
                    {t(alert.message, alert.message)}
                  </p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">
                    {alert.time}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition"
            >
              {t("viewAll")}
            </button>
          </div>

          {/* Inventory Snapshot */}
          <div className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("inventorySnapshot")}
            </h3>
            <div className="flex flex-col gap-3 mb-5">
              {[
                {
                  label: t("inStock"),
                  count: `${inStock} ${t("items")}`,
                  dot: "text-emerald-700",
                },
                {
                  label: t("lowStock"),
                  count: `${lowStock} ${t("items")}`,
                  dot: "text-yellow-500",
                },
                {
                  label: t("outOfStock"),
                  count: `${outOfStock} ${t("items")}`,
                  dot: "text-red-500",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className={`h-5 w-5 shrink-0 ${row.dot}`}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      {row.label}
                    </span>
                  </div>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex h-12 w-full overflow-hidden rounded-2xl">
              <div
                className="bg-emerald-700"
                style={{ width: `${inStockPct}%` }}
              />
              <div
                className="bg-yellow-400"
                style={{ width: `${lowStockPct}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${outStockPct}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: `${t("inStock")} ${inStockPct}%`, color: "bg-emerald-700" },
                { label: `${t("lowStock")} ${lowStockPct}%`, color: "bg-yellow-400" },
                { label: `${t("outStock")} ${outStockPct}%`, color: "bg-red-500" },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div className={`h-4 w-4 rounded-md shrink-0 ${leg.color}`} />
                  <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
                    {leg.label}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition"
            >
              {t("viewAll")}
            </button>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">
                {t("activityLog")}
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {activityLogs.map((log, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                >
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-5 w-5 shrink-0 text-emerald-700"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      {log.title}
                    </p>
                  </div>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">
                    {t(log.addedBy, log.addedBy)}
                  </p>
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                    {t(log.note, log.note)}
                  </p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">
                    {log.time}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition"
            >
              {t("viewAll")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
