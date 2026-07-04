import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const traderAsset = (file: string) =>
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

const dateRanges = ["29 Oct - 11 Nov", "Last 30 days", "This quarter"] as const;

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
  { label: "New", share: 35, color: "#BBFF63" },
  { label: "Confirmed", share: 25, color: "#FCD34D" },
  { label: "Shipped", share: 30, color: "#7DD3FC" },
  { label: "Delivered", share: 10, color: "#A855F7" },
] as const;

const alerts = [
  {
    title: "Low Stock Alert",
    body: 'Basic Tee #122" only 3 items left in stock.',
    time: "Oct 4, 10:32 AM",
    icon: "solar_danger-triangle-bold.svg",
  },
  {
    title: "Payment Received",
    body: "Payout batch for the week was deposited successfully.",
    time: "Oct 4, 08:10 AM",
    icon: "solar_box-linear.svg",
  },
  {
    title: "Shipment Delay",
    body: "Courier exception detected for 2 wholesale orders.",
    time: "Oct 3, 06:45 PM",
    icon: "entypo_cross.svg",
  },
] as const;

const inventorySnapshot = [
  { label: "In Stock", count: 320, percent: 80, icon: "solar_box-linear.svg" },
  { label: "Low Stock", count: 54, percent: 14, icon: "solar_danger-triangle-bold.svg" },
  { label: "Out of Stock", count: 24, percent: 6, icon: "entypo_cross.svg" },
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
  { label: "Returning", value: 62, color: "#BBFF63" },
  { label: "New", value: 38, color: "#7DD3FC" },
] as const;

