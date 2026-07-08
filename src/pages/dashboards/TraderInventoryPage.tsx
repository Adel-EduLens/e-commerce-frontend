import { useState } from "react";
import { type InventoryItem, getStatus, asset } from "../../components/trader/inventoryUtils";
import { InventoryTablePanel, AddItemModal, EditItemModal } from "../../components/trader/InventoryShared";
import { useTraderProducts, useDeleteProduct } from "../../hooks/queries/productsQuery";
import { useTraderWholesales, useDeleteWholesale } from "../../hooks/queries/wholesaleQuery";

const alerts = [
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
  { title: "Low Stock Alert", message: 'Basic Tee #122" only 3 items left in stock.', time: "Oct 4, 10:32 AM" },
];

const activityLogs = [
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
  { title: "Hoodie – Black (+20)", addedBy: "Added by Ahmed", note: "Restocked from supplier", time: "Oct 3, 10:30 AM" },
];

export default function TraderInventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const { data: traderProducts = [], isLoading: loadingProducts, isError: productsError, error: productsErrorMsg } = useTraderProducts();
  const { data: traderWholesales = [], isLoading: loadingWholesales, isError: wholesalesError, error: wholesalesErrorMsg } = useTraderWholesales();
  const deleteProduct = useDeleteProduct();
  const deleteWholesale = useDeleteWholesale();

  const inventoryItems: InventoryItem[] = [
    ...traderProducts.map((p) => ({
      id: p.id,
      image: p.images[0]?.url ?? "",
      imagesByColor: p.images.map((img) => ({ url: img.url, color: img.color ?? undefined })),
      product: p.name,
      category: p.category?.name ?? "",
      categoryId: p.categoryId,
      stock: p.stock ?? 0,
      sku: p.sku ?? "",
      price: `$${p.price}`,
      priceNum: p.price,
      date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(p.createdAt).getTime(),
      status: getStatus(p.stock ?? 0),
      type: "product" as const,
      description: p.description ?? "",
      sizes: p.sizes?.map((s) => s.size) ?? [],
      colors: p.colors?.map((c) => c.color) ?? [],
      minOrder: 1,
      isMustHave: p.isMustHave ?? false,
      isFlashDeals: p.isFlashDeals ?? false,
      flashDealPrice: p.flashDealPrice ?? null,
      flashDealEndsAt: p.flashDealEndsAt ?? null,
      isBestDeal: false,
      isMostPopular: false,
      isPremiumCollection: false,
    })),
    ...traderWholesales.map((w) => ({
      id: w.id,
      image: w.images[0]?.url ?? "",
      imagesByColor: w.images.map((img) => ({ url: img.url, color: img.color ?? undefined })),
      product: w.name,
      category: w.category?.name ?? "",
      categoryId: w.categoryId,
      stock: w.stock ?? 0,
      sku: w.sku ?? "",
      price: `$${w.price}`,
      priceNum: w.price,
      date: new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdAtRaw: new Date(w.createdAt).getTime(),
      status: getStatus(w.stock ?? 0),
      type: "wholesale" as const,
      description: w.description ?? "",
      sizes: [],
      colors: [],
      minOrder: w.minOrder ?? 1,
      isMustHave: false,
      isFlashDeals: false,
      flashDealPrice: null,
      flashDealEndsAt: null,
      isBestDeal: w.isBestDeal ?? false,
      isMostPopular: w.isMostPopular ?? false,
      isPremiumCollection: w.isPremiumCollection ?? false,
    })),
  ];

  const handleDelete = (item: InventoryItem) => {
    if (item.type === "product") deleteProduct.mutate(item.id);
    else deleteWholesale.mutate(item.id);
  };

  const errorMessages: string[] = [];
  if (productsError) errorMessages.push(`Products: ${(productsErrorMsg as any)?.response?.data?.message ?? (productsErrorMsg as any)?.message ?? "Unknown error"}`);
  if (wholesalesError) errorMessages.push(`Wholesales: ${(wholesalesErrorMsg as any)?.response?.data?.message ?? (wholesalesErrorMsg as any)?.message ?? "Unknown error"}`);

  const inStock = inventoryItems.filter((i) => i.status === "Active").length;
  const lowStock = inventoryItems.filter((i) => i.status === "Low Stock").length;
  const outOfStock = inventoryItems.filter((i) => i.status === "Out of Stock").length;
  const total = inventoryItems.length || 1;
  const inStockPct = Math.round((inStock / total) * 100);
  const lowStockPct = Math.round((lowStock / total) * 100);
  const outStockPct = 100 - inStockPct - lowStockPct;

  const summaryCards = [
    { label: "In Stock", value: String(inStock), up: true },
    { label: "Low Stock", value: String(lowStock), up: false },
    { label: "Out of Stock", value: String(outOfStock), up: false },
    { label: "Total Products", value: String(inventoryItems.length), up: true },
  ];

  return (
    <>
      {showModal && <AddItemModal onClose={() => setShowModal(false)} />}
      {editItem && <EditItemModal item={editItem} onClose={() => setEditItem(null)} />}
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <img className="h-6 w-6" src={asset("material-symbols_inventory.svg")} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shared table panel */}
        <InventoryTablePanel
          items={inventoryItems}
          isLoading={loadingProducts || loadingWholesales}
          errorMessages={errorMessages}
          onAdd={() => setShowModal(true)}
          onEdit={setEditItem}
          onDelete={handleDelete}
          showTypeFilter={true}
          title="Inventory Table"
        />

        {/* Bottom panels */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Alerts */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Recent Alerts</h3>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.map((alert, i) => (
                <div key={i} className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{alert.title}</p>
                  </div>
                  <p className="mt-1.5 font-['Montserrat'] text-sm font-medium text-gray-text">{alert.message}</p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{alert.time}</p>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">View All</button>
          </div>

          {/* Inventory Snapshot */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Inventory Snapshot</h3>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: "In Stock", count: `${inStock} items`, dot: "text-emerald-700" },
                { label: "Low Stock", count: `${lowStock} items`, dot: "text-yellow-500" },
                { label: "Out of Stock", count: `${outOfStock} items`, dot: "text-red-500" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className={`h-5 w-5 shrink-0 ${row.dot}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <span className="font-['Montserrat'] text-sm font-semibold text-foreground">{row.label}</span>
                  </div>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text">{row.count}</span>
                </div>
              ))}
            </div>
            <div className="flex h-12 w-full overflow-hidden rounded-2xl">
              <div className="bg-emerald-700" style={{ width: `${inStockPct}%` }} />
              <div className="bg-yellow-400" style={{ width: `${lowStockPct}%` }} />
              <div className="bg-red-500" style={{ width: `${outStockPct}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: `In Stock ${inStockPct}%`, color: "bg-emerald-700" },
                { label: `Low Stock ${lowStockPct}%`, color: "bg-yellow-400" },
                { label: `Out Stock ${outStockPct}%`, color: "bg-red-500" },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div className={`h-4 w-4 rounded-md shrink-0 ${leg.color}`} />
                  <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{leg.label}</span>
                </div>
              ))}
            </div>
            <button type="button" className="mt-4 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">View All</button>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Activity Log</h3>
            </div>
            <div className="flex flex-col gap-3">
              {activityLogs.map((log, i) => (
                <div key={i} className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{log.title}</p>
                  </div>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{log.addedBy}</p>
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{log.note}</p>
                  <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{log.time}</p>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">View All</button>
          </div>
        </div>
      </div>
    </>
  );
}
