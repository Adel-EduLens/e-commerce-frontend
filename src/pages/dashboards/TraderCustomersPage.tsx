import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

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

type CustomerStatus = "Active" | "Inactive" | "New";

interface Customer {
  id: number;
  name: string;
  avatar: string;
  email: string;
  orders: number;
  totalSpent: string;
  frequency: string;
  lastPurchase: string;
  status: CustomerStatus;
}

interface Order {
  id: string;
  date: string;
  items: number;
  payment: string;
  total: string;
  status: "Delivered" | "Processing" | "Cancelled";
}

const customers: Customer[] = [
  { id: 1, name: "Sarah Johnson", avatar: "unsplash_8Vt2haq8NSQ.png", email: "sarah.j@email.com", orders: 12, totalSpent: "$520.00", frequency: "Monthly", lastPurchase: "2024-01-15", status: "Active" },
  { id: 2, name: "Michael Chen", avatar: "image 69.png", email: "m.chen@email.com", orders: 8, totalSpent: "$340.00", frequency: "Bi-monthly", lastPurchase: "2024-01-10", status: "Active" },
  { id: 3, name: "Emily Davis", avatar: "unsplash_8Vt2haq8NSQ.png", email: "emily.d@email.com", orders: 3, totalSpent: "$145.00", frequency: "Quarterly", lastPurchase: "2023-12-20", status: "New" },
  { id: 4, name: "James Wilson", avatar: "image 69.png", email: "j.wilson@email.com", orders: 0, totalSpent: "$0.00", frequency: "—", lastPurchase: "2023-11-05", status: "Inactive" },
  { id: 5, name: "Olivia Brown", avatar: "unsplash_8Vt2haq8NSQ.png", email: "o.brown@email.com", orders: 21, totalSpent: "$890.00", frequency: "Weekly", lastPurchase: "2024-01-18", status: "Active" },
  { id: 6, name: "Noah Martinez", avatar: "image 69.png", email: "n.martinez@email.com", orders: 5, totalSpent: "$210.00", frequency: "Monthly", lastPurchase: "2024-01-02", status: "Active" },
];

const customerOrders: Order[] = [
  { id: "#ORD-001", date: "Jan 15, 2024", items: 3, payment: "Credit Card", total: "$120.00", status: "Delivered" },
  { id: "#ORD-002", date: "Dec 28, 2023", items: 1, payment: "PayPal", total: "$49.99", status: "Delivered" },
  { id: "#ORD-003", date: "Dec 10, 2023", items: 2, payment: "Credit Card", total: "$95.00", status: "Delivered" },
  { id: "#ORD-004", date: "Nov 22, 2023", items: 4, payment: "Credit Card", total: "$185.00", status: "Cancelled" },
  { id: "#ORD-005", date: "Nov 05, 2023", items: 2, payment: "PayPal", total: "$70.00", status: "Delivered" },
];

function statusPill(status: CustomerStatus) {
  if (status === "Active") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "New") return { bg: "bg-blue-50", text: "text-blue-700" };
  return { bg: "bg-gray-100", text: "text-gray-600" };
}

