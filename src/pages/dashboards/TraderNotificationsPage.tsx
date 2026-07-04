import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const traderAsset = (file: string) => `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;



const sidebarItems = [
  { label: "Overview", icon: "si_dashboard-line.svg", path: "/dashboard/trader" },
  { label: "Retail", icon: "fluent_building-retail-20-regular.svg", path: "" },
  { label: "Dropshipping", icon: "streamline-flex_shipping-box-2.svg", path: "" },
  { label: "Wholesale", icon: "system-uicons_boxes.svg", path: "/dashboard/trader/wholesale" },
  { label: "Brand Partners", icon: "mdi_partnership-outline.svg", path: "/dashboard/trader/brand-partners" },
  { label: "Products", icon: "streamline-ultimate_products-gifts.svg", path: "/dashboard/trader/products" },
  { label: "Orders", icon: "carbon_follow-up-work-order.svg", path: "/dashboard/trader/orders" },
  { label: "Inventory", icon: "material-symbols_inventory.svg", path: "/dashboard/trader/inventory" },
  { label: "Customers", icon: "carbon_customer.svg", path: "/dashboard/trader/customers" },
  { label: "Finance", icon: "material-symbols_finance-rounded.svg", path: "/dashboard/trader/finance" },
  { label: "Notifications", icon: "ion_notifications-outline.svg", path: "/dashboard/trader/notifications" },
  { label: "Analytics", icon: "grommet-icons_analytics.svg", path: "/dashboard/trader/analytics" },
  { label: "Store Settings", icon: "solar_settings-linear.svg", path: "" },
] as const;

const notificationsData = Array(8).fill({
  title: "Low Stock Alert",
  date: "Oct 4, 10:32 AM",
  description: "Your order has been shipped and is expected to arrive tomorrow.",
});

export default function TraderNotificationsPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
        {/* ── Sidebar ── */}
        

        {/* ── Main ── */}
        <div className="flex-1 space-y-5">
          {/* Top Header */}
          <div className="flex h-20 items-center justify-between rounded-3xl border border-[#E5E7EB] bg-white px-6">
            <h1 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">
              Notification
            </h1>
            <div className="flex items-center gap-4">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition hover:bg-gray-50">
                <svg className="h-5 w-5 text-[#111827]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor" />
                </svg>
              </button>
              <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt="Profile" />
            </div>
          </div>

          {/* Search + filters */}
          <div className="flex flex-wrap items-center gap-3.5">
            <label className="relative flex w-80 items-center">
              <svg className="pointer-events-none absolute left-4 h-5 w-5 text-[#111827]" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#D1D5DB]"
              />
            </label>
            <button
              type="button"
              className="flex h-11 items-center gap-1 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 font-['Montserrat'] text-sm font-medium text-[#111827] transition hover:bg-[#F9FAFB]"
            >
              All
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Notifications List Panel */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)] sm:p-5">
            <h2 className="mb-6 font-['Montserrat'] text-xl font-semibold text-[#111827]">
              Notification
            </h2>
            
            <div className="flex flex-col gap-4">
              {notificationsData.map((notification, idx) => (
                <div 
                  key={idx}
                  className="relative rounded-lg border border-[#E5E7EB] bg-[#F5F7FA] p-4 shadow-[0_6px_20px_-2px_rgba(30,37,45,0.10)]"
                >
                  <div className="absolute right-4 top-4 text-xs font-medium font-['Montserrat'] text-[#6B7280]">
                    {notification.date}
                  </div>
                  
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700">
                      <svg className="h-3 w-3 text-emerald-700" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="font-['Montserrat'] text-sm font-semibold text-[#111827]">
                      {notification.title}
                    </h3>
                  </div>
                  
                  <p className="font-['Montserrat'] text-sm font-medium text-[#6B7280]">
                    {notification.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
    </>
  );
}