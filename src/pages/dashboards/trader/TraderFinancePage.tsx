import { useState } from "react";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


// ─── Data ──────────────────────────────────────────────────────────────────

const topCards = [
  { label: "Total Revenue", value: "$148,200", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
  { label: "Net Revenue", value: "$122,350", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Total Payouts", value: "$36,900", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Refunds Total", value: "$1,100", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
];

const channelCards = [
  { label: "Retail Revenue", value: "$148,200", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
  { label: "Wholesale Revenue", value: "$122,350", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Dropship Revenue", value: "$36,900", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Brand Partners", value: "$1,100", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
];

const earningsRows = [
  { source: "Retail", revenue: "$78,500", pct: "53%", avgOrder: "$48.5", orders: "1,620", lastPurchase: "2 days ago", profit: "22%" },
  { source: "Wholesale", revenue: "$32,600", pct: "22%", avgOrder: "$48.5", orders: "1,620", lastPurchase: "1 month ago", profit: "22%" },
  { source: "Dropshipping", revenue: "$20,700", pct: "14%", avgOrder: "$48.5", orders: "1,620", lastPurchase: "Today", profit: "22%" },
  { source: "Brand Partners", revenue: "$16,300", pct: "11%", avgOrder: "$48.5", orders: "1,620", lastPurchase: "Today", profit: "22%" },
];

const refundRows = [
  { id: "#R1021", customer: "Sarah M.", amount: "$48.5", reason: "Wrong Size", status: "Approved" },
  { id: "#R1021", customer: "Sarah M.", amount: "$48.5", reason: "Damaged Item", status: "Pending" },
  { id: "#R1021", customer: "Sarah M.", amount: "$48.5", reason: "Damaged Item", status: "Rejected" },
  { id: "#R1021", customer: "Sarah M.", amount: "$48.5", reason: "Wrong Size", status: "Rejected" },
];

const payoutRows = [
  { id: "P-0112", amount: "$1,200", method: "Bank", date: "Oct 10", status: "Sent" },
  { id: "P-0112", amount: "$1,200", method: "Bank", date: "Oct 10", status: "Processing" },
  { id: "P-0112", amount: "$1,200", method: "Bank", date: "Oct 10", status: "Rejected" },
  { id: "P-0112", amount: "$1,200", method: "Bank", date: "Oct 10", status: "Rejected" },
];

const txnRows = [
  { id: "TXN-0912", type: "Sale", channel: "Retail", amount: "$85.00", fees: "$3.2", net: "$81.00", date: "Oct 3, 2025", method: "Bank", status: "Sent", positive: true },
  { id: "TXN-0912", type: "Refund", channel: "Wholesale", amount: "-$42.00", fees: "-", net: "$81.00", date: "Oct 3, 2025", method: "Bank", status: "Processing", positive: false },
  { id: "TXN-0912", type: "Commission", channel: "Wholesale", amount: "-$42.00", fees: "-", net: "$81.00", date: "Oct 3, 2025", method: "Bank", status: "Rejected", positive: false },
  { id: "TXN-0912", type: "Payout", channel: "All Channels", amount: "-$42.00", fees: "-", net: "$81.00", date: "Oct 3, 2025", method: "Bank", status: "Rejected", positive: false },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function pillStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "approved" || s === "sent") return { bg: "bg-emerald-50", text: "text-emerald-700" };
  if (s === "pending" || s === "processing") return { bg: "bg-amber-100", text: "text-amber-800" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function Pagination() {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5">
        <span className="font-['Inter'] text-sm font-medium text-foreground">6 per page</span>
        <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5">
        <span className="font-['Inter'] text-sm font-medium text-foreground">
          1-6 <span className="text-gray-text">of 14</span>
        </span>
        <span className="mx-1 h-5 border-l border-stroke" />
        <button type="button" className="flex h-5 w-5 rotate-180 items-center justify-center">
          <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Prev" />
        </button>
        <button type="button" className="flex h-5 w-5 items-center justify-center">
          <img className="h-3 w-2" src={asset("weui_arrow-filled.svg")} alt="Next" />
        </button>
      </div>
    </div>
  );
}

function ExportBtn() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
    >
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <rect x="1.5" y="2.5" width="17" height="14" rx="1.5" stroke="#111827" strokeWidth="1.5" />
        <path d="M1.5 7h17" stroke="#111827" strokeWidth="1.5" />
      </svg>
      Export
    </button>
  );
}

function ThreeDot() {
  return (
    <button type="button" className="flex h-4 w-4 flex-col items-center justify-center gap-0.5">
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
      <span className="h-0.5 w-0.5 rounded-full bg-gray-text" />
    </button>
  );
}

// ─── Charts ────────────────────────────────────────────────────────────────

function RevenueChannelChart() {
  const channels = [
    { label: "Retail", value: 78500 },
    { label: "Wholesales", value: 32600 },
    { label: "Dropship", value: 20700 },
    { label: "Brand Partners", value: 16300 },
  ];
  const max = 80000;
  const xLabels = ["0K", "10k", "20K", "30K", "40K", "50K", "60K", "70K", "80K"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-6">
        {channels.map((ch) => (
          <div key={ch.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right font-['Montserrat'] text-sm font-semibold text-foreground">
              {ch.label}
            </span>
            <div className="flex-1 h-4 rounded-[10px] bg-gray-light overflow-hidden">
              <div
                className="h-full rounded-[10px] bg-primary"
                style={{ width: `${(ch.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between pl-[7.5rem]">
        {xLabels.map((l) => (
          <span key={l} className="font-['Montserrat'] text-sm font-medium text-foreground">{l}</span>
        ))}
      </div>
    </div>
  );
}

function FinanceDonutChart() {
  const segments = [
    { label: "Retail", value: 35, color: "#A81324" },
    { label: "Wholesales", value: 25, color: "#FCD34D" },
    { label: "Dropship", value: 30, color: "#7DD3FC" },
    { label: "Brands", value: 10, color: "#C084FC" },
  ];
  const cx = 130, cy = 130, r = 110, innerR = 66;
  let startAngle = -Math.PI / 2;

  const paths = segments.map((seg) => {
    const angle = (seg.value / 100) * 2 * Math.PI;
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
    <div className="flex flex-col items-center gap-3">
      <svg width="260" height="260" viewBox="0 0 260 260">
        {paths.map((seg) => (
          <path key={seg.label} d={seg.d} fill={seg.color} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">1,234</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0D9488">↑ 8.5%</text>
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize="9" fill="#6B7280">Total Revenue</text>
      </svg>
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 px-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 shrink-0 rounded bg-primary" />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground">Retail 35%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 shrink-0 rounded bg-[#7DD3FC]" />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground">Dropship — 30%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 shrink-0 rounded bg-[#FCD34D]" />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground">Wholesales — 25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 shrink-0 rounded bg-[#C084FC]" />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground">Brands — 10%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Shared table header ────────────────────────────────────────────────────

function DarkTH({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-secondary">
        <th className="px-4 py-3">
          <div className="h-5 w-5 rounded-md border border-primary bg-secondary" />
        </th>
        {cols.map((col) => (
          <th key={col} className="px-4 py-3 text-left font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderFinancePage() {
  const [search, setSearch] = useState("");

  const rowBg = (idx: number) => (idx % 2 === 0 ? "bg-white" : "bg-background");

  const CheckBox = ({ checked }: { checked: boolean }) => (
    <td className="px-4 py-3">
      <div className={`h-5 w-5 rounded-md border ${checked ? "border-secondary bg-secondary" : "border-stroke bg-white"}`}>
        {checked && (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="M5 10.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </td>
  );

  return (
    <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-[280px] items-center">
              <img className="pointer-events-none absolute left-4 h-5 w-5" src={asset("mynaui_search.svg")} alt="" />
              <input
                type="text"
                placeholder="Search customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-stroke bg-white py-2.5 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none placeholder:text-gray-text focus:border-stroke"
              />
            </label>
            {["Date Range", "Compare"].map((f) => (
              <button key={f} type="button" className="flex h-11 items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background">
                {f}
                <img className="h-5 w-5 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
              </button>
            ))}
          </div>

          {/* Top stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topCards.map((card) => (
              <div key={card.label} className="relative h-32 rounded-2xl border border-stroke bg-card p-4 overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                <div className="flex flex-col gap-1">
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                    <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-xs font-semibold ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                    {card.trendUp ? "+" : "-"}{card.trend}
                  </span>
                  <span className="font-['Montserrat'] text-xs font-medium text-gray-text">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue by Channel + Donut */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-stroke bg-card p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-5 font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">Revenue by Sales Channel</h2>
              <RevenueChannelChart />
            </div>
            <div className="rounded-2xl border border-stroke bg-card p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">Order Status Distribution</h2>
              <FinanceDonutChart />
            </div>
          </div>

          {/* Earnings Break Down */}
          <div className="rounded-2xl border border-stroke bg-card shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke px-4 py-4">
              <h2 className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">Earnings Break Down</h2>
              <ExportBtn />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <DarkTH cols={["Source", "Revenue", "% of Total", "Avg Order Value", "Orders Count", "Last Purchase", "Profit", "Actions"]} />
                <tbody>
                  {earningsRows.map((row, idx) => (
                    <tr key={row.source} className={rowBg(idx)}>
                      <CheckBox checked={idx === 1} />
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.source}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.revenue}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.pct}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.avgOrder}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.orders}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.lastPurchase}</td>
                      <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.profit}</td>
                      <td className="px-4 py-3"><ThreeDot /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>

          {/* Channel revenue cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channelCards.map((card) => (
              <div key={card.label} className="relative h-32 rounded-2xl border border-stroke bg-card p-4 overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
                <div className="flex flex-col gap-1">
                  <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                  <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className={`font-['Montserrat'] text-xs font-semibold ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                    {card.trendUp ? "+" : "-"}{card.trend}
                  </span>
                  <span className="font-['Montserrat'] text-xs font-medium text-gray-text">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Refunds + Payouts side by side */}
          <div className="grid gap-4 lg:grid-cols-2">

            {/* Refunds Summary */}
            <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Refunds Summary</h2>
                <ExportBtn />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <DarkTH cols={["Refund ID", "Customer", "Amount", "Reason", "Status", "Actions"]} />
                  <tbody>
                    {refundRows.map((row, idx) => {
                      const pill = pillStyle(row.status);
                      return (
                        <tr key={idx} className={rowBg(idx)}>
                          <CheckBox checked={idx === 1} />
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.id}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.customer}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.amount}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.reason}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3"><ThreeDot /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>

            {/* Payouts Section */}
            <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Payouts Section</h2>
                <ExportBtn />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <DarkTH cols={["Payout ID", "Amount", "Method", "Date", "Status", "Actions"]} />
                  <tbody>
                    {payoutRows.map((row, idx) => {
                      const pill = pillStyle(row.status);
                      return (
                        <tr key={idx} className={rowBg(idx)}>
                          <CheckBox checked={idx === 1} />
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.id}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.amount}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.method}</td>
                          <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3"><ThreeDot /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
              <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Transaction History</h2>
              <ExportBtn />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <DarkTH cols={["Txn ID", "Type", "Channel", "Amount", "Fees", "Net", "Date", "Method", "Status", "Actions"]} />
                <tbody>
                  {txnRows.map((row, idx) => {
                    const pill = pillStyle(row.status);
                    return (
                      <tr key={idx} className={rowBg(idx)}>
                        <CheckBox checked={idx === 1} />
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.id}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.type}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.channel}</td>
                        <td className={`px-4 py-3 font-['Montserrat'] text-xs font-medium ${row.positive ? "text-teal-500" : "text-rose-500"}`}>{row.amount}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.fees}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.net}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.date}</td>
                        <td className="px-4 py-3 font-['Montserrat'] text-xs font-medium text-foreground">{row.method}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3"><ThreeDot /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>

    </div>
  );
}