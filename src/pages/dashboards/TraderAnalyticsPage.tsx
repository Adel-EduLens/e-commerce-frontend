import { useState } from "react";
import { useTranslation } from "react-i18next";

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
      className={`rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h2>
        {right ?? (action ? (
          <button className="text-xs font-medium text-gray-text transition hover:text-foreground cursor-pointer">
            {action}
          </button>
        ) : null)}
      </div>
      {children}
    </section>
  );
}

function NetProfitChart({ series }: { series: { monthKey: string; defaultMonth: string; value: number }[] }) {
  const { t } = useTranslation("traderAnalytics");
  const width = 700;
  const height = 220;
  const pad = { top: 16, right: 8, bottom: 32, left: 8 };
  const max = 40;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const pts = series.map((d, i) => ({
    ...d,
    x: pad.left + (cw / (series.length - 1)) * i,
    y: pad.top + ch - (d.value / max) * ch,
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `M ${pts[0].x} ${height - pad.bottom} ${pts.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${height - pad.bottom} Z`;

  return (
    <div className="space-y-2">
      <div className="grid gap-4 lg:grid-cols-[44px_minmax(0,1fr)]">
        <div className="hidden flex-col justify-between pt-2 pb-8 font-['Montserrat'] text-sm font-medium text-foreground lg:flex">
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
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="8" fill="#FFAE4C" fillOpacity="0.25" />
                <circle cx={p.x} cy={p.y} r="4" fill="#FFAE4C" stroke="white" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-5 gap-2 font-['Montserrat'] text-sm font-medium text-foreground sm:grid-cols-10">
            {series.map((d, i) => (
              <span key={i} className="text-center">{t(d.monthKey, d.defaultMonth)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderAnalyticsPage() {
  const { t } = useTranslation("traderAnalytics");
  const [search, setSearch] = useState("");

  const orderStatus = [
    { labelKey: "statusNew", defaultLabel: "New", share: 35, color: "#A81324" },
    { labelKey: "statusConfirmed", defaultLabel: "Confirmed", share: 25, color: "#FCD34D" },
    { labelKey: "statusShipped", defaultLabel: "Shipped", share: 30, color: "#7DD3FC" },
    { labelKey: "statusDelivered", defaultLabel: "Delivered", share: 10, color: "#A855F7" },
  ];

  const summaryCards = [
    { labelKey: "totalRevenue", defaultLabel: "Total Revenue", value: "EGP 245,300", delta: "8.5%", noteKey: "upFromYesterday", defaultNote: "Up from yesterday", up: true },
    { labelKey: "grossMargin", defaultLabel: "Gross Margin", value: "42% (EGP 102k)", delta: "8.5%", noteKey: "upFromYesterday", defaultNote: "Up from yesterday", up: true },
    { labelKey: "totalDiscounts", defaultLabel: "Total Discounts", value: "-EGP 14,600", delta: "8.5%", noteKey: "downFromYesterday", defaultNote: "Down from yesterday", up: false },
    { labelKey: "predictedRevenue", defaultLabel: "Predicted Revenue", value: "EGP 260,000", delta: "8.5%", noteKey: "upFromYesterday", defaultNote: "Up from yesterday", up: true },
  ];

  const profitTrendSeries = [
    { monthKey: "jan", defaultMonth: "Jan", value: 22 },
    { monthKey: "feb", defaultMonth: "Feb", value: 26 },
    { monthKey: "mar", defaultMonth: "Mar", value: 31 },
    { monthKey: "apr", defaultMonth: "Apr", value: 33 },
    { monthKey: "may", defaultMonth: "May", value: 29 },
    { monthKey: "jun", defaultMonth: "Jun", value: 18 },
    { monthKey: "jul", defaultMonth: "Jul", value: 25 },
    { monthKey: "aug", defaultMonth: "Aug", value: 32 },
    { monthKey: "sep", defaultMonth: "Sep", value: 35 },
    { monthKey: "oct", defaultMonth: "Oct", value: 39 },
  ];

  const marginWeekData = [
    { weekKey: "week1", defaultWeek: "Week 1", cogs: 38, profit: 20 },
    { weekKey: "week2", defaultWeek: "Week 2", cogs: 38, profit: 20 },
    { weekKey: "week3", defaultWeek: "Week 3", cogs: 38, profit: 20 },
    { weekKey: "week4", defaultWeek: "Week 4", cogs: 38, profit: 20 },
  ];

  const discountAnalysisRows = [
    { periodKey: "week1", defaultPeriod: "Week 1", discounts: "EGP 2,400", avgDiscount: "10%", netMargin: "42.8%" },
    { periodKey: "week2", defaultPeriod: "Week 2", discounts: "EGP 2,400", avgDiscount: "10%", netMargin: "42.8%" },
    { periodKey: "week3", defaultPeriod: "Week 3", discounts: "EGP 2,400", avgDiscount: "10%", netMargin: "42.8%" },
    { periodKey: "week4", defaultPeriod: "Week 4", discounts: "EGP 2,400", avgDiscount: "10%", netMargin: "42.8%" },
  ];

  const cogsCategories = [
    { key: "hoodies", defaultLabel: "Hoodies" },
    { key: "hoodies", defaultLabel: "Hoodies" },
    { key: "hoodies", defaultLabel: "Hoodies" },
    { key: "hoodies", defaultLabel: "Hoodies" },
    { key: "hoodies", defaultLabel: "Hoodies" },
  ];
  const cogsBarValues = [38, 38, 38, 38, 38];

  const cogsTableRows = [
    { catKey: "hoodie", defaultCat: "Hoodie", materials: "EGP 2,400", labor: "EGP 2,400", logistics: "EGP 2,400", packaging: "EGP 2,400", total: "EGP 2,400" },
    { catKey: "tees", defaultCat: "Tees", materials: "EGP 2,400", labor: "EGP 2,400", logistics: "EGP 2,400", packaging: "EGP 2,400", total: "EGP 2,400" },
    { catKey: "hoodie", defaultCat: "Hoodie", materials: "EGP 2,400", labor: "EGP 2,400", logistics: "EGP 2,400", packaging: "EGP 2,400", total: "EGP 2,400" },
    { catKey: "hoodie", defaultCat: "Hoodie", materials: "EGP 2,400", labor: "EGP 2,400", logistics: "EGP 2,400", packaging: "EGP 2,400", total: "EGP 2,400" },
  ];

  const inventoryBarData = [
    { monthKey: "jan", defaultMonth: "Jan", value: 38 },
    { monthKey: "feb", defaultMonth: "Feb", value: 38 },
    { monthKey: "mar", defaultMonth: "Mar", value: 38 },
    { monthKey: "apr", defaultMonth: "Apr", value: 38 },
    { monthKey: "may", defaultMonth: "May", value: 38 },
    { monthKey: "jun", defaultMonth: "Jun", value: 38 },
    { monthKey: "jul", defaultMonth: "Jul", value: 38 },
    { monthKey: "aug", defaultMonth: "Aug", value: 38 },
    { monthKey: "sep", defaultMonth: "Sep", value: 38 },
    { monthKey: "oct", defaultMonth: "Oct", value: 38 },
    { monthKey: "nov", defaultMonth: "Nov", value: 38 },
    { monthKey: "dec", defaultMonth: "Dec", value: 38 },
  ];

  const inventoryTurnoverSeries = [
    { monthKey: "jan", defaultMonth: "Jan", value: 2.2 },
    { monthKey: "feb", defaultMonth: "Feb", value: 2.6 },
    { monthKey: "mar", defaultMonth: "Mar", value: 3.1 },
    { monthKey: "apr", defaultMonth: "Apr", value: 3.3 },
    { monthKey: "may", defaultMonth: "May", value: 2.9 },
    { monthKey: "jun", defaultMonth: "Jun", value: 1.8 },
    { monthKey: "jul", defaultMonth: "Jul", value: 2.5 },
    { monthKey: "aug", defaultMonth: "Aug", value: 3.2 },
    { monthKey: "sep", defaultMonth: "Sep", value: 3.5 },
    { monthKey: "oct", defaultMonth: "Oct", value: 3.9 },
  ];

  const inventoryCostRows = [
    { catKey: "men", defaultCat: "Men", stock: 540, cost: "EGP 8,600", avgPrice: "EGP 12,400", margin: "42.8%" },
    { catKey: "women", defaultCat: "Women", stock: 540, cost: "EGP 8,600", avgPrice: "EGP 12,400", margin: "42.8%" },
    { catKey: "kids", defaultCat: "Kids", stock: 540, cost: "EGP 8,600", avgPrice: "EGP 12,400", margin: "42.8%" },
  ];

  return (
    <div className="space-y-5">
      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex min-w-[280px] items-center">
          <svg className="pointer-events-none absolute left-4 h-5 w-5 text-gray-text" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            type="text"
            placeholder={t("searchCustomers", "Search customers")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-stroke bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none placeholder:text-gray-text focus:border-stroke"
          />
        </label>
        <button
          type="button"
          className="flex h-11 items-center gap-1.5 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background cursor-pointer"
        >
          {t("dateRange", "Date Range")}
          <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.labelKey}
            className="rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{t(card.labelKey, card.defaultLabel)}</p>
                <p className="mt-2 font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
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
              <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
                <span className={card.up ? "text-teal-500" : "text-rose-500"}>{card.delta}</span>{" "}
                {t(card.noteKey, card.defaultNote)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Net Profit Trend */}
      <Panel title={t("netProfitTrend", "Net Profit Trend Over Time")}>
        <NetProfitChart series={profitTrendSeries} />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_320px]">
        {/* Performance Margin Trend */}
        <Panel title={t("performanceMarginTrend", "Performance Margin Trend")}>
          <div className="flex h-56 items-end gap-6 justify-center">
            {marginWeekData.map((d, i) => (
              <div key={i} className="flex h-full flex-col justify-end gap-1">
                <div className="flex items-end gap-1 h-48">
                  <div className="w-5 bg-sky-300 rounded-t-lg" style={{ height: `${(d.profit / 40) * 100}%` }} />
                  <div className="w-5 bg-primary rounded-t-lg" style={{ height: `${(d.cogs / 40) * 100}%` }} />
                </div>
                <span className="font-['Montserrat'] text-xs text-center font-medium text-foreground">{t(d.weekKey, d.defaultWeek)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-2"><span className="h-4 w-4 bg-primary rounded-md"></span> {t("cogs", "COGS")}</span>
            <span className="flex items-center gap-2"><span className="h-4 w-4 bg-sky-300 rounded-md"></span> {t("profit", "Profit")}</span>
          </div>
        </Panel>

        {/* Discount Impact on Net Margin */}
        <Panel title={t("discountImpact", "Discount Impact on Net Margin")}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-primary border-r-sky-300">
              <div className="text-center">
                <p className="font-['Montserrat'] text-xl font-semibold text-foreground">1,234</p>
                <p className="font-['Montserrat'] text-xs font-medium text-gray-text">{t("totalOrders", "Total Orders")}</p>
              </div>
            </div>
            <div className="w-full text-sm font-medium">
              <div className="flex justify-between py-1 border-b border-stroke">
                <span className="text-gray-text">{t("totalDiscount", "Total Discount")}</span>
                <span>EGP 14,600 (5.9%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-text">{t("avgMarginDrop", "Avg. Margin Drop")}</span>
                <span>-3.2%</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Discount Analysis Summary */}
      <Panel title={t("discountAnalysisSummary", "Discount Analysis Summary")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
            <thead>
              <tr className="bg-secondary text-primary">
                <th className="px-4 py-3 rounded-l-lg">{t("period", "Period")}</th>
                <th className="px-4 py-3">{t("totalDiscounts", "Total Discounts")}</th>
                <th className="px-4 py-3">{t("avgDiscount", "Avg. Discount")}</th>
                <th className="px-4 py-3 rounded-r-lg">{t("netMargin", "Net Margin")}</th>
              </tr>
            </thead>
            <tbody>
              {discountAnalysisRows.map((row, i) => (
                <tr key={i} className="border-b border-stroke">
                  <td className="px-4 py-3">{t(row.periodKey, row.defaultPeriod)}</td>
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
        <Panel title={t("cogsBreakdown", "COGS Breakdown")}>
          <div className="flex h-48 items-end justify-center gap-4 border-b border-stroke pb-2">
            {cogsBarValues.map((v, i) => (
              <div key={i} className={`w-8 rounded-t-lg ${i === 4 ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`} style={{ height: `${(v / 40) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-2">
            {cogsCategories.map((c, i) => (
              <span key={i} className="text-xs font-medium w-8 text-center">{t(c.key, c.defaultLabel)}</span>
            ))}
          </div>
        </Panel>
        <Panel title={t("cogsBreakdownTable", "COGS Breakdown Table")}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
              <thead>
                <tr className="bg-secondary text-primary">
                  <th className="px-4 py-3 rounded-l-lg">{t("category", "Category")}</th>
                  <th className="px-4 py-3">{t("materials", "Materials")}</th>
                  <th className="px-4 py-3">{t("labor", "Labor")}</th>
                  <th className="px-4 py-3">{t("logistics", "Logistics")}</th>
                  <th className="px-4 py-3">{t("packaging", "Packaging")}</th>
                  <th className="px-4 py-3 rounded-r-lg">{t("totalCost", "Total Cost")}</th>
                </tr>
              </thead>
              <tbody>
                {cogsTableRows.map((row, i) => (
                  <tr key={i} className="border-b border-stroke">
                    <td className="px-4 py-3">{t(row.catKey, row.defaultCat)}</td>
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
        <Panel title={t("inventoryValueVsRevenue", "Inventory Value vs Revenue")}>
          <div className="flex h-56 items-end justify-between px-4">
            {inventoryBarData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-8 bg-primary rounded-t-lg" style={{ height: `${d.value}%` }} />
                <span className="text-xs font-medium">{t(d.monthKey, d.defaultMonth)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title={t("inventoryTurnoverTrend", "Inventory Turnover Trend")}>
          <div className="flex h-56 items-end justify-between px-4 border-b border-stroke">
            {inventoryTurnoverSeries.map((d, i) => (
              <div key={i} className="flex flex-col items-center h-full justify-end">
                <div className="w-2 h-2 rounded-full bg-orange-400 mb-2"></div>
                <span className="text-xs font-medium">{t(d.monthKey, d.defaultMonth)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Inventory Cost Breakdown */}
      <Panel title={t("inventoryCostBreakdown", "Inventory Cost Breakdown")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left font-['Montserrat'] text-xs font-medium">
            <thead>
              <tr className="bg-secondary text-primary">
                <th className="px-4 py-3 rounded-l-lg">{t("category", "Category")}</th>
                <th className="px-4 py-3">{t("currentStock", "Current Stock")}</th>
                <th className="px-4 py-3">{t("totalCost", "Total Cost")}</th>
                <th className="px-4 py-3">{t("avgSalePrice", "Avg. Sale Price")}</th>
                <th className="px-4 py-3 rounded-r-lg">{t("netMargin", "Net Margin")}</th>
              </tr>
            </thead>
            <tbody>
              {inventoryCostRows.map((row, i) => (
                <tr key={i} className="border-b border-stroke">
                  <td className="px-4 py-3">{t(row.catKey, row.defaultCat)}</td>
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
    </div>
  );
}
