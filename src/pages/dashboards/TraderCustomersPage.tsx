import { useState } from "react";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


type CustomerStatus = "Delivered" | "Shipped" | "Cancelled";

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
  status: "Delivered" | "Shipped" | "Cancelled";
}

const customers: Customer[] = [
  { id: 1, name: "Sarah Johnson", avatar: "unsplash_8Vt2haq8NSQ.png", email: "sarah.j@email.com", orders: 12, totalSpent: "$520.00", frequency: "Monthly", lastPurchase: "2024-01-15", status: "Delivered" },
  { id: 2, name: "Michael Chen", avatar: "image 69.png", email: "m.chen@email.com", orders: 8, totalSpent: "$340.00", frequency: "Bi-monthly", lastPurchase: "2024-01-10", status: "Shipped" },
  { id: 3, name: "Emily Davis", avatar: "unsplash_8Vt2haq8NSQ.png", email: "emily.d@email.com", orders: 3, totalSpent: "$145.00", frequency: "Quarterly", lastPurchase: "2023-12-20", status: "Delivered" },
  { id: 4, name: "James Wilson", avatar: "image 69.png", email: "j.wilson@email.com", orders: 0, totalSpent: "$0.00", frequency: "—", lastPurchase: "2023-11-05", status: "Cancelled" },
  { id: 5, name: "Olivia Brown", avatar: "unsplash_8Vt2haq8NSQ.png", email: "o.brown@email.com", orders: 21, totalSpent: "$890.00", frequency: "Weekly", lastPurchase: "2024-01-18", status: "Delivered" },
  { id: 6, name: "Noah Martinez", avatar: "image 69.png", email: "n.martinez@email.com", orders: 5, totalSpent: "$210.00", frequency: "Monthly", lastPurchase: "2024-01-02", status: "Shipped" },
];

const customerOrders: Order[] = [
  { id: "#1023", date: "Oct 3, 2025", items: 3, payment: "Visa", total: "$89.00", status: "Delivered" },
  { id: "#1024", date: "Oct 3, 2025", items: 1, payment: "Cash", total: "$62.00", status: "Shipped" },
  { id: "#1025", date: "Oct 3, 2025", items: 4, payment: "Cash", total: "$62.00", status: "Shipped" },
  { id: "#1026", date: "Oct 3, 2025", items: 2, payment: "Cash", total: "$89.00", status: "Cancelled" },
  { id: "#1027", date: "Oct 3, 2025", items: 1, payment: "Visa", total: "$89.00", status: "Cancelled" },
  { id: "#1028", date: "Oct 3, 2025", items: 4, payment: "Visa", total: "$89.00", status: "Cancelled" },
];

function statusPill(status: CustomerStatus) {
  if (status === "Delivered") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Shipped") return { bg: "bg-sky-50", text: "text-sky-700" };
  return { bg: "bg-red-50", text: "text-red-600" };
}

