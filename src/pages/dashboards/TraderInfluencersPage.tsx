import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation("traderInfluencersPage");
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
      .catch(() => toast.error(t("toast.loadError", "Failed to load influencers")))
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
      toast.success(t("toast.created", "Influencer created!"));
      setShowCreate(false);
      setForm(emptyForm);
      loadInfluencers();
    } catch (error) {
      handleApiError(error, t("toast.createError", "Failed to create influencer"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (inf: Influencer) => {
    const newStatus = inf.status === "active" ? "suspended" : "active";
    try {
      await api.patch(`/trader/influencers/${inf.id}`, { status: newStatus });
      toast.success(
        t("toast.statusUpdated", `Influencer ${newStatus}`, {
          status:
            newStatus === "active"
              ? t("status.Active", "Active")
              : t("status.Inactive", "Inactive"),
        })
      );
      loadInfluencers();
    } catch (error) {
      handleApiError(error, t("toast.updateStatusError", "Failed to update status"));
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
      toast.error(t("toast.loadDetailsError", "Failed to load influencer details"));
    }
  };

  const loadCouponUsers = async (id: number) => {
    setCouponUsersLoading(true);
    try {
      const res = await api.get(`/trader/influencers/${id}/coupon-users`);
      setCouponUsers(res.data.data);
    } catch {
      toast.error(t("toast.loadCouponUsersError", "Failed to load coupon users"));
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
      toast.success(t("toast.couponUpdated", "Coupon updated!"));
      setEditCoupon(false);
      openDetail(selectedId);
      loadInfluencers();
    } catch (error) {
      handleApiError(error, t("toast.updateCouponError", "Failed to update coupon"));
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
          {t("backToList", "Back to list")}
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
            {t("tabs.info", "Info & Coupon")}
          </button>
          <button
            onClick={() => handleTabChange("coupon-users")}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
              detailTab === "coupon-users"
                ? "border-primary text-primary"
                : "border-transparent text-gray-text hover:text-foreground"
            }`}
          >
            {t("tabs.couponUsers", "Coupon Users")}
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
                  <span className="text-gray-text">{t("info.email", "Email:")}</span>{" "}
                  {detailData.influencer.email}
                </p>
                <p>
                  <span className="text-gray-text">{t("info.phone", "Phone:")}</span>{" "}
                  {detailData.influencer.phone || "—"}
                </p>
                <p>
                  <span className="text-gray-text">{t("info.status", "Status:")}</span>{" "}
                  {t(`status.${detailData.influencer.status}` as any, detailData.influencer.status) as string}
                </p>
              </div>
            </div>

            {/* Coupon */}
            {detailData.coupon && (
              <div className="rounded-2xl border border-stroke bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-['Montserrat'] text-lg font-semibold">
                    {t("coupon.title", "Coupon Settings")}
                  </h2>
                  <button
                    onClick={() => setEditCoupon(!editCoupon)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Edit2 size={14} />
                    {editCoupon ? t("coupon.cancel", "Cancel") : t("coupon.edit", "Edit")}
                  </button>
                </div>

                {editCoupon ? (
                  <div className="space-y-3">
                    <input
                      placeholder={t("coupon.placeholderCode", "Coupon Code")}
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, code: e.target.value })
                      }
                      className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="number"
                        placeholder={t("coupon.placeholderDiscount", "Discount %")}
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
                        placeholder={t("coupon.placeholderCommission", "Commission %")}
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
                      {t("coupon.active", "Active")}
                    </label>
                    <button
                      onClick={handleUpdateCoupon}
                      className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      {t("coupon.saveChanges", "Save Changes")}
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-gray-text">{t("info.code", "Code:")}</span>{" "}
                      <span className="font-bold">{detailData.coupon.code}</span>
                    </p>
                    <p>
                      <span className="text-gray-text">{t("info.discount", "Discount:")}</span>{" "}
                      {detailData.coupon.discountPercent}%
                    </p>
                    <p>
                      <span className="text-gray-text">{t("info.commission", "Commission:")}</span>{" "}
                      {detailData.coupon.commissionPercent}%
                    </p>
                    <p>
                      <span className="text-gray-text">{t("info.status", "Status:")}</span>{" "}
                      {detailData.coupon.isActive
                        ? (t("status.Active", "Active") as string)
                        : (t("status.Inactive", "Inactive") as string)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Stats */}
            {detailData.stats && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">{t("stats.totalEarnings", "Total Earnings")}</p>
                  <p className="mt-1 text-xl font-bold text-green-600">
                    EGP {detailData.stats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">{t("stats.pending", "Pending")}</p>
                  <p className="mt-1 text-xl font-bold text-yellow-600">
                    EGP {detailData.stats.pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">{t("stats.eligible", "Eligible")}</p>
                  <p className="mt-1 text-xl font-bold text-blue-600">
                    EGP {detailData.stats.eligibleEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-card p-5">
                  <p className="text-sm text-gray-text">{t("stats.settled", "Settled")}</p>
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
                <p className="text-gray-text">{t("couponUsers.noUsers", "No coupon users yet")}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                        <th className="px-5 py-4">{t("couponUsers.table.user", "User")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.email", "Email")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.phone", "Phone")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.orderTotal", "Order Total")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.discount", "Discount")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.commission", "Commission")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.date", "Date")}</th>
                        <th className="px-5 py-4">{t("couponUsers.table.items", "Items")}</th>
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
                            {new Date(u.usedAt).toLocaleDateString(
                              i18n.language === "ar" ? "ar-EG" : "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
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
                  {t("modal.title", "Order Products")}
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
                    <span className="text-gray-text">{t("modal.user", "User:")}</span>{" "}
                    <span className="font-medium text-foreground">
                      {modalData.userName || "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-text">{t("modal.date", "Date:")}</span>{" "}
                    <span className="text-foreground">
                      {new Date(modalData.usedAt).toLocaleDateString(
                        i18n.language === "ar" ? "ar-EG" : "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-text">{t("modal.orderTotal", "Order Total:")}</span>{" "}
                    <span className="text-foreground">
                      EGP {modalData.orderTotal.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-text">{t("modal.discount", "Discount:")}</span>{" "}
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
                        <span className="text-xs text-gray-text">{t("modal.noImg", "No img")}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-text mt-0.5">
                        {item.size && <span>{t("modal.size", "Size:")} {item.size}</span>}
                        {item.color && <span>{t("modal.color", "Color:")} {item.color}</span>}
                        <span>{t("modal.qty", "Qty:")} {item.quantity}</span>
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
          {t("title", "Influencers")}
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={16} />
          {t("addBtn", "Add Influencer")}
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Montserrat'] text-lg font-semibold">
                {t("create.title", "Create Influencer")}
              </h3>
              <button onClick={() => setShowCreate(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder={t("create.name", "Name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder={t("create.email", "Email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                placeholder={t("create.password", "Password")}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder={t("create.phone", "Phone (optional)")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-light px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                placeholder={t("create.couponCode", "Coupon Code (e.g. AHMED20)")}
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
                  placeholder={t("create.discountPercent", "Discount % (for users)")}
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
                  placeholder={t("create.commissionPercent", "Commission % (for influencer)")}
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
                {submitting
                  ? t("create.submitting", "Creating...")
                  : t("create.submit", "Create Influencer")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
        {influencers.length === 0 ? (
          <div className="p-10 text-center text-gray-text">
            {t("noInfluencers", "No influencers yet")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                  <th className="px-5 py-4">{t("table.name", "Name")}</th>
                  <th className="px-5 py-4">{t("table.email", "Email")}</th>
                  <th className="px-5 py-4">{t("table.coupon", "Coupon")}</th>
                  <th className="px-5 py-4">{t("table.discount", "Discount")}</th>
                  <th className="px-5 py-4">{t("table.commission", "Commission")}</th>
                  <th className="px-5 py-4">{t("table.uses", "Uses")}</th>
                  <th className="px-5 py-4">{t("table.status", "Status")}</th>
                  <th className="px-5 py-4">{t("table.actions", "Actions")}</th>
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
                        {t(`status.${inf.status}` as any, inf.status) as string}
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
