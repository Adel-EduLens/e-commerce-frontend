import { useState } from "react";

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const summaryCards = [
  {
    label: "Total Revenue",
    value: "$87,250",
    delta: "8.5%",
    note: "Up from yesterday",
    trend: "up",
    icon: "dashicons_money-alt.svg",
  },
  {
    label: "Total Orders",
    value: "1,234 Orders",
    delta: "8.5%",
    note: "Down from yesterday",
    trend: "down",
    icon: "mynaui_cart.svg",
  },
  {
    label: "Customers",
    value: "658 Users",
    delta: "8.5%",
    note: "Up from yesterday",
    trend: "up",
    icon: "majesticons_users-line.svg",
  },
  {
    label: "Conversion Rate",
    value: "6.3%",
    delta: "8.5%",
    note: "Up from yesterday",
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
  { label: "New", share: 35, color: "#A81324" },
  { label: "Confirmed", share: 25, color: "#FCD34D" },
  { label: "Shipped", share: 30, color: "#7DD3FC" },
  { label: "Delivered", share: 10, color: "#A855F7" },
] as const;

const refunds = [
  {
    orderId: "#ORD-1024",
    reason: "Size didn't fit",
    amount: "EGP 450",
    status: "Approved",
    time: "Oct 4, 10:32 AM",
  },
  {
    orderId: "#ORD-1024",
    reason: "Size didn't fit",
    amount: "EGP 450",
    status: "Approved",
    time: "Oct 4, 10:32 AM",
  },
  {
    orderId: "#ORD-1024",
    reason: "Size didn't fit",
    amount: "EGP 450",
    status: "Approved",
    time: "Oct 4, 10:32 AM",
  },
] as const;

const inventoryItems = [
  { label: "In Stock", count: 320, percent: 80, color: "#037847" },
  { label: "Low Stock", count: 54, percent: 14, color: "#FACC15" },
  { label: "Out of Stock", count: 24, percent: 6, color: "#FF0000" },
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
  { orderId: "#INV-1452", product: "Basic Sweatpants", customer: "John Carter", amount: "$48.5", date: "Oct 3", status: "Sent" },
  { orderId: "#INV-1452", product: "Basic Sweatpants", customer: "John Carter", amount: "$48.5", date: "Oct 3", status: "Processing" },
  { orderId: "#INV-1452", product: "Basic Sweatpants", customer: "John Carter", amount: "$48.5", date: "Oct 3", status: "Rejected" },
  { orderId: "#INV-1452", product: "Basic Sweatpants", customer: "John Carter", amount: "$48.5", date: "Oct 3", status: "Rejected" },
] as const;

const customerOverview = [
  { label: "Returning", value: 62, color: "#A81324", delta: "+8.5%", deltaNote: "8% this month", trend: "up" },
  { label: "New", value: 38, color: "#7DD3FC", delta: "3%", deltaNote: "since last month", trend: "down" },
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
  return (
    <div className="rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{label}</p>
          <p className="mt-2 font-['Montserrat'] text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary">
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
          {note}
        </p>
      </div>
    </div>
  );
}

function RevenueChart() {
  const width = 760;
  const height = 220;
  const padding = { top: 20, right: 12, bottom: 34, left: 12 };
  const max = 44;
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
    <div className="space-y-2">
      <div className="grid gap-4 lg:grid-cols-[48px_minmax(0,1fr)]">
        <div className="hidden justify-between pt-2 font-['Montserrat'] text-sm font-medium text-foreground lg:flex lg:flex-col">
          <span>40K</span>
          <span>30K</span>
          <span>20K</span>
          <span>10K</span>
          <span>0K</span>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[220px] w-full overflow-visible rounded-[24px] bg-[#FFFBF5]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="retailRevenueFill" x1="0" y1="0" x2="0" y2="1">
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

            <path d={areaPath} fill="url(#retailRevenueFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="#FFAE4C"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />

            {points.map((point) => (
              <g key={point.month}>
                <circle cx={point.x} cy={point.y} r="8" fill="#FFAE4C" opacity="0.25" />
                <circle cx={point.x} cy={point.y} r="4" fill="#FFAE4C" stroke="white" strokeWidth="1.5" />
              </g>
            ))}
          </svg>

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
      <div className="mx-auto mt-2 flex h-56 w-56 items-center justify-center">
        <div
          className="flex h-56 w-56 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">1,234</p>
            <div className="mt-1 flex items-center gap-1">
              <img className="h-5 w-5" src={traderAsset("hugeicons_trade-up-1.svg")} alt="" />
              <p className="font-['Montserrat'] text-xs font-medium text-gray-text">
                <span className="text-[#00B69B]">8.5%</span> Total Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {orderStatus.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-md" style={{ backgroundColor: item.color }} />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
              {item.label} — {item.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusPill(status: string) {
  switch (status) {
    case "Sent":
      return "bg-emerald-50 text-emerald-700";
    case "Processing":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function TraderRetailPage() {
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allSelected = transactions.length > 0 && selectedRows.size === transactions.length;
  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(transactions.map((_, i) => i)));
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Page header */}
      <section className="rounded-[32px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-['Montserrat'] text-xl font-semibold text-foreground sm:text-2xl">
              Retail Operations
            </p>
            <p className="mt-1 text-sm text-gray-text">
              Manage your retail sales, customers, and in-store performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <label className="relative inline-flex min-w-[260px] items-center">
              <svg
                className="pointer-events-none absolute left-4 h-5 w-5 text-gray-text"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
              </svg>
              <input
                type="text"
                placeholder="Search customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-stroke bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-sm font-medium text-foreground placeholder-[#6B7280] outline-none transition focus:border-stroke focus:ring-0"
              />
            </label>

            {/* Date Range */}
            <button className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
              Date Range
              <svg className="h-3 w-5 text-gray-text" fill="currentColor" viewBox="0 0 20 12">
                <path d="M4.688 2.57 10 7.883l5.313-5.312" stroke="currentColor" strokeWidth={1.5} fill="none" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      {/* Charts row */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
        <Panel title="Earnings Over Time">
          <RevenueChart />
        </Panel>

        <Panel title="Orders by Status">
          <OrdersByStatus />
        </Panel>
      </section>

      {/* Middle panels */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Returns & Refunds */}
        <Panel title="Returns &amp; Refunds" action="View All">
          <div className="space-y-3">
            {refunds.map((item, index) => (
              <article
                key={index}
                className="rounded-xl border border-stroke bg-background p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.06)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="#037847" strokeWidth={1.5} viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="3" />
                    </svg>
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      Order ID: {item.orderId}
                    </p>
                  </div>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground shrink-0">
                    {item.amount}
                  </span>
                </div>
                <p className="mt-1.5 font-['Montserrat'] text-sm font-medium text-gray-text">
                  Reason: {item.reason}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-text">{item.time}</span>
                  <span className="rounded-2xl bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        {/* Inventory Snapshot */}
        <Panel title="Inventory Snapshot" action="View All">
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 shrink-0 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-text">{item.count} items</span>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl">
              <div className="flex h-12 w-full">
                {inventoryItems.map((item) => (
                  <div
                    key={item.label}
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {inventoryItems.map((item) => (
                <div key={`${item.label}-legend`} className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
                    {item.label} {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Top-Selling Products */}
        <Panel title="Top-Selling Products" action="View All">
          <div className="space-y-3">
            {topProducts.map((product) => (
              <article
                key={product.name}
                className="flex items-start gap-3 rounded-2xl border border-stroke bg-background p-3"
              >
                <img
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  src={traderAsset(product.image)}
                  alt={product.name}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs font-medium text-gray-text">
                      Revenue{" "}
                      <span className="font-semibold text-foreground">{product.revenue}</span>
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-gray-text">
                    <span>
                      Units Sold{" "}
                      <span className="font-semibold text-foreground">{product.units}</span>
                    </span>
                    <span>
                      Unit Price{" "}
                      <span className="font-semibold text-foreground">{product.unitPrice}</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      {/* Bottom row */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {/* Transactions table */}
        <Panel title="Transactions">
          <div className="mb-3 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.67} viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
              </svg>
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-center">
                    <div
                      onClick={toggleAll}
                      className="mx-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-primary bg-secondary"
                    >
                      {allSelected && (
                        <svg className="h-3.5 w-3.5" fill="none" stroke="var(--primary)" strokeWidth={2} viewBox="0 0 14 14">
                          <path d="M2.92 7 5.5 9.58l5.58-5.58" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </th>
                  {["Order ID", "Product", "Customer", "Amount", "Date", "Status", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-background"}>
                    <td className="px-4 py-3 text-center">
                      <div
                        onClick={() => toggleRow(index)}
                        className={`mx-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border ${
                          selectedRows.has(index)
                            ? "border-secondary bg-secondary"
                            : "border-stroke bg-white"
                        }`}
                      >
                        {selectedRows.has(index) && (
                          <svg className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 14 14">
                            <path d="M2.92 7 5.5 9.58l5.58-5.58" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                      {row.orderId}
                    </td>
                    <td className="px-3 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                      {row.product}
                    </td>
                    <td className="px-3 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                      {row.customer}
                    </td>
                    <td className="px-3 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                      {row.amount}
                    </td>
                    <td className="px-3 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                      {row.date}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusPill(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button className="flex items-center justify-center">
                        <svg className="h-4 w-4 text-gray-text" fill="currentColor" viewBox="0 0 4 16">
                          <circle cx="2" cy="2" r="1.5" />
                          <circle cx="2" cy="8" r="1.5" />
                          <circle cx="2" cy="14" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-center">
            <button className="text-xs font-medium text-gray-text transition hover:text-foreground">
              View All
            </button>
          </div>
        </Panel>

        {/* Customer Overview */}
        <Panel title="Overview">
          <div className="space-y-5">
            {customerOverview.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">
                    {item.value}%
                  </span>
                </div>
                <div className="h-10 overflow-hidden rounded-[10px] bg-gray-light">
                  <div
                    className="h-full rounded-[10px]"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-1">
              {customerOverview.map((item) => (
                <div key={`${item.label}-stat`} className="flex items-center justify-between gap-3">
                  <span className="font-['Montserrat'] text-xs font-medium text-gray-text">
                    {item.label} Customers
                  </span>
                  <div className="flex items-center gap-1">
                    <img
                      className="h-5 w-5"
                      src={traderAsset(
                        item.trend === "up"
                          ? "hugeicons_trade-up-1.svg"
                          : "ic-trending-down-24px.svg",
                      )}
                      alt=""
                    />
                    <span
                      className={`font-['Montserrat'] text-sm font-medium ${
                        item.trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"
                      }`}
                    >
                      {item.delta}
                    </span>
                    <span className="font-['Montserrat'] text-sm font-medium text-foreground">
                      {" "}
                      {item.deltaNote}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="rounded-2xl bg-background px-4 py-3 text-sm font-medium text-gray-text">
              <span className="text-gray-text">Insight: </span>
              <span className="text-foreground">
                Returning customers increased by 8% vs last month.
              </span>
            </p>
          </div>
        </Panel>
      </section>
    </div>
  );
}
