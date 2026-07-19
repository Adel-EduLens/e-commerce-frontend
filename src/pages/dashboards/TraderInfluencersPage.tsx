import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X, Eye, Edit2 } from "lucide-react";
import { api } from "../../lib/axios";
import { handleApiError } from "../../lib/utils";

interface Influencer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  coupon: {
    id: string;
    code: string;
    discountPercent: number;
    commissionPercent: number;
    isActive: boolean;
    _count: { usages: number };
  } | null;
}

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

interface CreateForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  couponCode: string;
  discountPercent: string;
  commissionPercent: string;
}

const emptyForm: CreateForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  couponCode: "",
  discountPercent: "",
  commissionPercent: "",
};

export default function TraderInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Detail / Edit
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [editCoupon, setEditCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountPercent: "",
    commissionPercent: "",
    isActive: true,
  });

  // Coupon Users
  const [couponUsers, setCouponUsers] = useState<CouponUser[]>([]);
  const [couponUsersLoading, setCouponUsersLoading] = useState(false);
  const [modalData, setModalData] = useState<CouponUser | null>(null);

  // Detail tab
  const [detailTab, setDetailTab] = useState<"info" | "coupon-users">("info");

  const loadInfluencers = () => {
    api
      .get("/trader/influencers")
      .then((res) => setInfluencers(res.data.data))
      .catch(() => toast.error("Failed to load influencers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInfluencers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/trader/influencers", {
        ...form,
        discountPercent: Number(form.discountPercent),
        commissionPercent: Number(form.commissionPercent),
      });
      toast.success("Influencer created!");
      setShowCreate(false);
      setForm(emptyForm);
      loadInfluencers();
    } catch (error) {
      handleApiError(error, "Failed to create influencer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (inf: Influencer) => {
    const newStatus = inf.status === "active" ? "suspended" : "active";
    try {
      await api.patch(`/trader/influencers/${inf.id}`, { status: newStatus });
      toast.success(`Influencer ${newStatus}`);
      loadInfluencers();
    } catch (error) {
      handleApiError(error, "Failed to update status");
    }
  };

  const openDetail = async (id: number) => {
    setSelectedId(id);
    setDetailTab("info");
    setCouponUsers([]);
    try {
      const res = await api.get(`/trader/influencers/${id}`);
      setDetailData(res.data.data);
      if (res.data.data.coupon) {
        setCouponForm({
          code: res.data.data.coupon.code,
          discountPercent: String(res.data.data.coupon.discountPercent),
          commissionPercent: String(res.data.data.coupon.commissionPercent),
          isActive: res.data.data.coupon.isActive,
        });
      }
    } catch {
      toast.error("Failed to load influencer details");
    }
  };

  const loadCouponUsers = async (id: number) => {
    setCouponUsersLoading(true);
    try {
      const res = await api.get(`/trader/influencers/${id}/coupon-users`);
      setCouponUsers(res.data.data);
    } catch {
      toast.error("Failed to load coupon users");
    } finally {
      setCouponUsersLoading(false);
    }
  };

  const handleTabChange = (tab: "info" | "coupon-users") => {
    setDetailTab(tab);
    if (tab === "coupon-users" && selectedId && couponUsers.length === 0) {
      loadCouponUsers(selectedId);
    }
  };

  const handleUpdateCoupon = async () => {
    if (!selectedId) return;
    try {
      await api.patch(`/trader/influencers/${selectedId}/coupon`, {
        code: couponForm.code,
        discountPercent: Number(couponForm.discountPercent),
        commissionPercent: Number(couponForm.commissionPercent),
        isActive: couponForm.isActive,
      });
      toast.success("Coupon updated!");
      setEditCoupon(false);
      openDetail(selectedId);
      loadInfluencers();
    } catch (error) {
      handleApiError(error, "Failed to update coupon");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Detail View
  if (selectedId && detailData) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setSelectedId(null);
            setDetailData(null);
            setEditCoupon(false);
            setCouponUsers([]);
          }}
          className="text-sm text-primary hover:underline"
        >
          Back to list
        </button>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stroke">
          <button
            onClick={() => handleTabChange("info")}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
              detailTab === "info"
                ? "border-primary text-primary"
                : "border-transparent text-gray-text hover:text-foreground"
            }`}
          >
            Info & Coupon
          </button>
          <button
            onClick={() => handleTabChange("coupon-users")}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
              detailTab === "coupon-users"
                ? "border-primary text-primary"
                : "border-transparent text-gray-text hover:text-foreground"
            }`}
          >
            Coupon Users
          </button>
        </div>

        {detailTab === "info" && (
          <>
            {/* Influencer Info */}
            <div className="rounded-2xl border border-stroke bg-card p-6">
              <h2 className="mb-4 font-['Montserrat'] text-lg font-semibold">
                {detailData.influencer.name}
              </h2>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-gray-text">Email:</span>{" "}
                  {detailData.influencer.email}
                </p>
                <p>
                  <span className="text-gray-text">Phone:</span>{" "}
                  {detailData.influencer.phone || "—"}
                </p>
                <p>
                  <span className="text-gray-text">Status:</span>{" "}
                  {detailData.influencer.status}
                </p>
              </div>
            </div>

            {/* Coupon */}
            {detailData.coupon && (
              <div className="rounded-2xl border border-stroke bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-['Montserrat'] text-lg font-semibold">
                    Coupon Settings
                  </h2>
                  <button
                    onClick={() => setEditCoupon(!editCoupon)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Edit2 size={14} />
                    {editCoupon ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editCoupon ? (
                  <div className="space-y-3">
                    <input
                      placeholder="Coupon Code"
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, code: e.target.value })
                      }
                      className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="number"
                        placeholder="Discount %"
                        value={couponForm.discountPercent}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            discountPercent: e.target.value,
                          })
                        }
                        className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Commission %"
                        value={couponForm.commissionPercent}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            commissionPercent: e.target.value,
                          })
                        }
                        className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={couponForm.isActive}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      Active
                    </label>
                    <button
                      onClick={handleUpdateCoupon}
                      className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-gray-text">Code:</span>{" "}
                      <span className="font-bold">{detailData.coupon.code}</span>
                    </p>
                    <p>
                      <span className="text-gray-text">Discount:</span>{" "}
                      {detailData.coupon.discountPercent}%
                    </p>
                    <p>
                      <span className="text-gray-text">Commission:</span>{" "}
                      {detailData.coupon.commissionPercent}%
                    </p>
                    <p>
                      <span className="text-gray-text">Status:</span>{" "}
                      {detailData.coupon.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Stats */}
            {detailData.stats && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">Total Earnings</p>
                  <p className="mt-1 text-xl font-bold text-green-600">
                    EGP {detailData.stats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">Pending</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">
                    EGP {detailData.stats.pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">Eligible</p>
                  <p className="mt-1 text-xl font-bold text-blue-600">
                    EGP {detailData.stats.eligibleEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">Settled</p>
                  <p className="mt-1 text-xl font-bold text-gray-600">
                    EGP {detailData.stats.settledEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {detailTab === "coupon-users" && (
          <>
            {couponUsersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : couponUsers.length === 0 ? (
              <div className="rounded-2xl border border-stroke bg-card p-10 text-center">
                <p className="text-gray-text">No coupon users yet</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                        <th className="px-5 py-4">User</th>
                        <th className="px-5 py-4">Email</th>
                        <th className="px-5 py-4">Phone</th>
                        <th className="px-5 py-4">Order Total</th>
                        <th className="px-5 py-4">Discount</th>
                        <th className="px-5 py-4">Commission</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couponUsers.map((u) => (
                        <tr
                          key={u.orderId}
                          className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                        >
                          <td className="px-5 py-4 font-medium text-foreground">
                            {u.userName || "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-text">{u.userEmail}</td>
                          <td className="px-5 py-4 text-gray-text">{u.userPhone || "—"}</td>
                          <td className="px-5 py-4 text-foreground">
                            EGP {u.orderTotal.toFixed(2)}
                          </td>
                          <td className="px-5 py-4 text-red-500">
                            -EGP {u.discountAmount.toFixed(2)}
                          </td>
                          <td className="px-5 py-4 font-semibold text-green-600">
                            +EGP {u.commissionAmount.toFixed(2)}
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Order Items Modal */}
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
                    <span className="text-gray-text">Order Total:</span>{" "}
                    <span className="text-foreground">
                      EGP {modalData.orderTotal.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-text">Discount:</span>{" "}
                    <span className="text-red-500">
                      -EGP {modalData.discountAmount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {modalData.orderItems.map((item, idx) => (
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
                        EGP {item.price.toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-text">
                          x{item.quantity} = EGP{" "}
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-['Montserrat'] text-lg font-semibold text-foreground">
          Influencers
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={16} />
          Add Influencer
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Montserrat'] text-lg font-semibold">
                Create Influencer
              </h3>
              <button onClick={() => setShowCreate(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder="Coupon Code (e.g. AHMED20)"
                value={form.couponCode}
                onChange={(e) =>
                  setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                }
                required
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Discount % (for users)"
                  value={form.discountPercent}
                  onChange={(e) =>
                    setForm({ ...form, discountPercent: e.target.value })
                  }
                  required
                  min="1"
                  max="100"
                  className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Commission % (for influencer)"
                  value={form.commissionPercent}
                  onChange={(e) =>
                    setForm({ ...form, commissionPercent: e.target.value })
                  }
                  required
                  min="1"
                  max="100"
                  className="rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Influencer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
        {influencers.length === 0 ? (
          <div className="p-10 text-center text-gray-text">
            No influencers yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                  <th className="px-5 py-4">
                    Name
                  </th>
                  <th className="px-5 py-4">
                    Email
                  </th>
                  <th className="px-5 py-4">
                    Coupon
                  </th>
                  <th className="px-5 py-4">
                    Discount
                  </th>
                  <th className="px-5 py-4">
                    Commission
                  </th>
                  <th className="px-5 py-4">
                    Uses
                  </th>
                  <th className="px-5 py-4">
                    Status
                  </th>
                  <th className="px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((inf) => (
                  <tr
                    key={inf.id}
                    className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {inf.name}
                    </td>
                    <td className="px-5 py-4 text-gray-text">{inf.email}</td>
                    <td className="px-5 py-4 font-mono font-bold text-primary">
                      {inf.coupon?.code || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {inf.coupon?.discountPercent || 0}%
                    </td>
                    <td className="px-5 py-4">
                      {inf.coupon?.commissionPercent || 0}%
                    </td>
                    <td className="px-5 py-4">
                      {inf.coupon?._count?.usages || 0}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(inf)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          inf.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inf.status}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openDetail(inf.id)}
                        className="rounded-lg border border-stroke p-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
