import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTranslation } from "react-i18next";

const traderAsset = (file: string) => `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;



const dateRanges = ["29 Oct - 11 Nov", "Last 30 days", "This quarter"] as const;

const summaryCards = [
  {
    label: "totalRevenue",
    value: "totalRevenueVal",
    delta: "8.5%",
    note: "upFromYesterday",
    trend: "up",
    icon: "dashicons_money-alt.svg",
  },
  {
    label: "totalOrders",
    value: "totalOrdersVal",
    delta: "8.5%",
    note: "downFromYesterday",
    trend: "down",
    icon: "mynaui_cart.svg",
  },
  {
    label: "customers",
    value: "customersVal",
    delta: "8.5%",
    note: "upFromYesterday",
    trend: "up",
    icon: "majesticons_users-line.svg",
  },
  {
    label: "conversionRate",
    value: "conversionRateVal",
    delta: "8.5%",
    note: "upFromYesterday",
    trend: "up",
    icon: "hugeicons_trade-up.svg",
  },
] as const;

const revenueSeries = [
  { month: "Jan", value: 22 },
  { month: "Feb", value: 26 },
  { month: "Mar", value: 31 },
  { month: "Apr", value: 33 },
  { month: "May", value: 29 },
  { month: "Jun", value: 18 },
  { month: "Jul", value: 25 },
  { month: "Aug", value: 32 },
  { month: "Sep", value: 35 },
  { month: "Oct", value: 39 },
] as const;

const orderStatus = [
  { label: "new", share: 35, color: "#A81324" },
  { label: "confirmed", share: 25, color: "#FCD34D" },
  { label: "shipped", share: 30, color: "#7DD3FC" },
  { label: "delivered", share: 10, color: "#A855F7" },
] as const;

const alerts = [
  {
    title: "lowStockAlert",
    body: "alertBody1",
    time: "oct4_1032",
    icon: "solar_danger-triangle-bold.svg",
  },
  {
    title: "paymentReceived",
    body: "alertBody2",
    time: "oct4_0810",
    icon: "solar_box-linear.svg",
  },
  {
    title: "shipmentDelay",
    body: "alertBody3",
    time: "oct3_0645",
    icon: "entypo_cross.svg",
  },
] as const;

const inventorySnapshot = [
  { label: "inStock", count: 320, percent: 80, icon: "solar_box-linear.svg" },
  { label: "lowStock", count: 54, percent: 14, icon: "solar_danger-triangle-bold.svg" },
  { label: "outOfStock", count: 24, percent: 6, icon: "entypo_cross.svg" },
] as const;

const topProducts = [
  {
    name: "Basic Sweatpants",
    revenue: "$7,350",
    units: "245 Units",
    unitPrice: "$30",
    image: "image 69.png",
  },
  {
    name: "Vintage Utility Cap",
    revenue: "$5,490",
    units: "183 Units",
    unitPrice: "$30",
    image: "unsplash_8Vt2haq8NSQ.png",
  },
  {
    name: "Softshell Overshirt",
    revenue: "$4,860",
    units: "108 Units",
    unitPrice: "$45",
    image: "image 69.png",
  },
] as const;

const transactions = [
  {
    orderId: "#INV-1452",
    customer: "John Carter",
    total: "$30",
    date: "Oct 3",
    status: "Completed",
  },
  {
    orderId: "#INV-1458",
    customer: "Sarah Ahmed",
    total: "$86",
    date: "Oct 3",
    status: "Pending",
  },
  {
    orderId: "#INV-1461",
    customer: "Lina Noor",
    total: "$120",
    date: "Oct 2",
    status: "Pending",
  },
  {
    orderId: "#INV-1464",
    customer: "Malik Stone",
    total: "$42",
    date: "Oct 2",
    status: "Completed",
  },
] as const;

const customerOverview = [
  { label: "returning", value: 62, color: "#A81324" },
  { label: "new", value: 38, color: "#7DD3FC" },
] as const;

const customerStats = [
  { label: "avgOrdersPerCustomer", value: "2.3", icon: "solar_box-linear-1.svg" },
  { label: "avgSpendPerCustomer", value: "$38", icon: "akar-icons_money.svg" },
  { label: "mostActiveDay", value: "friday", icon: "solar_calendar-linear.svg" },
] as const;

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
      className={`rounded-[28px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h2>
        {action ? (
          <button className="text-xs font-medium text-gray-text transition hover:text-foreground">
            {action}
          </button>
        ) : null}
      </div>
      {children}
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
    <div className="rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{t(label, label)}</p>
          <p className="mt-2 font-['Montserrat'] text-2xl font-semibold text-foreground">{t(value, value)}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
          <img className="h-8 w-8" src={traderAsset(icon)} alt="" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="h-5 w-5"
          src={traderAsset(trend === "up" ? "hugeicons_trade-up-1.svg" : "ic-trending-down-24px.svg")}
          alt=""
        />
        <p className="font-['Montserrat'] text-sm font-medium text-gray-text">
          <span className={trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"}>{delta}</span>{" "}
          {t(note, note)}
        </p>
      </div>
    </div>
  );
}