const customerStats = [
  { label: "Avg. Orders per Customer", value: "2.3", icon: "solar_box-linear-1.svg" },
  { label: "Avg. Spend per Customer", value: "$38", icon: "akar-icons_money.svg" },
  { label: "Most Active Day", value: "Friday", icon: "solar_calendar-linear.svg" },
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
      className={`rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-[#111827] sm:text-xl">
          {title}
        </h2>
        {action ? (
          <button className="text-xs font-medium text-[#6B7280] transition hover:text-[#111827]">
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
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 font-['Montserrat'] text-2xl font-semibold text-[#111827]">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#BBFF63]">
          <img className="h-8 w-8" src={traderAsset(icon)} alt="" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="h-5 w-5"
          src={traderAsset(trend === "up" ? "hugeicons_trade-up-1.svg" : "ic-trending-down-24px.svg")}
          alt=""
        />
        <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
          <span className={trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"}>{delta}</span>{" "}
          {note}
        </p>
      </div>
    </div>
  );
}

function RevenueChart() {
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
          <span className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
            Annual sales trend across channels
          </span>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#111827] transition hover:border-[#D1D5DB] hover:bg-[#F9FAFB]">
          <img className="h-5 w-5" src={traderAsset("download-cloud-02.svg")} alt="" />
          Export
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[48px_minmax(0,1fr)]">
        <div className="hidden justify-between pt-4 font-['Montserrat'] text-sm font-medium text-[#111827] lg:flex lg:flex-col">
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

          <div className="mt-3 grid grid-cols-5 gap-2 font-['Montserrat'] text-sm font-medium text-[#111827] sm:grid-cols-10">
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
      <div className="mx-auto mt-2 flex h-64 w-64 items-center justify-center">
        <div
          className="flex h-64 w-64 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white text-center">
            <p className="font-['Montserrat'] text-3xl font-semibold text-[#111827]">1,234</p>
            <div className="mt-2 flex items-center gap-2">
              <img className="h-5 w-5" src={traderAsset("hugeicons_trade-up-1.svg")} alt="" />
              <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">
                <span className="text-[#00B69B]">8.5%</span> Total Orders
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
            <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">
              {item.label} - {item.share}%
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
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<(typeof sidebarItems)[number]["label"]>("Overview");
  const [dateRange, setDateRange] = useState<(typeof dateRanges)[number]>(dateRanges[0]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Maan";
  const avatar = typeof user?.avatar === "string" && user.avatar
    ? user.avatar
    : traderAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-[32px] bg-[#111827] p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img
                className="h-12 w-auto"
                src={traderAsset("logo gen-z .white 1.png")}
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
                    onClick={() => {
                      setActiveItem(item.label);
                      if (item.label === "Products") navigate("/dashboard/trader/products");
                      if (item.label === "Customers") navigate("/dashboard/trader/customers");
                      if (item.label === "Orders") navigate("/dashboard/trader/orders");
                      if (item.label === "Inventory") navigate("/dashboard/trader/inventory");
                    }}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-[#BBFF63] text-[#111827]"
                        : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <img className="h-6 w-6 shrink-0" src={traderAsset(item.icon)} alt="" />
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

        <main className="min-w-0 flex-1 space-y-6">
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-['Montserrat'] text-xl font-semibold text-[#111827] sm:text-2xl">
                  Dashboard Overview
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Daily performance summary for your retail and wholesale operations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111827] bg-[#111827] transition hover:bg-[#1F2937]"
                >
                  <img
                    className="h-5 w-5"
                    src={traderAsset("ion_notifications-outline.svg")}
                    alt=""
                  />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                  <img className="h-5 w-5" src={traderAsset("hugeicons_moon-01.svg")} alt="" />
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={avatar}
                  alt={user?.name || "Trader avatar"}
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="font-['Montserrat'] text-3xl font-semibold text-[#111827] sm:text-4xl">
                Good morning, {firstName}{" "}
                <span className="inline-block align-middle">👋</span>
              </h1>
              <p className="mt-2 text-sm text-[#6B7280]">
                Here&apos;s what&apos;s moving across your store today.
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
                  className="w-full appearance-none rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-12 pr-12 font-['Montserrat'] text-sm font-medium text-[#111827] outline-none transition hover:bg-[#F9FAFB] focus:border-[#D1D5DB]"
                >
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
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
                className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3 font-['Montserrat'] text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]"
              >
                Storefront
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} {...card} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
            <Panel title="Revenue Overview">
              <RevenueChart />
            </Panel>

            <Panel title="Orders by Status">
              <OrdersByStatus />
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Panel title="Recent Alerts" action="View All">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <article
                    key={`${alert.title}-${alert.time}`}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img className="h-5 w-5" src={traderAsset(alert.icon)} alt="" />
                        <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                          {alert.title}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#6B7280]">{alert.time}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-[#6B7280]">{alert.body}</p>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel title="Inventory Snapshot" action="View All">
              <div className="space-y-4">
                {inventorySnapshot.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img className="h-5 w-5" src={traderAsset(item.icon)} alt="" />
                      <span className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#6B7280]">{item.count} items</span>
                  </div>
                ))}

                <div className="overflow-hidden rounded-2xl bg-[#F3F4F6]">
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
                            item.label === "In Stock"
                              ? "#037847"
                              : item.label === "Low Stock"
                              ? "#FACC15"
                              : "#FF0000",
                        }}
                      />
                      <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">
                        {item.label} {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title="Top-Selling Products" action="View All">
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <article
                    key={product.name}
                    className="flex items-start gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-3"
                  >
                    <img
                      className="h-12 w-12 rounded-xl object-cover"
                      src={traderAsset(product.image)}
                      alt={product.name}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-[#6B7280]">
                          Revenue <span className="font-semibold text-[#111827]">{product.revenue}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#6B7280]">
                        <span>
                          Units Sold <span className="font-semibold text-[#111827]">{product.units}</span>
                        </span>
                        <span>
                          Unit Price <span className="font-semibold text-[#111827]">{product.unitPrice}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Panel title="Recent Transactions" action="View All">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
                  <thead>
                    <tr className="bg-[#111827]">
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction.orderId}
                        className={index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
                          {transaction.orderId}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
                          {transaction.customer}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
                          {transaction.total}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusPill(
                              transaction.status,
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
            </Panel>

            <Panel title="Customers Overview" action="View All">
              <div className="space-y-5">
                {customerOverview.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                        {item.label}
                      </span>
                      <span className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#F3F4F6]">
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
                        <span className="font-['Montserrat'] text-sm font-semibold text-[#6B7280]">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-['Montserrat'] text-sm font-medium text-[#111827]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#6B7280]">
                  <span className="text-[#6B7280]">Insight: </span>
                  <span className="text-[#111827]">
                    Returning customers increased by +5% compared to last month.
                  </span>
                </p>
              </div>
            </Panel>
          </section>
        </main>
      </div>
    </div>
  );
}
