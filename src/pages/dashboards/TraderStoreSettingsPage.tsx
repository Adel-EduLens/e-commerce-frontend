import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

const traderAsset = (file: string) =>
  `/trader-overview/${file.split("/").map(encodeURIComponent).join("/")}`;

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
  { label: "Store Settings", icon: "solar_settings-linear.svg", path: "/dashboard/trader/settings" },
] as const;

function GeneralInfoTab() {
  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">General Information</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#BBFF63] px-6 py-3 font-['Montserrat'] text-base font-semibold text-[#111827] transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Store Name</label>
          <div className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 overflow-hidden border border-[#E5E7EB]">
            <img src="/store setting/tabler_photo-up.svg" className="h-6 w-6 opacity-60" alt="Upload" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Store Name</label>
          <input
            type="text"
            defaultValue="GenZ"
            className="w-80 rounded-lg border border-[#E5E7EB] bg-white p-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Contact Email</label>
          <input
            type="email"
            defaultValue="GenZ@Gmail.com"
            className="w-80 rounded-lg border border-[#E5E7EB] bg-white p-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Phone</label>
          <input
            type="tel"
            defaultValue="011145574412"
            className="w-80 rounded-lg border border-[#E5E7EB] bg-white p-4 font-['Montserrat'] text-base font-medium text-[#111827] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Address</label>
          <img
            className="h-52 w-96 rounded-lg object-cover"
            src="/store setting/🌎 Map Maker_ Cairo, Cairo, Egypt (Standard).png"
            alt="Map placeholder"
          />
        </div>
      </div>
    </div>
  );
}


function ShippingSettingsTab() {
  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Shipping Settings</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#BBFF63] px-6 py-3 font-['Montserrat'] text-base font-semibold text-[#111827] transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
            Default Shipping Region
          </label>
          <div className="relative">
            <select className="h-16 w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]">
              <option>Default Shipping Region</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">
            Shipping Provider
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <select className="h-16 w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]">
                <option>Shipping Provider</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="relative w-80">
              <select className="h-16 w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]">
                <option>Shipping Provider</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Shipping Rate</label>
          <input
            type="text"
            placeholder="Shipping Rate"
            className="h-16 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Free Shipping Above</label>
          <input
            type="text"
            placeholder="Free Shipping Above"
            className="h-16 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">Estimated Delivery Time</label>
          <input
            type="text"
            placeholder="Estimated Delivery Time"
            className="h-16 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>
      </div>
    </div>
  );
}

