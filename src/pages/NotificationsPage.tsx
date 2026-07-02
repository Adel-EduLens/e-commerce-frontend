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
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from "../components/shared";

const placeholderAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23D9D9D9'/%3E%3C/svg%3E";

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
    { icon: Bell, label: "Notifications", active: true },
    { icon: Clock, label: "Notify Me List" },
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

function NotificationSwitch() {
  return (
    <div className="relative h-9 w-14 overflow-hidden">
      <div className="absolute left-0 top-0 h-9 w-14 bg-[#BBFF63]" />
    </div>
  );
}

function NotificationRow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center justify-start gap-5 self-stretch">
      <img
        src={placeholderAvatar}
        className="h-14 w-14 rounded-full object-cover object-top"
        alt={label}
        draggable={false}
      />
      <div className="flex w-[453px] items-center justify-between py-4">
        <div className="font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          {label}
        </div>
        <NotificationSwitch />
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <>
      <div className="absolute left-[496px] top-[122px] inline-flex w-[537px] items-center justify-between">
        <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
          NOTIFICATIONS
        </div>
      </div>
      <div className="absolute left-[496px] top-[193px] inline-flex w-[536px] flex-col items-start justify-start gap-6">
        <NotificationRow label="Men" />
        <NotificationRow label="Women" />
        <NotificationRow label="Kids" />
      </div>
    </>
  );
}



export default function NotificationsPage() {
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
      <NotificationsPanel />
      <Footer top="top-[863px]" />
    </div>
  );
}
