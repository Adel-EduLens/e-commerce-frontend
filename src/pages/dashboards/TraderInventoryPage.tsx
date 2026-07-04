import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;

const traderOverviewAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const sidebarItems = [
  { label: "Overview", icon: "si_dashboard-line.svg" },
  { label: "Retail", icon: "fluent_building-retail-20-regular.svg" },
  { label: "Dropshipping", icon: "streamline-flex_shipping-box-2.svg" },
  { label: "Wholesale", icon: "system-uicons_boxes.svg" },
  { label: "Brand Partners", icon: "mdi_partnership-outline.svg" },
  { label: "Products", icon: "streamline-ultimate_products-gifts.svg" },
  { label: "Orders", icon: "carbon_follow-up-work-order.svg" },
  { label: "Inventory", icon: "material-symbols_inventory.svg" },
  { label: "Customers", icon: "carbon_customer.svg" },
  { label: "Finance", icon: "material-symbols_finance-rounded.svg" },
  { label: "Notifications", icon: "ion_notifications-outline.svg" },
  { label: "Analytics", icon: "grommet-icons_analytics.svg" },
  { label: "Store Settings", icon: "solar_settings-linear.svg" },
] as const;

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
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] =
    useState<(typeof sidebarItems)[number]["label"]>("Inventory");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderOverviewAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSidebarClick = (label: (typeof sidebarItems)[number]["label"]) => {
    setActiveItem(label);
    if (label === "Overview") navigate("/dashboard/trader");
    if (label === "Products") navigate("/dashboard/trader/products");
    if (label === "Orders") navigate("/dashboard/trader/orders");
    if (label === "Customers") navigate("/dashboard/trader/customers");
    if (label === "Finance") navigate("/dashboard/trader/finance");
  };

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
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full rounded-[32px] bg-[#111827] p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img
                className="h-12 w-auto"
                src={traderOverviewAsset("logo gen-z .white 1.png")}
                alt="Gen-Z"
              />
            </div>

            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {sidebarItems.map((item) => {
                const isActive = item.label === activeItem;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSidebarClick(item.label)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-[#BBFF63] text-[#111827]"
                        : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <img className="h-6 w-6 shrink-0" src={asset(item.icon)} alt="" />
                    <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 space-y-4 lg:mt-auto">
              <div className="rounded-[24px] bg-white/6 p-3">
                <div className="flex items-center gap-3">
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                    src={avatar}
                    alt={user?.name || "Trader avatar"}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-['Montserrat'] text-sm font-semibold text-white">
                      {user?.name || "Maan Hassan"}
                    </p>
                    <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-[#BBFF63]">
                      {user?.role || "trader"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl border border-white/10 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-white transition hover:border-[#BBFF63]/40 hover:bg-[#BBFF63]/10"
              >
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 space-y-4">
          {/* Top bar */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Inventory</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111827] bg-[#111827] transition hover:bg-[#1F2937]"
                >
                  <img className="h-5 w-5" src={asset("ion_notifications-outline.svg")} alt="" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                  <img className="h-5 w-5" src={asset("hugeicons_moon-01.svg")} alt="" />
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={avatar}
                  alt={user?.name || "Trader avatar"}
                />
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{card.label}</p>
                    <p className="font-['Montserrat'] text-2xl font-semibold text-[#111827]">{card.value}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#BBFF63]">
                    <img className="h-6 w-6" src={asset("material-symbols_inventory.svg")} alt="" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-sm font-medium ${card.up ? "text-teal-500" : "text-rose-500"}`}>
                    {card.delta}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-[#6B7280]"> {card.note}</span>
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
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none transition placeholder:text-[#6B7280] focus:border-[#D1D5DB]"
              />
            </label>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
            >
              <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
              Add Item
            </button>
          </div>

          {/* Inventory Table Panel */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Products Table</h2>
                <div className="flex items-center gap-2">
                  {(["Category", "Status", "Sort by"] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
                    >
                      {label}
                      <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Tables / Cards toggle */}
                <div className="flex items-center gap-1 rounded-2xl border border-[#E5E7EB] bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "table" ? "bg-[#F3F4F6]" : ""}`}
                  >
                    <img className="h-6 w-6" src={asset("material-symbols_table-outline.svg")} alt="" />
                    <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "table" ? "text-[#111827]" : "text-[#6B7280]"}`}>Tables</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 transition ${viewMode === "cards" ? "bg-[#F3F4F6]" : ""}`}
                  >
                    <img className="h-6 w-6" src={asset("clarity_view-cards-line.svg")} alt="" />
                    <span className={`font-['Montserrat'] text-xs font-medium ${viewMode === "cards" ? "text-[#111827]" : "text-[#6B7280]"}`}>Cards</span>
                  </button>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
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
                      className="relative flex flex-col overflow-hidden rounded-lg border border-[#E5E7EB] bg-white"
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
                          <p className="truncate font-['Montserrat'] text-base font-semibold text-[#111827]">
                            {item.product}
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
                            <span className="text-[#6B7280]">Views: </span>
                            <span className="font-semibold text-[#111827]">540</span>
                          </p>
                        </div>

                        {/* Category + SKU */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
                            {item.category} / Hoodie
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
                            <span className="text-[#6B7280]">SKU: </span>
                            <span className="font-semibold text-[#111827]">{item.sku}</span>
                          </p>
                        </div>

                        {/* Price + Stock */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                            {item.price}
                          </p>
                          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
                            <span className="text-[#6B7280]">Stock: </span>
                            <span className="font-semibold text-[#111827]">{item.stock}</span>
                          </p>
                        </div>

                        {/* Actions + Last Updated */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                              title="Edit"
                            >
                              <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                            </button>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                              title="Copy"
                            >
                              <img className="h-4 w-4" src={asset("solar_copy-linear.svg")} alt="Copy" />
                            </button>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                              title="Delete"
                            >
                              <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
                            </button>
                          </div>
                          <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">
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
                  <tr className="bg-[#111827]">
                    <th className="px-4 py-3">
                      <div
                        className="h-5 w-5 cursor-pointer rounded-md border border-[#BBFF63] bg-[#111827] flex items-center justify-center"
                        onClick={toggleAll}
                      >
                        {allSelected && (
                          <svg className="h-3 w-3 text-[#BBFF63]" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </th>
                    {["Image", "Product", "Category", "Stock", "SKU", "Price", "Date", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#BBFF63] whitespace-nowrap"
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
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                        <td className="px-4 py-3">
                          <div
                            className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                              isChecked ? "border-[#111827] bg-[#111827]" : "border-gray-300 bg-white"
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
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                          {item.product}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                          {item.category}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                          {item.stock}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                          {item.sku}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                          {item.price}
                        </td>
                        <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#111827] whitespace-nowrap">
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
                            className="flex mx-auto h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                            title="More actions"
                          >
                            <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="currentColor">
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
            <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                <span className="font-['Inter'] text-sm font-medium text-[#111827]">6 per page</span>
                <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                <span className="font-['Inter'] text-sm font-medium text-[#111827]">
                  1-6 <span className="text-[#6B7280]">of 14</span>
                </span>
                <span className="mx-1 h-5 border-l border-[#E5E7EB]" />
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
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Recent Alerts</h3>
              </div>
              <div className="flex flex-col gap-3">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                  >
                    <div className="flex items-center gap-1.5">
                      <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="14" height="14" rx="2" />
                      </svg>
                      <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{alert.title}</p>
                    </div>
                    <p className="mt-1.5 font-['Montserrat'] text-sm font-medium text-[#6B7280]">{alert.message}</p>
                    <p className="mt-1 font-['Montserrat'] text-xs font-medium text-[#9CA3AF]">{alert.time}</p>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-[#6B7280] hover:text-[#111827] transition">
                View All
              </button>
            </div>

            {/* Inventory Snapshot */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Inventory Snapshot</h3>
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
                      <span className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{row.label}</span>
                    </div>
                    <span className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{row.count}</span>
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
                    <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">{leg.label}</span>
                  </div>
                ))}
              </div>

              <button type="button" className="mt-4 w-full text-center font-['Montserrat'] text-xs font-medium text-[#6B7280] hover:text-[#111827] transition">
                View All
              </button>
            </div>

            {/* Activity Log */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Activity Log</h3>
              </div>
              <div className="flex flex-col gap-3">
                {activityLogs.map((log, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                  >
                    <div className="flex items-center gap-1.5">
                      <svg className="h-5 w-5 shrink-0 text-emerald-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="14" height="14" rx="2" />
                      </svg>
                      <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{log.title}</p>
                    </div>
                    <p className="mt-1 font-['Montserrat'] text-xs font-medium text-[#6B7280]">{log.addedBy}</p>
                    <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{log.note}</p>
                    <p className="mt-1 font-['Montserrat'] text-xs font-medium text-[#9CA3AF]">{log.time}</p>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 w-full text-center font-['Montserrat'] text-xs font-medium text-[#6B7280] hover:text-[#111827] transition">
                View All
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
