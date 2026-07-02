import { useEffect } from "react";
import {
  Bell,
  Clock,
  Gamepad2,
  Gift,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from "../components/shared";

const placeholderProduct =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='166' viewBox='0 0 140 166'%3E%3Crect width='140' height='166' fill='%23D9D9D9'/%3E%3C/svg%3E";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

function SidebarRow({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  return (
    <div
      className={`inline-flex items-center justify-start gap-4 rounded-lg p-4 ${
        item.active
          ? "self-stretch bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
          : item.label === "Wallet & Rewards"
            ? ""
            : "self-stretch"
      }`}
    >
      <Icon className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
      <div className="whitespace-nowrap font-['Montserrat'] text-lg font-medium text-[#1A1A1A]">
        {item.label}
      </div>
    </div>
  );
}

function AccountSidebar() {
  const items: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: ShoppingBag, label: "My Orders" },
    { icon: Wallet, label: "Wallet & Rewards" },
    { icon: User, label: "My Info" },
    { icon: Bell, label: "Notifications" },
    { icon: Clock, label: "Notify Me List", active: true },
    { icon: Gift, label: "Gift Cards" },
    { icon: Gamepad2, label: "Avatar" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="absolute left-[24px] top-[122px] inline-flex w-56 flex-col items-start justify-start gap-24">
      <div className="flex self-stretch flex-col items-start justify-start gap-3 rounded-lg">
        {items.map((item) => (
          <SidebarRow key={item.label} item={item} />
        ))}
      </div>
      <div className="inline-flex items-center justify-start gap-4 self-stretch p-4">
        <LogOut className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
        <div className="font-['Montserrat'] text-lg font-medium text-[#DC2626]">
          Sign Out
        </div>
      </div>
    </div>
  );
}

function ProductRequestCard() {
  return (
    <div className="relative h-44 self-stretch overflow-hidden rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <img
        className="absolute left-[8px] top-[8px] h-40 w-36"
        src={placeholderProduct}
        alt="Amber Blaze Classic Tee"
        draggable={false}
      />
      <div className="absolute left-[163px] top-[16px] inline-flex w-60 flex-col items-start justify-start gap-2">
        <div className="self-stretch whitespace-nowrap font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          Amber Blaze Classic Tee
        </div>
        <div className="self-stretch font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          $250
        </div>
        <div className="inline-flex items-center justify-start gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="font-['Montserrat'] text-base text-[#1A1A1A]">
            <span className="font-medium">Size: </span>
            <span className="font-bold">XXL</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
              Color:
            </div>
            <div className="h-6 w-6 rounded-full bg-[#FECACA]" />
          </div>
        </div>
        <div className="self-stretch font-['Montserrat'] text-sm font-semibold text-[#6B7280]">
          Requested on Sep 30, 2025
        </div>
      </div>
      <div className="absolute left-[630px] top-[16px] h-10 w-10 overflow-hidden rounded-full bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
        <Trash2
          className="absolute left-[8px] top-[8px] h-6 w-6 text-[#B91C1C]"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

function NotifyMePanel() {
  return (
    <div className="absolute left-[378px] top-[122px] inline-flex w-[690px] flex-col items-start justify-start gap-6">
      <div className="flex w-[613px] flex-col items-start justify-start gap-4">
        <div className="inline-flex items-center justify-between self-stretch">
          <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
            NOTIFY ME LIST
          </div>
        </div>
        <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          You’ll be notified as soon as these items come back in stock.
        </div>
      </div>
      <div className="flex self-stretch flex-col items-start justify-start gap-4">
        <ProductRequestCard />
        <ProductRequestCard />
      </div>
    </div>
  );
}



export default function NotifyMeListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative h-[1305px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <AccountSidebar />
      <NotifyMePanel />
      <Footer top="top-[863px]" />
    </div>
  );
}
