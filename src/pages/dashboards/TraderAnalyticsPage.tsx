import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const sidebarItems = [
  { label: "Overview", icon: "si_dashboard-line.svg", path: "/dashboard/trader" },
  { label: "Retail", icon: "fluent_building-retail-20-regular.svg", path: "" },
  { label: "Dropshipping", icon: "streamline-flex_shipping-box-2.svg", path: "" },
  { label: "Wholesale", icon: "system-uicons_boxes.svg", path: "" },
  { label: "Brand Partners", icon: "mdi_partnership-outline.svg", path: "" },
  { label: "Products", icon: "streamline-ultimate_products-gifts.svg", path: "/dashboard/trader/products" },
  { label: "Orders", icon: "carbon_follow-up-work-order.svg", path: "/dashboard/trader/orders" },
  { label: "Inventory", icon: "material-symbols_inventory.svg", path: "/dashboard/trader/inventory" },
  { label: "Customers", icon: "carbon_customer.svg", path: "/dashboard/trader/customers" },
  { label: "Finance", icon: "material-symbols_finance-rounded.svg", path: "/dashboard/trader/finance" },
  { label: "Notifications", icon: "ion_notifications-outline.svg", path: "" },
  { label: "Analytics", icon: "grommet-icons_analytics.svg", path: "/dashboard/trader/analytics" },
  { label: "Store Settings", icon: "solar_settings-linear.svg", path: "" },
] as const;

// ─── Data ──────────────────────────────────────────────────────────────────

const summaryCards = [
  { label: "Total Revenue", value: "$245,300", delta: "8.5%", note: "Up from yesterday", up: true },
  { label: "Gross Margin", value: "42% ($102k)", delta: "8.5%", note: "Up from yesterday", up: true },
  { label: "Total Discounts", value: "-$14,600", delta: "8.5%", note: "Down from yesterday", up: false },
  { label: "Predicted Revenue", value: "$260,000", delta: "8.5%", note: "Up from yesterday", up: true },
];

const profitTrendSeries = [
  { month: "Jan", value: 22 }, { month: "Feb", value: 26 }, { month: "Mar", value: 31 },
  { month: "Apr", value: 33 }, { month: "May", value: 29 }, { month: "Jun", value: 18 },
  { month: "Jul", value: 25 }, { month: "Aug", value: 32 }, { month: "Sep", value: 35 },
  { month: "Oct", value: 39 },
];

const marginWeekData = [
  { week: "Week1", cogs: 38, profit: 20 }, { week: "Week2", cogs: 38, profit: 20 },
  { week: "Week3", cogs: 38, profit: 20 }, { week: "Week4", cogs: 38, profit: 20 },
];

const discountAnalysisRows = [
  { period: "Week 1", discounts: "$2,400", avgDiscount: "10%", netMargin: "42.8%" },
  { period: "Week 2", discounts: "$2,400", avgDiscount: "10%", netMargin: "42.8%" },
  { period: "Week 3", discounts: "$2,400", avgDiscount: "10%", netMargin: "42.8%" },
  { period: "Week 4", discounts: "$2,400", avgDiscount: "10%", netMargin: "42.8%" },
];

const cogsCategories = ["Hoodies", "Hoodies", "Hoodies", "Hoodies", "Hoodies"];
const cogsBarValues = [38, 38, 38, 38, 38];

const cogsTableRows = [
  { cat: "Hoodie", materials: "$2,400", labor: "$2,400", logistics: "$2,400", packaging: "$2,400", total: "$2,400" },
  { cat: "Tees", materials: "$2,400", labor: "$2,400", logistics: "$2,400", packaging: "$2,400", total: "$2,400" },
  { cat: "Hoodie", materials: "$2,400", labor: "$2,400", logistics: "$2,400", packaging: "$2,400", total: "$2,400" },
  { cat: "Hoodie", materials: "$2,400", labor: "$2,400", logistics: "$2,400", packaging: "$2,400", total: "$2,400" },
];

const inventoryBarData = [
  { month: "Jan", value: 38 }, { month: "Feb", value: 38 }, { month: "Mar", value: 38 },
  { month: "Apr", value: 38 }, { month: "May", value: 38 }, { month: "Jun", value: 38 },
  { month: "Jul", value: 38 }, { month: "Aug", value: 38 }, { month: "Sep", value: 38 },
  { month: "Oct", value: 38 }, { month: "Nov", value: 38 }, { month: "Dec", value: 38 },
];

const inventoryTurnoverSeries = [
  { month: "Jan", value: 2.2 }, { month: "Feb", value: 2.6 }, { month: "Mar", value: 3.1 },
  { month: "Apr", value: 3.3 }, { month: "May", value: 2.9 }, { month: "Jun", value: 1.8 },
  { month: "Jul", value: 2.5 }, { month: "Aug", value: 3.2 }, { month: "Sep", value: 3.5 },
  { month: "Oct", value: 3.9 },
];

