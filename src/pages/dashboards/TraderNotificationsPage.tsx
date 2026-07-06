import { useState } from "react";

const notificationsData = Array(8).fill({
  title: "Low Stock Alert",
  date: "Oct 4, 10:32 AM",
  description: "Your order has been shipped and is expected to arrive tomorrow.",
});

export default function TraderNotificationsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-5">
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
  );
}