function TaxSettingsTab() {
  const [applyVat, setApplyVat] = useState(true);
  const [includeVat, setIncludeVat] = useState(true);

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Tax settings</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#BBFF63] px-6 py-3 font-['Montserrat'] text-base font-semibold text-[#111827] transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-base font-semibold text-[#111827]">Apply VAT</span>
          <button
            onClick={() => setApplyVat(!applyVat)}
            className={`relative h-9 w-14 rounded-full transition-colors ${
              applyVat ? "bg-[#BBFF63]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 h-7 w-7 rounded-full bg-white transition-transform ${
                applyVat ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-[#111827]">VAT Percentage</label>
          <input
            type="text"
            placeholder="VAT Percentage"
            className="h-16 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 font-['Montserrat'] text-base font-medium text-[#6B7280] outline-none transition focus:border-[#D1D5DB]"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-base font-semibold text-[#111827]">Include VAT in Prices</span>
          <button
            onClick={() => setIncludeVat(!includeVat)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E7EB] bg-white transition hover:bg-gray-50"
          >
            {includeVat && (
              <svg className="h-5 w-5 text-[#111827]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamMembersTab() {
  const teamMembers = [
    { name: "Sarah Ahmed", role: "Admin", email: "Sarah@genz.com", status: "Active" },
    { name: "Ali Hassan", role: "Manager", email: "Sarah@genz.com", status: "Pending" },
    { name: "Ali Hassan", role: "Manager", email: "Sarah@genz.com", status: "Pending" },
    { name: "Ali Hassan", role: "Manager", email: "Sarah@genz.com", status: "Pending" },
  ];

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Team Members</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#BBFF63] px-6 py-3 font-['Montserrat'] text-base font-semibold text-[#111827] transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden pb-4 shadow-sm">
        <div className="p-6 pb-2">
          <h3 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">Team Member Table</h3>
        </div>

        <div className="w-full overflow-x-auto px-4">
          <table className="w-full text-left font-['Montserrat']">
            <thead>
              <tr className="bg-[#111827] text-xs font-medium text-[#BBFF63]">
                <th className="px-4 py-3 rounded-l-lg w-12 text-center">
                  <div className="mx-auto h-5 w-5 rounded border border-[#BBFF63] bg-[#111827] flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-[#BBFF63]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 rounded-r-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, i) => (
                <tr key={i} className="text-xs font-medium text-[#111827] border-b border-[#E5E7EB] last:border-0">
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-5 w-5 rounded border border-[#E5E7EB] bg-white flex items-center justify-center" />
                  </td>
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.role}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center rounded-2xl px-2 py-1 text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="flex h-6 w-6 mx-auto items-center justify-center text-gray-400 hover:text-gray-600">
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="3" r="1.5" />
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="8" cy="13" r="1.5" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">{title}</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#BBFF63] px-6 py-3 font-['Montserrat'] text-base font-semibold text-[#111827] transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>
      <p className="font-['Montserrat'] text-[#6B7280]">This tab content is not implemented yet.</p>
    </div>
  );
}

export default function TraderStoreSettingsPage() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("General Info");

  const avatar =
    typeof user?.avatar === "string" && user.avatar
      ? user.avatar
      : traderAsset("unsplash_8Vt2haq8NSQ.png");

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const tabs = [
    { name: "General Info", icon: "si_dashboard-line.svg" },

    { name: "Shipping Settings", icon: "material-symbols-light_local-shipping-outline.svg" },
    { name: "Tax Settings", icon: "tabler_receipt-tax.svg" },
    { name: "Notification", icon: "tdesign_notification.svg" },
    { name: "Team Members", icon: "fluent_people-team-20-regular.svg" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 text-[#111827] sm:p-6">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full rounded-[32px] bg-[#111827] p-4 text-white shadow-[0_18px_50px_-24px_rgba(17,24,39,0.7)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-w-[280px] lg:p-5">
          <div className="flex h-full flex-col">
            <div className="mb-8">
              <img className="h-12 w-auto" src={traderAsset("logo gen-z .white 1.png")} alt="Gen-Z" />
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {sidebarItems.map((item) => {
                const isActive = item.label === "Store Settings";
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive ? "bg-[#BBFF63] text-[#111827]" : "text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <img className="h-6 w-6 shrink-0" src={traderAsset(item.icon)} alt="" />
                    <span className="font-['Montserrat'] text-sm font-semibold sm:text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-8 space-y-4 lg:mt-auto">
              <div className="rounded-[24px] bg-white/6 p-3">
                <div className="flex items-center gap-3">
                  <img className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" src={avatar} alt={user?.name || "Trader"} />
                  <div className="min-w-0">
                    <p className="truncate font-['Montserrat'] text-sm font-semibold text-white">{user?.name || "Maan Hassan"}</p>
                    <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-[#BBFF63]">{user?.role || "trader"}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl border border-white/10 px-4 py-3 font-['Montserrat'] text-sm font-semibold text-white transition hover:border-[#BBFF63]/40 hover:bg-[#BBFF63]/10"
              >
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 space-y-5">
          {/* Top Header */}
          <div className="flex h-20 items-center justify-between rounded-3xl border border-[#E5E7EB] bg-white px-6">
            <h1 className="font-['Montserrat'] text-xl font-semibold text-[#111827]">
              Store Settings
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
          
          {/* Main Content Area */}
          <div className="flex min-h-[800px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
            {/* Settings Sidebar */}
            <div className="w-60 shrink-0 border-r-2 border-[#E5E7EB] flex flex-col p-4 gap-2 bg-white">
              {tabs.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex h-14 w-full items-center gap-2 rounded-2xl px-4 py-4 text-left font-['Montserrat'] text-base font-semibold transition ${
                    activeTab === item.name ? "bg-[#BBFF63] text-[#111827]" : "text-[#111827] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <img
                      src={`/store setting/${item.icon}`}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  {item.name}
                </button>
              ))}
            </div>

            {/* Content Area Rendering */}
            {activeTab === "General Info" && <GeneralInfoTab />}

            {activeTab === "Shipping Settings" && <ShippingSettingsTab />}
            {activeTab === "Tax Settings" && <TaxSettingsTab />}
            {activeTab === "Notification" && <PlaceholderTab title="Notification" />}
            {activeTab === "Team Members" && <TeamMembersTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
