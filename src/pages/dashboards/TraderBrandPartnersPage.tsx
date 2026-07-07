import { useState } from "react";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


// ─── Data ──────────────────────────────────────────────────────────────────

const statCards = [
  { label: "Total Partner Brands", value: "24 Brands", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Active Brands", value: "18 Active", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Total Brand Revenue", value: "$124,560", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
  { label: "Commission Earned", value: "$8,240", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
];

const earningsData = [
  { month: "Jan", value: 55000 },
  { month: "Feb", value: 72000 },
  { month: "Mar", value: 61000 },
  { month: "Apr", value: 88000 },
  { month: "May", value: 74000 },
  { month: "Jun", value: 95000 },
  { month: "Jul", value: 110000 },
  { month: "Aug", value: 124560 },
];

const barData = [
  { label: "Jan", value: 55 },
  { label: "Feb", value: 72 },
  { label: "Mar", value: 61 },
  { label: "Apr", value: 88 },
  { label: "May", value: 74 },
  { label: "Jun", value: 95 },
  { label: "Jul", value: 82 },
  { label: "Aug", value: 100 },
  { label: "Sep", value: 78 },
];

const categorySegments = [
  { label: "Men", value: 35, color: "#BBFF63" },
  { label: "Women", value: 25, color: "#FCD34D" },
  { label: "Kids", value: 30, color: "#7DD3FC" },
  { label: "Craft", value: 10, color: "#C084FC" },
];

const commissionRows = [
  { brand: "Alpha Fashion", sales: "$32,400", commPct: "8%", commEarned: "$2,592", status: "Paid" },
  { brand: "Beta Apparel", sales: "$28,100", commPct: "7%", commEarned: "$1,967", status: "Pending" },
  { brand: "Gamma Wear", sales: "$21,600", commPct: "9%", commEarned: "$1,944", status: "Paid" },
  { brand: "Delta Styles", sales: "$16,200", commPct: "6%", commEarned: "$972", status: "Pending" },
];

const topProducts = [
  { name: "Classic White Tee", sku: "SKU-001", units: "3,200 pcs", revenue: "$28,800" },
  { name: "Slim Fit Chinos", sku: "SKU-002", units: "2,100 pcs", revenue: "$37,800" },
  { name: "Hooded Sweatshirt", sku: "SKU-003", units: "1,800 pcs", revenue: "$32,400" },
];

const supportAlerts = [
  { title: "Contract Renewal", desc: "Alpha Fashion contract expires in 14 days.", time: "1 day ago", color: "bg-amber-400" },
  { title: "New Brand Request", desc: "Sigma Styles has requested a partnership.", time: "3 hrs ago", color: "bg-emerald-400" },
  { title: "Dispute Filed", desc: "Delta Styles filed a commission dispute.", time: "2 days ago", color: "bg-rose-400" },
];

const topBrands = [
  { name: "Alpha Fashion", revenue: "$32,400", units: "8,100 pcs", rating: 4.8 },
  { name: "Beta Apparel", revenue: "$28,100", units: "6,420 pcs", rating: 4.5 },
  { name: "Gamma Wear", revenue: "$21,600", units: "5,200 pcs", rating: 4.2 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function pillStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "paid") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (s === "pending") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function Pagination() {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5">
        <span className="font-['Inter'] text-sm font-medium text-foreground">6 per page</span>
        <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5">
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
  );
}

function ExportBtn() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
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
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
    </button>
  );
}