function orderStatusPill(status: Order["status"]) {
  if (status === "Delivered") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Processing") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

/* ─── Donut Chart ────────────────────────────────────────────────────────── */
function DonutChart() {
  const segments = [
    { label: "Active", value: 58, color: "#BBFF63" },
    { label: "Inactive", value: 22, color: "#111827" },
    { label: "New", value: 20, color: "#E5E7EB" },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = 70, cy = 70, r = 50, innerR = 28;
  let startAngle = -Math.PI / 2;

  const paths = segments.map((seg) => {
    const angle = (seg.value / total) * 2 * Math.PI;
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
    <div className="flex items-center gap-4">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {paths.map((seg) => (
          <path key={seg.label} d={seg.d} fill={seg.color} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">12,430</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#6B7280">Total</text>
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: seg.color, border: seg.color === "#E5E7EB" ? "1px solid #D1D5DB" : undefined }} />
            <span className="font-['Montserrat'] text-xs text-[#6B7280]">{seg.label}</span>
            <span className="ml-auto font-['Montserrat'] text-xs font-semibold text-[#111827]">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bar Chart (Overview) ───────────────────────────────────────────────── */
function BarChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = [65, 78, 55, 90, 72, 88, 60, 95, 70, 82, 75, 85];
  const max = Math.max(...values);
  const chartH = 80;

  return (
    <svg width="100%" height={chartH + 24} viewBox={`0 0 ${months.length * 28} ${chartH + 24}`} preserveAspectRatio="none">
      {months.map((m, i) => {
        const barH = (values[i] / max) * chartH;
        const x = i * 28 + 4;
        const y = chartH - barH;
        const isActive = i === 9;
        return (
          <g key={m}>
            <rect x={x} y={y} width={20} height={barH} rx={4} fill={isActive ? "#111827" : "#BBFF63"} />
            <text x={x + 10} y={chartH + 16} textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="Montserrat">{m}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Line Chart (Spending Over Time) ───────────────────────────────────── */
function LineChart() {
  const points = [120, 80, 160, 95, 200, 140, 180, 220, 165, 240, 190, 260];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const W = 400, H = 120, pad = 20;
  const max = Math.max(...points);
  const coords = points.map((v, i) => ({
    x: pad + (i / (points.length - 1)) * (W - pad * 2),
    y: H - pad - ((v / max) * (H - pad * 2)),
  }));
  const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${H - pad} L ${coords[0].x} ${H - pad} Z`;

  return (
    <svg width="100%" height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BBFF63" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#BBFF63" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1={pad} y1={H - pad - t * (H - pad * 2)} x2={W - pad} y2={H - pad - t * (H - pad * 2)} stroke="#F3F4F6" strokeWidth="1" />
      ))}
      <path d={areaD} fill="url(#spendGrad)" />
      <path d={pathD} fill="none" stroke="#BBFF63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={3} fill="#BBFF63" stroke="white" strokeWidth="1.5" />
      ))}
      {months.map((m, i) => (
        <text key={m} x={coords[i].x} y={H + 14} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="Montserrat">{m}</text>
      ))}
    </svg>
  );
}

/* ─── Customer Detail View ───────────────────────────────────────────────── */
function CustomerDetail({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const statCards = [
    { label: "Total Orders", value: "12", sub: "+2 this month" },
    { label: "Total Spent", value: "$520", sub: "+$95 this month" },
    { label: "Avg. Order Value", value: "$43.30", sub: "Last 6 months" },
    { label: "Avg. Purchase Every", value: "10 days", sub: "Purchase frequency" },
  ];

  const insights = [
    { label: "Preferred Category", value: "Women's Wear" },
    { label: "Most Used Payment", value: "Credit Card" },
    { label: "Peak Shopping Time", value: "Weekends" },
    { label: "Return Rate", value: "8%" },
    { label: "Coupon Usage", value: "23%" },
  ];

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Customers
      </button>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">{card.label}</p>
            <p className="mt-1 font-['Montserrat'] text-2xl font-bold text-[#111827]">{card.value}</p>
            <p className="mt-0.5 font-['Montserrat'] text-xs text-[#9CA3AF]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Customer Information */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-[#111827]">Customer Information</h3>
          <div className="mb-4 flex items-center gap-3">
            <img
              className="h-14 w-14 rounded-full object-cover ring-2 ring-[#E5E7EB]"
              src={asset(customer.avatar)}
              alt={customer.name}
            />
            <div>
              <p className="font-['Montserrat'] text-base font-semibold text-[#111827]">{customer.name}</p>
              <span className={`inline-flex rounded-2xl px-2 py-0.5 text-xs font-medium font-['Montserrat'] ${statusPill(customer.status).bg} ${statusPill(customer.status).text}`}>
                {customer.status}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Email", value: customer.email },
              { label: "Phone", value: "+1 (555) 012-3456" },
              { label: "Address", value: "123 Main St, New York, NY 10001" },
              { label: "Member Since", value: "March 2023" },
              { label: "Last Purchase", value: customer.lastPurchase },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <span className="font-['Montserrat'] text-xs font-medium text-[#9CA3AF]">{row.label}</span>
                <span className="font-['Montserrat'] text-sm font-medium text-[#111827]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Chart */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-['Montserrat'] text-base font-semibold text-[#111827]">Customer Spending Over Time</h3>
            <span className="font-['Montserrat'] text-xs text-[#9CA3AF]">Last 12 months</span>
          </div>
          <LineChart />
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h3 className="font-['Montserrat'] text-base font-semibold text-[#111827]">Order History</h3>
          <span className="font-['Montserrat'] text-xs text-[#6B7280]">{customerOrders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#111827]">
                {["Order ID", "Date", "Items", "Payment", "Total", "Status"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customerOrders.map((order, idx) => {
                const pill = orderStatusPill(order.status);
                return (
                  <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-semibold text-[#111827]">{order.id}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#6B7280]">{order.date}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#111827]">{order.items} item{order.items > 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#6B7280]">{order.payment}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-semibold text-[#111827]">{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Behavior Insights */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-[#111827]">Behavior Insights</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {insights.map((ins) => (
            <div key={ins.label} className="rounded-xl bg-[#F9FAFB] p-3">
              <p className="font-['Montserrat'] text-xs font-medium text-[#9CA3AF]">{ins.label}</p>
              <p className="mt-1 font-['Montserrat'] text-sm font-semibold text-[#111827]">{ins.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TraderCustomersPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] =
    useState<(typeof sidebarItems)[number]["label"]>("Customers");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderOverviewAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSidebarClick = (label: (typeof sidebarItems)[number]["label"]) => {
    setActiveItem(label);
    if (label === "Overview") navigate("/dashboard/trader");
    if (label === "Products") navigate("/dashboard/trader/products");
    if (label === "Orders") navigate("/dashboard/trader/orders");
    if (label === "Inventory") navigate("/dashboard/trader/inventory");
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const summaryCards = [
    { label: "Total Customers", value: "12,430", trend: "+5.2% this month", up: true },
    { label: "Returning", value: "3,210", trend: "25.8% retention", up: true },
    { label: "New Customers", value: "1,050", trend: "+12% this month", up: true },
    { label: "Avg. Order Value", value: "$78.40", trend: "-1.3% vs last month", up: false },
  ];

  const alerts = [
    { text: "5 customers haven't ordered in 90+ days", type: "warning" },
    { text: "3 high-value customers flagged for churn risk", type: "danger" },
    { text: "New segment: 12 customers hit VIP threshold", type: "success" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full rounded-[32px] bg-[#111827] p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img
                className="h-12 w-auto"
                src={traderOverviewAsset("logo gen-z .white 1.png")}
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
                    onClick={() => handleSidebarClick(item.label)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-[#BBFF63] text-[#111827]"
                        : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <img className="h-6 w-6 shrink-0" src={asset(item.icon)} alt="" />
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

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 space-y-4">
          {/* Top bar */}
          <section className="rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-['Montserrat'] text-xl font-semibold text-[#111827]">
                Customers
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111827] bg-[#111827] transition hover:bg-[#1F2937]"
                >
                  <img className="h-5 w-5" src={asset("ion_notifications-outline.svg")} alt="" />
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                  <img className="h-5 w-5" src={asset("hugeicons_moon-01.svg")} alt="" />
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={avatar}
                  alt={user?.name || "Trader avatar"}
                />
              </div>
            </div>
          </section>

          {selectedCustomer ? (
            <CustomerDetail
              customer={selectedCustomer}
              onBack={() => setSelectedCustomer(null)}
            />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                    <p className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">{card.label}</p>
                    <p className="mt-1 font-['Montserrat'] text-2xl font-bold text-[#111827]">{card.value}</p>
                    <p className={`mt-0.5 font-['Montserrat'] text-xs font-medium ${card.up ? "text-emerald-600" : "text-red-500"}`}>
                      {card.trend}
                    </p>
                  </div>
                ))}
              </div>

              {/* Search + Send Offer */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="relative flex min-w-[280px] items-center">
                  <img
                    className="pointer-events-none absolute left-4 h-5 w-5"
                    src={asset("mynaui_search.svg")}
                    alt=""
                  />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none transition placeholder:text-[#6B7280] focus:border-[#D1D5DB]"
                  />
                </label>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-['Montserrat'] text-sm font-semibold text-white transition hover:bg-[#1F2937]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3h12M2 8h8M2 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="13" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13 9.5V11l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Send Offer
                </button>
              </div>

              {/* Customer Activity Table */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
                  <h2 className="font-['Montserrat'] text-base font-semibold text-[#111827]">Customer Activity</h2>
                  <div className="flex items-center gap-2">
                    {(["Status", "Sort by"] as const).map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
                      >
                        {label}
                        <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                      </button>
                    ))}
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
                    >
                      <img className="h-4 w-4" src={asset("download-cloud-02.svg")} alt="" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-[#111827]">
                        {["Customer Name", "Email", "Orders", "Total Spent", "Frequency", "Last Purchase", "Status", "Actions"].map((col) => (
                          <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63] whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer, idx) => {
                        const pill = statusPill(customer.status);
                        return (
                          <tr
                            key={customer.id}
                            className={`cursor-pointer transition hover:bg-[#F9FAFB] ${idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  className="h-8 w-8 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                                  src={asset(customer.avatar)}
                                  alt={customer.name}
                                />
                                <span className="font-['Montserrat'] text-xs font-semibold text-[#111827] whitespace-nowrap">{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#6B7280]">{customer.email}</td>
                            <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{customer.orders}</td>
                            <td className="px-4 py-3 font-['Montserrat'] text-xs font-semibold text-[#111827]">{customer.totalSpent}</td>
                            <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#6B7280]">{customer.frequency}</td>
                            <td className="px-4 py-3 font-['Montserrat'] text-xs text-[#6B7280]">{customer.lastPurchase}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                                {customer.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                                  title="Edit"
                                >
                                  <img className="h-4 w-4" src={asset("mynaui_edit.svg")} alt="Edit" />
                                </button>
                                <button
                                  type="button"
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-[#F9FAFB]"
                                  title="Delete"
                                >
                                  <img className="h-4 w-4" src={asset("material-symbols_delete-outline.svg")} alt="Delete" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
                  <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                    <span className="font-['Montserrat'] text-sm font-medium text-[#111827]">10 per page</span>
                    <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
                    <span className="font-['Inter'] text-sm font-medium text-[#111827]">
                      1-6 <span className="text-[#6B7280]">of {customers.length}</span>
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
              </div>

              {/* Bottom panels */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Recent Alerts */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                  <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-[#111827]">Recent Alerts</h3>
                  <div className="flex flex-col gap-3">
                    {alerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-xl p-3 ${
                          alert.type === "warning"
                            ? "bg-amber-50"
                            : alert.type === "danger"
                            ? "bg-red-50"
                            : "bg-emerald-50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                            alert.type === "warning"
                              ? "bg-amber-400"
                              : alert.type === "danger"
                              ? "bg-red-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <p className="font-['Montserrat'] text-xs font-medium text-[#111827]">{alert.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer by Status (Donut) */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                  <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-[#111827]">Customer by Status</h3>
                  <DonutChart />
                </div>

                {/* Overview (Bar Chart) */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-['Montserrat'] text-base font-semibold text-[#111827]">Overview</h3>
                    <span className="font-['Montserrat'] text-xs text-[#9CA3AF]">2024</span>
                  </div>
                  <BarChart />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
