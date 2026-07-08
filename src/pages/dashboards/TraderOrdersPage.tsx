import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Calendar, User, Mail, Phone, MapPin, CreditCard, ShoppingBag } from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  product: string;
  quantity: number;
  price: string;
  subtotal: string;
  size: string | null;
  color: string | null;
  image: string;
}

interface Order {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  mapAddress: string | null;
  latitude: string | null;
  longitude: string | null;
  date: string;
  time: string;
  payment: string;
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  status: string;
  items: OrderItem[];
}

function statusPill(status: string) {
  const norm = status.toUpperCase();
  if (norm === "COMPLETED" || norm === "DELIVERED") {
    return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "outline-emerald-700" };
  }
  if (norm === "SHIPPED") {
    return { bg: "bg-blue-50", text: "text-blue-700", ring: "outline-blue-700" };
  }
  if (norm === "PROCESSING") {
    return { bg: "bg-amber-50", text: "text-amber-700", ring: "outline-amber-700" };
  }
  if (norm === "PENDING") {
    return { bg: "bg-purple-50", text: "text-purple-700", ring: "outline-purple-700" };
  }
  return { bg: "bg-rose-50", text: "text-rose-700", ring: "outline-rose-700" };
}

function getTimelineSteps(status: string, dateStr: string, timeStr: string) {
  const s = status.toUpperCase();
  const baseTime = `${dateStr} ${timeStr}`;
  return [
    { label: "Order Placed", time: baseTime, done: true },
    { label: "Processing", time: s === "PROCESSING" || s === "SHIPPED" || s === "COMPLETED" ? "In progress" : "Pending", done: s === "PROCESSING" || s === "SHIPPED" || s === "COMPLETED" },
    { label: "Shipped", time: s === "SHIPPED" || s === "COMPLETED" ? "Shipped" : "Pending", done: s === "SHIPPED" || s === "COMPLETED" },
    { label: "Delivered", time: s === "COMPLETED" ? "Delivered" : "Pending", done: s === "COMPLETED" },
  ];
}

/* ─── Order Detail View ──────────────────────────────────────────────────── */
interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

