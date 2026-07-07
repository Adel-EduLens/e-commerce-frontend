const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


// ─── Data ──────────────────────────────────────────────────────────────────

const statsCards = [
  { label: "Total Orders", value: "12", trend: "8.5%", trendUp: false, sub: "Down from yesterday" },
  { label: "Total Revenue", value: "$87,250", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Total Commission", value: "$2,450", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
  { label: "Avg. Order Value", value: "$43.30", trend: "8.5%", trendUp: true, sub: "Up from yesterday" },
];

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
];

const orderStatus = [
  { label: "New", share: 35, color: "#BBFF63" },
  { label: "Confirmed", share: 25, color: "#FCD34D" },
  { label: "Shipped", share: 30, color: "#7DD3FC" },
  { label: "Delivered", share: 10, color: "#C084FC" },
];

const withdrawRequests = [
  { orderId: "#ORD-1024", amount: "EGP 450", partner: "AliDesign", date: "Oct 4, 10:32 AM" },
  { orderId: "#ORD-1025", amount: "EGP 320", partner: "AliDesign", date: "Oct 4, 10:32 AM" },
  { orderId: "#ORD-1026", amount: "EGP 610", partner: "AliDesign", date: "Oct 4, 10:32 AM" },
];

const partnerRatings = [
  { name: "Ahmed R.", rating: "4.7", review: "Loved the packaging and the product quality was great.", date: "Oct 4, 10:32 AM" },
  { name: "Ahmed R.", rating: "4.7", review: "Loved the packaging and the product quality was great.", date: "Oct 4, 10:32 AM" },
  { name: "Ahmed R.", rating: "4.7", review: "Loved the packaging and the product quality was great.", date: "Oct 4, 10:32 AM" },
];

const topProducts = [
  { name: "Basic Sweatpants", revenue: "$7,350", units: "245 Units", unitPrice: "$30" },
  { name: "Vintage Utility Cap", revenue: "$5,490", units: "183 Units", unitPrice: "$30" },
  { name: "Softshell Overshirt", revenue: "$4,860", units: "108 Units", unitPrice: "$45" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
        {action && <button className="text-xs font-medium text-gray-text hover:text-foreground">{action}</button>}
      </div>
      {children}
    </section>
  );
}

// ─── Charts ────────────────────────────────────────────────────────────────

