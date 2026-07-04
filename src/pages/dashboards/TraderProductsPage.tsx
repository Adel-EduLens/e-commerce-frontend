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

type Status = "Active" | "Low Stock" | "Out of Stock";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  stock: number;
  status: Status;
  sales: number;
  views: number;
  updatedAgo: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 85,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "image 69.png",
  },
  {
    id: 2,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "unsplash_8Vt2haq8NSQ.png",
  },
  {
    id: 3,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "image 69.png",
  },
  {
    id: 4,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "unsplash_8Vt2haq8NSQ.png",
  },
  {
    id: 5,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "image 69.png",
  },
  {
    id: 6,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "unsplash_8Vt2haq8NSQ.png",
  },
  {
    id: 7,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "image 69.png",
  },
  {
    id: 8,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "unsplash_8Vt2haq8NSQ.png",
  },
  {
    id: 9,
    name: "Basic Sweatpants",
    category: "Women",
    subcategory: "Men / Hoodie",
    price: "$49.99",
    stock: 23,
    status: "Active",
    sales: 132,
    views: 540,
    updatedAgo: "2 days ago",
    image: "image 69.png",
  },
];

const tableProducts = [
  { id: 1, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 85, status: "Active" as Status, image: "image 69.png" },
  { id: 2, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 15, status: "Low Stock" as Status, image: "unsplash_8Vt2haq8NSQ.png" },
  { id: 3, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 0, status: "Out of Stock" as Status, image: "image 69.png" },
  { id: 4, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 250, status: "Out of Stock" as Status, image: "unsplash_8Vt2haq8NSQ.png" },
  { id: 5, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 250, status: "Out of Stock" as Status, image: "image 69.png" },
  { id: 6, name: "Basic Sweatpants", category: "Women", price: "$30", stock: 250, status: "Out of Stock" as Status, image: "unsplash_8Vt2haq8NSQ.png" },
];

