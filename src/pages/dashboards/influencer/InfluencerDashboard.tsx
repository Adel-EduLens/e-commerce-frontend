import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { LoadingSpinner } from "../../../components/shared";

interface DashboardData {
  influencer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  coupon: {
    code: string;
    discountPercent: number;
    commissionPercent: number;
    isActive: boolean;
    totalUsages: number;
  } | null;
  earnings: {
    totalEarnings: number;
    pendingEarnings: number;
    eligibleEarnings: number;
    settledEarnings: number;
    currentMonthEarnings: number;
  };
}

export default function InfluencerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get("/influencer/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (data?.coupon?.code) {
      navigator.clipboard.writeText(data.coupon.code);
      setCopied(true);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingSpinner containerClassName="py-20" size="lg" />;
  }

  if (!data) return null;

  const statsCards = [
    {
      label: "Total Earnings",
      value: `EGP ${data.earnings.totalEarnings.toFixed(2)}`,
      color: "text-green-600",
    },
    {
      label: "Pending (< 15 days)",
      value: `EGP ${data.earnings.pendingEarnings.toFixed(2)}`,
      color: "text-yellow-600",
    },
    {
      label: "Eligible for Payout",
      value: `EGP ${data.earnings.eligibleEarnings.toFixed(2)}`,
      color: "text-blue-600",
    },
    {
      label: "Settled / Paid",
      value: `EGP ${data.earnings.settledEarnings.toFixed(2)}`,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-stroke bg-card p-5"
          >
            <p className="text-sm font-medium text-gray-text">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon Info Card */}
      {data.coupon && (
        <div className="rounded-2xl border border-stroke bg-card p-6">
          <h2 className="mb-4 font-['Montserrat'] text-lg font-semibold text-foreground">
            Your Coupon
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 px-5 py-3">
                <span className="font-['Montserrat'] text-2xl font-bold text-primary">
                  {data.coupon.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="rounded-xl border border-stroke p-3 transition hover:bg-gray-100 dark:hover:bg-white/5"
              >
                {copied ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} className="text-gray-text" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-gray-text">User Discount</p>
                <p className="text-xl font-bold text-foreground">
                  {data.coupon.discountPercent}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-text">Your Commission</p>
                <p className="text-xl font-bold text-foreground">
                  {data.coupon.commissionPercent}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-text">Total Uses</p>
                <p className="text-xl font-bold text-foreground">
                  {data.coupon.totalUsages}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-text">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    data.coupon.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {data.coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Month */}
      <div className="rounded-2xl border border-stroke bg-card p-6">
        <h2 className="mb-2 font-['Montserrat'] text-lg font-semibold text-foreground">
          This Month
        </h2>
        <p className="text-3xl font-bold text-primary">
          EGP {data.earnings.currentMonthEarnings.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-gray-text">Earnings this month</p>
      </div>
    </div>
  );
}
