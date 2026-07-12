import { useState, useEffect } from "react";
import { FileText, Package, Truck, CheckCircle2, ShoppingBag, Loader2, Calendar, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "../components/shared";
import { useTranslation } from "react-i18next";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Tab = "active" | "completed" | "cancelled";

type OrderItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  imageSrc: string | null;
};

type Order = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment: string;
  mapAddress: string | null;
  latitude: string | null;
  longitude: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  status: string; // PENDING, PROCESSING, SHIPPED, COMPLETED, CANCELLED
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  };
};

const getOrderSteps = (status: string, dateStr: string) => {
  const { date } = formatDate(dateStr);

  const isPending = status === "PENDING";
  const isProcessing = status === "PROCESSING";
  const isShipped = status === "SHIPPED";
  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";

  return [
    {
      icon: FileText,
      label: "New Order",
      date: date,
      completed: !isCancelled
    },
    {
      icon: CheckCircle2,
      label: "Confirmed",
      date: (!isPending && !isCancelled) ? date : "Pending Confirmation",
      completed: !isPending && !isCancelled,
    },
    {
      icon: Package,
      label: "Shipped",
      date: (isShipped || isCompleted) ? date : "Pending Shipment",
      completed: isShipped || isCompleted,
    },
    {
      icon: Truck,
      label: "Delivered",
      date: isCompleted ? date : "Pending Delivery",
      completed: isCompleted,
    },
  ];
};

function OrderTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const { t } = useTranslation("orders");
  const tabs: { key: Tab; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="relative">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-4 font-['Montserrat'] text-base font-bold cursor-pointer transition-all duration-200 ${activeTab === tab.key
              ? "text-foreground border-b-[3px] border-secondary"
              : "text-gray-text hover:text-foreground"
              }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-stroke" />
    </div>
  );
}