function RevenueChart() {
  const { t } = useTranslation("traderOverview");
  const width = 760;
  const height = 260;
  const padding = { top: 20, right: 12, bottom: 34, left: 12 };
  const max = 40;
  const baseline = height - padding.bottom;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = revenueSeries.map((item, index) => {
    const x = padding.left + (chartWidth / (revenueSeries.length - 1)) * index;
    const y = padding.top + chartHeight - (item.value / max) * chartHeight;
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `M ${points[0].x} ${baseline} ${points
    .map((point) => `L ${point.x} ${point.y}`)
    .join(" ")} L ${points[points.length - 1].x} ${baseline} Z`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-['Montserrat'] text-sm font-medium text-gray-text">
            {t("annualSalesTrend")}
          </span>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-stroke px-4 py-2 text-sm font-medium text-foreground transition hover:border-stroke hover:bg-background">
          <img className="h-5 w-5" src={traderAsset("download-cloud-02.svg")} alt="" />
          {t("export")}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[48px_minmax(0,1fr)]">
        <div className="hidden justify-between pt-4 font-['Montserrat'] text-sm font-medium text-foreground lg:flex lg:flex-col">
          <span>40K</span>
          <span>30K</span>
          <span>20K</span>
          <span>10K</span>
          <span>0K</span>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[260px] w-full overflow-visible rounded-[24px] bg-[#FFFBF5]"
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
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              );
            })}

            <path d={areaPath} fill="url(#revenueFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="#FFAE4C"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>

          {points.map((point) => (
            <img
              key={point.month}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2"
              src={traderAsset("basicNode.svg")}
              style={{
                left: `${(point.x / width) * 100}%`,
                top: `${(point.y / height) * 100}%`,
              }}
              alt=""
            />
          ))}

          <div className="mt-3 grid grid-cols-5 gap-2 font-['Montserrat'] text-sm font-medium text-foreground sm:grid-cols-10">
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

