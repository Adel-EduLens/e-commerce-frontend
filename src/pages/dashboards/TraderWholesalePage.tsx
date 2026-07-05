import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useTraderWholesales } from "../../hooks/queries/wholesaleQuery";

const traderAsset = (file: string) => `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

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

type SidebarLabel = (typeof sidebarItems)[number]["label"];

// ─── Data ──────────────────────────────────────────────────────────────────

const statCards = [
  { label: "Total Orders", value: "1,245 Orders", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Total Revenue", value: "$87,250", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Total Units Sold", value: "18,320 pcs", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
  { label: "Active Clients", value: "126 Clients", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
];

const earningsData = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 62000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 71000 },
  { month: "May", value: 55000 },
  { month: "Jun", value: 80000 },
  { month: "Jul", value: 67000 },
  { month: "Aug", value: 87250 },
];

const topClients = [
  { name: "Alpha Retail Co.", order: "#WS-1021", spent: "$12,400", last: "Oct 10, 2025", status: "Active" },
  { name: "Beta Goods Ltd.", order: "#WS-1022", spent: "$9,870", last: "Oct 8, 2025", status: "Pending" },
  { name: "Gamma Supplies", order: "#WS-1023", spent: "$7,500", last: "Sep 29, 2025", status: "Active" },
  { name: "Delta Traders", order: "#WS-1024", spent: "$5,200", last: "Sep 15, 2025", status: "Inactive" },
];

const recentAlerts = [
  { title: "Low Stock Alert", desc: "Product SKU #P-0421 has only 12 units remaining.", time: "2 hrs ago", color: "bg-amber-400" },
  { title: "New Wholesale Order", desc: "Alpha Retail Co. placed an order of 500 units.", time: "5 hrs ago", color: "bg-emerald-400" },
  { title: "Payment Overdue", desc: "Delta Traders payment of $5,200 is 3 days overdue.", time: "1 day ago", color: "bg-rose-400" },
];

const topSellingProductsFallback = [
  { name: "Classic White Tee", sku: "SKU-001", units: "3,200 pcs", revenue: "$28,800" },
  { name: "Slim Fit Chinos", sku: "SKU-002", units: "2,100 pcs", revenue: "$37,800" },
  { name: "Hooded Sweatshirt", sku: "SKU-003", units: "1,800 pcs", revenue: "$32,400" },
];

const wholesaleOrdersFallback = [
  { id: "#WS-1021", client: "Alpha Retail Co.", items: 5, qty: 500, spent: "$12,400", date: "Oct 10, 2025", status: "Active" },
  { id: "#WS-1022", client: "Beta Goods Ltd.", items: 3, qty: 320, spent: "$9,870", date: "Oct 8, 2025", status: "Pending" },
  { id: "#WS-1023", client: "Gamma Supplies", items: 4, qty: 210, spent: "$7,500", date: "Sep 29, 2025", status: "Active" },
  { id: "#WS-1024", client: "Delta Traders", items: 2, qty: 150, spent: "$5,200", date: "Sep 15, 2025", status: "Inactive" },
];

const categorySegments = [
  { label: "Men", value: 35, color: "#BBFF63" },
  { label: "Women", value: 25, color: "#FCD34D" },
  { label: "Kids", value: 30, color: "#7DD3FC" },
  { label: "Craft", value: 10, color: "#C084FC" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function pillStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (s === "pending") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function Pagination() {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
        <span className="font-['Inter'] text-sm font-medium text-[#111827]">6 per page</span>
        <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
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
  );
}

function ExportBtn() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
    >
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <rect x="1.5" y="2.5" width="17" height="14" rx="1.5" stroke="#111827" strokeWidth="1.5" />
        <path d="M1.5 7h17" stroke="#111827" strokeWidth="1.5" />
      </svg>
      Export
    </button>
  );
}

function ThreeDot() {
  return (
    <button type="button" className="flex h-4 w-4 flex-col items-center justify-center gap-0.5">
      <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
      <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
      <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
    </button>
  );
}

function DarkTH({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-[#111827]">
        <th className="px-4 py-3">
          <div className="h-5 w-5 rounded-md border border-[#BBFF63] bg-[#111827]" />
        </th>
        {cols.map((col) => (
          <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63] whitespace-nowrap">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function EarningsChart() {
  const max = Math.max(...earningsData.map((d) => d.value));
  const w = 600, h = 200;
  const padL = 40, padR = 20, padT = 20, padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const pts = earningsData.map((d, i) => ({
    x: padL + (i / (earningsData.length - 1)) * chartW,
    y: padT + (1 - d.value / max) * chartH,
    ...d,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + chartH} L ${pts[0].x} ${padT + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wh-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padL} x2={w - padR}
          y1={padT + t * chartH}
          y2={padT + t * chartH}
          stroke="#E5E7EB" strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#wh-grad)" />
      <path d={linePath} fill="none" stroke="#FFAE4C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <circle key={p.month} cx={p.x} cy={p.y} r={4} fill="white" stroke="#FFAE4C" strokeWidth="2" />
      ))}
      {pts.map((p) => (
        <text key={p.month + "l"} x={p.x} y={h - 6} textAnchor="middle" fontSize="9" fill="#6B7280">{p.month}</text>
      ))}
    </svg>
  );
}

function CategoryDonut() {
  const cx = 80, cy = 80, r = 65, innerR = 40;
  let startAngle = -Math.PI / 2;

  const paths = categorySegments.map((seg) => {
    const angle = (seg.value / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle);
    const yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle);
    const yi2 = cy + innerR * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return { ...seg, d };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths.map((seg) => (
          <path key={seg.label} d={seg.d} fill={seg.color} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">18,320</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#6B7280">Total Units</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {categorySegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="h-3 w-3 shrink-0 rounded" style={{ background: seg.color }} />
            <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">{seg.label} {seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderWholesalePage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<SidebarLabel>("Wholesale");
  const [search, setSearch] = useState("");
  const { data: traderWholesales = [], isLoading: wholesalesLoading } = useTraderWholesales();

  const topSellingProducts = traderWholesales.length > 0
    ? traderWholesales.slice(0, 3).map((w, idx) => ({
        name: w.name,
        sku: `SKU-${String(idx + 1).padStart(3, '0')}`,
        units: `${w.minOrder} pcs min`,
        revenue: `$${w.price}`,
      }))
    : topSellingProductsFallback;

  const wholesaleOrders = traderWholesales.length > 0
    ? traderWholesales.map((w, idx) => ({
        id: `#WS-${String(idx + 1).padStart(4, '0')}`,
        client: w.brand,
        items: w.sizes.length,
        qty: w.minOrder,
        spent: `$${w.price}`,
        date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Active",
      }))
    : wholesaleOrdersFallback;

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderOverviewAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSidebarClick = (label: SidebarLabel) => {
    setActiveItem(label);
    if (label === "Overview") navigate("/dashboard/trader");
    if (label === "Products") navigate("/dashboard/trader/products");
    if (label === "Orders") navigate("/dashboard/trader/orders");
    if (label === "Inventory") navigate("/dashboard/trader/inventory");
    if (label === "Customers") navigate("/dashboard/trader/customers");
    if (label === "Finance") navigate("/dashboard/trader/finance");
    if (label === "Analytics") navigate("/dashboard/trader/analytics");
    if (label === "Dropshipping") navigate("/dashboard/trader/dropshipping");
    if (label === "Brand Partners") navigate("/dashboard/trader/brand-partners");
    if (label === "Notifications") navigate("/dashboard/trader/notifications");
  };

  const rowBg = (idx: number) => (idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]");

  const CheckBox = ({ checked }: { checked: boolean }) => (
    <td className="px-4 py-3">
      <div className={`h-5 w-5 rounded-md border ${checked ? "border-[#111827] bg-[#111827]" : "border-[#E5E7EB] bg-white"}`}>
        {checked && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="M5 10.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </td>
  );

  return (
    <>

        {/* ── Sidebar ── */}
        

        {/* ── Main ── */}
        <div className="flex-1 space-y-4">

          {/* Top bar */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Wholesale</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/trader/notifications")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111827] bg-[#111827] transition hover:bg-[#1F2937]"
                >
                  <img className="h-5 w-5" src={asset("ion_notifications-outline.svg")} alt="" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                  <img className="h-5 w-5" src={asset("hugeicons_moon-01.svg")} alt="" />
                </div>
                <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt={user?.name || "Trader"} />
              </div>
            </div>
          </section>

          {/* Search + filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-[280px] items-center">
              <img className="pointer-events-none absolute left-4 h-5 w-5" src={asset("mynaui_search.svg")} alt="" />
              <input
                type="text"
                placeholder="Search clients or orders"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#D1D5DB]"
              />
            </label>
            {["Date Range", "Status"].map((f) => (
              <button key={f} type="button" className="flex h-11 items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]">
                {f}
                <img className="h-5 w-5 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </button>
            ))}
          </div>

          {/* Stat cards */}
          <div className="flex gap-4 overflow-x-auto pb-1">
            {statCards.map((card) => (
              <div key={card.label} className="relative flex-1 min-w-[220px] h-32 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <p className="font-['Montserrat'] text-base font-medium text-[#6B7280]">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-[#111827]">{card.value}</p>
                </div>
                <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#BBFF63]">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                    <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-sm font-medium ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                    {card.trendUp ? "+" : "-"}{card.trend}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings Over Time */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Earnings Over Time</h2>
              <button type="button" className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]">
                Partner
                <img className="h-5 w-5 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </button>
            </div>
            <EarningsChart />
          </div>

          {/* Top Clients Table */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Top Clients</h2>
              <ExportBtn />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <DarkTH cols={["Client", "Order", "Total Spent", "Last Order", "Status", "Actions"]} />
                <tbody>
                  {topClients.map((row, idx) => {
                    const pill = pillStyle(row.status);
                    return (
                      <tr key={idx} className={rowBg(idx)}>
                        <CheckBox checked={idx === 0} />
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.name}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.order}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.spent}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.last}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3"><ThreeDot /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>

          {/* 3-column bottom panels */}
          <div className="grid gap-4 lg:grid-cols-3">

            {/* Recent Alerts */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Recent Alerts</h2>
              <div className="space-y-3">
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} className="flex gap-3 rounded-xl border border-[#E5E7EB] p-3">
                    <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${alert.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{alert.title}</p>
                      <p className="mt-0.5 font-['Montserrat'] text-xs text-[#6B7280]">{alert.desc}</p>
                      <p className="mt-1 font-['Montserrat'] text-xs font-medium text-[#9CA3AF]">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-Selling Products */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Top-Selling Products</h2>
              <div className="space-y-3">
                {topSellingProducts.map((prod, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] p-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                      <span className="font-['Montserrat'] text-xs font-bold text-[#6B7280]">{idx + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{prod.name}</p>
                      <p className="font-['Montserrat'] text-xs text-[#6B7280]">{prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{prod.revenue}</p>
                      <p className="font-['Montserrat'] text-xs text-[#6B7280]">{prod.units}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Category Donut */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Product Category</h2>
              <CategoryDonut />
            </div>
          </div>

          {/* Recent Wholesale Orders */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Recent Wholesale Orders</h2>
              <ExportBtn />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <DarkTH cols={["Order ID", "Client", "Items", "Quantity", "Total Spent", "Date", "Status", "Actions"]} />
                <tbody>
                  {wholesaleOrders.map((row, idx) => {
                    const pill = pillStyle(row.status);
                    return (
                      <tr key={idx} className={rowBg(idx)}>
                        <CheckBox checked={idx === 1} />
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.id}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.client}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.items}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.qty}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.spent}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3"><ThreeDot /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>

        </div>
    </>
  );
}