function OrderHeader({ order }: { order: Order }) {
  const { t } = useTranslation("orders");
  const { date, time } = formatDate(order.createdAt);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-card p-5 shadow-sm border border-stroke">
      <div className="flex flex-col gap-1.5">
        <span className="font-['Montserrat'] text-lg font-bold text-secondary">
          {t("Order")} #{order.id.slice(-8).toUpperCase()}
        </span>
        <div className="flex items-center gap-3 text-sm text-gray-text font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-text" />
            {date}
          </span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-1">
        <span className="font-['Montserrat'] text-xs font-bold text-gray-text/60 uppercase tracking-wider">
          Total Amount
        </span>
        <span className="font-['Montserrat'] text-xl font-extrabold text-foreground">
          EGP {order.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function OrderItemCard({ item }: { item: OrderItem }) {
  const { t } = useTranslation("orders");

  return (
    <div className="flex rounded-xl bg-card border border-stroke p-3 sm:p-4 gap-4 transition-all hover:shadow-md">
      <div className="h-24 w-20 sm:h-28 sm:w-24 shrink-0 rounded-lg bg-gray-light overflow-hidden flex items-center justify-center border border-stroke">
        {item.imageSrc ? (
          <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <ShoppingBag className="h-8 w-8 text-gray-text/40" />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div className="space-y-1">
          <h4 className="font-['Montserrat'] text-base sm:text-lg font-bold text-foreground truncate">
            {item.title}
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {item.size && (
              <span className="inline-flex items-center rounded-md  border border-stroke px-2 py-0.5 font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("Size")}: {item.size}
              </span>
            )}
            {item.color && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-stroke px-2 py-0.5 font-['Montserrat'] text-xs font-semibold text-foreground">
                {t("Color")}:
                {item.color.startsWith("#") ? (
                  <span className="h-3.5 w-3.5 rounded-full border border-stroke shrink-0" style={{ backgroundColor: item.color }} />
                ) : (
                  <span>{item.color}</span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-2">
          <span className="font-['Montserrat'] text-sm font-semibold text-gray-text">
            Qty: {item.quantity}
          </span>
          <span className="font-['Montserrat'] text-base sm:text-lg font-extrabold text-foreground">
            EGP {item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderStatus({ order }: { order: Order }) {
  const { t } = useTranslation("orders");
  const steps = getOrderSteps(order.status, order.createdAt);

  if (order.status === "CANCELLED") {
    return (
      <div className="w-full lg:w-80 shrink-0 rounded-xl bg-urgent/5 border border-urgent/20 p-5 self-start">
        <span className="font-['Montserrat'] text-base font-bold text-urgent">
          Order Cancelled
        </span>
        <p className="mt-3 font-['Montserrat'] text-sm font-medium text-urgent leading-relaxed">
          This order has been cancelled and is no longer being processed. If you believe this is an error, please contact customer support.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 shrink-0 rounded-xl bg-card border border-stroke p-5 self-start shadow-sm">
      <span className="font-['Montserrat'] text-base font-bold text-foreground">
        {t("Order Status")}
      </span>
      <div className="mt-6 flex flex-col">
        {steps.map((step, index) => (
          <div key={step.label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${step.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-light text-gray-text/40"
                    }`}
                >
                  <step.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`font-['Montserrat'] text-sm font-bold ${step.completed ? "text-foreground" : "text-gray-text/60"
                      }`}
                  >
                    {t(step.label)}
                  </span>
                  <span
                    className={`font-['Montserrat'] text-xs font-semibold ${step.completed ? "text-gray-text" : "text-gray-text/40"
                      }`}
                  >
                    {step.date === "Pending Delivery" || step.date === "Pending Shipment" || step.date === "Pending Confirmation"
                      ? t(step.date)
                      : step.date}
                  </span>
                </div>
              </div>
              <div className="h-6 w-6 flex items-center justify-center">
                {step.completed ? (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px]">
                    ✓
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-stroke bg-transparent" />
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`ml-[23px] h-10 w-0.5 transition-all duration-300 ${step.completed && steps[index + 1]?.completed
                  ? "bg-primary"
                  : "bg-stroke"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderDetailsCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-stroke bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-stroke pb-3">
        <MapPin className="h-5 w-5 text-secondary" />
        <span className="font-['Montserrat'] text-base font-bold text-foreground">Delivery & Payment Info</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-['Montserrat'] text-sm">
        <div className="space-y-2">
          <div className="text-gray-text font-medium">Recipient & Address</div>
          <div className="font-bold text-foreground">
            {order.firstName} {order.lastName}
          </div>
          <div className="text-gray-text leading-relaxed">
            {order.apartment && `Apt ${order.apartment}, `}
            {order.streetAddress}, {order.area}, {order.city}, {order.country}
          </div>
          <div className="text-gray-text">Phone: {order.phone}</div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-gray-text font-medium">Payment Details</div>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <CreditCard className="h-4 w-4 text-gray-text" />
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Card Payment"}
            </div>
          </div>

          {order.mapAddress && (
            <div className="space-y-1">
              <div className="text-gray-text font-medium">Pinned Map Address</div>
              <div className="text-xs font-semibold text-success break-words leading-relaxed">
                {order.mapAddress}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(res.data?.data || []);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        toast.error("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by active tabs
  const filteredOrders = orders.filter((order) => {
    const status = order.status.toUpperCase();
    if (activeTab === "active") {
      return status === "PENDING" || status === "PROCESSING" || status === "SHIPPED";
    }
    if (activeTab === "completed") {
      return status === "COMPLETED" || status === "DELIVERED";
    }
    if (activeTab === "cancelled") {
      return status === "CANCELLED";
    }
    return true;
  });

  // Automatically select the first order of the filtered list if selectedOrderId is not set or not in filtered list
  useEffect(() => {
    if (filteredOrders.length > 0) {
      const exists = filteredOrders.some(o => o.id === selectedOrderId);
      if (!exists) {
        setSelectedOrderId(filteredOrders[0].id);
      }
    } else {
      setSelectedOrderId(null);
    }
  }, [activeTab, orders]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  return (
    <div className="w-full space-y-6">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <LoadingSpinner containerClassName="h-64" className="h-8 w-8" />
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stroke p-12 text-center bg-gray-light/50 transition-all duration-300">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-['Montserrat'] text-xl font-bold text-foreground mb-2">
            No {activeTab} orders found
          </h3>
          <p className="font-['Montserrat'] text-sm text-gray-text max-w-sm mb-6 leading-relaxed">
            It looks like you don't have any orders in this category. Browse our shop to find something you love!
          </p>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-['Montserrat'] text-sm font-bold text-foreground hover:opacity-90 transition-all shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Orders list selection sidebar */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            <span className="font-['Montserrat'] text-xs font-bold text-gray-text uppercase tracking-wider px-1">
              Select Order to Track
            </span>
            {filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const { date } = formatDate(order.createdAt);
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${isSelected
                    ? "bg-secondary border-secondary text-secondary-foreground shadow-md font-semibold"
                    : "bg-card border-stroke text-foreground hover:bg-gray-light"
                    }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className={`font-['Montserrat'] text-sm font-bold truncate ${isSelected ? "text-secondary-foreground" : "text-foreground"}`}>
                      Order #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div className={`font-['Montserrat'] text-xs ${isSelected ? "text-secondary-foreground/75" : "text-gray-text"}`}>
                      {date} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "translate-x-1 text-secondary-foreground" : "text-gray-text"}`} />
                </button>
              );
            })}
          </div>

          {/* Details pane of the selected order */}
          {selectedOrder && (
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-w-0">
              <div className="flex-1 flex flex-col gap-5 min-w-0">
                <OrderHeader order={selectedOrder} />
                <OrderDetailsCard order={selectedOrder} />

                <div className="flex flex-col gap-3.5">
                  <span className="font-['Montserrat'] text-xs font-bold text-gray-text uppercase tracking-wider px-1">
                    Items List
                  </span>
                  {selectedOrder.items.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <OrderStatus order={selectedOrder} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
