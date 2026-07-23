import { useState, useMemo } from "react";
import { useTraderCustomers, useTraderDashboardOrders, type TraderCustomer } from "../../../hooks/queries/ordersQuery";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;

function statusPill(status: string) {
  const s = status?.toUpperCase();
  if (s === "COMPLETED" || s === "DELIVERED")
    return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Completed" };
  if (s === "SHIPPED")
    return { bg: "bg-sky-50", text: "text-sky-700", label: "Shipped" };
  if (s === "PROCESSING")
    return { bg: "bg-sky-50", text: "text-sky-700", label: "Processing" };
  if (s === "CANCELLED")
    return { bg: "bg-red-50", text: "text-red-600", label: "Cancelled" };
  return { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" };
}

function DonutChart({ total, completed, cancelled, pending }: {
  total: number; completed: number; cancelled: number; pending: number;
}) {
  const rawSegs = [
    { label: "Completed", value: completed, color: "#A81324" },
    { label: "Pending/Shipped", value: pending, color: "#FCD34D" },
    { label: "Cancelled", value: cancelled, color: "#7DD3FC" },
  ];
  const other = Math.max(0, total - completed - cancelled - pending);
  if (other > 0) rawSegs.push({ label: "Other", value: other, color: "#E5E7EB" });
  const segments = rawSegs.filter((s) => s.value > 0);
  const isNoData = segments.length === 0;
  if (isNoData) segments.push({ label: "No data", value: 1, color: "#E5E7EB" });

  const sum = segments.reduce((s, x) => s + x.value, 0);
  const cx = 70, cy = 70, r = 50, innerR = 28;
  let startAngle = -Math.PI / 2;

  const paths = segments.map((seg) => {
    const rawAngle = (seg.value / sum) * 2 * Math.PI;
    const angle = Math.min(rawAngle, 2 * Math.PI - 0.0001);
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle), yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle), yi2 = cy + innerR * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return { ...seg, d };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {paths.map((seg) => <path key={seg.label} d={seg.d} fill={seg.color} />)}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="7" fill="#6B7280">Total Customers</text>
      </svg>
      <div className="flex flex-col gap-2">
        {isNoData ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full shrink-0 border border-gray-300 bg-[#E5E7EB]" />
            <span className="font-['Montserrat'] text-xs text-gray-text">No data</span>
          </div>
        ) : (
          segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: seg.color, border: seg.color === "#E5E7EB" ? "1px solid #D1D5DB" : undefined }} />
              <span className="font-['Montserrat'] text-xs text-gray-text">{seg.label}</span>
              <span className="ml-auto font-['Montserrat'] text-xs font-semibold text-foreground">
                {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CustomerDetail({ customer, onBack }: { customer: TraderCustomer; onBack: () => void }) {
  const { data: allOrders = [], isLoading } = useTraderDashboardOrders({ type: "ALL" });
  const customerOrders = useMemo(
    () => allOrders.filter((o) => o.customerEmail === customer.email),
    [allOrders, customer.email]
  );
  const totalSpentNum = customerOrders.reduce((sum, o) => {
    const t = typeof o.total === "string" ? parseFloat(o.total.replace(/[^\d.]/g, "")) : Number(o.total);
    return sum + (isNaN(t) ? 0 : t);
  }, 0);
  const avgOrder = customerOrders.length > 0 ? totalSpentNum / customerOrders.length : 0;

  const statCards = [
    { label: "Total Orders", value: String(customerOrders.length) },
    { label: "Total Spent", value: customer.totalSpent },
    { label: "Avg. Order Value", value: customerOrders.length > 0 ? `EGP ${avgOrder.toFixed(2)}` : "—" },
    { label: "Last Purchase", value: customer.lastPurchase },
  ];

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Customers
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
            <p className="mt-1 font-['Montserrat'] text-xl font-semibold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <h3 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Customer Information</h3>
        <div className="flex flex-col gap-4">
          {[{ label: "Name", value: customer.name }, { label: "Email", value: customer.email }, { label: "Phone", value: customer.phone || "—" }].map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <div className="h-6 w-6 shrink-0 rounded bg-gray-light" />
              <span className="font-['Montserrat'] text-base font-semibold text-gray-text">{row.label} </span>
              <span className="font-['Montserrat'] text-base font-semibold text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
          <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Order History</h3>
          <span className="font-['Montserrat'] text-sm text-gray-text">{customerOrders.length} orders</span>
        </div>
        {isLoading ? (
          <LoadingSpinner containerClassName="py-12" />
        ) : customerOrders.length === 0 ? (
          <div className="py-12 text-center font-['Montserrat'] text-sm text-gray-text">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-secondary">
                  {["Order ID", "Date", "Items", "Payment", "Total", "Status"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customerOrders.map((order, idx) => {
                  const pill = statusPill(order.status);
                  return (
                    <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-background"}>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{order.orderId}</span>
                          {order.orderType === "WHOLESALE" && (
                            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                              Wholesale
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{order.date}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{order.items.length}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{order.payment || "—"}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{order.total}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>{pill.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function TraderCustomersPage() {
  const { data: customers = [], isLoading } = useTraderCustomers();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<TraderCustomer | null>(null);

  const filtered = useMemo(
    () => customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [customers, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
  const totalSpentAll = customers.reduce((s, c) => {
    const v = parseFloat(c.totalSpent.replace(/[^\d.]/g, ""));
    return s + (isNaN(v) ? 0 : v);
  }, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpentAll / totalOrders : 0;

  const completedCount = customers.filter((c) => ["COMPLETED", "DELIVERED"].includes(c.status?.toUpperCase())).length;
  const cancelledCount = customers.filter((c) => c.status?.toUpperCase() === "CANCELLED").length;
  const pendingCount = customers.filter((c) => ["PENDING", "PROCESSING", "SHIPPED"].includes(c.status?.toUpperCase())).length;

  const summaryCards = [
    { label: "Total Customers", value: String(customers.length) },
    { label: "Total Orders", value: String(totalOrders) },
    { label: "Total Revenue", value: `EGP ${totalSpentAll.toFixed(2)}` },
    { label: "Avg. Order Value", value: totalOrders > 0 ? `EGP ${avgOrderValue.toFixed(2)}` : "—" },
  ];

  if (selectedCustomer) {
    return <CustomerDetail customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-stroke bg-card p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <p className="font-['Montserrat'] text-xs font-medium text-gray-text">{card.label}</p>
            <p className="mt-1 font-['Montserrat'] text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex w-full sm:w-auto sm:min-w-[280px] flex-1 items-center">
          <img className="pointer-events-none absolute left-4 h-5 w-5" src={asset("mynaui_search.svg")} alt="" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-2xl border border-stroke bg-card py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-primary"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke">
          <h2 className="font-['Montserrat'] text-base font-semibold text-foreground">Customer Activity</h2>
          <span className="font-['Montserrat'] text-xs text-gray-text">{filtered.length} customers</span>
        </div>

        {isLoading ? (
          <LoadingSpinner containerClassName="py-16" />
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center font-['Montserrat'] text-sm text-gray-text">
            {search ? "No customers match your search." : "No customers yet. Orders will appear here once placed."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-secondary">
                    {["Customer Name", "Email", "Phone", "Orders", "Total Spent", "Last Purchase", "Status"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((customer, idx) => {
                    const pill = statusPill(customer.status);
                    return (
                      <tr
                        key={customer.email}
                        className={`cursor-pointer transition hover:bg-background ${idx % 2 === 0 ? "bg-white" : "bg-background"}`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="font-['Montserrat'] text-xs font-bold text-primary">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-['Montserrat'] text-xs font-semibold text-foreground whitespace-nowrap">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs text-gray-text">{customer.email}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs text-gray-text">{customer.phone || "—"}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{customer.orders}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-semibold text-foreground">{customer.totalSpent}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs text-gray-text">{customer.lastPurchase}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>{pill.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
              <span className="font-['Montserrat'] text-sm text-gray-text">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white transition hover:bg-background disabled:opacity-40">
                <img className="h-3 w-2 rotate-180" src={asset("weui_arrow-filled.svg")} alt="Prev" />
              </button>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white transition hover:bg-background disabled:opacity-40">
                <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Next" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-foreground">Customers by Last Order Status</h3>
          <DonutChart total={customers.length} completed={completedCount} cancelled={cancelledCount} pending={pendingCount} />
        </div>

        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <h3 className="mb-4 font-['Montserrat'] text-base font-semibold text-foreground">Top Spenders</h3>
          {isLoading ? (
            <LoadingSpinner containerClassName="py-8" />
          ) : (
            <div className="flex flex-col gap-3">
              {[...customers]
                .sort((a, b) => parseFloat(b.totalSpent.replace(/[^\d.]/g, "")) - parseFloat(a.totalSpent.replace(/[^\d.]/g, "")))
                .slice(0, 5)
                .map((c, i) => (
                  <div key={c.email} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-['Montserrat'] text-xs font-bold text-primary">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-['Montserrat'] text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="truncate font-['Montserrat'] text-xs text-gray-text">{c.email}</p>
                    </div>
                    <span className="font-['Montserrat'] text-sm font-bold text-primary shrink-0">{c.totalSpent}</span>
                  </div>
                ))}
              {customers.length === 0 && <p className="text-center font-['Montserrat'] text-sm text-gray-text">No data yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