function DarkTH({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-secondary">
        <th className="px-4 py-3">
          <div className="h-5 w-5 rounded-md border border-primary bg-secondary" />
        </th>
        {cols.map((col) => (
          <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
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
        <linearGradient id="bp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={padL} x2={w - padR} y1={padT + t * chartH} y2={padT + t * chartH} stroke="#E5E7EB" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="url(#bp-grad)" />
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

function BrandPerformanceBar() {
  const maxVal = Math.max(...barData.map((d) => d.value));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1.5 h-36">
        {barData.map((bar, idx) => (
          <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${(bar.value / maxVal) * 136}px`,
                background: idx === barData.length - 1 ? "#BBFF63" : "#E5E7EB",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {barData.map((bar) => (
          <span key={bar.label} className="flex-1 text-center font-['Montserrat'] text-[10px] text-gray-text">{bar.label}</span>
        ))}
      </div>
    </div>
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
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">24</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#6B7280">Brands</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {categorySegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="h-3 w-3 shrink-0 rounded" style={{ background: seg.color }} />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{seg.label} {seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="h-3.5 w-3.5" viewBox="0 0 14 14" fill={star <= Math.floor(rating) ? "#FBBF24" : "#E5E7EB"}>
          <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.3l-3.7 1.9.7-4.1L1 5.3l4.2-.7z" />
        </svg>
      ))}
      <span className="ml-1 font-['Montserrat'] text-xs font-medium text-gray-text">{rating}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderBrandPartnersPage() {
  const [search, setSearch] = useState("");

  const rowBg = (idx: number) => (idx % 2 === 0 ? "bg-white" : "bg-background");

  const CheckBox = ({ checked }: { checked: boolean }) => (
    <td className="px-4 py-3">
      <div className={`h-5 w-5 rounded-md border ${checked ? "border-secondary bg-secondary" : "border-stroke bg-white"}`}>
        {checked && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="M5 10.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </td>
  );

  return (
    <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-[280px] items-center">
              <img className="pointer-events-none absolute left-4 h-5 w-5" src={asset("mynaui_search.svg")} alt="" />
              <input
                type="text"
                placeholder="Search brands or partners"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-stroke bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none placeholder:text-gray-text focus:border-stroke"
              />
            </label>
            {["Date Range", "Status"].map((f) => (
              <button key={f} type="button" className="flex h-11 items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
                {f}
                <img className="h-5 w-5 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </button>
            ))}
          </div>

          {/* Stat cards */}
          <div className="flex gap-4 overflow-x-auto pb-1">
            {statCards.map((card) => (
              <div key={card.label} className="relative flex-1 min-w-[220px] h-32 rounded-2xl border border-stroke bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <p className="font-['Montserrat'] text-base font-medium text-gray-text">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                    <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-sm font-medium ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                    {card.trendUp ? "+" : "-"}{card.trend}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings Over Time */}
          <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Earnings Over Time</h2>
              <button type="button" className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
                Partner
                <img className="h-5 w-5 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </button>
            </div>
            <EarningsChart />
          </div>

          {/* Bar chart + Donut side by side */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Brand Performance Overview</h2>
              <BrandPerformanceBar />
            </div>
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Product Category</h2>
              <CategoryDonut />
            </div>
          </div>

          {/* Commission & Revenue Share Summary */}
          <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Commission & Revenue Share Summary</h2>
              <ExportBtn />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <DarkTH cols={["Brand", "Total Sales", "Commission %", "Commission Earned", "Payment Status", "Actions"]} />
                <tbody>
                  {commissionRows.map((row, idx) => {
                    const pill = pillStyle(row.status);
                    return (
                      <tr key={idx} className={rowBg(idx)}>
                        <CheckBox checked={idx === 0} />
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.brand}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.sales}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.commPct}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.commEarned}</td>
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

            {/* Top-Selling Products */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Top-Selling Products</h2>
                <button type="button" className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-1.5 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background">
                  Brands
                  <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
              </div>
              <div className="space-y-3">
                {topProducts.map((prod, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-stroke p-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-light flex items-center justify-center">
                      <span className="font-['Montserrat'] text-xs font-bold text-gray-text">{idx + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{prod.name}</p>
                      <p className="font-['Montserrat'] text-xs text-gray-text">{prod.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{prod.revenue}</p>
                      <p className="font-['Montserrat'] text-xs text-gray-text">{prod.units}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Panel */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Support Panel</h2>
              <div className="space-y-3">
                {supportAlerts.map((alert, idx) => (
                  <div key={idx} className="flex gap-3 rounded-xl border border-stroke p-3">
                    <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${alert.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{alert.title}</p>
                      <p className="mt-0.5 font-['Montserrat'] text-xs text-gray-text">{alert.desc}</p>
                      <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Brands */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Top Performing Brands</h2>
              <div className="space-y-3">
                {topBrands.map((brand, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-stroke p-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center">
                      <span className="font-['Montserrat'] text-xs font-bold text-foreground">{brand.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{brand.name}</p>
                      <StarRating rating={brand.rating} />
                    </div>
                    <div className="text-right">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">{brand.revenue}</p>
                      <p className="font-['Montserrat'] text-xs text-gray-text">{brand.units}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

    </div>
  );
}