import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "si_dashboard-line.svg",
    path: "/dashboard/influencer",
  },
  {
    label: "Coupon Users",
    icon: "carbon_customer.svg",
    path: "/dashboard/influencer/coupon-users",
  },
  {
    label: "Earnings",
    icon: "dashicons_money-alt.svg",
    path: "/dashboard/influencer/earnings",
  },
] as const;

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

export default function InfluencerLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/influencer/login");
  };

  const currentItem = [...sidebarItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      item.path === "/dashboard/influencer"
        ? location.pathname === "/dashboard/influencer" ||
          location.pathname === "/dashboard/influencer/"
        : location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/")
    );

  const title = currentItem?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full rounded-[32px] bg-card p-4 text-foreground shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img
                className="h-12 w-auto"
                src="/home-page/Logo.png"
                alt="Gen-Z"
              />
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 overflow-y-auto pr-2 no-scrollbar pb-4">
              {sidebarItems.map((item) => {
                const isActive = item.label === currentItem?.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-text hover:bg-gray-100 dark:hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <div
                      className="h-6 w-6 shrink-0"
                      style={{
                        backgroundColor: "currentColor",
                        WebkitMask: `url(${traderAsset(item.icon)}) no-repeat center / contain`,
                        mask: `url(${traderAsset(item.icon)}) no-repeat center / contain`,
                      }}
                    />
                    <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto space-y-4 shrink-0">
              <div className="rounded-[24px] bg-gray-50 dark:bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 ring-2 ring-stroke dark:ring-white/10">
                    <svg
                      className="h-7 w-7 text-gray-text"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-['Montserrat'] text-sm font-semibold text-foreground">
                      {user?.name || "Influencer"}
                    </p>
                    <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-primary">
                      INFLUENCER
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl border border-stroke px-4 py-3 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/10"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-5 pb-6">
          <div className="flex h-20 items-center justify-between rounded-3xl border border-stroke bg-card px-6">
            <h1 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stroke bg-gray-100">
                <svg
                  className="h-7 w-7 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