function OrdersByStatus() {
  const { t } = useTranslation("traderOverview");
  const gradientStops = orderStatus
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
    .parts.join(" ");

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="mx-auto mt-2 flex h-64 w-64 items-center justify-center">
        <div
          className="flex h-64 w-64 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="font-['Montserrat'] text-3xl font-semibold text-foreground">1,234</p>
            <div className="mt-2 flex items-center gap-2">
              <img className="h-5 w-5" src={traderAsset("hugeicons_trade-up-1.svg")} alt="" />
              <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                <span className="text-[#00B69B]">8.5%</span> {t("totalOrders")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {orderStatus.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded-md"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
              {t(item.label, item.label)} - {item.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusPill(status: string) {
  if (status === "Completed") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-amber-100 text-amber-800";
}

export default function TraderDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<(typeof dateRanges)[number]>(dateRanges[0]);
  const { t } = useTranslation("traderOverview");

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Maan";

  return (
    <>
        <div className="space-y-6">
          <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="font-['Montserrat'] text-3xl font-semibold text-foreground sm:text-4xl">
                {t("goodMorning", { name: firstName })}
              </h1>
              <p className="mt-2 text-sm text-gray-text">
                {t("subheading")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="relative inline-flex min-w-[220px] items-center">
                <img
                  className="pointer-events-none absolute left-4 h-5 w-5"
                  src={traderAsset("solar_calendar-linear-1.svg")}
                  alt=""
                />
                <select
                  value={dateRange}
                  onChange={(event) =>
                    setDateRange(event.target.value as (typeof dateRanges)[number])
                  }
                  className="w-full appearance-none rounded-2xl border border-stroke bg-white py-3 pl-12 pr-12 font-['Montserrat'] text-sm font-medium text-foreground outline-none transition hover:bg-background focus:border-stroke"
                >
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>
                      {t(range === "29 Oct - 11 Nov" ? "dateRange1" : range === "Last 30 days" ? "last30Days" : "thisQuarter", range)}
                    </option>
                  ))}
                </select>
                <img
                  className="pointer-events-none absolute right-4 h-3 w-6"
                  src={traderAsset("weui_arrow-outlined.svg")}
                  alt=""
                />
              </label>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-2xl border border-stroke bg-white px-5 py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:bg-background"
              >
                {t("storefront")}
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} {...card} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
            <Panel title={t("revenueOverview")}>
              <RevenueChart />
            </Panel>

            <Panel title={t("ordersByStatus")}>
              <OrdersByStatus />
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Panel title={t("recentAlerts")} action={t("viewAll")}>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <article
                    key={`${alert.title}-${alert.time}`}
                    className="rounded-2xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img className="h-5 w-5" src={traderAsset(alert.icon)} alt="" />
                        <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                          {t(alert.title, alert.title)}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-text">{t(alert.time, alert.time)}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-text">{t(alert.body, alert.body)}</p>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel title={t("inventorySnapshot")} action={t("viewAll")}>
              <div className="space-y-4">
                {inventorySnapshot.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img className="h-5 w-5" src={traderAsset(item.icon)} alt="" />
                      <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {t(item.label, item.label)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-text">{t("itemsCount", { count: item.count, defaultValue: `${item.count} items` })}</span>
                  </div>
                ))}

                <div className="overflow-hidden rounded-2xl bg-gray-light">
                  <div className="flex h-12 w-full">
                    <div className="bg-[#037847]" style={{ width: "80%" }} />
                    <div className="bg-[#FACC15]" style={{ width: "14%" }} />
                    <div className="bg-[#FF0000]" style={{ width: "6%" }} />
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {inventorySnapshot.map((item) => (
                    <div key={`${item.label}-legend`} className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-md"
                        style={{
                          backgroundColor:
                            item.label === "inStock"
                              ? "#037847"
                              : item.label === "lowStock"
                              ? "#FACC15"
                              : "#FF0000",
                        }}
                      />
                      <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
                        {t(item.label, item.label)} {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title={t("topSellingProducts")} action={t("viewAll")}>
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <article
                    key={product.name}
                    className="flex items-start gap-3 rounded-2xl border border-stroke bg-background p-3"
                  >
                    <img
                      className="h-12 w-12 rounded-xl object-cover"
                      src={traderAsset(product.image)}
                      alt={product.name}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-gray-text">
                          {t("revenue")} <span className="font-semibold text-foreground">{product.revenue}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-gray-text">
                        <span>
                          {t("unitsSold")} <span className="font-semibold text-foreground">{product.units}</span>
                        </span>
                        <span>
                          {t("unitPrice")} <span className="font-semibold text-foreground">{product.unitPrice}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Panel title={t("recentTransactions")} action={t("viewAll")}>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary">
                        {t("orderId")}
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary">
                        {t("customer")}
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary">
                        {t("total")}
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary">
                        {t("date")}
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary">
                        {t("status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction.orderId}
                        className={index % 2 === 0 ? "bg-white" : "bg-background"}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {transaction.orderId}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {transaction.customer}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {transaction.total}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusPill(
                              transaction.status,
                            )}`}
                          >
                            {t(transaction.status.toLowerCase(), transaction.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title={t("customersOverview")} action={t("viewAll")}>
              <div className="space-y-5">
                {customerOverview.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {t(item.label, item.label)}
                      </span>
                      <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-light">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-3 pt-2">
                  {customerStats.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img className="h-5 w-5" src={traderAsset(item.icon)} alt="" />
                        <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">
                          {t(item.label, item.label)}
                        </span>
                      </div>
                      <span className="font-['Montserrat'] text-sm font-medium text-foreground">
                        {t(item.value.toLowerCase(), item.value)}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="rounded-2xl bg-background px-4 py-3 text-sm font-medium text-gray-text">
                  <span className="text-gray-text">{t("insightLabel")}</span>
                  <span className="text-foreground">
                    {t("insightText")}
                  </span>
                </p>
              </div>
            </Panel>
          </section>
        </div>
    </>
  );
}