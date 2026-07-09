import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const sidebarItems = [
  { label: "Overview", icon: "si_dashboard-line.svg", path: "/dashboard/trader" },
  { label: "Retail", icon: "fluent_building-retail-20-regular.svg", path: "/dashboard/trader/retail" },
  { label: "Dropshipping", icon: "streamline-flex_shipping-box-2.svg", path: "/dashboard/trader/dropshipping" },
  { label: "Wholesale", icon: "system-uicons_boxes.svg", path: "/dashboard/trader/wholesale" },
  { label: "Brand Partners", icon: "mdi_partnership-outline.svg", path: "/dashboard/trader/brand-partners" },
  { label: "Products", icon: "streamline-ultimate_products-gifts.svg", path: "/dashboard/trader/products" },
  { label: "Orders", icon: "carbon_follow-up-work-order.svg", path: "/dashboard/trader/orders" },
  { label: "Inventory", icon: "material-symbols_inventory.svg", path: "/dashboard/trader/inventory" },
  { label: "Customers", icon: "carbon_customer.svg", path: "/dashboard/trader/customers" },
  { label: "Coupons", icon: "dashicons_money-alt.svg", path: "/dashboard/trader/coupons" },
  { label: "Finance", icon: "material-symbols_finance-rounded.svg", path: "/dashboard/trader/finance" },
  { label: "Notifications", icon: "ion_notifications-outline.svg", path: "/dashboard/trader/notifications" },
  { label: "Analytics", icon: "grommet-icons_analytics.svg", path: "/dashboard/trader/analytics" },
  { label: "Help Center", icon: "help-circle.svg", path: "/dashboard/trader/help-center" },
  { label: "Store Settings", icon: "solar_settings-linear.svg", path: "/dashboard/trader/settings" },
] as const;

export default function TraderLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const avatar = typeof user?.avatar === "string" && user.avatar ? user.avatar : null;

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const currentItem = sidebarItems.find(item => 
    item.path === "/dashboard/trader" 
      ? location.pathname === "/dashboard/trader" || location.pathname === "/dashboard/trader/"
      : location.pathname.startsWith(item.path)
  );
  
  const title = currentItem ? currentItem.label : "Dashboard";

  return (
    <div className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full rounded-[32px] bg-secondary p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img className="h-12 w-auto" src={traderAsset("logo gen-z .white 1.png")} alt="Gen-Z" />
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
              {sidebarItems.map((item) => {
                const isActive = item.label === currentItem?.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive ? "bg-primary text-foreground" : "text-gray-text hover:bg-white/5 hover:text-white"
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
                    <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 space-y-4 shrink-0">
              <div className="rounded-[24px] bg-white/6 p-3">
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" src={avatar} alt={user?.name || "Trader"} />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/10">
                      <svg className="h-7 w-7 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-['Montserrat'] text-sm font-semibold text-white">{user?.name || "Maan Hassan"}</p>
                    <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-primary">{user?.role || "trader"}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl border border-white/10 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-white transition hover:border-primary/40 hover:bg-primary/10"
              >
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 space-y-5 pb-6">
          {/* Top Header */}
          <div className="flex h-20 items-center justify-between rounded-3xl border border-stroke bg-white px-6">
            <h1 className="font-['Montserrat'] text-xl font-semibold text-foreground">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-white transition hover:bg-gray-50">
                <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor" />
                </svg>
              </button>
              {avatar ? (
                <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt="Profile" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stroke bg-gray-100">
                  <svg className="h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Area */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
