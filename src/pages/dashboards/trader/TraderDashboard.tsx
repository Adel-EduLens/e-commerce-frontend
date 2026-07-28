import { useState, useMemo } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import { useTraderProducts, type Product } from "../../../hooks/queries/productsQuery";
import { useCategories } from "../../../hooks/queries/categoriesQuery";
import { useTraderDashboardOrders } from "../../../hooks/queries/ordersQuery";
import { useTraderWholesaleOrders } from "../../../hooks/queries/wholesaleOrderQuery";
import { Loader2, Filter, Calendar, Tag, X, Download } from "lucide-react";
import { toast } from "sonner";

const traderAsset = (file: string) => `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const typeFilters = ["ALL", "SHOP", "RENTAL", "WHOLESALE", "BLANK"] as const;

export type ProductTypeFilter = (typeof typeFilters)[number];

const parsePrice = (val: any): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

function Panel({
  title,
  action,
  className = "",
  children,
}: {
  title: string;
  action?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`flex flex-col justify-between rounded-[24px] border border-stroke bg-card p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5 ${className}`}
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-['Montserrat'] text-base font-semibold text-foreground sm:text-lg">
            {title}
          </h2>
          {action ? (
            <button className="text-xs font-medium text-gray-text transition hover:text-foreground">
              {action}
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  delta,
  note,
  trend,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  note: string;
  trend: "up" | "down";
  icon: string;
}) {
  const { t } = useTranslation("traderOverview");
  return (
    <div className="rounded-[24px] border border-stroke bg-card p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Montserrat'] text-xs font-medium text-gray-text">{t(label, label)}</p>
          <p className="mt-2 font-['Montserrat'] text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary">
          <img className="h-7 w-7" src={traderAsset(icon)} alt="" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="h-4 w-4"
          src={traderAsset(trend === "up" ? "hugeicons_trade-up-1.svg" : "ic-trending-down-24px.svg")}
          alt=""
        />
        <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
          <span className={trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"}>{delta}</span>{" "}
          {t(note, note)}
        </p>
      </div>
    </div>
  );
}

function RevenueChart({
  revenueSeries,
  maxVal = 40,
}: {
  revenueSeries: { month: string; value: number }[];
  maxVal?: number;
}) {
  const { t } = useTranslation("traderOverview");
  const width = 760;
  const height = 240;
  const padding = { top: 16, right: 12, bottom: 30, left: 12 };
  const max = Math.max(maxVal, 10);
  const baseline = height - padding.bottom;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = revenueSeries.map((item, index) => {
    const x = padding.left + (chartWidth / Math.max(revenueSeries.length - 1, 1)) * index;
    const y = padding.top + chartHeight - (item.value / max) * chartHeight;
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = points.length
    ? `M ${points[0].x} ${baseline} ${points
        .map((point) => `L ${point.x} ${point.y}`)
        .join(" ")} L ${points[points.length - 1].x} ${baseline} Z`
    : "";

  const step = max / 4;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-['Montserrat'] text-xs font-medium text-gray-text">
          {t("annualSalesTrend", "Annual sales trend across channels")}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[56px_minmax(0,1fr)]">
        <div className="hidden flex-col justify-between pt-2 font-['Montserrat'] text-[11px] font-medium text-foreground lg:flex">
          <span>EGP {max.toFixed(0)}</span>
          <span>EGP {(step * 3).toFixed(0)}</span>
          <span>EGP {(step * 2).toFixed(0)}</span>
          <span>EGP {step.toFixed(0)}</span>
          <span>0</span>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[220px] w-full overflow-visible rounded-2xl bg-background/40"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((line) => {
              const y = padding.top + (chartHeight / 4) * line;
              return (
                <line
                  key={line}
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  stroke="#374151"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
              );
            })}

            {areaPath && <path d={areaPath} fill="url(#revenueFill)" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#FFAE4C"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            )}
          </svg>

          {points.map((point) => (
            <div
              key={point.month}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-[#FFAE4C]"
              style={{
                left: `${(point.x / width) * 100}%`,
                top: `${(point.y / height) * 100}%`,
              }}
            />
          ))}

          <div className="mt-2.5 grid grid-cols-6 gap-2 font-['Montserrat'] text-[11px] font-medium text-foreground sm:grid-cols-12">
            {revenueSeries.map((item) => (
              <span key={item.month} className="text-center">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersByStatus({
  orderStatus,
  totalOrdersCount,
}: {
  orderStatus: { label: string; count: number; share: number; color: string }[];
  totalOrdersCount: number;
}) {
  const { t } = useTranslation("traderOverview");

  const hasData = totalOrdersCount > 0 && orderStatus.some((s) => s.count > 0);

  const gradientStops = hasData
    ? orderStatus
        .reduce(
          (segments, item, index) => {
            const start = segments.total;
            const end = start + item.share;
            segments.total = end;
            segments.parts.push(
              `${item.color} ${start}% ${end}%${index < orderStatus.length - 1 ? "," : ""}`,
            );
            return segments;
          },
          { total: 0, parts: [] as string[] },
        )
        .parts.join(" ")
    : "rgba(156, 163, 175, 0.25) 0% 100%";

  return (
    <div className="flex flex-col items-center justify-between py-1">
      {/* Donut Ring Container */}
      <div className="relative flex h-48 w-48 items-center justify-center">
        <div
          className="flex h-48 w-48 items-center justify-center rounded-full transition-all duration-300 shadow-inner"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card text-center border border-stroke/20 shadow-sm">
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
              {totalOrdersCount}
            </p>
            <p className="mt-0.5 font-['Montserrat'] text-[11px] font-medium text-gray-text">
              {t("totalOrders", "Total Orders")}
            </p>
          </div>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="mt-4 grid w-full grid-cols-2 gap-2.5 font-['Montserrat'] text-xs">
        {orderStatus.map((item) => {
          const translatedName = t(item.label, item.label);
          return (
            <div key={item.label} className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-[11px] font-medium text-foreground">
                {translatedName}: <span className="font-bold">{item.count}</span> ({item.share}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusPill(status: string) {
  const s = status.toUpperCase();
  if (s === "COMPLETED" || s === "DELIVERED") {
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  }
  if (s === "PROCESSING" || s === "SHIPPED") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  }
  if (s === "PENDING" || s === "NEW") {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }
  return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
}

const getOrderTypes = (order: any, productsList: Product[]) => {
  if (order.orderType === "WHOLESALE") {
    return ["WHOLESALE"];
  }

  const types = new Set<string>();
  order.items?.forEach((item: any) => {
    if (item.productType) {
      types.add(item.productType === "STANDARD" ? "SHOP" : item.productType);
      return;
    }
    const product = productsList.find((p) => p.id === item.productId);
    if (product?.productTypes && Array.isArray(product.productTypes)) {
      product.productTypes.forEach((t) => {
        // productTypes can be a string relation or string directly
        const typeStr = typeof t === "string" ? t : (t as any).type || (t as any).productTypes;
        if (typeStr) types.add(typeStr);
      });
    } else if (product) {
      if (product.shopPrice !== null && product.shopPrice !== undefined) types.add("SHOP");
      if (product.retailPrice !== null && product.retailPrice !== undefined) types.add("RETAIL");
      if (product.blankPrice !== null && product.blankPrice !== undefined) types.add("BLANK");
      if (product.wholesalePrice !== null && product.wholesalePrice !== undefined) types.add("WHOLESALE");
    } else {
      types.add("SHOP");
    }
  });

  return Array.from(types);
};

export default function TraderDashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation("traderOverview");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<ProductTypeFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Trader";

  // 1. Fetch categories
  const { data: categories = [] } = useCategories("all");

  // 2. Fetch trader products with backend type filter parameter and category filter parameter
  const { data: traderProducts = [], isLoading: productsLoading } = useTraderProducts(
    typeFilter !== "ALL" ? typeFilter : undefined,
    categoryFilter !== "ALL" ? categoryFilter : undefined
  );

  // 3. Construct Backend Query Params for Orders
  const orderQueryParams = useMemo(
    () => ({
      type: typeFilter !== "ALL" && typeFilter !== "WHOLESALE" ? typeFilter : undefined,
      categoryId: categoryFilter !== "ALL" ? categoryFilter : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [typeFilter, categoryFilter, fromDate, toDate]
  );

  // 4. Fetch backend-filtered trader orders directly (retail, shop, blank)
  const { data: orders = [], isLoading: ordersLoading } = useTraderDashboardOrders(
    orderQueryParams,
    { enabled: typeFilter !== "WHOLESALE" }
  );

  // 4b. Fetch wholesale orders separately using dedicated wholesale orders query hook
  const { data: wholesaleOrders = [], isLoading: wholesaleOrdersLoading } = useTraderWholesaleOrders({
    enabled: typeFilter === "ALL" || typeFilter === "WHOLESALE",
  });

  // 4c. Combine and filter orders in frontend
  const combinedOrders = useMemo(() => {
    // Filter wholesale orders by category and dates
    const filteredWholesale = wholesaleOrders
      .map((wo) => ({ ...wo, orderType: "WHOLESALE" }))
      .filter((order) => {
        // Date filter
        const orderDate = new Date(order.createdAt || order.date);
        const from = fromDate ? new Date(fromDate) : null;
        if (from) from.setHours(0, 0, 0, 0);
        const to = toDate ? new Date(toDate) : null;
        if (to) to.setHours(23, 59, 59, 999);

        if (from && orderDate < from) return false;
        if (to && orderDate > to) return false;

        // Category filter
        if (categoryFilter !== "ALL") {
          const hasMatchingProduct = order.items?.some((item) => {
            if ((item as any).categoryId === categoryFilter) return true;
            const product = traderProducts.find((p) => p.id === item.productId);
            if (!product) return false;
            const inCategories = product.categories?.some((c) => c.id === categoryFilter);
            const inCategory = product.category?.id === categoryFilter;
            return inCategories || inCategory;
          });
          if (!hasMatchingProduct) return false;
        }

        return true;
      });

    if (typeFilter === "WHOLESALE") {
      return filteredWholesale;
    }

    if (typeFilter === "ALL") {
      return [...orders, ...filteredWholesale].sort(
        (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
      );
    }

    // Otherwise (SHOP, RETAIL, BLANK)
    return orders;
  }, [typeFilter, orders, wholesaleOrders, categoryFilter, fromDate, toDate, traderProducts]);

  // 5. Calculate total revenue & metrics directly from combined orders & products
  const totalRevenueNum = useMemo(() => {
    return combinedOrders.reduce((sum, order) => {
      return sum + parsePrice(order.subtotal);
    }, 0);
  }, [combinedOrders]);

  const totalDiscountNum = useMemo(() => {
    return combinedOrders.reduce((sum, order) => {
      return sum + parsePrice(order.discount);
    }, 0);
  }, [combinedOrders]);

  const summaryCardsData = useMemo(() => {
    const totalOrdersCount = combinedOrders.length;
    const totalProductsCount = traderProducts.length;
    const avgOrderVal = totalOrdersCount > 0 ? totalRevenueNum / totalOrdersCount : 0;

    return [
      {
        label: "totalRevenue",
        value: `EGP ${totalRevenueNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        delta: "+12.4%",
        note: "upFromLastMonth",
        trend: "up" as const,
        icon: "dashicons_money-alt.svg",
      },
      {
        label: "totalOrders",
        value: totalOrdersCount.toString(),
        delta: "+8.5%",
        note: "upFromLastMonth",
        trend: "up" as const,
        icon: "mynaui_cart.svg",
      },
      {
        label: "totalDiscounts",
        value: `EGP ${totalDiscountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        delta: "-3.2%",
        note: "upFromLastMonth",
        trend: "up" as const,
        icon: "hugeicons_trade-up.svg",
      },
      {
        label: "activeProducts",
        value: totalProductsCount.toString(),
        delta: "+5.0%",
        note: "upFromLastMonth",
        trend: "up" as const,
        icon: "majesticons_users-line.svg",
      },
      {
        label: "avgOrderValue",
        value: `EGP ${avgOrderVal.toFixed(2)}`,
        delta: "+4.2%",
        note: "upFromLastMonth",
        trend: "up" as const,
        icon: "hugeicons_trade-up.svg",
      },
    ];
  }, [combinedOrders, traderProducts, totalRevenueNum, totalDiscountNum]);

  // 6. Dynamic Revenue Trend Chart (Monthly sales from combined orders)
  const dynamicRevenueSeries = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals: Record<string, number> = {};
    months.forEach((m) => (monthlyTotals[m] = 0));

    combinedOrders.forEach((order) => {
      const d = new Date(order.createdAt || order.date);
      if (!isNaN(d.getTime())) {
        const monthName = months[d.getMonth()];
        const val = parsePrice(order.total);
        monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + val;
      }
    });

    return months.map((m) => ({
      month: m,
      value: Number((monthlyTotals[m] || 0).toFixed(2)),
    }));
  }, [combinedOrders]);

  const maxChartVal = useMemo(() => {
    const max = Math.max(...dynamicRevenueSeries.map((s) => s.value), 0);
    return max > 0 ? max * 1.2 : 1000;
  }, [dynamicRevenueSeries]);

  // 7. Order Status Distribution from combined orders
  const orderStatusDistribution = useMemo(() => {
    const counts = {
      new: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    combinedOrders.forEach((o) => {
      const s = (o.status || "").toUpperCase();
      if (s === "PENDING" || s === "NEW") counts.new++;
      else if (s === "PROCESSING" || s === "CONFIRMED") counts.processing++;
      else if (s === "SHIPPED") counts.shipped++;
      else if (s === "COMPLETED" || s === "DELIVERED") counts.delivered++;
      else counts.new++;
    });

    const total = combinedOrders.length || 1;

    return [
      { label: "new", count: counts.new, share: Math.round((counts.new / total) * 100), color: "#EF4444" },
      { label: "processing", count: counts.processing, share: Math.round((counts.processing / total) * 100), color: "#F59E0B" },
      { label: "shipped", count: counts.shipped, share: Math.round((counts.shipped / total) * 100), color: "#38BDF8" },
      { label: "delivered", count: counts.delivered, share: Math.round((counts.delivered / total) * 100), color: "#10B981" },
    ];
  }, [combinedOrders]);

  // 8. Inventory Snapshot from trader products
  const inventorySnapshot = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    traderProducts.forEach((p) => {
      const stock = p.stock ?? 0;
      if (stock === 0) outOfStock++;
      else if (stock <= 5) lowStock++;
      else inStock++;
    });

    const total = traderProducts.length || 1;

    return [
      {
        label: "inStock",
        count: inStock,
        percent: Math.round((inStock / total) * 100),
        icon: "solar_box-linear.svg",
        color: "#10B981",
      },
      {
        label: "lowStock",
        count: lowStock,
        percent: Math.round((lowStock / total) * 100),
        icon: "solar_danger-triangle-bold.svg",
        color: "#F59E0B",
      },
      {
        label: "outOfStock",
        count: outOfStock,
        percent: Math.round((outOfStock / total) * 100),
        icon: "entypo_cross.svg",
        color: "#EF4444",
      },
    ];
  }, [traderProducts]);

  // 9. Top Selling Products directly from backend orders & products
  const topSellingProducts = useMemo(() => {
    const salesMap: Record<
      string,
      { name: string; revenue: number; units: number; price: number; image: string }
    > = {};

    combinedOrders.forEach((order) => {
      (order.items || []).forEach((item: any) => {
        const pId = item.productId || item.id;
        const itemPrice = parsePrice(item.price);
        const itemQty = Number(item.quantity) || 1;

        const matchedProduct = traderProducts.find((tp) => tp.id === pId);
        const name =
          matchedProduct?.name ||
          item.product ||
          item.title ||
          item.name ||
          "Product";
        const image =
          matchedProduct?.images?.[0]?.url ||
          (typeof matchedProduct?.image === "string" ? matchedProduct.image : undefined) ||
          item.image ||
          item.imageSrc ||
          traderAsset("image 69.png");

        if (!salesMap[pId]) {
          salesMap[pId] = {
            name,
            revenue: 0,
            units: 0,
            price: itemPrice,
            image,
          };
        }
        salesMap[pId].units += itemQty;
        salesMap[pId].revenue += itemPrice * itemQty;
      });
    });

    const ranked = Object.values(salesMap).sort((a, b) => b.revenue - a.revenue);

    if (ranked.length > 0) {
      return ranked.slice(0, 4).map((p) => ({
        name: p.name,
        revenue: `EGP ${p.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        units: t("unitsCount", "{{count}} Units", { count: p.units }),
        unitPrice: `EGP ${p.price.toFixed(2)}`,
        image: p.image || traderAsset("image 69.png"),
      }));
    }

    // Fallback to top trader products
    return traderProducts.slice(0, 4).map((p) => {
      const numPrice = parsePrice(p.shopPrice ?? p.price ?? 0);
      return {
        name: p.name,
        revenue: `EGP ${numPrice.toFixed(2)}`,
        units: t("stockCount", "{{count}} Stock", { count: p.stock || 0 }),
        unitPrice: `EGP ${numPrice.toFixed(2)}`,
        image: p.images?.[0]?.url || (typeof p.image === "string" ? p.image : undefined) || traderAsset("image 69.png"),
      };
    });
  }, [combinedOrders, traderProducts]);

  // 10. Export XLS Function with complete financial details and i18n support
  const handleExportXLS = () => {
    if (combinedOrders.length === 0) {
      toast.error(t("noSalesToExport", "No sales available to export with current filters"));
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Arabic compatibility in Excel
    csvContent += `${t("orderId", "Order ID")},${t("customer", "Customer")},${t("customerPhone", "Phone Number")},${t("paymentMethod", "Payment Method")},${t("subtotal", "Subtotal")},${t("shipping", "Shipping")},${t("discount", "Discount")},${t("totalPaid", "Total Paid")},${t("date", "Date")},${t("status", "Status")},${t("itemsCountHeader", "Items Count")}\n`;

    combinedOrders.forEach((order) => {
      const id = order.orderId || `#${order.id.slice(-6)}`;
      const customer = (order.customer || t("guestCustomer", "Guest Customer")).replace(/,/g, " ");
      const phone = (order.customerPhone || "").replace(/,/g, " ");
      const payment = order.payment || "COD";
      const subtotal = typeof order.subtotal === "number" ? `EGP ${order.subtotal.toFixed(2)}` : String(order.subtotal || "");
      const shipping = typeof order.shipping === "number" ? `EGP ${order.shipping.toFixed(2)}` : String(order.shipping || "");
      const discount = typeof order.discount === "number" ? `EGP ${order.discount.toFixed(2)}` : String(order.discount || "");
      const totalPaid = typeof order.total === "number" ? `EGP ${order.total.toFixed(2)}` : String(order.total || "");
      const date =
        order.date ||
        (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "");
      const status = order.status || "";
      const itemsCount = order.items?.length || 0;

      csvContent += `"${id}","${customer}","${phone}","${payment}","${subtotal}","${shipping}","${discount}","${totalPaid}","${date}","${status}","${itemsCount}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t("exportSuccess", "XLS file exported successfully!"));
  };

  const isLoading = productsLoading || ordersLoading || wholesaleOrdersLoading;

  return (
    <div className="space-y-6">
      {/* Header Title & Subheading */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-bold text-foreground sm:text-3xl">
            {t("goodMorning", { name: firstName })}
          </h1>
          <p className="mt-1 text-xs text-gray-text sm:text-sm">
            {t("subheading", "Welcome back! Here is an overview of your store performance.")}
          </p>
        </div>
      </section>

      {/* Unified Control & Filter Bar */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stroke bg-card p-3.5 shadow-sm">
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="relative inline-flex min-w-[150px] items-center">
            <Tag className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-text" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProductTypeFilter)}
              className="w-full appearance-none rounded-xl border border-stroke bg-background py-2 pl-9 pr-8 font-['Montserrat'] text-xs font-medium text-foreground outline-none transition hover:border-primary focus:border-primary cursor-pointer"
            >
              <option value="ALL">{t("allTypes", "All Types")}</option>
              <option value="SHOP">{t("typeShop", "Shop")}</option>
              <option value="RENTAL">{t("typeRental", "Rental")}</option>
              <option value="WHOLESALE">{t("typeWholesale", "Wholesale")}</option>
              <option value="BLANK">{t("typeBlank", "Blank")}</option>
            </select>
            <img
              className="pointer-events-none absolute right-3 h-2.5 w-3.5"
              src={traderAsset("weui_arrow-outlined.svg")}
              alt=""
            />
          </div>

          {/* Category Filter */}
          <div className="relative inline-flex min-w-[170px] items-center">
            <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-text" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-stroke bg-background py-2 pl-9 pr-8 font-['Montserrat'] text-xs font-medium text-foreground outline-none transition hover:border-primary focus:border-primary cursor-pointer"
            >
              <option value="ALL">{t("allCategories", "All Categories")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <img
              className="pointer-events-none absolute right-3 h-2.5 w-3.5"
              src={traderAsset("weui_arrow-outlined.svg")}
              alt=""
            />
          </div>

          {/* Date Filter (From - To) */}
          <div className="flex flex-wrap items-center gap-2">
            <label
              onClick={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input && "showPicker" in input) {
                  try {
                    (input as HTMLInputElement).showPicker();
                  } catch (err) {
                    console.debug(err);
                    input.focus();
                  }
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-stroke bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:border-primary transition"
            >
              <Calendar className="h-3.5 w-3.5 text-gray-text shrink-0" />
              <span className="font-semibold text-gray-text text-[11px]">{t("from", "From:")}</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-['Montserrat'] text-xs text-foreground"
              />
            </label>

            <label
              onClick={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (input && "showPicker" in input) {
                  try {
                    (input as HTMLInputElement).showPicker();
                  } catch (err) {
                    console.debug(err);
                    input.focus();
                  }
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-stroke bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:border-primary transition"
            >
              <Calendar className="h-3.5 w-3.5 text-gray-text shrink-0" />
              <span className="font-semibold text-gray-text text-[11px]">{t("to", "To:")}</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-['Montserrat'] text-xs text-foreground font-semibold"
              />
            </label>

            {(fromDate || toDate || typeFilter !== "ALL" || categoryFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setTypeFilter("ALL");
                  setCategoryFilter("ALL");
                }}
                className="flex items-center gap-1 rounded-xl border border-stroke bg-stroke/30 px-2.5 py-1.5 font-['Montserrat'] text-xs font-semibold text-gray-text transition hover:bg-stroke hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>{t("reset", "Reset")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExportXLS}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 font-['Montserrat'] text-xs font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-white cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{t("exportXLS", "Export Data (XLS)")}</span>
        </button>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {summaryCardsData.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Panel title={t("revenueOverview", "Revenue Overview")}>
          {isLoading ? (
            <div className="flex h-[240px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <RevenueChart revenueSeries={dynamicRevenueSeries} maxVal={maxChartVal} />
          )}
        </Panel>

        <Panel title={t("ordersByStatus", "Orders by Status")}>
          {isLoading ? (
            <div className="flex h-[240px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <OrdersByStatus
              orderStatus={orderStatusDistribution}
              totalOrdersCount={combinedOrders.length}
            />
          )}
        </Panel>
      </section>

      {/* Inventory & Top Products Section */}
      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title={t("inventorySnapshot", "Inventory Snapshot")}>
          <div className="space-y-4">
            {inventorySnapshot.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                    {t(item.label, item.label)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-text">
                  {t("itemsCount", "{{count}} Items ({{percent}}%)", { count: item.count, percent: item.percent })}
                </span>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl bg-gray-light">
              <div className="flex h-3.5 w-full">
                <div
                  className="bg-[#10B981]"
                  style={{ width: `${inventorySnapshot[0]?.percent || 0}%` }}
                />
                <div
                  className="bg-[#F59E0B]"
                  style={{ width: `${inventorySnapshot[1]?.percent || 0}%` }}
                />
                <div
                  className="bg-[#EF4444]"
                  style={{ width: `${inventorySnapshot[2]?.percent || 0}%` }}
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title={t("topSellingProducts", "Top-Selling Products")}>
          <div className="space-y-3">
            {topSellingProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-text">
                {t("noProductsFound", "No products found matching active filters.")}
              </p>
            ) : (
              topSellingProducts.map((product) => (
                <article
                  key={product.name}
                  className="flex items-center gap-3 rounded-2xl border border-stroke bg-background p-3"
                >
                  <img
                    className="h-12 w-12 rounded-xl object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-['Montserrat'] text-sm font-semibold text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {product.revenue}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-text">
                      <span>{product.units}</span>
                      <span>{product.unitPrice}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </Panel>
      </section>

      {/* Recent Transactions */}
      <section>
        <Panel title={t("recentTransactions", "Recent Transactions")}>
          {combinedOrders.length === 0 ? (
            <div className="py-8 text-center text-sm font-medium text-gray-text">
              {t("noTransactions", "No sales transactions found.")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
                <thead>
                  <tr className="border-b border-stroke bg-background/80 transition-colors">
                    <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                      {t("orderId", "Order ID")}
                    </th>
                    <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                      {t("customer", "Customer")}
                    </th>
                    {typeFilter === "ALL" && (
                      <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                        {t("type", "Type")}
                      </th>
                    )}
                    <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                      {t("total", "Total")}
                    </th>
                    <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                      {t("date", "Date")}
                    </th>
                    <th className="px-4 py-3 text-center font-['Montserrat'] text-xs font-semibold text-gray-text">
                      {t("status", "Status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {combinedOrders.slice(0, 8).map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={index % 2 === 0 ? "bg-card hover:bg-background/50 transition-colors" : "bg-background/40 hover:bg-background/80 transition-colors"}
                    >
                      <td className="px-4 py-3 text-start text-sm font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{transaction.orderId || `#${transaction.id.slice(-6)}`}</span>
                          {transaction.couponCode && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-[10px] border border-amber-500/20">
                              <Tag className="h-2.5 w-2.5" />
                              {transaction.couponCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-start text-sm font-medium text-foreground">
                        {transaction.customer || t("guestCustomer", "Guest Customer")}
                      </td>
                      {typeFilter === "ALL" && (
                        <td className="px-4 py-3 text-start text-sm font-medium text-foreground">
                          <div className="flex flex-wrap gap-1">
                            {getOrderTypes(transaction, traderProducts).map((type) => {
                              let bgClass = "bg-gray-500/10 text-gray-400 border border-gray-500/20";
                              if (type === "WHOLESALE") bgClass = "bg-rose-500/10 text-rose-500 border border-rose-500/20";
                              else if (type === "RENTAL") bgClass = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                              else if (type === "SHOP") bgClass = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                              else if (type === "BLANK") bgClass = "bg-amber-500/10 text-amber-500 border border-amber-500/20";

                              const label = type === "WHOLESALE"
                                ? t("typeWholesale", "Wholesale")
                                : type === "RENTAL"
                                ? t("typeRental", "Rental")
                                : type === "SHOP"
                                ? t("typeShop", "Shop")
                                : type === "BLANK"
                                ? t("typeBlank", "Blank")
                                : type;

                              return (
                                <span
                                  key={type}
                                  className={`inline-flex rounded-xl px-2 py-0.5 text-[10px] font-bold uppercase ${bgClass}`}
                                >
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-start text-sm font-medium text-foreground">
                        {typeof transaction.subtotal === "number"
                          ? `EGP ${(transaction.subtotal as number).toFixed(2)}`
                          : String(transaction.subtotal)}
                      </td>
                      <td className="px-4 py-3 text-start text-sm font-medium text-foreground">
                        {transaction.date ||
                          (transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "")}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPill(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}