function OrderDetail({ order, onBack, onUpdateStatus }: OrderDetailProps) {
  const pill = statusPill(order.status);
  const [itemSelected, setItemSelected] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);

  const toggleItem = (id: string) => {
    setItemSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllItems = () => {
    setItemSelected((prev) =>
      prev.size === order.items.length ? new Set() : new Set(order.items.map((i) => i.id)),
    );
  };

  const allItemsSelected = itemSelected.size === order.items.length && order.items.length > 0;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, e.target.value);
    } finally {
      setUpdating(false);
    }
  };

  const timelineSteps = getTimelineSteps(order.status, order.date, order.time);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </button>

      {/* Three info cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
            Order Details
          </h3>
          <div className="flex flex-col gap-3 font-['Montserrat'] text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">Order ID:</span>
              <span className="font-bold text-foreground">{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">Date & Time:</span>
              <span className="font-semibold text-foreground">{order.date} — {order.time}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">Status:</span>
              <div className="flex items-center gap-2">
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                ) : (
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    className={`inline-flex rounded-xl px-2 py-1 text-xs font-semibold font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring} bg-white cursor-pointer focus:outline-none`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">Payment Type:</span>
              <span className="font-semibold text-foreground">{order.payment}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">Customer Information</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: <User className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: "Name", value: order.customer },
              { icon: <Mail className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: "Email", value: order.customerEmail },
              { icon: <Phone className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: "Phone", value: order.customerPhone },
              { icon: <MapPin className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: "Address", value: order.address },
            ].map((row, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                {row.icon}
                <div className="min-w-0">
                  <span className="font-['Montserrat'] text-xs font-semibold text-gray-text block">{row.label}</span>
                  <span className="font-['Montserrat'] text-sm font-semibold text-foreground break-words">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">Order Timeline</h3>
          <div className="flex flex-col gap-0">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${step.done ? "border-secondary bg-secondary text-secondary-foreground" : "border-stroke bg-white"}`}>
                    {step.done && (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-0.5 ${step.done ? "bg-secondary" : "bg-stroke"}`} style={{ height: 28 }} />
                  )}
                </div>
                <div className="pb-4">
                  <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">{step.label} </span>
                  <span className="font-['Montserrat'] text-sm font-medium text-foreground block text-xs">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="rounded-2xl border border-stroke bg-white shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">Ordered Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-zinc-50 border-b border-stroke">
                <th className="px-5 py-3.5 text-left w-12">
                  <div
                    className="h-5 w-5 cursor-pointer rounded border border-stroke bg-white flex items-center justify-center"
                    onClick={toggleAllItems}
                  >
                    {allItemsSelected && (
                      <div className="h-3.5 w-3.5 bg-secondary rounded-sm flex items-center justify-center text-secondary-foreground">
                        ✓
                      </div>
                    )}
                  </div>
                </th>
                {["Image", "Product Details", "Quantity", "Price", "Subtotal"].map((col) => (
                  <th key={col} className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-gray-text uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const isChecked = itemSelected.has(item.id);
                return (
                  <tr key={item.id} className={`transition hover:bg-zinc-50/50 ${idx % 2 === 0 ? "bg-white" : "bg-zinc-50/30"}`}>
                    <td className="px-5 py-4">
                      <div
                        className={`h-5 w-5 cursor-pointer rounded border flex items-center justify-center transition ${
                          isChecked ? "border-secondary bg-secondary text-secondary-foreground" : "border-stroke bg-white"
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {isChecked && <span className="text-[10px]">✓</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 border border-stroke overflow-hidden flex items-center justify-center mx-auto">
                        {item.image ? (
                          <img
                            className="h-full w-full object-cover"
                            src={item.image}
                            alt={item.product}
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-['Montserrat'] text-sm font-bold text-foreground">
                        {item.product}
                      </div>
                      <div className="flex justify-center gap-2 mt-1">
                        {item.size && (
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-600 rounded border border-stroke">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-100 text-zinc-600 rounded border border-stroke">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
                      {item.price}
                    </td>
                    <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground">
                      {item.subtotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary totals */}
        <div className="flex flex-col items-end gap-2 border-t border-stroke px-6 py-5 bg-zinc-50/50">
          <div className="w-64 space-y-2 font-['Montserrat'] text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-gray-text">Trader Subtotal:</span>
              <span className="text-foreground font-bold">{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-text">Total Shipping:</span>
              <span className="text-foreground">{order.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-text">Total Discount:</span>
              <span className="text-foreground">{order.discount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-stroke text-foreground">
              <span>Order Grand Total:</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TraderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/trader");
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch trader orders:", err);
      toast.error("Could not fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/trader/${orderId}/status`, { status });
      toast.success("Order status updated successfully!");
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Could not update order status.");
    }
  };

  const toggleRow = (id: string) => {
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

  const allSelected = selected.size === orders.length && orders.length > 0;

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || o.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesPayment = !paymentFilter || o.payment.toLowerCase() === paymentFilter.toLowerCase();

    let matchesDate = true;
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const orderDate = new Date(o.date);
      matchesDate =
        orderDate.getFullYear() === filterDate.getFullYear() &&
        orderDate.getMonth() === filterDate.getMonth() &&
        orderDate.getDate() === filterDate.getDate();
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalOrdersCount = orders.length;
  const activeCount = orders.filter(o => ["PENDING", "PROCESSING", "SHIPPED"].includes(o.status.toUpperCase())).length;
  const completedCount = orders.filter(o => ["COMPLETED", "DELIVERED"].includes(o.status.toUpperCase())).length;
  const cancelledCount = orders.filter(o => o.status.toUpperCase() === "CANCELLED").length;

  const summaryCards = [
    { label: "Total Orders", value: `${totalOrdersCount} Orders`, note: "All time received", up: true },
    { label: "Active Orders", value: String(activeCount), note: "Pending/Processing/Shipped", up: true },
    { label: "Completed Orders", value: String(completedCount), note: "Delivered to clients", up: true },
    { label: "Cancelled Orders", value: String(cancelledCount), note: "Cancelled/Returned", up: false },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-['Montserrat'] text-xs font-semibold text-gray-text uppercase tracking-wider">{card.label}</p>
                    <p className="font-['Montserrat'] text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-stroke text-secondary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="font-['Montserrat'] text-xs font-medium text-gray-text"> {card.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-start gap-4 bg-white p-5 rounded-2xl border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-text" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5L14 14" />
              </svg>
              <input
                type="text"
                placeholder="Search by ID, customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-zinc-50 py-2.5 pl-12 pr-4 font-['Montserrat'] text-sm font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-zinc-50 px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground outline-none transition cursor-pointer focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-zinc-50 px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground outline-none transition cursor-pointer focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary"
              >
                <option value="">All Payments</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative min-w-[160px]">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-zinc-50 px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground outline-none transition cursor-pointer focus:border-secondary focus:bg-white focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Reset Button */}
            {(search || statusFilter || paymentFilter || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setPaymentFilter("");
                  setDateFilter("");
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-['Montserrat'] text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Orders Table Panel */}
          <section className="rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] overflow-hidden">
            {/* Panel header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-stroke">
              <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">Orders History Table</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-zinc-50 border-b border-stroke">
                    <th className="px-5 py-3.5 text-left w-12">
                      <div
                        className="h-5 w-5 cursor-pointer rounded border border-stroke bg-white flex items-center justify-center"
                        onClick={toggleAll}
                      >
                        {allSelected && (
                          <div className="h-3.5 w-3.5 bg-secondary rounded-sm flex items-center justify-center text-secondary-foreground">
                            ✓
                          </div>
                        )}
                      </div>
                    </th>
                    {["Order ID", "Customer Name", "Date & Time", "Payment", "Trader Subtotal", "Order Total", "Status"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-gray-text uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-text font-medium font-['Montserrat']">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order, idx) => {
                      const isChecked = selected.has(order.id);
                      const pill = statusPill(order.status);
                      return (
                        <tr
                          key={order.id}
                          className={`cursor-pointer transition hover:bg-zinc-50/50 ${idx % 2 === 0 ? "bg-white" : "bg-zinc-50/30"}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                            <div
                              className={`h-5 w-5 cursor-pointer rounded border flex items-center justify-center transition ${
                                isChecked ? "border-secondary bg-secondary text-secondary-foreground" : "border-stroke bg-white"
                              }`}
                              onClick={() => toggleRow(order.id)}
                            >
                              {isChecked && <span className="text-[10px]">✓</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground whitespace-nowrap">
                            {order.orderId}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-semibold text-foreground whitespace-nowrap">
                            {order.customer}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-gray-text whitespace-nowrap">
                            {order.date} — {order.time}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                            {order.payment}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-secondary whitespace-nowrap">
                            {order.subtotal}
                          </td>
                          <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground whitespace-nowrap">
                            {order.total}
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}