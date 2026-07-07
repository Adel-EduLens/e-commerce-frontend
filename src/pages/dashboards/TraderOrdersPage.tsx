import { useState } from "react";

const asset = (file: string) =>
  `/trader-product/${file.split("/").map(encodeURIComponent).join("/")}`;


type OrderStatus = "Delivered" | "Shipped" | "Cancelled";

interface Order {
  id: number;
  orderId: string;
  customer: string;
  date: string;
  payment: string;
  total: string;
  status: OrderStatus;
}

interface OrderItem {
  id: number;
  image: string;
  product: string;
  quantity: number;
  price: string;
  subtotal: string;
}

const orders: Order[] = [
  { id: 1, orderId: "#1023", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Visa", total: "$89.00", status: "Delivered" },
  { id: 2, orderId: "#1024", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Cash", total: "$62.00", status: "Shipped" },
  { id: 3, orderId: "#1025", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Cash", total: "$62.00", status: "Shipped" },
  { id: 4, orderId: "#1026", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Cash", total: "$89.00", status: "Cancelled" },
  { id: 5, orderId: "#1027", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Visa", total: "$89.00", status: "Cancelled" },
  { id: 6, orderId: "#1028", customer: "Ahmed Hassan", date: "Oct 3, 2025", payment: "Visa", total: "$89.00", status: "Cancelled" },
];

const orderItems: OrderItem[] = [
  { id: 1, image: "image 69.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
  { id: 2, image: "unsplash_8Vt2haq8NSQ.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
  { id: 3, image: "image 69.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
  { id: 4, image: "unsplash_8Vt2haq8NSQ.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
  { id: 5, image: "image 69.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
  { id: 6, image: "unsplash_8Vt2haq8NSQ.png", product: "Hoodie – Black (M)", quantity: 1, price: "$49.99", subtotal: "$49.99" },
];

const timelineSteps = [
  { label: "New Order", time: "Oct 2, 10:00 AM", done: true },
  { label: "Confirmed", time: "Oct 2, 11:30 AM", done: true },
  { label: "Shipped", time: "Oct 3, 08:00 AM", done: true },
  { label: "Delivered", time: "Oct 3, 02:00 PM", done: true },
];

function statusPill(status: OrderStatus) {
  if (status === "Delivered") return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "outline-emerald-700" };
  if (status === "Shipped") return { bg: "bg-amber-100", text: "text-amber-800", ring: "outline-amber-700" };
  return { bg: "bg-red-100", text: "text-red-700", ring: "outline-red-700" };
}

/* ─── Order Detail View ──────────────────────────────────────────────────── */
function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const pill = statusPill(order.status);
  const [itemSelected, setItemSelected] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    setItemSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllItems = () => {
    setItemSelected((prev) =>
      prev.size === orderItems.length ? new Set() : new Set(orderItems.map((i) => i.id)),
    );
  };

  const allItemsSelected = itemSelected.size === orderItems.length;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Orders
      </button>

      {/* Three info cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Order Info */}
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <p className="font-['Montserrat'] text-base font-semibold text-foreground">
            Order ID: {order.orderId}
          </p>
          <p className="mt-0.5 font-['Montserrat'] text-xs font-medium text-gray-text">
            {order.date} — 10:24 AM
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">Status:</span>
              <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring}`}>
                {order.status}
              </span>
            </div>
            <p className="font-['Montserrat'] text-sm font-semibold text-gray-text">
              Delivery Type: <span className="text-foreground">Express</span>
            </p>
            <p className="font-['Montserrat'] text-sm font-semibold text-gray-text">
              Payment: Paid: <span className="text-foreground">({order.payment})</span>
            </p>
            <p className="font-['Montserrat'] text-sm font-semibold text-gray-text">
              Tracking ID: <span className="text-foreground">#TRK-547392</span>
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <p className="font-['Montserrat'] text-xl font-semibold text-foreground">Customer Information</p>
          <div className="mt-4 flex flex-col gap-3">
            {[
              { icon: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-3.31 0-6 1.34-6 3v1h12v-1c0-1.66-2.69-3-6-3z", label: "Name", value: order.customer },
              { icon: "M2 4h12v8H2zM2 4l6 5 6-5", label: "Email", value: `${order.customer.toLowerCase().replace(" ", "")}@gmail.com` },
              { icon: "M3 3h2l1 4-1.5 1.5a11 11 0 0 0 4 4L10 11l4 1v2a1 1 0 0 1-1 1A15 15 0 0 1 2 4a1 1 0 0 1 1-1z", label: "Phone", value: "+20 1009084373" },
              { icon: "M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z", label: "Address", value: "12 El Tahrir St, Cairo" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-text" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d={row.icon} />
                </svg>
                <div>
                  <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">{row.label} </span>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
          <p className="font-['Montserrat'] text-xl font-semibold text-foreground">Order Timeline</p>
          <div className="mt-4 flex flex-col gap-0">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${step.done ? "border-primary bg-primary" : "border-stroke bg-white"}`}>
                    {step.done && (
                      <svg className="h-3 w-3 text-foreground" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-0.5 flex-1 ${step.done ? "bg-primary" : "bg-stroke"}`} style={{ height: 28 }} />
                  )}
                </div>
                <div className="pb-4">
                  <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">{step.label} </span>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground">— {step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Ordered Items</h3>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
          >
            <img className="h-5 w-5" src={asset("download-cloud-02.svg")} alt="" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3">
                  <div
                    className="h-5 w-5 cursor-pointer rounded-md border border-primary bg-secondary flex items-center justify-center"
                    onClick={toggleAllItems}
                  >
                    {allItemsSelected && (
                      <svg className="h-3 w-3 text-primary" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </th>
                {["Image", "Product", "Quantity", "Price", "Subtotal", "Actions"].map((col) => (
                  <th key={col} className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => {
                const isChecked = itemSelected.has(item.id);
                return (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-background"}>
                    <td className="px-4 py-3">
                      <div
                        className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                          isChecked ? "border-secondary bg-secondary" : "border-gray-300 bg-white"
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {isChecked && (
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <img
                        className="mx-auto h-7 w-7 rounded-lg object-cover"
                        src={asset(item.image)}
                        alt={item.product}
                      />
                    </td>
                    <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                      #{item.product}
                    </td>
                    <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                      {item.price}
                    </td>
                    <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                      {item.subtotal}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        className="flex mx-auto h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                        title="More actions"
                      >
                        <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.2" />
                          <circle cx="8" cy="8" r="1.2" />
                          <circle cx="8" cy="13" r="1.2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary totals */}
        <div className="flex flex-col gap-1.5 border-t border-stroke px-5 py-4">
          <p className="font-['Montserrat'] text-xs font-semibold">
            <span className="text-gray-text">Subtotal: </span>
            <span className="text-foreground">$89.97</span>
          </p>
          <p className="font-['Montserrat'] text-xs font-semibold">
            <span className="text-gray-text">Shipping: </span>
            <span className="text-foreground">$5.00</span>
          </p>
          <p className="font-['Montserrat'] text-xs font-semibold">
            <span className="text-gray-text">Total: </span>
            <span className="text-foreground">$94.97</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TraderOrdersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === orders.length ? new Set() : new Set(orders.map((o) => o.id)),
    );
  };

  const allSelected = selected.size === orders.length;

  const filtered = orders.filter(
    (o) =>
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()),
  );

  const summaryCards = [
    { label: "Total Orders", value: "1,234 Orders", delta: "8.5%", note: "Down from yesterday", up: false },
    { label: "Active", value: "118", delta: "8.5%", note: "Up from yesterday", up: true },
    { label: "Delivered", value: "176", delta: "8.5%", note: "Up from yesterday", up: true },
    { label: "Returned", value: "30", delta: "8.5%", note: "Up from yesterday", up: true },
  ];

  return (
    <>
        <div className="space-y-4">
          {selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
            />
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-stroke bg-white p-4 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="font-['Montserrat'] text-sm font-medium text-gray-text">{card.label}</p>
                        <p className="font-['Montserrat'] text-2xl font-semibold text-foreground">{card.value}</p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                        <img className="h-6 w-6" src={asset("carbon_follow-up-work-order.svg")} alt="" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <span className={`font-['Montserrat'] text-sm font-medium ${card.up ? "text-teal-500" : "text-rose-500"}`}>
                        {card.delta}
                      </span>
                      <span className="font-['Montserrat'] text-sm font-medium text-gray-text"> {card.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search + Add Order */}
              <div className="flex flex-wrap items-center justify-start gap-3">
                <label className="relative flex min-w-[280px] items-center">
                  <img
                    className="pointer-events-none absolute left-4 h-5 w-5"
                    src={asset("mynaui_search.svg")}
                    alt=""
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-stroke bg-white py-3 pl-12 pr-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-stroke"
                  />
                </label>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-3 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
                >
                  <img className="h-5 w-5" src={asset("ic_round-plus.svg")} alt="" />
                  Add Order
                </button>
              </div>

              {/* Orders Table Panel */}
              <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
                {/* Panel header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Products Table</h2>
                    <div className="flex items-center gap-2">
                      {(["Payment", "Delivery", "Date Range"] as const).map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-2 py-1.5 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background"
                        >
                          {label}
                          <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
                  >
                    <img className="h-5 w-5" src={asset("download-cloud-02.svg")} alt="" />
                    Export
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-3">
                          <div
                            className="h-5 w-5 cursor-pointer rounded-md border border-primary bg-secondary flex items-center justify-center"
                            onClick={toggleAll}
                          >
                            {allSelected && (
                              <svg className="h-3 w-3 text-primary" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </th>
                        {["Order ID", "Customer Name", "Date", "Payment", "Total", "Status", "Actions"].map((col) => (
                          <th
                            key={col}
                            className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-primary whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((order, idx) => {
                        const isChecked = selected.has(order.id);
                        const pill = statusPill(order.status);
                        return (
                          <tr
                            key={order.id}
                            className={`cursor-pointer transition hover:bg-background ${idx % 2 === 0 ? "bg-white" : "bg-background"}`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <div
                                className={`h-5 w-5 cursor-pointer rounded-md border flex items-center justify-center transition ${
                                  isChecked ? "border-secondary bg-secondary" : "border-gray-300 bg-white"
                                }`}
                                onClick={() => toggleRow(order.id)}
                              >
                                {isChecked && (
                                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                              {order.orderId}
                            </td>
                            <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                              {order.customer}
                            </td>
                            <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                              {order.date}
                            </td>
                            <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                              {order.payment}
                            </td>
                            <td className="px-3 py-3 text-center font-['Montserrat'] text-xs font-medium text-foreground">
                              {order.total}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className={`inline-flex rounded-2xl px-2 py-1 text-xs font-medium font-['Montserrat'] ${pill.bg} ${pill.text}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="flex mx-auto h-7 w-7 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-background"
                                title="More actions"
                              >
                                <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="currentColor">
                                  <circle cx="8" cy="3" r="1.2" />
                                  <circle cx="8" cy="8" r="1.2" />
                                  <circle cx="8" cy="13" r="1.2" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 border-t border-stroke px-4 py-3">
                  <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
                    <span className="font-['Inter'] text-sm font-medium text-foreground">6 per page</span>
                    <img className="h-4 w-4 rotate-90" src={asset("weui_arrow-outlined.svg")} alt="" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-white px-4 py-2.5">
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
              </section>
            </>
          )}
        </div>
    </>
  );
}