import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useTraderWholesaleOrders,
  useUpdateWholesaleOrderStatus,
  useDeleteWholesaleOrder,
  useUpdateWholesaleOrder,
  type WholesaleOrder,
} from "../../../hooks/queries/wholesaleOrderQuery";
import { useTraderProducts, type Product } from "../../../hooks/queries/productsQuery";
import { useWholesale, type WholesaleProduct } from "../../../hooks/queries/wholesaleQuery";
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Trash2,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Info,
} from "lucide-react";
import { toast } from "sonner";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function statusPill(status: string) {
  const norm = status.toUpperCase();
  if (norm === "COMPLETED" || norm === "DELIVERED") {
    return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "outline-emerald-700" };
  }
  if (norm === "SHIPPED") {
    return { bg: "bg-blue-50", text: "text-blue-700", ring: "outline-blue-700" };
  }
  if (norm === "PROCESSING") {
    return { bg: "bg-amber-50", text: "text-amber-700", ring: "outline-amber-700" };
  }
  if (norm === "PENDING") {
    return { bg: "bg-purple-50", text: "text-purple-700", ring: "outline-purple-700" };
  }
  return { bg: "bg-rose-50", text: "text-rose-700", ring: "outline-rose-700" };
}

function getLocalizedStatus(status: string, t: ReturnType<typeof useTranslation>["t"]) {
  const norm = status.toUpperCase();
  if (norm === "COMPLETED") return t("statusCompleted", "Completed");
  if (norm === "DELIVERED") return t("statusDelivered", "Delivered");
  if (norm === "SHIPPED") return t("statusShipped", "Shipped");
  if (norm === "PROCESSING") return t("statusProcessing", "Processing");
  if (norm === "PENDING") return t("statusPending", "Pending");
  if (norm === "CANCELLED") return t("statusCancelled", "Cancelled");
  return status;
}

type SizeOption = {
  id?: string;
  size: string;
  quantity?: number;
};

type ColorOption = {
  id: string;
  color: string;
  stock: number;
  sizes: SizeOption[];
};

function normalizeSizeOptions(sizes?: Product["sizes"]): SizeOption[] {
  if (!Array.isArray(sizes)) return [];

  return sizes.map((size) =>
    typeof size === "string"
      ? { size }
      : {
          id: "id" in size ? size.id : undefined,
          size: size.size,
          quantity: "quantity" in size ? size.quantity : undefined,
        },
  );
}