function EarningsChart() {
  const max = 40;
  const svgW = 700;
  const svgH = 220;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const xStep = chartW / (revenueSeries.length - 1);

  const points = revenueSeries.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + chartH - (d.value / max) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  const yLabels = ["40K", "30K", "20K", "10K", "0K"];

  return (
    <div className="w-full overflow-x-auto">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="min-w-[500px]">
        <defs>
          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis labels + grid lines */}
        {yLabels.map((label, i) => {
          const y = padT + (i / (yLabels.length - 1)) * chartH;
          return (
            <g key={label}>
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#6B7280" fontFamily="Montserrat">
                {label}
              </text>
              <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#orangeGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#FFAE4C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8" fill="#FFAE4C" opacity="0.25" />
            <circle cx={p.x} cy={p.y} r="4" fill="#FFAE4C" stroke="white" strokeWidth="2" />
          </g>
        ))}

        {/* X-axis labels */}
        {revenueSeries.map((d, i) => (
          <text
            key={d.month}
            x={padL + i * xStep}
            y={svgH - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#6B7280"
            fontFamily="Montserrat"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

function OrdersDonutChart() {
  let startAngle = -90;
  const cx = 112;
  const cy = 112;
  const r = 90;
  const innerR = 58;

  const segments = orderStatus.map((seg) => {
    const angle = (seg.share / 100) * 360;
    const start = startAngle;
    startAngle += angle;
    const end = startAngle;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const xi1 = cx + innerR * Math.cos(startRad);
    const yi1 = cy + innerR * Math.sin(startRad);
    const xi2 = cx + innerR * Math.cos(endRad);
    const yi2 = cy + innerR * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
    return { ...seg, d };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-56 w-56">
        <svg width="224" height="224" viewBox="0 0 224 224">
          {segments.map((seg) => (
            <path key={seg.label} d={seg.d} fill={seg.color} />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">
            1,234
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0D9488">
            ↑ 8.5%
          </text>
          <text x={cx} y={cy + 24} textAnchor="middle" fontSize="9" fill="#6B7280">
            Total Orders
          </text>
        </svg>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 px-2">
        {orderStatus.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: seg.color }} />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
              {seg.label} — {seg.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TraderDropshippingPage() {
  return (
    <>
        <div className="space-y-5">

          {/* Stats cards row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[24px] border border-stroke bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                    <p className="font-['Montserrat'] text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#111827" strokeWidth="1.5" />
                      <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {card.trendUp ? (
                    <svg className="h-4 w-4 text-teal-500" viewBox="0 0 16 16" fill="none">
                      <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-rose-500" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v8M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className={`font-['Montserrat'] text-sm font-medium ${card.trendUp ? "text-teal-500" : "text-rose-500"}`}>
                    {card.trend}
                  </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Basic Information */}
          <div className="rounded-[24px] border border-stroke bg-white p-5 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
            <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Left column */}
              <div className="flex flex-col gap-3">
                {[
                  { label: "Partner Name", value: "Ahmed Hassan" },
                  { label: "Email", value: "AhmedHassan@gmail.com" },
                  { label: "Phone", value: "+20 1009084373" },
                  { label: "Address", value: "12 El Tahrir St, Cairo" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="h-5 w-5 shrink-0 rounded bg-stroke" />
                    <span className="w-32 shrink-0 font-['Montserrat'] text-sm font-medium text-gray-text">{row.label}</span>
                    <span className="font-['Montserrat'] text-sm font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-3">
                {[
                  { label: "Company", value: "AliDesign" },
                  { label: "Country", value: "Egypt" },
                  { label: "Preferred Payment", value: "Bank Transfer" },
                  { label: "Commission", value: "15%" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="h-5 w-5 shrink-0 rounded bg-stroke" />
                    <span className="w-32 shrink-0 font-['Montserrat'] text-sm font-medium text-gray-text">{row.label}</span>
                    <span className="font-['Montserrat'] text-sm font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Charts row */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_340px]">

            {/* Earnings Over Time */}
            <div className="rounded-[24px] border border-stroke bg-white p-5 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Earnings Over Time</h2>
              <EarningsChart />
            </div>

            {/* Orders by Status */}
            <div className="rounded-[24px] border border-stroke bg-white p-5 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">Orders by Status</h2>
              <OrdersDonutChart />
            </div>
          </div>

          {/* 5. Bottom panels row */}
          <div className="grid gap-5 xl:grid-cols-3">

            {/* Panel 1: Withdraw Requests */}
            <Panel title="Withdraw Requests" action="View All">
              <div className="flex flex-col gap-3">
                {withdrawRequests.map((req, idx) => (
                  <div key={idx} className="rounded-xl border border-stroke bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                          <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </div>
                        <span className="font-['Montserrat'] text-xs font-semibold text-foreground">Order ID: {req.orderId}</span>
                      </div>
                      <span className="font-['Montserrat'] text-xs font-bold text-foreground">{req.amount}</span>
                    </div>
                    <p className="mt-1.5 font-['Montserrat'] text-xs text-gray-text">Partner: {req.partner}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="font-['Montserrat'] text-xs text-gray-text">{req.date}</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded-2xl bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Approve</button>
                        <button className="rounded-2xl bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Panel 2: Partner Rating */}
            <Panel title="Partner Rating" action="View All">
              <div className="flex flex-col gap-3">
                {partnerRatings.map((review, idx) => (
                  <div key={idx} className="rounded-xl border border-stroke bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                          <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 14 14" fill="currentColor">
                          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.435.59 3.433L7 9l-3.09 1.625.59-3.433L2 4.632l3.455-.502z" />
                        </svg>
                        <span className="font-['Montserrat'] text-xs font-semibold text-foreground">{review.rating}</span>
                      </div>
                    </div>
                    <p className="mt-2 font-['Montserrat'] text-xs text-gray-text">{review.review}</p>
                    <p className="mt-2 font-['Montserrat'] text-xs text-gray-text">{review.date}</p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Panel 3: Top-Selling Products */}
            <Panel title="Top-Selling Products" action="View All">
              <div className="flex flex-col gap-3">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-stroke bg-background p-3">
                    <img
                      src="https://placehold.co/48x48"
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-['Montserrat'] text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="font-['Montserrat'] text-xs font-bold text-foreground">{product.revenue}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-['Montserrat'] text-xs text-gray-text">{product.units}</span>
                        <span className="font-['Montserrat'] text-xs text-gray-text">·</span>
                        <span className="font-['Montserrat'] text-xs text-gray-text">{product.unitPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

          </div>

        </div>
    </>
  );
}