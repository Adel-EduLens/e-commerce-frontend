import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

const sidebarItems = [
  {
    label: "overview",
    icon: "si_dashboard-line.svg",
    path: "/dashboard/trader",
  },
  // {
  //   label: "retail",
  //   icon: "fluent_building-retail-20-regular.svg",
  //   path: "/dashboard/trader/rental",
  // },
  // {
  //   label: "dropshipping",
  //   icon: "streamline-flex_shipping-box-2.svg",
  //   path: "/dashboard/trader/dropshipping",
  // },
  // {
  //   label: "wholesale",
  //   icon: "system-uicons_boxes.svg",
  //   path: "/dashboard/trader/wholesale",
  // },
  // {
  //   label: "brandPartners",
  //   icon: "mdi_partnership-outline.svg",
  //   path: "/dashboard/trader/brand-partners",
  // },
  {
    label: "categories",
    icon: "carbon_category-2.svg",
    path: "/dashboard/trader/categories",
  },
  {
    label: "products",
    icon: "streamline-ultimate_products-gifts.svg",
    path: "/dashboard/trader/products",
  },
  {
    label: "orders",
    icon: "carbon_follow-up-work-order.svg",
    path: "/dashboard/trader/orders",
  },
  // {
  //   label: "inventory",
  //   icon: "material-symbols_inventory.svg",
  //   path: "/dashboard/trader/inventory",
  // },
  {
    label: "customers",
    icon: "carbon_customer.svg",
    path: "/dashboard/trader/customers",
  },
  {
    label: "coupons",
    icon: "dashicons_money-alt.svg",
    path: "/dashboard/trader/coupons",
  },
  {
    label: "finance",
    icon: "material-symbols_finance-rounded.svg",
    path: "/dashboard/trader/finance",
  },
  {
    label: "notifications",
    icon: "ion_notifications-outline.svg",
    path: "/dashboard/trader/notifications",
  },
  // {
  //   label: "analytics",
  //   icon: "grommet-icons_analytics.svg",
  //   path: "/dashboard/trader/analytics",
  // },
  {
    label: "Collections",
    icon: "carbon_category-2.svg",
    path: "/dashboard/trader/collections",
  },
  {
    label: "influencers",
    icon: "majesticons_users-line.svg",
    path: "/dashboard/trader/influencers",
  },
  {
    label: "designs",
    icon: "vote.svg",
    path: "/dashboard/trader/designs",
  },
  {
    label: "websiteSettings",
    icon: "solar_settings-linear.svg",
    path: "/dashboard/trader/website-settings",
  },
  {
    label: "preferences",
    icon: "solar_settings-linear.svg",
    path: "/dashboard/trader/preferences",
  },
  // {
  //   label: "storeSettings",
  //   icon: "solar_settings-linear.svg",
  //   path: "/dashboard/trader/settings",
  // }

] as const;

export default function TraderLayout() {
  const { t } = useTranslation("traderLayout");
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const avatar =
    typeof user?.avatar === "string" && user.avatar ? user.avatar : null;

  const handleLogout = () => {
    clearAuth();
    toast.success(t("loggedOut"));
    navigate("/login");
  };

  const currentItem = [...sidebarItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      item.path === "/dashboard/trader"
        ? location.pathname === "/dashboard/trader" ||
        location.pathname === "/dashboard/trader/"
        : location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/"),
    );

  const title = currentItem ? t(currentItem.label) : t("dashboard");

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <img
          className="h-10 w-auto sm:h-12"
          src={"/home-page/Logo.png"}
          alt="Gen-Z"
        />
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-xl p-2 text-gray-text hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 no-scrollbar pb-4">
        {sidebarItems.map((item) => {
          const isActive = item.label === currentItem?.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition ${isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-gray-text hover:bg-gray-100 dark:hover:bg-white/5 hover:text-foreground"
                }`}
            >
              <div
                className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
                style={{
                  backgroundColor: "currentColor",
                  WebkitMask: `url(${traderAsset(item.icon)}) no-repeat center / contain`,
                  mask: `url(${traderAsset(item.icon)}) no-repeat center / contain`,
                }}
              />
              <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3 shrink-0 pt-3 border-t border-stroke/50">
        <div className="rounded-[24px] bg-gray-50 dark:bg-white/5 p-3">
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-stroke dark:ring-white/10"
                src={avatar}
                alt={user?.name || t("traderRole")}
              />
            ) : (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 ring-2 ring-stroke dark:ring-white/10">
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7 text-gray-text"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-['Montserrat'] text-sm font-semibold text-foreground">
                {user?.name || t("defaultTraderName", "Maan Hassan")}
              </p>
              <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-primary">
                {user?.role === "trader" ? t("traderRole") : user?.role}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl border border-stroke px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/10"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-3 text-foreground sm:p-6">
      <div className="mx-auto flex flex-col w-full max-w-[1440px] gap-4 lg:flex-row">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[280px] lg:shrink-0 rounded-[32px] bg-card p-5 text-foreground shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] border border-stroke/50">
          {navContent}
        </aside>

        {/* Mobile Overlay & Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over Drawer */}
            <aside className="relative z-10 w-full max-w-[300px] bg-card p-5 shadow-2xl h-full flex flex-col border-r border-stroke">
              {navContent}
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 space-y-4 sm:space-y-6 pb-6">
          {/* Top Header */}
          <div className="flex h-16 sm:h-20 items-center justify-between rounded-2xl sm:rounded-3xl border border-stroke bg-card px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stroke bg-background text-foreground hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden transition"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <h1 className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground truncate">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
              <button className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-stroke bg-card transition hover:bg-gray-100 dark:hover:bg-white/5">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {avatar ? (
                <img
                  className="h-9 w-9 sm:h-12 sm:w-12 rounded-full object-cover"
                  src={avatar}
                  alt={t("profile")}
                />
              ) : (
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-stroke bg-gray-100 dark:bg-white/10">
                  <svg
                    className="h-5 w-5 sm:h-7 sm:w-7 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
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

