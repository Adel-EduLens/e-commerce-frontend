import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { toast } from "sonner";

interface Commission {
  id: string;
  orderId: string;
  orderTotal: number;
  commissionPercent: number;
  commissionAmount: number;
  status: string;
  eligibleAt: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
    createdAt: string;
  };
  settlement: {
    id: string;
    periodStart: string;
    periodEnd: string;
  } | null;
}

interface Settlement {
  id: string;
  totalAmount: number;
  periodStart: string;
  periodEnd: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  _count: { commissions: number };
}

export default function InfluencerEarningsPage() {
  const [tab, setTab] = useState<"commissions" | "settlements">("commissions");
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [commRes, settRes] = await Promise.all([
          api.get("/influencer/commissions"),
          api.get("/influencer/settlements"),
        ]);
        setCommissions(commRes.data.data);
        setSettlements(settRes.data.data);
      } catch {
        toast.error("Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      ELIGIBLE: "bg-blue-100 text-blue-700",
      SETTLED: "bg-green-100 text-green-700",
      PAID: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("commissions")}
          className={`rounded-xl px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition ${
            tab === "commissions"
              ? "bg-primary text-primary-foreground"
              : "border border-stroke bg-card text-gray-text hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          Commission History
        </button>
        <button
          onClick={() => setTab("settlements")}
          className={`rounded-xl px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition ${
            tab === "settlements"
              ? "bg-primary text-primary-foreground"
              : "border border-stroke bg-card text-gray-text hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          Monthly Settlements
        </button>
      </div>

      {/* Commissions Table */}
      {tab === "commissions" && (
        <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
          {commissions.length === 0 ? (
            <div className="p-10 text-center text-gray-text">
              No commissions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                    <th className="px-5 py-4">
                      Order ID
                    </th>
                    <th className="px-5 py-4">
                      Order Total
                    </th>
                    <th className="px-5 py-4">
                      Commission %
                    </th>
                    <th className="px-5 py-4">
                      Amount
                    </th>
                    <th className="px-5 py-4">
                      Status
                    </th>
                    <th className="px-5 py-4">
                      Eligible At
                    </th>
                    <th className="px-5 py-4">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-gray-text">
                        #{c.orderId.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        EGP {c.orderTotal.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        {c.commissionPercent}%
                      </td>
                      <td className="px-5 py-4 font-semibold text-green-600">
                        +EGP {c.commissionAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">{statusBadge(c.status)}</td>
                      <td className="px-5 py-4 text-gray-text">
                        {new Date(c.eligibleAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-gray-text">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settlements Table */}
      {tab === "settlements" && (
        <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
          {settlements.length === 0 ? (
            <div className="p-10 text-center text-gray-text">
              No settlements yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                    <th className="px-5 py-4">
                      Period
                    </th>
                    <th className="px-5 py-4">
                      Total Amount
                    </th>
                    <th className="px-5 py-4">
                      Orders
                    </th>
                    <th className="px-5 py-4">
                      Status
                    </th>
                    <th className="px-5 py-4">
                      Paid Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-stroke last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">
                        {new Date(s.periodStart).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 font-semibold text-green-600">
                        EGP {s.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        {s._count.commissions}
                      </td>
                      <td className="px-5 py-4">{statusBadge(s.status)}</td>
                      <td className="px-5 py-4 text-gray-text">
                        {s.paidAt
                          ? new Date(s.paidAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