const inventoryCostRows = [
  { cat: "Men", stock: 540, cost: "$8,600", avgPrice: "$12,400", margin: "42.8%" },
  { cat: "Women", stock: 540, cost: "$8,600", avgPrice: "$12,400", margin: "42.8%" },
  { cat: "Kids", stock: 540, cost: "$8,600", avgPrice: "$12,400", margin: "42.8%" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

// ─── Sub-components ────────────────────────────────────────────────────────

function Panel({
  title,
  action,
  right,
  className = "",
  children,
}: {
  title: string;
  action?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-[#111827] sm:text-xl">
          {title}
        </h2>
        {right ?? (action ? (
          <button className="text-xs font-medium text-[#6B7280] transition hover:text-[#111827]">
            {action}
          </button>
        ) : null)}
      </div>
      {children}
    </section>
  );
}

function NetProfitChart() {
  const width = 700;
  const height = 220;
  const pad = { top: 16, right: 8, bottom: 32, left: 8 };
  const max = 40;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const pts = profitTrendSeries.map((d, i) => ({
    ...d,
    x: pad.left + (cw / (profitTrendSeries.length - 1)) * i,
    y: pad.top + ch - (d.value / max) * ch,
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `M ${pts[0].x} ${height - pad.bottom} ${pts.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${height - pad.bottom} Z`;

  return (
    <div className="space-y-2">
      <div className="grid gap-4 lg:grid-cols-[44px_minmax(0,1fr)]">
        <div className="hidden flex-col justify-between pt-2 pb-8 font-['Montserrat'] text-sm font-medium text-[#111827] lg:flex">
          <span>40K</span>
          <span>30K</span>
          <span>20K</span>
          <span>10K</span>
          <span>0K</span>
        </div>
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[220px] w-full overflow-visible rounded-2xl bg-[#FFFBF5]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = pad.top + (ch / 4) * i;
              return (
                <line key={i} x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              );
            })}
            <path d={area} fill="url(#profitFill)" />
            <path d={line} fill="none" stroke="#FFAE4C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p) => (
              <g key={p.month}>
                <circle cx={p.x} cy={p.y} r="8" fill="#FFAE4C" fillOpacity="0.25" />
                <circle cx={p.x} cy={p.y} r="4" fill="#FFAE4C" stroke="white" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-5 gap-2 font-['Montserrat'] text-sm font-medium text-[#111827] sm:grid-cols-10">
            {profitTrendSeries.map((d) => (
              <span key={d.month} className="text-center">{d.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersDonut() {
  const stops = orderStatus
    .reduce(
      (acc, seg) => {
        const start = acc.total;
        const end = start + seg.share;
        acc.total = end;
        acc.parts.push(`${seg.color} ${start}% ${end}%`);
        return acc;
      },
      { total: 0, parts: [] as string[] },
    )
    .parts.join(", ");

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto mt-2 flex h-56 w-56 items-center justify-center">
        <div
          className="flex h-56 w-56 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${stops})` }}
        >
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="font-['Montserrat'] text-2xl font-semibold text-[#111827]">1,234</p>
            <p className="mt-1 font-['Montserrat'] text-xs font-medium text-[#6B7280]">
              <span className="text-teal-500">↑ 8.5%</span> Total Orders
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        {orderStatus.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 shrink-0 rounded" style={{ backgroundColor: seg.color }} />
            <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">
              {seg.label} — {seg.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderAnalyticsPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const rowBg = (i: number) => (i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]");

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 lg:flex-row">

        {/* ── Sidebar ── */}
        <aside className="w-full rounded-[32px] bg-[#111827] p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img className="h-12 w-auto" src={traderAsset("logo gen-z .white 1.png")} alt="Gen-Z" />
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {sidebarItems.map((item) => {
                const isActive = item.label === "Analytics";
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive ? "bg-[#BBFF63] text-[#111827]" : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <img className="h-6 w-6 shrink-0" src={traderAsset(item.icon)} alt="" />
                    <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-8 space-y-4 lg:mt-auto">
              <div className="rounded-[24px] bg-white/6 p-3">
                <div className="flex items-center gap-3">
                  <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" src={avatar} alt={user?.name || "Trader"} />
                  <div className="min-w-0">
                    <p className="truncate font-['Montserrat'] text-sm font-semibold text-white">{user?.name || "Maan Hassan"}</p>
                    <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-[#BBFF63]">{user?.role || "trader"}</p>
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
        <main className="min-w-0 flex-1 space-y-5">

          {/* Search + filters */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-[280px] items-center">
              <svg className="pointer-events-none absolute left-4 h-5 w-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <input
                type="text"
                placeholder="Search customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#D1D5DB]"
              />
            </label>
            <button
              type="button"
              className="flex h-11 items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
            >
              Date Range
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{card.label}</p>
                    <p className="mt-2 font-['Montserrat'] text-2xl font-semibold text-[#111827]">{card.value}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#BBFF63]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                      <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                    {card.up ? (
                      <path d="M10 15V5M10 5l-4 4M10 5l4 4" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M10 5v10M10 15l-4-4M10 15l4-4" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                  <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
                    <span className={card.up ? "text-teal-500" : "text-rose-500"}>{card.delta}</span>{" "}
                    {card.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Net Profit Trend */}
          <Panel title="Net Profit Trend Over Time">
            <NetProfitChart />
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_320px]">
            {/* Performance Margin Trend */}
            <Panel title="Performance Margin Trend">
              <div className="flex h-56 items-end gap-6 justify-center">
                {marginWeekData.map((d, i) => (
                  <div key={i} className="flex h-full flex-col justify-end gap-1">
                    <div className="flex items-end gap-1 h-48">
                      <div className="w-5 bg-sky-300 rounded-t-lg" style={{ height: `${(d.profit / 40) * 100}%` }} />
                      <div className="w-5 bg-primary rounded-t-lg" style={{ height: `${(d.cogs / 40) * 100}%` }} />
                    </div>
                    <span className="font-['Montserrat'] text-xs text-center font-medium text-[#111827]">{d.week}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-2"><span className="h-4 w-4 bg-primary rounded-md"></span> COGS</span>
                <span className="flex items-center gap-2"><span className="h-4 w-4 bg-sky-300 rounded-md"></span> Profit</span>
              </div>
            </Panel>

            {/* Discount Impact on Net Margin */}
            <Panel title="Discount Impact on Net Margin">
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-primary border-r-sky-300">
                  <div className="text-center">
                    <p className="font-['Montserrat'] text-xl font-semibold text-[#111827]">1,234</p>
                    <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">Total Orders</p>
                  </div>
                </div>
                <div className="w-full text-sm font-medium">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Total Discount</span>
                    <span>$14,600 (5.9%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Avg. Margin Drop</span>
                    <span>-3.2%</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Discount Analysis Summary */}
          <Panel title="Discount Analysis Summary">
             <div className="overflow-x-auto">
                <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
                  <thead>
                    <tr className="bg-[#111827] text-primary">
                      <th className="px-4 py-3 rounded-l-lg">Period</th>
                      <th className="px-4 py-3">Total Discounts</th>
                      <th className="px-4 py-3">Avg. Discount</th>
                      <th className="px-4 py-3 rounded-r-lg">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountAnalysisRows.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3">{row.period}</td>
                        <td className="px-4 py-3">{row.discounts}</td>
                        <td className="px-4 py-3">{row.avgDiscount}</td>
                        <td className="px-4 py-3">{row.netMargin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </Panel>

          {/* COGS Breakdown */}
          <div className="grid gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
            <Panel title="COGS Breakdown">
              <div className="flex h-48 items-end justify-center gap-4 border-b pb-2">
                {cogsBarValues.map((v, i) => (
                  <div key={i} className={`w-8 rounded-t-lg ${i === 4 ? 'bg-primary' : 'bg-gray-200'}`} style={{ height: `${(v / 40) * 100}%` }} />
                ))}
              </div>
              <div className="flex justify-center gap-4 pt-2">
                {cogsCategories.map((c, i) => (
                  <span key={i} className="text-xs font-medium w-8 text-center">{c}</span>
                ))}
              </div>
            </Panel>
            <Panel title="COGS Breakdown Table">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
                  <thead>
                    <tr className="bg-[#111827] text-primary">
                      <th className="px-4 py-3 rounded-l-lg">Category</th>
                      <th className="px-4 py-3">Materials</th>
                      <th className="px-4 py-3">Labor</th>
                      <th className="px-4 py-3">Logistics</th>
                      <th className="px-4 py-3">Packaging</th>
                      <th className="px-4 py-3 rounded-r-lg">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cogsTableRows.map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3">{row.cat}</td>
                        <td className="px-4 py-3">{row.materials}</td>
                        <td className="px-4 py-3">{row.labor}</td>
                        <td className="px-4 py-3">{row.logistics}</td>
                        <td className="px-4 py-3">{row.packaging}</td>
                        <td className="px-4 py-3">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Inventory Charts */}
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="Inventory Value vs Revenue">
              <div className="flex h-56 items-end justify-between px-4">
                {inventoryBarData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-8 bg-primary rounded-t-lg" style={{ height: `${d.value}%` }} />
                    <span className="text-xs font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Inventory Turnover Trend">
              <div className="flex h-56 items-end justify-between px-4 border-b">
                 {inventoryTurnoverSeries.map((d, i) => (
                  <div key={i} className="flex flex-col items-center h-full justify-end">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mb-2"></div>
                    <span className="text-xs font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Inventory Cost Breakdown */}
          <Panel title="Inventory Cost Breakdown">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
                <thead>
                  <tr className="bg-[#111827] text-primary">
                    <th className="px-4 py-3 rounded-l-lg">Category</th>
                    <th className="px-4 py-3">Current Stock</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Avg. Sale Price</th>
                    <th className="px-4 py-3 rounded-r-lg">Net Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryCostRows.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3">{row.cat}</td>
                      <td className="px-4 py-3">{row.stock}</td>
                      <td className="px-4 py-3">{row.cost}</td>
                      <td className="px-4 py-3">{row.avgPrice}</td>
                      <td className="px-4 py-3">{row.margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
}
