import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "sonner";

interface CouponUser {
  userId: number;
  userName: string | null;
  userEmail: string;
  userPhone: string | null;
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  commissionAmount: number;
  usedAt: string;
}

export default function InfluencerCouponUsersPage() {
  const [users, setUsers] = useState<CouponUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/influencer/coupon-users")
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load coupon users"))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="rounded-2xl border border-stroke bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-5 py-4 font-semibold text-gray-text">User</th>
              <th className="px-5 py-4 font-semibold text-gray-text">Email</th>
              <th className="px-5 py-4 font-semibold text-gray-text">Phone</th>
              <th className="px-5 py-4 font-semibold text-gray-text">
                Order Total
              </th>
              <th className="px-5 py-4 font-semibold text-gray-text">
                Discount
              </th>
              <th className="px-5 py-4 font-semibold text-gray-text">
                Commission
              </th>
              <th className="px-5 py-4 font-semibold text-gray-text">Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
