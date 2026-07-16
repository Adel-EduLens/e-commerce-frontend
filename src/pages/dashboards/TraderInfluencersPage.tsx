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

  const handleGenerateSettlements = async () => {
    try {
      const res = await api.post("/trader/influencers/settlements/generate");
      toast.success(
        `Settlements generated: ${res.data.data.settlementsCreated} created`
      );
    } catch (error) {
      handleApiError(error, "Failed to generate settlements");
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
          }}
          className="text-sm text-primary hover:underline"
        >
          Back to list
        </button>

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
        <div className="flex gap-2">
          <button
            onClick={handleGenerateSettlements}
            className="rounded-xl border border-stroke px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-gray-100 dark:hover:bg-white/5"
          >
            Generate Settlements
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} />
            Add Influencer
          </button>
        </div>
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
              <thead className="border-b border-stroke bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Name
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Email
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Coupon
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Discount
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Commission
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Uses
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-text">
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