function orderStatusPill(status: Order["status"]) {
  if (status === "Delivered") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (status === "Shipped") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

/* ─── Donut Chart ────────────────────────────────────────────────────────── */
function DonutChart() {
  const segments = [
    { label: "New", value: 30, color: "#BBFF63" },
    { label: "One-time", value: 25, color: "#FCD34D" },
    { label: "At-risk", value: 30, color: "#7DD3FC" },
    { label: "Other", value: 15, color: "#E5E7EB" },
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
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">1,234</text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#0D9488">8.5%</text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="7" fill="#6B7280">Total Customers</text>
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

/* ─── Overview Panel (Horizontal Bars) ──────────────────────────────────── */
function OverviewPanel() {
  const rows = [
    { label: "Returning", pct: 62, color: "#BBFF63" },
    { label: "New", pct: 38, color: "#7DD3FC" },
  ];
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-xs font-medium text-[#6B7280]">{row.label}</span>
            <span className="font-['Montserrat'] text-xs font-semibold text-[#111827]">{row.pct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
            <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
          </div>
        </div>
      ))}
      <div className="mt-1 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#F9FAFB] p-3">
          <p className="font-['Montserrat'] text-[10px] font-medium text-[#6B7280]">Returning Customers</p>
          <p className="mt-0.5 font-['Montserrat'] text-sm font-bold text-emerald-600">+8.5%</p>
          <p className="font-['Montserrat'] text-[10px] text-[#9CA3AF]">8% this month</p>
        </div>
        <div className="rounded-xl bg-[#F9FAFB] p-3">
          <p className="font-['Montserrat'] text-[10px] font-medium text-[#6B7280]">New Customers</p>
          <p className="mt-0.5 font-['Montserrat'] text-sm font-bold text-red-500">-3%</p>
          <p className="font-['Montserrat'] text-[10px] text-[#9CA3AF]">since last month</p>
        </div>
      </div>
      <p className="rounded-xl bg-[#F0FDF4] px-3 py-2 font-['Montserrat'] text-xs text-emerald-700">
        Returning customers increased by 8% vs last month.
      </p>
    </div>
  );
}

/* ─── Line Chart (Spending Over Time) ───────────────────────────────────── */
function LineChart() {
  const points = [32000, 25000, 36000, 30000, 38000, 34000, 33000, 37000, 31000, 39000];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const yLabels = ["40K", "30K", "20K", "10K", "0K"];
  const W = 520, H = 160, padL = 40, padR = 12, padT = 12, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = 40000;
  const coords = points.map((v, i) => ({
    x: padL + (i / (points.length - 1)) * chartW,
    y: padT + chartH - (v / maxVal) * chartH,
  }));
  const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${padT + chartH} L ${coords[0].x} ${padT + chartH} Z`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Grid lines + y-axis labels */}
      {yLabels.map((label, i) => {
        const y = padT + (i / (yLabels.length - 1)) * chartH;
        return (
          <g key={label}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#6B7280" fontFamily="Montserrat">{label}</text>
          </g>
        );
      })}
      <path d={areaD} fill="url(#spendGrad)" />
      <path d={pathD} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={6} fill="#fb923c" opacity="0.25" />
          <circle cx={c.x} cy={c.y} r={3} fill="#fb923c" stroke="white" strokeWidth="1.5" />
        </g>
      ))}
      {months.map((m, i) => (
        <text key={m} x={coords[i].x} y={H - 4} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="Montserrat">{m}</text>
      ))}
    </svg>
  );
}

/* ─── Customer Detail View ───────────────────────────────────────────────── */
function CustomerDetail({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const statCards = [
    { label: "Total Orders", value: "12", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
    { label: "Total Spent", value: "$520.00", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
    { label: "Avg. Order Value", value: "$43.30", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
    { label: "Avg. Purchase", value: "Every 10 days", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  ];

  const insights = [
    { label: "Favorite Categories", value: "StreetWear, Hoodies, Sneakers" },
    { label: "Active Hours", value: "Evenings (4-9PM)" },
    { label: "Average Time Between Orders", value: "9 days" },
    { label: "Purchase Trend", value: "Consistent Monthly Orders" },
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
      <div className="flex gap-4 overflow-x-auto pb-1">
        {statCards.map((card) => (
          <div key={card.label} className="relative flex-1 min-w-[220px] h-32 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <p className="font-['Montserrat'] text-base font-medium text-[#6B7280]">{card.label}</p>
              <p className="font-['Montserrat'] text-2xl font-semibold text-[#111827]">{card.value}</p>
            </div>
            <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#BBFF63]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1">
              <span className={`font-['Montserrat'] text-sm font-medium ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                {card.trendUp ? "+" : "-"}{card.trend}
              </span>
              <span className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Information */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Customer Information</h3>
        <div className="flex flex-col gap-4">
          {[
            { label: "Name", value: customer.name },
            { label: "Email", value: customer.email },
            { label: "Phone", value: "+20 1009084373" },
            { label: "Address", value: "12 El Tahrir St, Cairo" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <div className="h-6 w-6 shrink-0 rounded bg-[#F3F4F6]" />
              <span className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">{row.label} </span>
              <span className="font-['Montserrat'] text-base font-semibold text-[#111827]">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Chart + Behavior Insights */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Customer Spending Over Time</h3>
          <LineChart />
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-[#111827]">Behavior Insights</h3>
          <div className="flex flex-col gap-3">
            {insights.map((ins) => (
              <div key={ins.label} className="rounded-lg border border-[#E5E7EB] bg-[#F5F7FA] px-2 py-2 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]">
                <p className="font-['Montserrat'] text-sm font-semibold text-[#111827]">{ins.label}</p>
                <p className="mt-0.5 font-['Montserrat'] text-sm font-medium text-[#6B7280]">{ins.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="cursor-pointer font-['Montserrat'] text-xs font-medium text-[#6B7280] hover:underline">View All</span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
          <div className="flex items-center gap-4">
            <h3 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Order History</h3>
            <div className="flex items-center gap-2">
              {["Payment", "Delivery", "Date Range"].map((f) => (
                <button key={f} type="button" className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]">
                  {f}
                  <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <rect x="1.5" y="2.5" width="17" height="14" rx="1.5" stroke="#111827" strokeWidth="1.5" />
              <path d="M1.5 7h17" stroke="#111827" strokeWidth="1.5" />
            </svg>
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3">
                  <div className="h-5 w-5 rounded-md border border-[#BBFF63] bg-[#111827] flex items-center justify-center">
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="#BBFF63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </th>
                {["Order ID", "Date", "Items", "Payment", "Total", "Status", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-[#BBFF63] whitespace-nowrap">
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
                    <td className="px-4 py-3">
                      <div className={`h-5 w-5 rounded-md border ${idx === 1 ? "border-[#111827] bg-[#111827]" : "border-[#E5E7EB] bg-white"}`}>
                        {idx === 1 && (
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{order.id}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{order.date}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{order.items}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{order.payment}</td>
                    <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-[#111827]">{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="flex h-6 w-4 flex-col items-center justify-center gap-1">
                        <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
                        <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
                        <span className="h-0.5 w-0.5 rounded-full bg-[#6B7280]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
            <span className="font-['Inter'] text-sm font-medium text-[#111827]">6 per page</span>
            <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5">
            <span className="font-['Inter'] text-sm font-medium text-[#111827]">
              1-6 <span className="text-[#6B7280]">of {customerOrders.length}</span>
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
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TraderCustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
    <div className="space-y-4">
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
                    {(["Status", "Activity", "Spending", "Date Range"] as const).map((label) => (
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

                {/* Overview (Horizontal Bars) */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-['Montserrat'] text-base font-semibold text-[#111827]">Overview</h3>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 font-['Montserrat'] text-xs font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
                    >
                      This Week
                      <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                    </button>
                  </div>
                  <OverviewPanel />
                </div>
              </div>
            </>
          )}
    </div>
  );
}