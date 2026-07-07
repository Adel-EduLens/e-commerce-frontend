import { useState } from "react";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


type InventoryStatus = "Active" | "Low Stock" | "Out of Stock";

interface InventoryItem {
  id: number;
  image: string;
  product: string;
  category: string;
  stock: number;
  sku: string;
  price: string;
  date: string;
  status: InventoryStatus;
}

const inventoryItems: InventoryItem[] = [
  { id: 1, image: "image 69.png", product: "Basic Sweatpants", category: "Women", stock: 85, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Active" },
  { id: 2, image: "unsplash_8Vt2haq8NSQ.png", product: "Basic Sweatpants", category: "Women", stock: 15, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Low Stock" },
  { id: 3, image: "image 69.png", product: "Basic Sweatpants", category: "Women", stock: 0, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Low Stock" },
  { id: 4, image: "unsplash_8Vt2haq8NSQ.png", product: "Basic Sweatpants", category: "Women", stock: 250, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Out of Stock" },
  { id: 5, image: "image 69.png", product: "Basic Sweatpants", category: "Women", stock: 250, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Out of Stock" },
  { id: 6, image: "unsplash_8Vt2haq8NSQ.png", product: "Basic Sweatpants", category: "Women", stock: 250, sku: "HDK-001", price: "$30", date: "Oct 3, 2025", status: "Out of Stock" },
];

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

function statusPill(status: InventoryStatus) {
  if (status === "Active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Low Stock") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

export default function TraderInventoryPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === inventoryItems.length
        ? new Set()
        : new Set(inventoryItems.map((i) => i.id)),
    );
  };

  const allSelected = selected.size === inventoryItems.length;

  const filtered = inventoryItems.filter(
    (i) =>
      i.product.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const summaryCards = [
    { label: "In Stock", value: "182", delta: "8.5%", note: "Down from yesterday", up: false },
    { label: "Low Stock", value: "24", delta: "8.5%", note: "Up from yesterday", up: true },
    { label: "Out of Stock", value: "12", delta: "8.5%", note: "Up from yesterday", up: true },
    { label: "Total Products", value: "218", delta: "8.5%", note: "Up from yesterday", up: true },
  ];

  return (
    <>
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                    <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <img className="h-6 w-6" src={asset("material-symbols_inventory.svg")} alt="" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-sm font-medium ${card.up ? "text-teal-500" : "text-rose-500"}`}>
                    {card.delta}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text"> {card.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Add */}
          <div className="flex flex-wrap items-center justify-start gap-3">
            <label className="relative flex min-w-[280px] items-center">
              <img
                className="pointer-events-none absolute left-4 h-5 w-5"
                src={asset("mynaui_search.svg")}
                alt=""
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-stroke bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
              />
            </label>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
              Add Item
            </button>
          </div>

          {/* Inventory Table Panel */}
          <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Products Table</h2>
                <div className="flex items-center gap-2">
                  {(["Category", "Status", "Sort by"] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-2 py-1.5 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background"
                    >
                      {label}
                      <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Tables / Cards toggle */}
                <div className="flex items-center gap-1 rounded-2xl border border-stroke bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "table" ? "bg-gray-light" : ""}`}
                  >
                    <img className="h-6 w-6" src={asset("material-symbols_table-outline.svg")} alt="" />
                    <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "table" ? "text-foreground" : "text-gray-text"}`}>Tables</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "cards" ? "bg-gray-light" : ""}`}
                  >
                    <img className="h-6 w-6" src={asset("clarity_view-cards-line.svg")} alt="" />
                    <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "cards" ? "text-foreground" : "text-gray-text"}`}>Cards</span>
                  </button>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
                >
                  <img className="h-5 w-5" src={asset("download-cloud-02.svg")} alt="" />
                  Export
                </button>
              </div>
            </div>

            {/* Content */}
            {viewMode === "cards" ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => {
                  const pill = statusPill(item.status);
                  return (
                    <div
                      key={item.id}
                      className="relative flex flex-col overflow-hidden rounded-lg border border-stroke bg-white"
                    >
                      {/* Image */}
                      <div className="relative mx-2 mt-2 h-48 overflow-hidden rounded-lg">
                        <img
                          className="h-full w-full rounded-lg object-cover"
                          src={asset(item.image)}
                          alt={item.product}
                        />
                        {/* Status badge */}
                        <span className={`absolute right-3 top-3 inline-flex rounded-2xl px-2 py-1 text-sm font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-2 px-2 pb-3 pt-2">
                        {/* Name + Views */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-['Montserrat'] text-base font-semibold text-foreground">
                            {item.product}
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                            <span className="text-gray-text">Views: </span>
                            <span className="font-semibold text-foreground">540</span>
                          </p>
                        </div>

                        {/* Category + SKU */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                            {item.category} / Hoodie
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                            <span className="text-gray-text">SKU: </span>
                            <span className="font-semibold text-foreground">{item.sku}</span>
                          </p>
                        </div>

                        {/* Price + Stock */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                            {item.price}
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-gray-text">
                            <span className="text-gray-text">Stock: </span>
                            <span className="font-semibold text-foreground">{item.stock}</span>
                          </p>
                        </div>

                        {/* Actions + Last Updated */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                              title="Edit"
                            >
                              <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                            </button>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                              title="Copy"
                            >
                              <img className="h-4 w-4" src={asset("solar_copy-linear.svg")} alt="Copy" />
                            </button>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                              title="Delete"
                            >
                              <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
                            </button>
                          </div>
                          <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                            Last Updated: 2 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-3">
                      <div
                        className="h-5 w-5 cursor-pointer rounded-md border border-primary bg-secondary flex items-center justify-center"
                        onClick={toggleAll}
                      >
                        {allSelected && (
                          <svg className="h-3 w-3 text-primary" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </th>
                    {["Image", "Product", "Category", "Stock", "SKU", "Price", "Date", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    const isChecked = selected.has(item.id);
                    const pill = statusPill(item.status);
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-background"}>
                        <td className="px-4 py-3">
                          <div
                            className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                              isChecked ? "border-secondary bg-secondary" : "border-gray-300 bg-white"
                            }`}
                            onClick={() => toggleRow(item.id)}
                          >
                            {isChecked && (
                              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <img
                            className="mx-auto h-7 w-7 rounded-lg object-cover"
                            src={asset(item.image)}
                            alt={item.product}
                          />
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.product}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.category}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.stock}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.sku}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                          {item.price}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            className="flex mx-auto h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                            title="More actions"
                          >
                            <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="currentColor">
                              <circle cx="8" cy="3" r="1.2" />
                              <circle cx="8" cy="8" r="1.2" />
                              <circle cx="8" cy="13" r="1.2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
                <span className="font-['Inter'] text-sm font-medium text-foreground">6 per page</span>
                <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
                <span className="font-['Inter'] text-sm font-medium text-foreground">
                  1-6 <span className="text-gray-text">of 14</span>
                </span>
                <span className="mx-1 h-5 border-l border-stroke" />
                <button type="button" className="flex h-5 w-5 rotate-180 items-center justify-center">
                  <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Prev" />
                </button>
                <button type="button" className="flex h-5 w-5 items-center justify-center">
                  <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Next" />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom panels */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Recent Alerts */}
            <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Recent Alerts</h3>
              </div>
              <div className="flex flex-col gap-3">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                  >
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
              <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
                View All
              </button>
            </div>

            {/* Inventory Snapshot */}
            <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Inventory Snapshot</h3>
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: "In Stock", count: "320 items", color: "bg-emerald-700", dot: "text-emerald-700" },
                  { label: "Low Stock", count: "54 items", color: "bg-yellow-400", dot: "text-yellow-500" },
                  { label: "Out of Stock", count: "24 items", color: "bg-red-500", dot: "text-red-500" },
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

              {/* Stacked bar chart */}
              <div className="flex h-12 w-full overflow-hidden rounded-2xl">
                <div className="bg-emerald-700" style={{ width: "40%" }} />
                <div className="bg-yellow-400" style={{ width: "35%" }} />
                <div className="bg-red-500" style={{ width: "25%" }} />
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {[
                  { label: "In Stock 40%", color: "bg-emerald-700" },
                  { label: "Low Stock 35%", color: "bg-yellow-400" },
                  { label: "Out Stock 25%", color: "bg-red-500" },
                ].map((leg) => (
                  <div key={leg.label} className="flex items-center gap-1.5">
                    <div className={`h-4 w-4 rounded-md shrink-0 ${leg.color}`} />
                    <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{leg.label}</span>
                  </div>
                ))}
              </div>

              <button type="button" className="mt-4 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
                View All
              </button>
            </div>

            {/* Activity Log */}
            <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Activity Log</h3>
              </div>
              <div className="flex flex-col gap-3">
                {activityLogs.map((log, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                  >
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
              <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-gray-text hover:text-foreground transition">
                View All
              </button>
            </div>
          </div>
        </div>
    </>
  );
}