function statusPill(status: Status) {
  if (status === "Active")
    return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Low Stock")
    return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function StatusBadge({ status }: { status: Status }) {
  const { bg, text } = statusPill(status);
  return (
    <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${bg} ${text}`}>
      {status}
    </span>
  );
}

/* ─── Add Product Modal ─────────────────────────────────────────────────── */
function AddProductModal({ onClose }: { onClose: () => void }) {
  const [imageName, setImageName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[650px] rounded-2xl bg-white overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#E5E7EB]/20">
          <h2 className="font-['Montserrat'] text-3xl font-semibold text-[#111827]">
            Add Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center text-[#6B7280] transition hover:text-[#111827]"
          >
            <img className="h-4 w-4" src={asset("x-close.svg")} alt="Close" />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Upload Images */}
          <div className="flex flex-col gap-4">
            <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
              Upload Images
            </label>
            <div className="relative flex h-14 items-center rounded-xl border border-[#E5E7EB] overflow-hidden">
              <span className="absolute left-4 font-['Montserrat'] text-base font-medium text-[#6B7280]">
                {imageName || "Upload images"}
              </span>
              <label className="absolute right-3 flex h-9 cursor-pointer items-center justify-center rounded-lg bg-[#F3F4F6] px-5 font-['Inter'] text-base font-medium text-[#111827] transition hover:bg-[#E5E7EB]">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-4">
            <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
              Product Name
            </label>
            <div className="h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
              <input
                type="text"
                placeholder="Enter Product Name"
                className="h-full w-full px-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-4">
            <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
              Category
            </label>
            <div className="relative h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
              <select className="h-full w-full appearance-none px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none bg-white">
                <option value="" disabled selected>Select Category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </div>
            </div>
          </div>

          {/* Price + Discount */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
                Price
              </label>
              <div className="h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter price"
                  className="h-full w-full px-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280]"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
                Discount
              </label>
              <div className="h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter Discount (optional)"
                  className="h-full w-full px-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280]"
                />
              </div>
            </div>
          </div>

          {/* Stock Quantity + Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
                Stock Quantity
              </label>
              <div className="h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  className="h-full w-full px-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280]"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
                Status
              </label>
              <div className="relative h-14 rounded-xl border border-[#E5E7EB] overflow-hidden">
                <select className="h-full w-full appearance-none px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none bg-white">
                  <option value="" disabled selected>Select Status</option>
                  <option value="active">Active</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Done button */}
        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center justify-center rounded-lg bg-[#111827] px-6 font-['Montserrat'] text-base font-semibold text-white shadow-[0px_5px_3px_0px_rgba(0,0,0,0.25)] transition hover:bg-[#1F2937]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Table View ─────────────────────────────────────────────────────────── */
function TableView({
  selected,
  onToggle,
  onToggleAll,
}: {
  selected: Set<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
}) {
  const allSelected = selected.size === tableProducts.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#111827]">
            <th className="px-4 py-3 text-left">
              <div
                className="h-5 w-5 cursor-pointer rounded-md border border-[#BBFF63] bg-[#111827] outline outline-1 outline-offset-[-1px] outline-[#BBFF63] flex items-center justify-center"
                onClick={onToggleAll}
              >
                {allSelected && (
                  <svg className="h-3 w-3 text-[#BBFF63]" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </th>
            {["Image", "Name", "Price", "Category", "Stock", "Status", "Actions"].map((col) => (
              <th
                key={col}
                className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-[#BBFF63]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableProducts.map((product, index) => {
            const isChecked = selected.has(product.id);
            return (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
              >
                <td className="px-4 py-2">
                  <div
                    className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                      isChecked
                        ? "border-[#111827] bg-[#111827]"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => onToggle(product.id)}
                  >
                    {isChecked && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  <img
                    className="mx-auto h-7 w-7 rounded-lg object-cover"
                    src={asset(product.image)}
                    alt={product.name}
                  />
                </td>
                <td className="px-3 py-2 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                  {product.name}
                </td>
                <td className="px-3 py-2 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                  {product.price}
                </td>
                <td className="px-3 py-2 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                  {product.category}
                </td>
                <td className="px-3 py-2 text-center font-['Montserrat'] text-xs font-medium text-[#111827]">
                  {product.stock}
                </td>
                <td className="px-3 py-2 text-center">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                      title="Edit"
                    >
                      <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                      title="Copy"
                    >
                      <img className="h-4 w-4" src={asset("solar_copy-linear.svg")} alt="Copy" />
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                      title="Delete"
                    >
                      <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Product Card ───────────────────────────────────────────────────────── */
function ProductCard({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg border bg-white transition cursor-pointer ${
        selected ? "border-[#111827] ring-2 ring-[#111827]/20" : "border-[#E5E7EB]"
      }`}
      onClick={() => onSelect(product.id)}
    >
      {/* Image section */}
      <div className="relative m-2 h-48 overflow-hidden rounded-lg">
        <img
          className="h-full w-full rounded-lg object-cover"
          src={asset(product.image)}
          alt={product.name}
        />
        {/* Status badge top-right */}
        <span
          className={`absolute right-3 top-3 inline-flex rounded-2xl px-2 py-1 text-sm font-medium font-['Montserrat'] ${statusPill(product.status).bg} ${statusPill(product.status).text}`}
        >
          {product.status}
        </span>
      </div>

      {/* Info section */}
      <div className="flex flex-col gap-2 px-2 pb-3 pt-1">
        {/* Name + Views */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-['Montserrat'] text-base font-semibold text-[#111827] truncate">
            {product.name}
          </p>
          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
            <span className="text-[#6B7280]">Views: </span>
            <span className="font-semibold text-[#111827]">{product.views}</span>
          </p>
        </div>

        {/* Subcategory + Sales */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
            {product.subcategory}
          </p>
          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
            <span className="text-[#6B7280]">Sales: </span>
            <span className="font-semibold text-[#111827]">{product.sales}</span>
          </p>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
            {product.price}
          </p>
          <p className="shrink-0 font-['Montserrat'] text-sm text-[#6B7280]">
            <span className="text-[#6B7280]">Stock: </span>
            <span className="font-semibold text-[#111827]">{product.stock}</span>
          </p>
        </div>

        {/* Actions + Last updated */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
              title="Edit"
            >
              <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
              title="Copy"
            >
              <img className="h-4 w-4" src={asset("solar_copy-linear.svg")} alt="Copy" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
              title="Delete"
            >
              <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
            </button>
          </div>
          <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">
            Last Updated: {product.updatedAgo}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TraderProductsPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] =
    useState<(typeof sidebarItems)[number]["label"]>("Products");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [search, setSearch] = useState("");
  const [selectedTableRows, setSelectedTableRows] = useState<Set<number>>(new Set());
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

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
    if (label === "Customers") navigate("/dashboard/trader/customers");
    if (label === "Orders") navigate("/dashboard/trader/orders");
  };

  /* Table row selection */
  const toggleTableRow = (id: number) => {
    setSelectedTableRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAllTableRows = () => {
    setSelectedTableRows((prev) =>
      prev.size === tableProducts.length
        ? new Set()
        : new Set(tableProducts.map((p) => p.id)),
    );
  };

  /* Card selection */
  const toggleCard = (id: number) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}

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
              <p className="font-['Montserrat'] text-xl font-semibold text-[#111827]">
                Products
              </p>
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

          {/* Search + Add Products */}
          <div className="flex flex-wrap items-center justify-end gap-3">
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
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
            >
              <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
              Add Products
            </button>
          </div>

          {/* Products panel */}
          <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">
                  Products Table
                </h2>
                <div className="flex items-center gap-2">
                  {(["Category", "Status", "Sort by"] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
                    >
                      {label}
                      <img
                        className="h-4 w-4 rotate-90"
                        src={asset("weui_arrow-outlined.svg")}
                        alt=""
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Table / Cards toggle */}
                <div className="flex items-center gap-1 rounded-2xl border border-[#E5E7EB] bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 font-['Montserrat'] text-xs font-medium transition ${
                      viewMode === "table"
                        ? "bg-[#F3F4F6] text-[#111827]"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    <img className="h-6 w-6" src={asset("material-symbols_table-outline.svg")} alt="" />
                    Tables
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-1 rounded-2xl px-2 py-1 font-['Montserrat'] text-xs font-medium transition ${
                      viewMode === "cards"
                        ? "bg-[#F3F4F6] text-[#111827]"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    <img className="h-6 w-6" src={asset("clarity_view-cards-line.svg")} alt="" />
                    Cards
                  </button>
                </div>

                {/* Export */}
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
            <div className="px-4 pb-4">
              {viewMode === "table" ? (
                <TableView
                  selected={selectedTableRows}
                  onToggle={toggleTableRow}
                  onToggleAll={toggleAllTableRows}
                />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={selectedCards.has(product.id)}
                      onSelect={toggleCard}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                <span className="font-['Montserrat'] text-sm font-medium text-[#111827]">
                  6 per page
                </span>
                <img
                  className="h-4 w-4 rotate-90"
                  src={asset("weui_arrow-outlined.svg")}
                  alt=""
                />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                <span className="font-['Inter'] text-sm font-medium text-[#111827]">
                  1-6{" "}
                  <span className="text-[#6B7280]">of 14</span>
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
        </main>
      </div>
    </div>
  );
}
