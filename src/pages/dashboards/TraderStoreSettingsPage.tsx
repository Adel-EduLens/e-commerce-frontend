import { useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useUpdateTraderMe } from "../../hooks/queries/traderQuery";
import { uploadImageFile } from "../../components/trader/inventoryUtils";
import GoogleMapPicker, { type PickedLocation } from "../../components/GoogleMap";

function GeneralInfoTab() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { mutate: saveProfile, isPending: isSaving } = useUpdateTraderMe();

  const [name, setName] = useState(user?.name ?? "");
  const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(() => {
    if (!user?.address) return null;
    try { return JSON.parse(user.address); } catch { return null; }
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImageFile(file);
      updateUser({ ...user, avatar: url });
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = () => {
    setSaveSuccess(false);
    saveProfile(
      { name, address: pickedLocation ? JSON.stringify(pickedLocation) : undefined },
      { onSuccess: () => setSaveSuccess(true) }
    );
  };

  const addressLabel = pickedLocation
    ? [pickedLocation.streetAddress, pickedLocation.area, pickedLocation.city]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8 flex items-center justify-between max-w-4xl">
        <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">General Information</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-foreground transition hover:bg-[#a5f348] disabled:opacity-60"
        >
          {isSaving ? "Saving…" : saveSuccess ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-xl">
        {/* Avatar */}
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Profile Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div
            onClick={() => !avatarUploading && fileInputRef.current?.click()}
            className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 overflow-hidden border border-stroke"
          >
            {user?.avatar ? (
              <img src={user.avatar} className="h-full w-full object-cover" alt="Avatar" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-100">
                <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <img src="/store setting/tabler_photo-up.svg" className="h-4 w-4 opacity-40" alt="Upload" />
              </div>
            )}
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Store Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-80 rounded-lg border border-stroke bg-white p-4 font-['Montserrat'] text-base font-medium text-foreground outline-none transition focus:border-stroke"
          />
        </div>

        {/* Email — read-only */}
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Contact Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            readOnly
            className="w-80 rounded-lg border border-stroke bg-gray-50 p-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none cursor-not-allowed"
          />
        </div>

        {/* Phone — disabled */}
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Phone</label>
          <input
            type="tel"
            value={user?.phone ?? ""}
            disabled
            className="w-80 rounded-lg border border-stroke bg-gray-50 p-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none cursor-not-allowed"
          />
        </div>

        {/* Address — map picker */}
        <div className="flex flex-col gap-2">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Address</label>
          {addressLabel && (
            <p className="font-['Montserrat'] text-sm text-gray-text">{addressLabel}</p>
          )}
          <GoogleMapPicker
            onLocationPick={setPickedLocation}
            searchQuery={
              pickedLocation
                ? [pickedLocation.area, pickedLocation.city].filter(Boolean).join(", ")
                : undefined
            }
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
        <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Shipping Settings</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-foreground transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">
            Default Shipping Region
          </label>
          <div className="relative">
            <select className="h-16 w-full appearance-none rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke">
              <option>Default Shipping Region</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">
            Shipping Provider
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <select className="h-16 w-full appearance-none rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke">
                <option>Shipping Provider</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="relative w-80">
              <select className="h-16 w-full appearance-none rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke">
                <option>Shipping Provider</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-4 w-4 text-gray-text" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Shipping Rate</label>
          <input
            type="text"
            placeholder="Shipping Rate"
            className="h-16 w-full rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Free Shipping Above</label>
          <input
            type="text"
            placeholder="Free Shipping Above"
            className="h-16 w-full rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">Estimated Delivery Time</label>
          <input
            type="text"
            placeholder="Estimated Delivery Time"
            className="h-16 w-full rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke"
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
        <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Tax settings</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-foreground transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-base font-semibold text-foreground">Apply VAT</span>
          <button
            onClick={() => setApplyVat(!applyVat)}
            className={`relative h-9 w-14 rounded-full transition-colors ${
              applyVat ? "bg-primary" : "bg-gray-300"
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
          <label className="font-['Montserrat'] text-base font-semibold text-foreground">VAT Percentage</label>
          <input
            type="text"
            placeholder="VAT Percentage"
            className="h-16 w-full rounded-lg border border-stroke bg-white px-4 font-['Montserrat'] text-base font-medium text-gray-text outline-none transition focus:border-stroke"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-base font-semibold text-foreground">Include VAT in Prices</span>
          <button
            onClick={() => setIncludeVat(!includeVat)}
            className="flex h-8 w-8 items-center justify-center rounded border border-stroke bg-white transition hover:bg-gray-50"
          >
            {includeVat && (
              <svg className="h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="currentColor">
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
        <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">Team Members</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-foreground transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl rounded-2xl border border-stroke bg-white overflow-hidden pb-4 shadow-sm">
        <div className="p-6 pb-2">
          <h3 className="font-['Montserrat'] text-xl font-semibold text-foreground">Team Member Table</h3>
        </div>

        <div className="w-full overflow-x-auto px-4">
          <table className="w-full text-left font-['Montserrat']">
            <thead>
              <tr className="bg-secondary text-xs font-medium text-primary">
                <th className="px-4 py-3 rounded-l-lg w-12 text-center">
                  <div className="mx-auto h-5 w-5 rounded border border-primary bg-secondary flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
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
                <tr key={i} className="text-xs font-medium text-foreground border-b border-stroke last:border-0">
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-5 w-5 rounded border border-stroke bg-white flex items-center justify-center" />
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
        <h2 className="font-['Montserrat'] text-xl font-semibold text-foreground">{title}</h2>
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-['Montserrat'] text-base font-semibold text-foreground transition hover:bg-[#a5f348]">
          Save
        </button>
      </div>
      <p className="font-['Montserrat'] text-gray-text">This tab content is not implemented yet.</p>
    </div>
  );
}

export default function TraderStoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("General Info");

  const tabs = [
    { name: "General Info", icon: "si_dashboard-line.svg" },
    { name: "Shipping Settings", icon: "material-symbols-light_local-shipping-outline.svg" },
    { name: "Tax Settings", icon: "tabler_receipt-tax.svg" },
    { name: "Notification", icon: "tdesign_notification.svg" },
    { name: "Team Members", icon: "fluent_people-team-20-regular.svg" },
  ];

  return (
    <div className="flex min-h-[800px] overflow-hidden rounded-2xl border border-stroke bg-white shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
      {/* Settings Sidebar */}
      <div className="w-60 shrink-0 border-r-2 border-stroke flex flex-col p-4 gap-2 bg-white">
        {tabs.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex h-14 w-full items-center gap-2 rounded-2xl px-4 py-4 text-left font-['Montserrat'] text-base font-semibold transition ${
              activeTab === item.name ? "bg-primary text-foreground" : "text-foreground hover:bg-gray-50"
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
  );
}
