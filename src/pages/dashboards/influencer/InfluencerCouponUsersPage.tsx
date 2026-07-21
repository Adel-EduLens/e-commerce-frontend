import { useEffect, useMemo, useState } from "react";
import { api } from "../../../lib/axios";
import { toast } from "sonner";
import { Eye, X, Search } from "lucide-react";
import {
  formatEgp,
  getItemDiscount,
  getItemTotalAfterDiscount,
  getOriginalOrderTotal,
} from "../../../lib/influencerOrderTotals";

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  imageSrc: string | null;
}

interface CouponUser {
  userId: number;
  userName: string | null;
  userEmail: string;
  userPhone: string | null;
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  commissionAmount: number;
  orderItems: OrderItem[];
  usedAt: string;
}

export default function InfluencerCouponUsersPage() {
  const [users, setUsers] = useState<CouponUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<CouponUser | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    api
      .get("/influencer/coupon-users")
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load coupon users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          (u.userName || "").toLowerCase().includes(q) ||
          u.userEmail.toLowerCase().includes(q) ||
          (u.userPhone || "").toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (new Date(u.usedAt) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(u.usedAt) > to) return false;
      }

      return true;
    });
  }, [users, search, dateFrom, dateTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-stroke bg-card p-10 text-center">
        <p className="text-lg text-gray-text">
          No one has used your coupon yet
        </p>
        <p className="mt-2 text-sm text-gray-text">
          Share your coupon code to start earning commissions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-text"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-light pl-9 pr-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <span className="text-sm text-gray-text">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        {(search || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSearch("");
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-xl border border-stroke px-4 py-3 text-sm text-gray-text hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-text">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">
                  Original Total
                </th>
                <th className="px-5 py-4">
                  Order Total
                </th>
                <th className="px-5 py-4">
                  Discount
                </th>
                <th className="px-5 py-4">
                  Commission
                </th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Items</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.orderId}
                  className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {u.userName || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-text">{u.userEmail}</td>
                  <td className="px-5 py-4 text-gray-text">
                    {u.userPhone || "—"}
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {formatEgp(getOriginalOrderTotal(u.orderItems, u.orderTotal, u.discountAmount))}
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {formatEgp(u.orderTotal)}
                  </td>
                  <td className="px-5 py-4 text-red-500">
                    {formatEgp(u.discountAmount, "-")}
                  </td>
                  <td className="px-5 py-4 font-semibold text-green-600">
                    {formatEgp(u.commissionAmount, "+")}
                  </td>
                  <td className="px-5 py-4 text-gray-text">
                    {new Date(u.usedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setModalData(u)}
                      className="rounded-lg border border-stroke p-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-gray-text">
                    No results match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModalData(null)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Montserrat'] text-lg font-semibold text-foreground">
                Order Products
              </h3>
              <button
                onClick={() => setModalData(null)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Order info */}
            <div className="mb-4 rounded-xl bg-gray-50 dark:bg-white/5 p-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="text-gray-text">User:</span>{" "}
                  <span className="font-medium text-foreground">
                    {modalData.userName || "—"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-text">Date:</span>{" "}
                  <span className="text-foreground">
                    {new Date(modalData.usedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p>
                  <span className="text-gray-text">Original Total:</span>{" "}
                  <span className="text-foreground">
                    {formatEgp(getOriginalOrderTotal(
                      modalData.orderItems,
                      modalData.orderTotal,
                      modalData.discountAmount,
                    ))}
                  </span>
                </p>
                <p>
                  <span className="text-gray-text">Order Total:</span>{" "}
                  <span className="text-foreground">
                    {formatEgp(modalData.orderTotal)}
                  </span>
                </p>
                <p>
                  <span className="text-gray-text">Discount:</span>{" "}
                  <span className="text-red-500">
                    {formatEgp(modalData.discountAmount, "-")}
                  </span>
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-3">
              {modalData.orderItems.map((item, idx) => {
                const itemSubtotal = item.price * item.quantity;
                const itemDiscount = getItemDiscount(
                  item,
                  modalData.orderItems,
                  modalData.discountAmount,
                );
                const itemTotalAfterDiscount = getItemTotalAfterDiscount(
                  item,
                  modalData.orderItems,
                  modalData.discountAmount,
                );

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-stroke p-3"
                  >
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10">
                        <span className="text-xs text-gray-text">No img</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-text mt-0.5">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-foreground">
                        {formatEgp(itemSubtotal)}
                      </p>
                      <p className="text-xs text-red-500">
                        {formatEgp(itemDiscount, "-")}
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        {formatEgp(itemTotalAfterDiscount)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-text">
                          {item.quantity} x {formatEgp(item.price)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
