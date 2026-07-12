import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type InventoryItem,
  getStatus,
  asset,
} from "../../components/trader/inventoryUtils";
import {
  InventoryTablePanel,
  AddItemModal,
  EditItemModal,
} from "../../components/trader/InventoryShared";
import {
  useTraderWholesales,
  useDeleteWholesale,
} from "../../hooks/queries/wholesaleQuery";

// ─── Static data ───────────────────────────────────────────────────────────────
const statCards = [
  {
    label: "totalOrders",
    value: "1,245 Orders",
    trend: "8.5%",
    trendUp: true,
    sub: "upFromYesterday",
  },
  {
    label: "totalRevenue",
    value: "$87,250",
    trend: "8.5%",
    trendUp: true,
    sub: "upFromYesterday",
  },
  {
    label: "totalUnitsSold",
    value: "18,320 pcs",
    trend: "8.5%",
    trendUp: false,
    sub: "downFromYesterday",
  },
  {
    label: "activeClients",
    value: "126 Clients",
    trend: "8.5%",
    trendUp: true,
    sub: "upFromYesterday",
  },
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
  {
    name: "Alpha Retail Co.",
    order: "#WS-1021",
    spent: "$12,400",
    last: "Oct 10, 2025",
    status: "Active",
  },
  {
    name: "Beta Goods Ltd.",
    order: "#WS-1022",
    spent: "$9,870",
    last: "Oct 8, 2025",
    status: "Pending",
  },
  {
    name: "Gamma Supplies",
    order: "#WS-1023",
    spent: "$7,500",
    last: "Sep 29, 2025",
    status: "Active",
  },
  {
    name: "Delta Traders",
    order: "#WS-1024",
    spent: "$5,200",
    last: "Sep 15, 2025",
    status: "Inactive",
  },
];

const recentAlerts = [
  {
    title: "lowStockAlert",
    desc: "Product SKU #P-0421 has only 12 units remaining.",
    time: "2 hrs ago",
    color: "bg-amber-400",
  },
  {
    title: "newWholesaleOrder",
    desc: "Alpha Retail Co. placed an order of 500 units.",
    time: "5 hrs ago",
    color: "bg-emerald-400",
  },
  {
    title: "paymentOverdue",
    desc: "Delta Traders payment of $5,200 is 3 days overdue.",
    time: "1 day ago",
    color: "bg-rose-400",
  },
];

const categorySegments = [
  { label: "men", value: 35, color: "#A81324" },
  { label: "women", value: 25, color: "#FCD34D" },
  { label: "kids", value: 30, color: "#7DD3FC" },
  { label: "craft", value: 10, color: "#C084FC" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function pillStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (s === "pending") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

// ─── Charts ────────────────────────────────────────────────────────────────────
function EarningsChart() {
  const max = Math.max(...earningsData.map((d) => d.value));
  const w = 600,
    h = 200,
    padL = 40,
    padR = 20,
    padT = 20,
    padB = 30;
  const chartW = w - padL - padR,
    chartH = h - padT - padB;
  const pts = earningsData.map((d, i) => ({
    x: padL + (i / (earningsData.length - 1)) * chartW,
    y: padT + (1 - d.value / max) * chartH,
    ...d,
  }));
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + chartH} L ${pts[0].x} ${padT + chartH} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wh-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padL}
          x2={w - padR}
          y1={padT + t * chartH}
          y2={padT + t * chartH}
          stroke="#E5E7EB"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#wh-grad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#FFAE4C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p) => (
        <circle
          key={p.month}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="white"
          stroke="#FFAE4C"
          strokeWidth="2"
        />
      ))}
      {pts.map((p) => (
        <text
          key={p.month + "l"}
          x={p.x}
          y={h - 6}
          textAnchor="middle"
          fontSize="9"
          fill="#6B7280"
        >
          {p.month}
        </text>
      ))}
    </svg>
  );
}

