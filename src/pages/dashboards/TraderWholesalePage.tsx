import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { asset } from "../../components/trader/inventoryUtils";
import {
  useTraderWholesaleOrders,
  useUpdateWholesaleOrderStatus,
  useDeleteWholesaleOrder,
  useUpdateWholesaleOrder,
  type WholesaleOrder,
} from "../../hooks/queries/wholesaleOrderQuery";
import { useAddWholesaleColor, useWholesale } from "../../hooks/queries/wholesaleQuery";
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Trash2,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// ─── Static data ───────────────────────────────────────────────────────────────
const earningsData = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 62000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 71000 },
  { month: "May", value: 55000 },
  { month: "Jun", value: 80000 },
  { month: "Jul", value: 67000 },
  { month: "Aug", value: 87250 },
];

const categorySegments = [
  { label: "men", value: 35, color: "#A81324" },
  { label: "women", value: 25, color: "#FCD34D" },
  { label: "kids", value: 30, color: "#7DD3FC" },
  { label: "craft", value: 10, color: "#C084FC" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
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

function getLocalizedStatus(status: string, t: any) {
  const norm = status.toUpperCase();
  if (norm === "COMPLETED") return t("statusCompleted", "Completed");
  if (norm === "DELIVERED") return t("statusDelivered", "Delivered");
  if (norm === "SHIPPED") return t("statusShipped", "Shipped");
  if (norm === "PROCESSING") return t("statusProcessing", "Processing");
  if (norm === "PENDING") return t("statusPending", "Pending");
  if (norm === "CANCELLED") return t("statusCancelled", "Cancelled");
  return status;
}

// ─── Charts ────────────────────────────────────────────────────────────────────
function EarningsChart() {
  const max = Math.max(...earningsData.map((d) => d.value));
  const w = 600,
    h = 200,
    padL = 40,
    padR = 20,
    padT = 20,
    padB = 30;
  const chartW = w - padL - padR,
    chartH = h - padT - padB;
  const pts = earningsData.map((d, i) => ({
    x: padL + (i / (earningsData.length - 1)) * chartW,
    y: padT + (1 - d.value / max) * chartH,
    ...d,
  }));
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + chartH} L ${pts[0].x} ${padT + chartH} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wh-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padL}
          x2={w - padR}
          y1={padT + t * chartH}
          y2={padT + t * chartH}
          stroke="#E5E7EB"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#wh-grad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#FFAE4C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p) => (
        <circle
          key={p.month}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="white"
          stroke="#FFAE4C"
          strokeWidth="2"
        />
      ))}
      {pts.map((p) => (
        <text
          key={p.month + "l"}
          x={p.x}
          y={h - 6}
          textAnchor="middle"
          fontSize="9"
          fill="#6B7280"
        >
          {p.month}
        </text>
      ))}
    </svg>
  );
}