// ─── Interactive Charts ────────────────────────────────────────────────────────
function EarningsChart({ orders = [] }: { orders?: WholesaleOrder[] }) {
  const { t } = useTranslation("traderWholesale");
  const [period, setPeriod] = useState<"6M" | "1Y" | "All">("6M");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  const earningsDataByPeriod = useMemo(() => {
    const now = new Date();
    const getMonthsData = (numMonths: number) => {
      const monthsList: { month: string; year: number; monthIdx: number; value: number; orders: number }[] = [];
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthsList.push({
          month: d.toLocaleDateString("en-US", { month: "short" }) + (numMonths > 6 ? ` '${String(d.getFullYear()).slice(-2)}` : ""),
          year: d.getFullYear(),
          monthIdx: d.getMonth(),
          value: 0,
          orders: 0,
        });
      }
      return monthsList;
    };

    const sixMonths = getMonthsData(6);
    const twelveMonths = getMonthsData(12);
    const allTimeMap = new Map<string, { month: string; sortKey: number; value: number; orders: number }>();

    orders.forEach((o) => {
      const d = new Date(o.date || "");
      const validDate = !isNaN(d.getTime()) ? d : now;
      const val = Number(String(o.total || "").replace(/[^0-9.-]+/g, "")) || 0;

      sixMonths.forEach((m) => {
        if (validDate.getFullYear() === m.year && validDate.getMonth() === m.monthIdx) {
          m.value += val;
          m.orders += 1;
        }
      });

      twelveMonths.forEach((m) => {
        if (validDate.getFullYear() === m.year && validDate.getMonth() === m.monthIdx) {
          m.value += val;
          m.orders += 1;
        }
      });

      const monthKey = `${validDate.getFullYear()}-${validDate.getMonth()}`;
      const monthLabel = validDate.toLocaleDateString("en-US", { month: "short" }) + ` '${String(validDate.getFullYear()).slice(-2)}`;
      if (!allTimeMap.has(monthKey)) {
        allTimeMap.set(monthKey, {
          month: monthLabel,
          sortKey: validDate.getFullYear() * 12 + validDate.getMonth(),
          value: 0,
          orders: 0,
        });
      }
      const entry = allTimeMap.get(monthKey)!;
      entry.value += val;
      entry.orders += 1;
    });

    let allTimeList = Array.from(allTimeMap.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ month, value, orders: ordCount }) => ({ month, value, orders: ordCount }));

    if (allTimeList.length === 0) {
      allTimeList = [
        { month: "Q1", value: 0, orders: 0 },
        { month: "Q2", value: 0, orders: 0 },
        { month: "Q3", value: 0, orders: 0 },
        { month: "Q4", value: 0, orders: 0 },
      ];
    }

    return {
      "6M": sixMonths.map(({ month, value, orders: ordCount }) => ({ month, value, orders: ordCount })),
      "1Y": twelveMonths.map(({ month, value, orders: ordCount }) => ({ month, value, orders: ordCount })),
      "All": allTimeList,
    };
  }, [orders]);

  const currentData = earningsDataByPeriod[period] || earningsDataByPeriod["6M"];
  const maxVal = Math.max(...currentData.map((d) => (activeMetric === "revenue" ? d.value : d.orders)), 1);

  const w = 600,
    h = 220,
    padL = 45,
    padR = 20,
    padT = 25,
    padB = 35;
  const chartW = w - padL - padR,
    chartH = h - padT - padB;

  const pts = currentData.map((d, i) => {
    const val = activeMetric === "revenue" ? d.value : d.orders;
    const xRatio = currentData.length > 1 ? i / (currentData.length - 1) : 0.5;
    return {
      x: padL + xRatio * chartW,
      y: padT + (1 - val / maxVal) * chartH,
      ...d,
      currentVal: val,
    };
  });

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + chartH} L ${pts[0].x} ${padT + chartH} Z`;

  const activeIndex = pinnedIndex ?? hoveredIndex;
  const activePoint = activeIndex !== null ? pts[activeIndex] : null;

  // Growth calc vs previous point
  let growth: number | null = null;
  if (activeIndex !== null && activeIndex > 0) {
    const prevVal = pts[activeIndex - 1].currentVal;
    if (prevVal > 0) {
      growth = ((pts[activeIndex].currentVal - prevVal) / prevVal) * 100;
    }
  }

  const totalPeriodValue = currentData.reduce((acc, d) => acc + (activeMetric === "revenue" ? d.value : d.orders), 0);
  const peakPoint = [...pts].sort((a, b) => b.currentVal - a.currentVal)[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Interactive Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stroke/60">
        {/* Metric Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-background p-1 border border-stroke">
          <button
            type="button"
            onClick={() => {
              setActiveMetric("revenue");
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['Montserrat'] text-xs font-bold transition cursor-pointer ${activeMetric === "revenue"
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-gray-text hover:text-foreground"
              }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {t("metricRevenue", "Revenue (EGP)")}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMetric("orders");
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['Montserrat'] text-xs font-bold transition cursor-pointer ${activeMetric === "orders"
                ? "bg-secondary text-secondary-foreground shadow-sm"
                : "text-gray-text hover:text-foreground"
              }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {t("metricOrders", "Orders Volume")}
          </button>
        </div>

        {/* Time Period Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-background p-1 border border-stroke">
          {(["6M", "1Y", "All"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setPeriod(tab);
                setHoveredIndex(null);
                setPinnedIndex(null);
              }}
              className={`px-3 py-1 rounded-lg font-['Montserrat'] text-xs font-bold transition cursor-pointer ${period === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-text hover:text-foreground"
                }`}
            >
              {tab === "6M" ? t("tab6Months", "6 Months") : tab === "1Y" ? t("tab1Year", "1 Year") : t("tabAllTime", "All Time")}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas with Interactive Tooltip */}
      <div className="relative w-full overflow-visible select-none py-1">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full overflow-visible cursor-crosshair"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={(e) => {
            // If clicking empty background, unpin
            if (e.target === e.currentTarget) setPinnedIndex(null);
          }}
        >
          <defs>
            <linearGradient id="wh-grad-interactive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"} stopOpacity="0" />
            </linearGradient>
            <filter id="point-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tVal) => (
            <line
              key={tVal}
              x1={padL}
              x2={w - padR}
              y1={padT + tVal * chartH}
              y2={padT + tVal * chartH}
              stroke="#F3F4F6"
              strokeWidth="1.5"
            />
          ))}

          {/* Y Axis Labels */}
          {[0, 0.5, 1].map((tVal) => {
            const valAtLine = Math.round(maxVal * (1 - tVal));
            const formatted = activeMetric === "revenue"
              ? valAtLine >= 1000 ? `${(valAtLine / 1000).toFixed(0)}k` : `${valAtLine}`
              : `${valAtLine}`;
            return (
              <text
                key={tVal}
                x={padL - 8}
                y={padT + tVal * chartH + 3}
                textAnchor="end"
                fontSize="9"
                fontWeight="600"
                fill="#9CA3AF"
                className="font-['Montserrat']"
              >
                {formatted}
              </text>
            );
          })}

          {/* Area & Line */}
          <path d={areaPath} fill="url(#wh-grad-interactive)" className="transition-all duration-300" />
          <path
            d={linePath}
            fill="none"
            stroke={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Active Vertical Guideline */}
          {activePoint && (
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={padT}
              y2={padT + chartH}
              stroke={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Invisible hover columns for smooth tracking across entire X axis */}
          {pts.map((p, i) => {
            const stepW = chartW / Math.max(pts.length - 1, 1);
            const leftX = i === 0 ? padL : p.x - stepW / 2;
            const widthX = i === 0 || i === pts.length - 1 ? stepW / 2 : stepW;
            return (
              <rect
                key={p.month + "rect"}
                x={leftX}
                y={padT}
                width={widthX}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => setPinnedIndex(prev => prev === i ? null : i)}
                className="cursor-pointer"
              />
            );
          })}

          {/* Data Points */}
          {pts.map((p, i) => {
            const isActive = activeIndex === i;
            return (
              <g key={p.month} className="pointer-events-none transition-all duration-150">
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={10}
                    fill={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"}
                    fillOpacity="0.25"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 4}
                  fill="white"
                  stroke={activeMetric === "revenue" ? "#FFAE4C" : "#A81324"}
                  strokeWidth={isActive ? 3 : 2}
                  filter={isActive ? "url(#point-glow)" : undefined}
                />
              </g>
            );
          })}

          {/* X Axis Labels */}
          {pts.map((p, i) => (
            <text
              key={p.month + "l"}
              x={p.x}
              y={h - 8}
              textAnchor="middle"
              fontSize={activeIndex === i ? "10" : "9"}
              fontWeight={activeIndex === i ? "700" : "500"}
              fill={activeIndex === i ? "#111827" : "#6B7280"}
              className="font-['Montserrat'] transition-all"
            >
              {p.month}
            </text>
          ))}
        </svg>

        {/* Floating HTML Tooltip */}
        {activePoint && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-150 rounded-xl border border-stroke bg-white p-3 shadow-xl min-w-[155px] font-['Montserrat']"
            style={{
              left: `${(activePoint.x / w) * 100}%`,
              top: `${(activePoint.y / h) * 100}%`,
              transform: activePoint.x > w * 0.6 ? "translate(-105%, -110%)" : "translate(5%, -110%)",
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-stroke pb-1.5 mb-1.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-text" />
                {activePoint.month}
              </span>
              {pinnedIndex === activeIndex && (
                <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-bold">
                  Pinned
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] font-semibold text-gray-text">
                  {activeMetric === "revenue" ? t("revenueLabel", "Revenue") : t("ordersLabel", "Orders")}:
                </span>
                <span className="text-sm font-bold text-foreground">
                  {activeMetric === "revenue" ? `${t("currencyEGP", "EGP")} ${activePoint.value.toLocaleString()}` : `${activePoint.orders}`}
                </span>
              </div>
              {activeMetric === "revenue" && (
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-[11px] text-gray-text">{t("ordersCount", "Orders")}:</span>
                  <span className="font-semibold text-foreground">{activePoint.orders}</span>
                </div>
              )}
              {growth !== null && (
                <div className="flex items-center gap-1 mt-1 pt-1 border-t border-stroke/60 text-xs font-bold">
                  {growth >= 0 ? (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">+{growth.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                      <span className="text-rose-600">{growth.toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-[10px] font-normal text-gray-text">{t("vsPrevMonth", "vs prev month")}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Summary Strip Below Chart */}
      <div className="grid grid-cols-3 gap-3 rounded-xl bg-background/80 p-3.5 border border-stroke font-['Montserrat']">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-gray-text uppercase tracking-wider">
            {t("totalPeriodVal", activeMetric === "revenue" ? "Total Revenue" : "Total Volume")}
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground mt-0.5">
            {activeMetric === "revenue" ? `${t("currencyEGP", "EGP")} ${totalPeriodValue.toLocaleString()}` : `${totalPeriodValue.toLocaleString()} ${t("ordersCountUnit", "Orders")}`}
          </span>
        </div>
        <div className="flex flex-col border-l border-stroke pl-3">
          <span className="text-[11px] font-semibold text-gray-text uppercase tracking-wider">
            {t("peakPeriod", "Peak Month")}
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5">
            {peakPoint.month}
            <span className="text-xs font-semibold text-secondary">
              ({activeMetric === "revenue" ? `${t("currencyEGP", "EGP")} ${peakPoint.value.toLocaleString()}` : `${peakPoint.orders}`})
            </span>
          </span>
        </div>
        <div className="flex flex-col border-l border-stroke pl-3 justify-center">
          <span className="text-xs font-medium text-gray-text flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-secondary shrink-0" />
            {pinnedIndex !== null ? (
              <button
                type="button"
                onClick={() => setPinnedIndex(null)}
                className="text-secondary font-bold underline hover:opacity-80 cursor-pointer"
              >
                {t("unpinPoint", "Unpin point")}
              </button>
            ) : (
              <span>{t("chartHint", "Hover to inspect • Click to pin")}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryDonut({
  orders = [],
  products = [],
}: {
  orders?: WholesaleOrder[];
  products?: Array<{ id: string | number; category?: { name: string } | null }>;
}) {
  const { t } = useTranslation("traderWholesale");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categorySegments = useMemo(() => {
    const productToCategoryMap = new Map<string, string>();
    products.forEach((p) => {
      if (p.category?.name) {
        productToCategoryMap.set(String(p.id), p.category.name);
      }
    });

    const categoryStats: Record<string, { units: number; value: number }> = {};
    let totalUnitsCount = 0;

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        let catName = productToCategoryMap.get(String(item.productId));
        if (!catName) {
          const titleLower = (item.product || "").toLowerCase();
          if (titleLower.includes("men") && !titleLower.includes("women")) catName = "Men";
          else if (titleLower.includes("women") || titleLower.includes("dress")) catName = "Women";
          else if (titleLower.includes("kid") || titleLower.includes("child") || titleLower.includes("toy")) catName = "Kids";
          else if (titleLower.includes("craft") || titleLower.includes("art")) catName = "Craft";
          else catName = "General";
        }
        const qty = Number(item.quantity) || 1;
        const price = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0;
        if (!categoryStats[catName]) {
          categoryStats[catName] = { units: 0, value: 0 };
        }
        categoryStats[catName].units += qty;
        categoryStats[catName].value += qty * price;
        totalUnitsCount += qty;
      });
    });

    if (totalUnitsCount === 0 && products.length > 0) {
      products.forEach((p) => {
        const catName = p.category?.name || "General";
        if (!categoryStats[catName]) categoryStats[catName] = { units: 0, value: 0 };
        categoryStats[catName].units += 1;
        totalUnitsCount += 1;
      });
    }

    if (totalUnitsCount === 0) {
      return [{ label: "No Items", value: 100, units: 0, color: "#E5E7EB" }];
    }

    const palette = ["#A81324", "#FBBF24", "#38BDF8", "#C084FC", "#34D399", "#F87171", "#60A5FA", "#A78BFA", "#F472B6"];
    return Object.entries(categoryStats)
      .map(([catName, stats], idx) => ({
        label: catName,
        value: Math.round((stats.units / totalUnitsCount) * 100),
        units: stats.units,
        color: palette[idx % palette.length],
      }))
      .sort((a, b) => b.units - a.units);
  }, [orders, products]);

  const activeCategory = selectedCategory ?? hoveredCategory;
  const activeSeg = categorySegments.find((s) => s.label === activeCategory) || null;
  const totalUnits = categorySegments.reduce((acc, s) => acc + s.units, 0);

  const cx = 90,
    cy = 90,
    baseR = 70,
    baseInnerR = 44;
  const { paths } = categorySegments.reduce(
    (acc, seg) => {
      const exactFraction = totalUnits > 0 ? seg.units / totalUnits : seg.value / 100;
      const safeFraction = Math.min(exactFraction, 0.9999);
      const angle = safeFraction * 2 * Math.PI;
      const startAngle = acc.currentAngle;
      const endAngle = startAngle + angle;
      const isActive = activeCategory === seg.label;

      const r = isActive ? baseR + 5 : baseR;
      const innerR = isActive ? baseInnerR - 2 : baseInnerR;

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
      acc.paths.push({ ...seg, d, isActive });
      acc.currentAngle = endAngle;
      return acc;
    },
    { currentAngle: -Math.PI / 2, paths: [] as Array<(typeof categorySegments)[0] & { d: string; isActive: boolean }> }
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Donut SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="overflow-visible select-none"
        >
          <defs>
            <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {paths.map((seg) => (
            <path
              key={seg.label}
              d={seg.d}
              fill={seg.color}
              filter={seg.isActive ? "url(#donut-glow)" : undefined}
              onMouseEnter={() => setHoveredCategory(seg.label)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => setSelectedCategory((prev) => (prev === seg.label ? null : seg.label))}
              style={{
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                opacity: activeCategory && !seg.isActive ? 0.45 : 1,
              }}
            />
          ))}

          {/* Center Dynamic Label */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="16"
            fontWeight="800"
            fill="#111827"
            className="font-['Montserrat'] transition-all"
          >
            {activeSeg ? activeSeg.units.toLocaleString() : totalUnits.toLocaleString()}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontSize={activeSeg ? "10" : "9"}
            fontWeight="700"
            fill={activeSeg ? activeSeg.color : "#6B7280"}
            className="font-['Montserrat'] transition-all uppercase tracking-wider"
          >
            {activeSeg ? `${t(activeSeg.label, activeSeg.label)} (${activeSeg.value}%)` : t("totalUnits", "Total Units")}
          </text>
        </svg>
      </div>

      {/* Interactive Legend Grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full mt-1">
        {categorySegments.map((seg) => {
          const isActive = activeCategory === seg.label;
          return (
            <button
              key={seg.label}
              type="button"
              onClick={() => setSelectedCategory((prev) => (prev === seg.label ? null : seg.label))}
              onMouseEnter={() => setHoveredCategory(seg.label)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-left font-['Montserrat'] transition-all cursor-pointer ${isActive
                  ? "bg-secondary/15 border-secondary shadow-sm scale-[1.02]"
                  : "bg-background border-stroke hover:border-gray-300 hover:bg-card"
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`h-3 w-3 shrink-0 rounded transition-transform ${isActive ? "scale-125" : ""
                    }`}
                  style={{ background: seg.color }}
                />
                <span className={`text-xs capitalize truncate ${isActive ? "font-bold text-foreground" : "font-semibold text-gray-text"}`}>
                  {t(seg.label, seg.label)}
                </span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-bold text-foreground">{seg.value}%</span>
                <span className="text-[10px] text-gray-text">{seg.units.toLocaleString()}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Footer */}
      <div className="w-full text-center">
        {selectedCategory ? (
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-bold font-['Montserrat'] text-secondary underline hover:opacity-80 cursor-pointer"
          >
            {t("clearSelection", "Clear category filter")}
          </button>
        ) : (
          <p className="text-[11px] font-medium text-gray-text font-['Montserrat']">
            💡 {t("donutHint", "Click any category slice or card to lock focus")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Editable Order Item Row Component ──────────────────────────────────── */
interface EditableOrderItemRowProps {
  item: WholesaleOrder["items"][number];
  idx: number;
  isEditing: boolean;
  currentEdit: { quantity: number; price: number; sizeQuantities?: Record<string, number> };
  onChange: (updates: Partial<{ quantity: number; price: number; sizeQuantities?: Record<string, number> }>) => void;
  onDelete: () => void;
  onAddColorRow?: () => void;
}

function EditableOrderItemRow({ item, idx, isEditing, currentEdit, onChange, onDelete, onAddColorRow }: EditableOrderItemRowProps) {
  const { t } = useTranslation("traderWholesale");
  const { data: product } = useWholesale(item.productId);

  const colors = useMemo<ColorOption[]>(() => {
    if (!product) return [];
    if (product.colors && product.colors.length > 0) {
      return product.colors.map((c) => ({
        id: c.id,
        color: c.colorName || c.color || "",
        stock: c.stock ?? product.stock ?? Infinity,
        sizes: c.variants || [],
      }));
    }
    if (product.wholesaleColors && product.wholesaleColors.length > 0) {
      return product.wholesaleColors.map((c) => ({
        id: c.id,
        color: c.color || "",
        stock: c.stock ?? product.stock ?? Infinity,
        sizes: c.sizes || [],
      }));
    }
    return [];
  }, [product]);

  const selectedColorObj = colors.find(
    (c) => item.color && c.color.toLowerCase() === item.color.toLowerCase()
  );
  const currentWarehouseStock = selectedColorObj !== undefined
    ? selectedColorObj.stock
    : (product?.stock !== undefined ? product.stock : Infinity);
  const maxStock = currentWarehouseStock !== Infinity
    ? currentWarehouseStock + item.quantity
    : Infinity;

  const sizeList: Array<{ id?: string; size: string }> = useMemo(() => {
    if (selectedColorObj?.sizes && selectedColorObj.sizes.length > 0) {
      return selectedColorObj.sizes;
    }
    if (product?.sizes && product.sizes.length > 0) {
      return normalizeSizeOptions(product.sizes);
    }
    return [];
  }, [selectedColorObj, product]);

  const handleProductQuantityChange = (newProductQty: number) => {
    const validQty = Math.max(1, newProductQty);
    const updatedSizeQuantities: Record<string, number> = {};
    if (sizeList.length > 0) {
      sizeList.forEach((s) => {
        updatedSizeQuantities[s.size] = validQty;
      });
    }
    onChange({ quantity: validQty, sizeQuantities: updatedSizeQuantities });
  };

  return (
    <tr className={`transition hover:bg-background ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}>
      <td className="px-4 py-4 text-center">
        <div className="h-12 w-12 rounded-lg bg-background border border-stroke overflow-hidden flex items-center justify-center mx-auto">
          {item.image ? (
            <img className="h-full w-full object-cover" src={item.image} alt={item.product} />
          ) : (
            <ShoppingBag className="h-5 w-5 text-gray-text" />
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat']">
        <div className="font-bold text-foreground text-sm">
          {item.product}
        </div>
        <div className="flex justify-center gap-2 mt-1">
          {item.size && (
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-background text-gray-text rounded border border-stroke">
              {t("sizeLabel", "Size:")} {item.size}
            </span>
          )}
          {item.color && (
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-background text-gray-text rounded border border-stroke">
              {t("colorLabel", "Color:")} {item.color}
            </span>
          )}
        </div>

        {/* Display Sizes & Quantities */}
        {sizeList.length > 0 && (
          <div className="mt-2 text-center">
            <span className="text-[9px] font-bold text-gray-text block uppercase mb-1">{t("sizesAndQuantities", "Sizes & Quantities:")}</span>
            <div className="flex flex-wrap gap-1 justify-center">
              {sizeList.map((s) => {
                const szQty = currentEdit.sizeQuantities?.[s.size] ?? currentEdit.quantity;
                return (
                  <span
                    key={s.id || s.size}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-secondary/10 text-foreground rounded border border-stroke"
                  >
                    <span>{s.size}:</span>
                    <span className="text-secondary font-bold">{szQty}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-center gap-2.5 mt-2">
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> {t("deleteColor", "Delete Color")}
            </button>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        {isEditing ? (
          <div>
            <input
              type="number"
              min={1}
              max={maxStock !== Infinity ? maxStock : undefined}
              value={currentEdit.quantity}
              onChange={(e) => {
                const rawVal = parseInt(e.target.value) || 1;
                let validQty = Math.max(1, rawVal);
                if (maxStock !== Infinity && validQty > maxStock) {
                  toast.error(`Quantity cannot exceed total available stock (${maxStock}) for ${item.product} ${item.color ? `(${item.color})` : ""}`);
                  validQty = maxStock;
                }
                handleProductQuantityChange(validQty);
              }}
              className="w-16 mx-auto rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
            />
            {maxStock !== Infinity && (
              <div className="text-[10px] font-semibold text-gray-text mt-1">
                {t("stockLabel", "Stock:")} {currentWarehouseStock}
              </div>
            )}
          </div>
        ) : (
          item.quantity
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        {isEditing ? (
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-text">EGP</span>
            <input
              type="number"
              step="0.01"
              value={currentEdit.price}
              onChange={(e) => onChange({ price: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="w-20 rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
            />
          </div>
        ) : (
          item.price
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground">
        {isEditing ? (
          `EGP ${(currentEdit.price * currentEdit.quantity).toFixed(2)}`
        ) : (
          item.subtotal
        )}
      </td>
    </tr>
  );
}

/* ─── New Order Item Row Component ───────────────────────────────────────── */
interface NewOrderItemRowProps {
  item: {
    tempId: string;
    productId: string;
    product: string;
    quantity: number;
    price: number;
    color: string | null;
    size?: string | null;
    sizeQuantities?: Record<string, number>;
    image: string;
  };
  usedColors: Set<string>;
  onChange: (updates: Partial<{ quantity: number; price: number; color: string | null; size: string | null; sizeQuantities?: Record<string, number> }>) => void;
  onRemove: () => void;
}

function NewOrderItemRow({ item, usedColors, onChange, onRemove }: NewOrderItemRowProps) {
  const { t } = useTranslation("traderWholesale");
  const { data: product } = useWholesale(item.productId);

  const colors = useMemo<ColorOption[]>(() => {
    if (!product) return [];
    if (product.colors && product.colors.length > 0) {
      return product.colors.map((c) => ({
        id: c.id,
        color: c.colorName || c.color || "",
        stock: c.stock ?? product.stock ?? 0,
        sizes: c.variants || [],
      }));
    }
    if (product.wholesaleColors && product.wholesaleColors.length > 0) {
      return product.wholesaleColors.map((c) => ({
        id: c.id,
        color: c.color || "",
        stock: c.stock ?? product.stock ?? 0,
        sizes: c.sizes || [],
      }));
    }
    return [];
  }, [product]);

  const availableColors = useMemo(() => {
    return colors.filter((c) => {
      if (item.color && c.color.toLowerCase() === item.color.toLowerCase()) {
        return true;
      }
      return !usedColors.has(c.color.toLowerCase());
    });
  }, [colors, item.color, usedColors]);

  const selectedColorObj = colors.find(
    (c) => item.color && c.color.toLowerCase() === item.color.toLowerCase()
  );
  const maxStock = selectedColorObj !== undefined ? selectedColorObj.stock : (product?.stock !== undefined ? product.stock : Infinity);

  const sizeList: Array<{ id?: string; size: string }> = useMemo(() => {
    if (selectedColorObj?.sizes && selectedColorObj.sizes.length > 0) {
      return selectedColorObj.sizes;
    }
    if (product?.sizes && product.sizes.length > 0) {
      return normalizeSizeOptions(product.sizes);
    }
    return [];
  }, [selectedColorObj, product]);

  const handleQuantityUpdate = (newProductQty: number) => {
    const validQty = Math.max(1, newProductQty);
    const updatedSizeQuantities: Record<string, number> = {};
    if (sizeList.length > 0) {
      sizeList.forEach((s) => {
        updatedSizeQuantities[s.size] = validQty;
      });
    }
    onChange({ quantity: validQty, sizeQuantities: updatedSizeQuantities });
  };

  return (
    <tr className="bg-amber-50/10 border-b border-stroke">
      <td className="px-4 py-4 text-center">
        <div className="h-12 w-12 rounded-lg bg-background border border-stroke overflow-hidden flex items-center justify-center mx-auto">
          {item.image ? (
            <img className="h-full w-full object-cover" src={item.image} alt="" />
          ) : (
            <ShoppingBag className="h-5 w-5 text-gray-text" />
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat']">
        <div className="font-bold text-foreground text-sm">
          {item.product} <span className="text-xs font-semibold text-secondary">{t("newColorRow", "(New Color Row)")}</span>
        </div>

        <div className="mt-2 max-w-[160px] mx-auto text-left space-y-2">
          <div>
            <label className="text-[9px] font-bold text-gray-text block uppercase mb-1">{t("selectColor", "Select Color")}</label>
            <select
              value={item.color || ""}
              onChange={(e) => {
                const chosenColor = e.target.value || null;
                const colorObj = colors.find(c => c.color.toLowerCase() === (chosenColor || "").toLowerCase());
                const colorMaxStock = colorObj ? colorObj.stock : Infinity;
                let newQty = item.quantity;
                if (chosenColor && colorObj && newQty > colorMaxStock) {
                  toast.error(`Quantity adjusted to available stock (${colorMaxStock}) for color ${chosenColor}`);
                  newQty = Math.max(1, colorMaxStock);
                }
                const defaultSize = null;
                const updatedSizeQuantities: Record<string, number> = {};
                const chosenSizes = colorObj?.sizes || [];
                chosenSizes.forEach((s) => {
                  updatedSizeQuantities[s.size] = newQty;
                });
                onChange({ color: chosenColor, quantity: newQty, size: defaultSize, sizeQuantities: updatedSizeQuantities });
              }}
              className="w-full text-xs rounded border border-stroke bg-background p-1 text-foreground focus:outline-none cursor-pointer"
            >
              <option value="">{t("selectColor", "Select Color")}</option>
              {availableColors.map((c) => (
                <option key={c.id} value={c.color} disabled={c.stock <= 0}>
                  {c.color} {c.stock <= 0 ? t("outOfStock", "(Out of stock)") : `(${t("stockLabel", "Stock:")} ${c.stock})`}
                </option>
              ))}
            </select>
            {availableColors.length === 0 && (
              <span className="text-[10px] font-semibold text-rose-500 block mt-1">
                {t("noMoreColors", "No more available colors for this product")}
              </span>
            )}
          </div>

          {sizeList.length > 0 && (
            <div className="mt-1">
              <span className="text-[9px] font-bold text-gray-text block uppercase mb-1">{t("sizesAndQuantities", "Sizes & Quantities:")}</span>
              <div className="flex flex-wrap gap-1">
                {sizeList.map((s) => {
                  const szQty = item.sizeQuantities?.[s.size] ?? item.quantity;
                  return (
                    <span
                      key={s.id || s.size}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-secondary/10 text-foreground rounded border border-stroke"
                    >
                      <span>{s.size}:</span>
                      <span className="text-secondary font-bold">{szQty}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-2.5">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <Trash2 className="h-3 w-3" /> {t("remove", "Remove")}
          </button>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        <input
          type="number"
          min={1}
          max={maxStock !== Infinity ? maxStock : undefined}
          value={item.quantity}
          onChange={(e) => {
            const rawVal = parseInt(e.target.value) || 1;
            let validQty = Math.max(1, rawVal);
            if (maxStock !== Infinity && validQty > maxStock) {
              toast.error(`Quantity cannot exceed available stock (${maxStock}) for ${item.color || "this item"}`);
              validQty = maxStock;
            }
            handleQuantityUpdate(validQty);
          }}
          className="w-16 mx-auto rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
        />
        {maxStock !== Infinity && (
          <div className={`text-[10px] font-semibold mt-1 ${maxStock === 0 ? "text-rose-600" : "text-gray-text"}`}>
            {t("stockLabel", "Stock:")} {maxStock}
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        <div className="flex items-center justify-center gap-1 font-['Montserrat']">
          <span className="text-xs text-gray-text">EGP</span>
          <input
            type="number"
            step="0.01"
            value={item.price}
            onChange={(e) => onChange({ price: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="w-20 rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
          />
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground">
        EGP {(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  );
}

/* ─── Order Detail View ──────────────────────────────────────────────────── */
interface OrderDetailProps {
  order: WholesaleOrder;
  onBack: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onUpdateOrderItems: (
    id: string,
    items: {
      id?: string;
      productId?: string;
      quantity: number;
      price: number;
      color?: string | null;
      size?: string | null;
    }[],
    deletedItemIds?: string[]
  ) => Promise<void>;
}

function OrderDetail({ order, onBack, onUpdateStatus, onDeleteOrder, onUpdateOrderItems }: OrderDetailProps) {
  const { t } = useTranslation("traderWholesale");
  const pill = statusPill(order.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Editable items state
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [isSavingItems, setIsSavingItems] = useState(false);
  const [editedItems, setEditedItems] = useState<Record<string, { quantity: number; price: number }>>({});
  const [newItems, setNewItems] = useState<{ tempId: string; productId: string; product: string; quantity: number; price: number; color: string | null; size?: string | null; image: string }[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);

  const handleAddColorRow = (originalItemOrEvent?: WholesaleOrder["items"][number] | React.MouseEvent) => {
    const isItem = originalItemOrEvent && "productId" in originalItemOrEvent;
    const targetItem = isItem ? originalItemOrEvent : order.items[0];
    if (!targetItem) return;
    const numericPrice = parseFloat(targetItem.price.replace(/[^0-9.-]+/g, "")) || 0;
    setNewItems((prev) => [
      ...prev,
      {
        tempId: Math.random().toString(36).slice(2, 9),
        productId: targetItem.productId,
        product: targetItem.product,
        quantity: 1,
        price: numericPrice,
        color: "",
        size: null,
        image: targetItem.image,
      }
    ]);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, e.target.value);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("deleteConfirm", "Are you sure you want to delete this wholesale order?"))) {
      setDeleting(true);
      try {
        await onDeleteOrder(order.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSaveItems = async () => {
    for (const newItem of newItems) {
      if (!newItem.color) {
        toast.error(t("selectColorRequired", "Please select a color for all newly added items before saving"));
        return;
      }
    }

    setIsSavingItems(true);
    try {
      const itemsPayload = [
        ...Object.entries(editedItems)
          .filter(([id]) => !deletedItemIds.includes(id))
          .map(([id, val]) => ({
            id,
            quantity: val.quantity,
            price: val.price,
          })),
        ...newItems.map((val) => ({
          productId: val.productId,
          quantity: val.quantity,
          price: val.price,
          color: val.color,
          size: val.size || null,
        }))
      ];
      await onUpdateOrderItems(order.id, itemsPayload, deletedItemIds);
      setIsEditingItems(false);
      setNewItems([]);
      setDeletedItemIds([]);
    } finally {
      setIsSavingItems(false);
    }
  };

  const timelineSteps = [
    { label: t("timelineOrderPlaced", "Order Placed"), time: `${order.date} ${order.time}`, done: true },
    { label: t("timelineProcessing", "Processing"), time: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) ? t("timelineInProgress", "In Progress") : t("timelinePending", "Pending"), done: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) },
    { label: t("timelineShipped", "Shipped"), time: ["SHIPPED", "COMPLETED"].includes(order.status) ? t("timelineShipped", "Shipped") : t("timelinePending", "Pending"), done: ["SHIPPED", "COMPLETED"].includes(order.status) },
    { label: t("timelineDelivered", "Delivered"), time: order.status === "COMPLETED" ? t("timelineDelivered", "Delivered") : t("timelinePending", "Pending"), done: order.status === "COMPLETED" },
  ];

  return (
    <div className="space-y-6">
      {/* Header buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-stroke bg-card px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToOrders", "Back to Orders")}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-['Montserrat'] text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {t("deleteOrder", "Delete Order")}
        </button>
      </div>

      {/* Info grids */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {t("orderDetails", "Order Details")}
          </h3>
          <div className="flex flex-col gap-3 font-['Montserrat'] text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("orderIdLabel", "Order ID")}</span>
              <span className="font-bold text-foreground">{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("dateTimeLabel", "Date & Time")}</span>
              <span className="font-semibold text-foreground">{order.date} — {order.time}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("statusLabel", "Status")}</span>
              <div className="flex items-center gap-2">
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                ) : (
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    className={`inline-flex rounded-xl px-2 py-1 text-xs font-semibold font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring} bg-card cursor-pointer focus:outline-none`}
                  >
                    <option value="PENDING">{t("statusPending", "Pending")}</option>
                    <option value="PROCESSING">{t("statusProcessing", "Processing")}</option>
                    <option value="SHIPPED">{t("statusShipped", "Shipped")}</option>
                    <option value="COMPLETED">{t("statusCompleted", "Completed")}</option>
                    <option value="CANCELLED">{t("statusCancelled", "Cancelled")}</option>
                  </select>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("paymentTypeLabel", "Payment Method")}</span>
              <span className="font-semibold text-foreground">{order.payment}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("customerInformation", "Customer Information")}</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: <User className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custName", "Customer Name"), value: order.customer },
              { icon: <Mail className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custEmail", "Email Address"), value: order.customerEmail },
              { icon: <Phone className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custPhone", "Phone Number"), value: order.customerPhone },
              { icon: <MapPin className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custAddress", "Shipping Address"), value: order.address },
            ].map((row, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                {row.icon}
                <div className="min-w-0">
                  <span className="font-['Montserrat'] text-xs font-semibold text-gray-text block">{row.label}</span>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground break-words">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("orderTimeline", "Order Timeline")}</h3>
          <div className="flex flex-col gap-0">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${step.done ? "border-secondary bg-secondary text-secondary-foreground" : "border-stroke bg-card"}`}>
                    {step.done && (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-0.5 ${step.done ? "bg-secondary" : "bg-stroke"}`} style={{ height: 28 }} />
                  )}
                </div>
                <div className="pb-4">
                  <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">{step.label} </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-foreground block text-xs">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="rounded-2xl border border-stroke bg-card shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("orderedItems", "Ordered Items")}</h3>
          <div className="flex gap-2">
            {isEditingItems ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAddColorRow()}
                  className="rounded-xl border border-secondary bg-secondary/15 px-4 py-2 font-['Montserrat'] text-xs font-bold text-secondary transition hover:bg-secondary/25 cursor-pointer"
                >
                  <Plus className="h-3 w-3 inline mr-1" /> {t("addColorRow", "Add Color Row")}
                </button>
                <button
                  type="button"
                  onClick={handleSaveItems}
                  disabled={isSavingItems}
                  className="rounded-xl bg-secondary px-4 py-2 font-['Montserrat'] text-xs font-bold text-secondary-foreground transition hover:bg-secondary/90 cursor-pointer disabled:opacity-50"
                >
                  {isSavingItems ? t("saving", "Saving...") : t("saveChanges", "Save Changes")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingItems(false);
                    setEditedItems({});
                    setNewItems([]);
                    setDeletedItemIds([]);
                  }}
                  className="rounded-xl border border-stroke bg-card px-4 py-2 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background cursor-pointer"
                >
                  {t("cancel", "Cancel")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditingItems(true);
                  const initial: Record<string, { quantity: number; price: number }> = {};
                  order.items.forEach(item => {
                    const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
                    initial[item.id] = {
                      quantity: item.quantity,
                      price: numericPrice,
                    };
                  });
                  setEditedItems(initial);
                }}
                className="rounded-xl border border-stroke bg-card px-4 py-2 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background cursor-pointer"
              >
                {t("editItems", "Edit Items")}
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-secondary border-b border-stroke">
                {[t("colImage", "Image"), t("colProductDetails", "Product Details"), t("colQuantity", "Quantity"), t("colPrice", "Price"), t("colSubtotal", "Subtotal")].map((col, cIdx) => (
                  <th key={cIdx} className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.filter(item => !deletedItemIds.includes(item.id)).map((item, idx) => {
                const isEditing = isEditingItems;
                const currentEdit = editedItems[item.id] || {
                  quantity: item.quantity,
                  price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0,
                };

                return (
                  <EditableOrderItemRow
                    key={item.id}
                    item={item}
                    idx={idx}
                    isEditing={isEditing}
                    currentEdit={currentEdit}
                    onAddColorRow={() => handleAddColorRow(item)}
                    onDelete={() => setDeletedItemIds(prev => [...prev, item.id])}
                    onChange={(updates) => {
                      setEditedItems(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], ...updates }
                      }));
                    }}
                  />
                );
              })}

              {/* Render newly added color rows */}
              {newItems.map((item) => {
                const usedColors = new Set<string>();
                order.items
                  .filter((it) => !deletedItemIds.includes(it.id) && String(it.productId) === String(item.productId))
                  .forEach((it) => {
                    if (it.color) usedColors.add(it.color.toLowerCase());
                  });
                newItems
                  .filter((it) => it.tempId !== item.tempId && String(it.productId) === String(item.productId))
                  .forEach((it) => {
                    if (it.color) usedColors.add(it.color.toLowerCase());
                  });

                return (
                  <NewOrderItemRow
                    key={item.tempId}
                    item={item}
                    usedColors={usedColors}
                    onChange={(updates) => {
                      setNewItems((prev) =>
                        prev.map((it) => (it.tempId === item.tempId ? { ...it, ...updates } : it))
                      );
                    }}
                    onRemove={() => {
                      setNewItems((prev) => prev.filter((it) => it.tempId !== item.tempId));
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex flex-col items-end gap-2 border-t border-stroke px-6 py-5 bg-background">
          <div className="w-64 space-y-2 font-['Montserrat'] text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-gray-text">{t("traderSubtotal", "Subtotal")}</span>
              <span className="text-foreground font-bold">{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-text">{t("totalShipping", "Shipping")}</span>
              <span className="text-foreground">{order.shipping}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-stroke text-foreground">
              <span>{t("orderGrandTotal", "Total")}</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TraderWholesalePage() {
  const { t } = useTranslation("traderWholesale");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<WholesaleOrder | null>(null);

  const { data: orders = [], isLoading, isError, error } = useTraderWholesaleOrders();
  const { data: products = [] } = useTraderProducts("WHOLESALE");
  const updateStatusMutation = useUpdateWholesaleOrderStatus();
  const deleteOrderMutation = useDeleteWholesaleOrder();
  const updateOrderMutation = useUpdateWholesaleOrder();

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      toast.success(t("statusUpdateSuccess", "Order status updated successfully"));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || t("statusUpdateError", "Failed to update order status");
      toast.error(errMsg);
    }
  };

  const handleUpdateOrderItems = async (
    orderId: string,
    items: {
      id?: string;
      productId?: string;
      quantity: number;
      price: number;
      color?: string | null;
      size?: string | null;
    }[],
    deletedItemIds?: string[]
  ) => {
    try {
      const updated = await updateOrderMutation.mutateAsync({ orderId, items, deletedItemIds });
      toast.success(t("orderUpdateSuccess", "Order items updated successfully"));
      setSelectedOrder(updated);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || t("orderUpdateError", "Failed to update order items");
      toast.error(errMsg);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success(t("deleteSuccess", "Order deleted successfully"));
      setSelectedOrder(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || t("deleteError", "Failed to delete order");
      toast.error(errMsg);
    }
  };

  const totalOrdersCount = orders.length;
  const activeCount = orders.filter(o => ["PENDING", "PROCESSING", "SHIPPED"].includes(o.status.toUpperCase())).length;
  const completedCount = orders.filter(o => ["COMPLETED", "DELIVERED"].includes(o.status.toUpperCase())).length;
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number(o.total.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + val;
  }, 0);

  const statCards = [
    {
      label: "totalWholesaleOrders",
      value: `${totalOrdersCount} ${t("ordersCountUnit", "Orders")}`,
      trend: "100%",
      trendUp: true,
      sub: "allTimeReceived",
    },
    {
      label: "totalWholesaleRevenue",
      value: `${t("currencyEGP", "EGP")} ${totalRevenue.toLocaleString()}`,
      trend: "100%",
      trendUp: true,
      sub: "fromAllOrders",
    },
    {
      label: "activeWholesaleOrders",
      value: String(activeCount),
      trend: "100%",
      trendUp: activeCount > 0,
      sub: "pendingOrProcessing",
    },
    {
      label: "completedWholesaleOrders",
      value: String(completedCount),
      trend: "100%",
      trendUp: true,
      sub: "deliveredToClients",
    },
  ];

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || o.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-rose-500 font-medium">
        {error instanceof Error ? error.message : "Failed to load wholesale orders"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdateOrderItems={handleUpdateOrderItems}
        />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="relative h-32 rounded-2xl border border-stroke bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <p className="font-['Montserrat'] text-xs font-semibold text-gray-text uppercase tracking-wider">
                    {t(card.label, card.label)}
                  </p>
                  <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className="font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t(card.sub, card.sub)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts container */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Earnings Over Time */}
            <div className="lg:col-span-2 rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
                  {t("earningsOverTime", "Earnings Over Time")}
                </h2>
              </div>
              <EarningsChart orders={orders} />
            </div>

            {/* Category Donut */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
                {t("productCategory", "Product Category")}
              </h2>
              <CategoryDonut orders={orders} products={products} />
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-start gap-4 bg-card p-5 rounded-2xl border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-text pointer-events-none" />
              <input
                type="text"
                placeholder={t("searchPlaceholder", "Search wholesale orders...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-background py-2.5 pl-12 pr-4 font-['Montserrat'] text-sm font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-secondary focus:bg-card focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-background px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground outline-none transition cursor-pointer focus:border-secondary focus:bg-card focus:ring-1 focus:ring-secondary"
              >
                <option value="">{t("allStatuses", "All Statuses")}</option>
                <option value="PENDING">{t("statusPending", "Pending")}</option>
                <option value="PROCESSING">{t("statusProcessing", "Processing")}</option>
                <option value="SHIPPED">{t("statusShipped", "Shipped")}</option>
                <option value="COMPLETED">{t("statusCompleted", "Completed")}</option>
                <option value="CANCELLED">{t("statusCancelled", "Cancelled")}</option>
              </select>
            </div>

            {/* Reset Button */}
            {(search || statusFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-['Montserrat'] text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
              >
                {t("resetFilters", "Reset Filters")}
              </button>
            )}
          </div>

          {/* Wholesale Orders History Table */}
          <section className="rounded-2xl border border-stroke bg-card shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-stroke">
              <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("wholesaleOrdersHistory", "Wholesale Orders History")}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-secondary border-b border-stroke">
                    {[t("colOrderId", "Order ID"), t("colCustomerName", "Customer"), t("colDateTime", "Date & Time"), t("colPayment", "Payment"), t("colTraderSubtotal", "Subtotal"), t("colOrderTotal", "Total"), t("colStatus", "Status")].map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-text font-medium font-['Montserrat']">
                        {t("noWholesaleOrdersFound", "No wholesale orders found")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order, idx) => {
                      const pill = statusPill(order.status);
                      return (
                        <tr
                          key={order.id}
                          className={`cursor-pointer transition hover:bg-background ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground whitespace-nowrap">
                            {order.orderId}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-semibold text-foreground whitespace-nowrap">
                            {order.customer}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-gray-text whitespace-nowrap">
                            {order.date} — {order.time}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                            {order.payment}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-secondary whitespace-nowrap">
                            {order.subtotal}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                            {order.total}
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring}`}>
                              {getLocalizedStatus(order.status, t)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