function CategoryDonut() {
  const cx = 80,
    cy = 80,
    r = 65,
    innerR = 40;
  let startAngle = -Math.PI / 2;
  const paths = categorySegments.map((seg) => {
    const angle = (seg.value / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle),
      y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),
      y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle),
      yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle),
      yi2 = cy + innerR * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return { ...seg, d };
  });
  const { t } = useTranslation("traderWholesale");
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths.map((seg) => (
          <path key={seg.label} d={seg.d} fill={seg.color} />
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#111827"
        >
          18,320
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="8"
          fill="#6B7280"
        >
          {t("totalUnits")}
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {categorySegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 shrink-0 rounded"
              style={{ background: seg.color }}
            />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
              {t(seg.label)} {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TraderWholesalePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const { t } = useTranslation("traderWholesale");

  const {
    data: traderWholesales = [],
    isLoading,
    isError,
    error: errorMsg,
  } = useTraderWholesales();
  const deleteWholesale = useDeleteWholesale();

  const items: InventoryItem[] = traderWholesales.map((w) => ({
    id: w.id,
    image: w.images[0]?.url ?? "",
    imagesByColor: w.images.map((img) => ({
      url: img.url,
      color: img.color ?? undefined,
    })),
    product: w.name,
    category: w.category?.name ?? "",
    categoryId: w.categoryId,
    brandId: "",
    stock: w.stock ?? 0,
    sku: w.sku ?? "",
    price: `$${w.price}`,
    priceNum: w.price,
    date: new Date(w.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    createdAtRaw: new Date(w.createdAt).getTime(),
    status: getStatus(w.stock ?? 0),
    type: "wholesale" as const,
    description: w.description ?? "",
    sizes: Array.from(new Set(w.wholesaleColors?.flatMap(wc => wc.sizes.map(s => s.size)) || [])),
    colors: w.wholesaleColors?.map(wc => wc.color) || [],
    minOrder: w.minOrder ?? 1,
    isMustHave: false,
    isFlashDeals: false,
    flashDealPrice: null,
    flashDealEndsAt: null,
    isBestDeal: w.isBestDeal ?? false,
    isMostPopular: w.isMostPopular ?? false,
    isPremiumCollection: w.isPremiumCollection ?? false,
  }));

  const topSellingProducts = traderWholesales.slice(0, 3).map((w, idx) => ({
    name: w.name,
    sku: `SKU-${String(idx + 1).padStart(3, "0")}`,
    units: `${w.minOrder} pcs min`,
    revenue: `$${w.price}`,
  }));

  const errorMessages = isError
    ? [
        (
          errorMsg as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ?? "Failed to load wholesales",
      ]
    : [];

  const rowBg = (idx: number) => (idx % 2 === 0 ? "bg-white" : "bg-background");

  return (
    <>
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          lockedType="wholesale"
        />
      )}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}

      <div className="space-y-4">
        {/* Stat cards */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="relative flex-1 min-w-[220px] h-32 rounded-2xl border border-stroke bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
            >
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <p className="font-['Montserrat'] text-base font-medium text-gray-text">
                  {t(card.label)}
                </p>
                <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">
                  {card.value}
                </p>
              </div>
              <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#111827"
                    strokeWidth="1.5"
                  />
                  <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-1">
                <span
                  className={`font-['Montserrat'] text-sm font-medium ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}
                >
                  {card.trendUp ? "+" : "-"}
                  {card.trend}
                </span>
                <span className="font-['Montserrat'] text-sm font-medium text-gray-text">
                  {t(card.sub)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings Over Time */}
        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("earningsOverTime")}
            </h2>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {t("partner")}
              <img
                className="h-5 w-5 rotate-90"
                src={asset("weui_arrow-outlined.svg")}
                alt=""
              />
            </button>
          </div>
          <EarningsChart />
        </div>

        {/* Top Clients */}
        <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
            <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("topClients")}
            </h2>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
            >
              {t("export")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3">
                    <div className="h-5 w-5 rounded-md border border-primary bg-secondary" />
                  </th>
                  {[
                    t("client"),
                    t("order"),
                    t("totalSpent"),
                    t("lastOrder"),
                    t("status"),
                    t("actions"),
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClients.map((row, idx) => {
                  const pill = pillStyle(row.status);
                  return (
                    <tr key={idx} className={rowBg(idx)}>
                      <td className="px-4 py-3">
                        <div className="h-5 w-5 rounded-md border border-stroke bg-white" />
                      </td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                        {row.order}
                      </td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                        {row.spent}
                      </td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                        {row.last}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="flex h-4 w-4 flex-col items-center justify-center gap-0.5"
                        >
                          <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
                          <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
                          <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-column bottom panels */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Alerts */}
          <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("recentAlerts")}
            </h2>
            <div className="space-y-3">
              {recentAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-xl border border-stroke p-3"
                >
                  <div
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${alert.color}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      {t(alert.title)}
                    </p>
                    <p className="mt-0.5 font-['Montserrat'] text-xs text-gray-text">
                      {alert.desc}
                    </p>
                    <p className="mt-1 font-['Montserrat'] text-xs font-medium text-gray-text">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top-Selling Products */}
          <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("topSellingProducts")}
            </h2>
            <div className="space-y-3">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((prod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-stroke p-3"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-light flex items-center justify-center">
                      <span className="font-['Montserrat'] text-xs font-bold text-gray-text">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {prod.name}
                      </p>
                      <p className="font-['Montserrat'] text-xs text-gray-text">
                        {prod.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {prod.revenue}
                      </p>
                      <p className="font-['Montserrat'] text-xs text-gray-text">
                        {prod.units}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-['Montserrat'] text-sm text-gray-text">
                  {t("noProductsYet")}
                </p>
              )}
            </div>
          </div>

          {/* Category Donut */}
          <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
              {t("productCategory")}
            </h2>
            <CategoryDonut />
          </div>
        </div>

        {/* Wholesale Products Table — shared panel */}
        <InventoryTablePanel
          items={items}
          isLoading={isLoading}
          errorMessages={errorMessages}
          onAdd={() => setShowAddModal(true)}
          onEdit={setEditItem}
          onDelete={(item) => deleteWholesale.mutate(item.id)}
          showTypeFilter={false}
          title={t("wholesaleProducts")}
          addLabel={t("addWholesale")}
        />
      </div>
    </>
  );
}