function CategoryDonut() {
  const cx = 80,
    cy = 80,
    r = 65,
    innerR = 40;
  let startAngle = -Math.PI / 2;
  const paths = categorySegments.map((seg) => {
    const angle = (seg.value / 100) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle),
      y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),
      y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + innerR * Math.cos(startAngle),
      yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(endAngle),
      yi2 = cy + innerR * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return { ...seg, d };
  });
  const { t } = useTranslation("traderWholesale");
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths.map((seg) => (
          <path key={seg.label} d={seg.d} fill={seg.color} />
        ))}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#111827"
        >
          18,320
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="8"
          fill="#6B7280"
        >
          {t("totalUnits", "Total Units")}
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {categorySegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 shrink-0 rounded"
              style={{ background: seg.color }}
            />
            <span className="font-['Montserrat'] text-xs font-semibold text-foreground">
              {t(seg.label, seg.label)} {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Editable Order Item Row Component ──────────────────────────────────── */
interface EditableOrderItemRowProps {
  item: WholesaleOrder["items"][number];
  idx: number;
  isEditing: boolean;
  currentEdit: { quantity: number; price: number };
  onChange: (updates: Partial<{ quantity: number; price: number }>) => void;
  onDelete: () => void;
}

function EditableOrderItemRow({ item, idx, isEditing, currentEdit, onChange, onDelete }: EditableOrderItemRowProps) {
  return (
    <tr className={`transition hover:bg-background ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}>
      <td className="px-4 py-4 text-center">
        <div className="h-12 w-12 rounded-lg bg-background border border-stroke overflow-hidden flex items-center justify-center mx-auto">
          {item.image ? (
            <img className="h-full w-full object-cover" src={item.image} alt={item.product} />
          ) : (
            <ShoppingBag className="h-5 w-5 text-gray-text" />
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat']">
        <div className="font-bold text-foreground text-sm">
          {item.product}
        </div>
        <div className="flex justify-center gap-2 mt-1">
          {item.size && (
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-background text-gray-text rounded border border-stroke">
              Size: {item.size}
            </span>
          )}
          {item.color && (
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-background text-gray-text rounded border border-stroke">
              Color: {item.color}
            </span>
          )}
        </div>
        
        {isEditing && (
          <div className="flex justify-center gap-2.5 mt-2">
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3 w-3" /> Delete Color
            </button>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        {isEditing ? (
          <input
            type="number"
            value={currentEdit.quantity}
            onChange={(e) => onChange({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-16 mx-auto rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
          />
        ) : (
          item.quantity
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        {isEditing ? (
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-text">EGP</span>
            <input
              type="number"
              step="0.01"
              value={currentEdit.price}
              onChange={(e) => onChange({ price: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="w-20 rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
            />
          </div>
        ) : (
          item.price
        )}
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground">
        {isEditing ? (
          `EGP ${(currentEdit.price * currentEdit.quantity).toFixed(2)}`
        ) : (
          item.subtotal
        )}
      </td>
    </tr>
  );
}

/* ─── New Order Item Row Component ───────────────────────────────────────── */
interface NewOrderItemRowProps {
  item: {
    tempId: string;
    productId: string;
    product: string;
    quantity: number;
    price: number;
    color: string | null;
    image: string;
  };
  onChange: (updates: Partial<{ quantity: number; price: number; color: string | null }>) => void;
  onRemove: () => void;
}

function NewOrderItemRow({ item, onChange, onRemove }: NewOrderItemRowProps) {
  const { data: product } = useWholesale(item.productId);

  return (
    <tr className="bg-amber-50/10 border-b border-stroke">
      <td className="px-4 py-4 text-center">
        <div className="h-12 w-12 rounded-lg bg-background border border-stroke overflow-hidden flex items-center justify-center mx-auto">
          {item.image ? (
            <img className="h-full w-full object-cover" src={item.image} alt="" />
          ) : (
            <ShoppingBag className="h-5 w-5 text-gray-text" />
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat']">
        <div className="font-bold text-foreground text-sm">
          {item.product} <span className="text-xs font-semibold text-secondary">(New Color Row)</span>
        </div>
        
        <div className="mt-2 max-w-[160px] mx-auto text-left">
          <label className="text-[9px] font-bold text-gray-text block uppercase mb-1">Select Color</label>
          <select
            value={item.color || ""}
            onChange={(e) => onChange({ color: e.target.value || null })}
            className="w-full text-xs rounded border border-stroke bg-background p-1 text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">Select Color</option>
            {product?.wholesaleColors?.map((c) => (
              <option key={c.id} value={c.color}>
                {c.color}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mt-2.5">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
          className="w-16 mx-auto rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
        />
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-medium text-foreground">
        <div className="flex items-center justify-center gap-1 font-['Montserrat']">
          <span className="text-xs text-gray-text">EGP</span>
          <input
            type="number"
            step="0.01"
            value={item.price}
            onChange={(e) => onChange({ price: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="w-20 rounded border border-stroke bg-background px-2 py-1 text-center font-semibold text-foreground focus:outline-none"
          />
        </div>
      </td>
      <td className="px-4 py-4 text-center font-['Montserrat'] text-sm font-bold text-foreground">
        EGP {(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  );
}

/* ─── Order Detail View ──────────────────────────────────────────────────── */
interface OrderDetailProps {
  order: WholesaleOrder;
  onBack: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onUpdateOrderItems: (
    id: string,
    items: {
      id?: string;
      productId?: string;
      quantity: number;
      price: number;
      color?: string | null;
      size?: string | null;
    }[]
  ) => Promise<void>;
}

function OrderDetail({ order, onBack, onUpdateStatus, onDeleteOrder, onUpdateOrderItems }: OrderDetailProps) {
  const { t } = useTranslation("traderWholesale");
  const pill = statusPill(order.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Editable items state
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [isSavingItems, setIsSavingItems] = useState(false);
  const [editedItems, setEditedItems] = useState<Record<string, { quantity: number; price: number }>>({});
  const [newItems, setNewItems] = useState<{ tempId: string; productId: string; product: string; quantity: number; price: number; color: string | null; image: string }[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);

  const handleAddColorRow = () => {
    const originalItem = order.items[0];
    if (!originalItem) return;
    const numericPrice = parseFloat(originalItem.price.replace(/[^0-9.-]+/g, "")) || 0;
    setNewItems((prev) => [
      ...prev,
      {
        tempId: Math.random().toString(36).slice(2, 9),
        productId: originalItem.productId,
        product: originalItem.product,
        quantity: 1,
        price: numericPrice,
        color: "",
        image: originalItem.image,
      }
    ]);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, e.target.value);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("deleteConfirm", "Are you sure you want to delete this wholesale order?"))) {
      setDeleting(true);
      try {
        await onDeleteOrder(order.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSaveItems = async () => {
    setIsSavingItems(true);
    try {
      const itemsPayload = [
        ...Object.entries(editedItems)
          .filter(([id]) => !deletedItemIds.includes(id))
          .map(([id, val]) => ({
            id,
            quantity: val.quantity,
            price: val.price,
          })),
        ...newItems.map((val) => ({
          productId: val.productId,
          quantity: val.quantity,
          price: val.price,
          color: val.color,
          size: null,
        }))
      ];
      await onUpdateOrderItems(order.id, itemsPayload, deletedItemIds);
      setIsEditingItems(false);
      setNewItems([]);
      setDeletedItemIds([]);
    } finally {
      setIsSavingItems(false);
    }
  };

  const timelineSteps = [
    { label: t("timelineOrderPlaced", "Order Placed"), time: `${order.date} ${order.time}`, done: true },
    { label: t("timelineProcessing", "Processing"), time: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) ? t("timelineInProgress", "In Progress") : t("timelinePending", "Pending"), done: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) },
    { label: t("timelineShipped", "Shipped"), time: ["SHIPPED", "COMPLETED"].includes(order.status) ? t("timelineShipped", "Shipped") : t("timelinePending", "Pending"), done: ["SHIPPED", "COMPLETED"].includes(order.status) },
    { label: t("timelineDelivered", "Delivered"), time: order.status === "COMPLETED" ? t("timelineDelivered", "Delivered") : t("timelinePending", "Pending"), done: order.status === "COMPLETED" },
  ];

  return (
    <div className="space-y-6">
      {/* Header buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-stroke bg-card px-4 py-2.5 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToOrders", "Back to Orders")}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-['Montserrat'] text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {t("deleteOrder", "Delete Order")}
        </button>
      </div>

      {/* Info grids */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
            {t("orderDetails", "Order Details")}
          </h3>
          <div className="flex flex-col gap-3 font-['Montserrat'] text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("orderIdLabel", "Order ID")}</span>
              <span className="font-bold text-foreground">{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("dateTimeLabel", "Date & Time")}</span>
              <span className="font-semibold text-foreground">{order.date} — {order.time}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("statusLabel", "Status")}</span>
              <div className="flex items-center gap-2">
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                ) : (
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    className={`inline-flex rounded-xl px-2 py-1 text-xs font-semibold font-['Montserrat'] outline outline-1 ${pill.bg} ${pill.text} ${pill.ring} bg-card cursor-pointer focus:outline-none`}
                  >
                    <option value="PENDING">{t("statusPending", "Pending")}</option>
                    <option value="PROCESSING">{t("statusProcessing", "Processing")}</option>
                    <option value="SHIPPED">{t("statusShipped", "Shipped")}</option>
                    <option value="COMPLETED">{t("statusCompleted", "Completed")}</option>
                    <option value="CANCELLED">{t("statusCancelled", "Cancelled")}</option>
                  </select>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-stroke">
              <span className="text-gray-text font-medium">{t("paymentTypeLabel", "Payment Method")}</span>
              <span className="font-semibold text-foreground">{order.payment}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("customerInformation", "Customer Information")}</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: <User className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custName", "Customer Name"), value: order.customer },
              { icon: <Mail className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custEmail", "Email Address"), value: order.customerEmail },
              { icon: <Phone className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custPhone", "Phone Number"), value: order.customerPhone },
              { icon: <MapPin className="h-4 w-4 text-gray-text shrink-0 mt-0.5" />, label: t("custAddress", "Shipping Address"), value: order.address },
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

        {/* Timeline */}
        <div className="rounded-2xl border border-stroke bg-card p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] space-y-4">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("orderTimeline", "Order Timeline")}</h3>
          <div className="flex flex-col gap-0">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${step.done ? "border-secondary bg-secondary text-secondary-foreground" : "border-stroke bg-card"}`}>
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
      <div className="rounded-2xl border border-stroke bg-card shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stroke">
          <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("orderedItems", "Ordered Items")}</h3>
          <div className="flex gap-2">
            {isEditingItems ? (
              <>
                <button
                  type="button"
                  onClick={handleAddColorRow}
                  className="rounded-xl border border-secondary bg-secondary/15 px-4 py-2 font-['Montserrat'] text-xs font-bold text-secondary transition hover:bg-secondary/25 cursor-pointer"
                >
                  <Plus className="h-3 w-3 inline mr-1" /> Add Color Row
                </button>
                <button
                  type="button"
                  onClick={handleSaveItems}
                  disabled={isSavingItems}
                  className="rounded-xl bg-secondary px-4 py-2 font-['Montserrat'] text-xs font-bold text-secondary-foreground transition hover:bg-secondary/90 cursor-pointer disabled:opacity-50"
                >
                  {isSavingItems ? t("saving", "Saving...") : t("saveChanges", "Save Changes")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingItems(false);
                    setEditedItems({});
                    setNewItems([]);
                    setDeletedItemIds([]);
                  }}
                  className="rounded-xl border border-stroke bg-card px-4 py-2 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background cursor-pointer"
                >
                  {t("cancel", "Cancel")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditingItems(true);
                  const initial: Record<string, { quantity: number; price: number }> = {};
                  order.items.forEach(item => {
                    const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0;
                    initial[item.id] = {
                      quantity: item.quantity,
                      price: numericPrice,
                    };
                  });
                  setEditedItems(initial);
                }}
                className="rounded-xl border border-stroke bg-card px-4 py-2 font-['Montserrat'] text-xs font-medium text-foreground transition hover:bg-background cursor-pointer"
              >
                {t("editItems", "Edit Items")}
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-secondary border-b border-stroke">
                {[t("colImage", "Image"), t("colProductDetails", "Product Details"), t("colQuantity", "Quantity"), t("colPrice", "Price"), t("colSubtotal", "Subtotal")].map((col, cIdx) => (
                  <th key={cIdx} className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.filter(item => !deletedItemIds.includes(item.id)).map((item, idx) => {
                const isEditing = isEditingItems;
                const currentEdit = editedItems[item.id] || {
                  quantity: item.quantity,
                  price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0,
                };

                return (
                  <EditableOrderItemRow
                    key={item.id}
                    item={item}
                    idx={idx}
                    isEditing={isEditing}
                    currentEdit={currentEdit}
                    onAddColorRow={() => handleAddColorRow(item)}
                    onDelete={() => setDeletedItemIds(prev => [...prev, item.id])}
                    onChange={(updates) => {
                      setEditedItems(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], ...updates }
                      }));
                    }}
                  />
                );
              })}

              {/* Render newly added color rows */}
              {newItems.map((item, nIdx) => (
                <NewOrderItemRow
                  key={item.tempId}
                  item={item}
                  onChange={(updates) => {
                    setNewItems((prev) =>
                      prev.map((it) => (it.tempId === item.tempId ? { ...it, ...updates } : it))
                    );
                  }}
                  onRemove={() => {
                    setNewItems((prev) => prev.filter((it) => it.tempId !== item.tempId));
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex flex-col items-end gap-2 border-t border-stroke px-6 py-5 bg-background">
          <div className="w-64 space-y-2 font-['Montserrat'] text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-gray-text">{t("traderSubtotal", "Subtotal")}</span>
              <span className="text-foreground font-bold">{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-text">{t("totalShipping", "Shipping")}</span>
              <span className="text-foreground">{order.shipping}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-stroke text-foreground">
              <span>{t("orderGrandTotal", "Total")}</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TraderWholesalePage() {
  const { t } = useTranslation("traderWholesale");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<WholesaleOrder | null>(null);

  const { data: orders = [], isLoading, isError, error } = useTraderWholesaleOrders();
  const updateStatusMutation = useUpdateWholesaleOrderStatus();
  const deleteOrderMutation = useDeleteWholesaleOrder();
  const updateOrderMutation = useUpdateWholesaleOrder();

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      toast.success(t("statusUpdateSuccess", "Order status updated successfully"));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      toast.error(t("statusUpdateError", "Failed to update order status"));
    }
  };

  const handleUpdateOrderItems = async (
    orderId: string,
    items: {
      id?: string;
      productId?: string;
      quantity: number;
      price: number;
      color?: string | null;
      size?: string | null;
    }[],
    deletedItemIds?: string[]
  ) => {
    try {
      const updated = await updateOrderMutation.mutateAsync({ orderId, items, deletedItemIds });
      toast.success(t("orderUpdateSuccess", "Order items updated successfully"));
      setSelectedOrder(updated);
    } catch (err) {
      toast.error(t("orderUpdateError", "Failed to update order items"));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success(t("deleteSuccess", "Order deleted successfully"));
      setSelectedOrder(null);
    } catch (err) {
      toast.error(t("deleteError", "Failed to delete order"));
    }
  };

  const totalOrdersCount = orders.length;
  const activeCount = orders.filter(o => ["PENDING", "PROCESSING", "SHIPPED"].includes(o.status.toUpperCase())).length;
  const completedCount = orders.filter(o => ["COMPLETED", "DELIVERED"].includes(o.status.toUpperCase())).length;
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number(o.total.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + val;
  }, 0);

  const statCards = [
    {
      label: "totalWholesaleOrders",
      value: `${totalOrdersCount} Orders`,
      trend: "100%",
      trendUp: true,
      sub: "allTimeReceived",
    },
    {
      label: "totalWholesaleRevenue",
      value: `EGP ${totalRevenue.toLocaleString()}`,
      trend: "100%",
      trendUp: true,
      sub: "fromAllOrders",
    },
    {
      label: "activeWholesaleOrders",
      value: String(activeCount),
      trend: "100%",
      trendUp: activeCount > 0,
      sub: "pendingOrProcessing",
    },
    {
      label: "completedWholesaleOrders",
      value: String(completedCount),
      trend: "100%",
      trendUp: true,
      sub: "deliveredToClients",
    },
  ];

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || o.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-rose-500 font-medium">
        {error instanceof Error ? error.message : "Failed to load wholesale orders"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdateOrderItems={handleUpdateOrderItems}
        />
      ) : (
        <>
          {/* Stat cards */}
          <div className="flex gap-4 overflow-x-auto pb-1">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="relative flex-1 min-w-[220px] h-32 rounded-2xl border border-stroke bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
              >
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <p className="font-['Montserrat'] text-xs font-semibold text-gray-text uppercase tracking-wider">
                    {t(card.label, card.label)}
                  </p>
                  <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <span className="font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t(card.sub, card.sub)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts container */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Earnings Over Time */}
            <div className="lg:col-span-2 rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">
                  {t("earningsOverTime", "Earnings Over Time")}
                </h2>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg border border-stroke bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-foreground transition hover:bg-background"
                >
                  {t("partner", "Partner")}
                  <img
                    className="h-5 w-5 rotate-90"
                    src={asset("weui_arrow-outlined.svg")}
                    alt=""
                  />
                </button>
              </div>
              <EarningsChart />
            </div>

            {/* Category Donut */}
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
              <h2 className="mb-4 font-['Montserrat'] text-xl font-semibold text-foreground">
                {t("productCategory", "Product Category")}
              </h2>
              <CategoryDonut />
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-start gap-4 bg-card p-5 rounded-2xl border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-text pointer-events-none" />
              <input
                type="text"
                placeholder={t("searchPlaceholder", "Search wholesale orders...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-background py-2.5 pl-12 pr-4 font-['Montserrat'] text-sm font-medium text-foreground outline-none transition placeholder:text-gray-text focus:border-secondary focus:bg-card focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-background px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground outline-none transition cursor-pointer focus:border-secondary focus:bg-card focus:ring-1 focus:ring-secondary"
              >
                <option value="">{t("allStatuses", "All Statuses")}</option>
                <option value="PENDING">{t("statusPending", "Pending")}</option>
                <option value="PROCESSING">{t("statusProcessing", "Processing")}</option>
                <option value="SHIPPED">{t("statusShipped", "Shipped")}</option>
                <option value="COMPLETED">{t("statusCompleted", "Completed")}</option>
                <option value="CANCELLED">{t("statusCancelled", "Cancelled")}</option>
              </select>
            </div>

            {/* Reset Button */}
            {(search || statusFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-['Montserrat'] text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
              >
                {t("resetFilters", "Reset Filters")}
              </button>
            )}
          </div>

          {/* Wholesale Orders History Table */}
          <section className="rounded-2xl border border-stroke bg-card shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-stroke">
              <h2 className="font-['Montserrat'] text-lg font-bold text-foreground">{t("wholesaleOrdersHistory", "Wholesale Orders History")}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-secondary border-b border-stroke">
                    {[t("colOrderId", "Order ID"), t("colCustomerName", "Customer"), t("colDateTime", "Date & Time"), t("colPayment", "Payment"), t("colTraderSubtotal", "Subtotal"), t("colOrderTotal", "Total"), t("colStatus", "Status")].map((col, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-4 py-3.5 text-center font-['Montserrat'] text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-text font-medium font-['Montserrat']">
                        {t("noWholesaleOrdersFound", "No wholesale orders found")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order, idx) => {
                      const pill = statusPill(order.status);
                      return (
                        <tr
                          key={order.id}
                          className={`cursor-pointer transition hover:bg-background ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}
                          onClick={() => setSelectedOrder(order)}
                        >
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
                              {getLocalizedStatus(order.status, t)}
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
