import { useEffect } from "react";
import {
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Gamepad2,
  Gift,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from "../components/shared";

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
    { icon: Clock, label: "Notify Me List" },
    { icon: Gift, label: "Gift Cards" },
    { icon: Gamepad2, label: "Avatar" },
    { icon: SettingsIcon, label: "Settings", active: true },
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

function LanguageField() {
  return (
    <div className="inline-flex h-14 items-center justify-between self-stretch">
      <div className="text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
        Language
      </div>
      <div className="relative h-14 w-96 overflow-hidden rounded-xl outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <div className="absolute left-[16px] top-[20px] inline-flex w-96 items-center justify-between">
          <div className="text-center font-['Poppins'] text-base font-normal leading-4 tracking-tight text-[#6B7280]">
            EN
          </div>
          <div className="relative h-6 w-6 overflow-hidden">
            <ChevronDown
              className="absolute left-0 top-0 h-6 w-6 text-[#6B7280]"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeMockup({ selected = false }: { selected?: boolean }) {
  return (
    <div
      className={`relative h-52 w-60 overflow-hidden bg-[#E0E0E0] outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-[#BBFF63]" : "outline-[#E0E0E0]"
      }`}
    >
      <div className="absolute left-[16px] top-[16px] h-36 w-56 overflow-hidden bg-white">
        <div className="absolute left-[32px] top-[24px] h-32 w-48 overflow-hidden bg-[#F9FAFB]">
          <div className="absolute left-[8px] top-[8px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[8px] top-[71px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[94px] top-[8px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[94px] top-[71px] h-12 w-16 bg-[#BBFF63]" />
        </div>
        <div className="absolute left-[4px] top-[25px] h-2.5 w-6 bg-[#BBFF63]" />
      </div>
    </div>
  );
}

function ThemeCard({
  label,
  selected = false,
}: {
  label: "Light Mode " | "Dark Mode ";
  selected?: boolean;
}) {
  return (
    <div
      className={`relative h-52 w-60 overflow-hidden bg-[#E0E0E0] outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-[#BBFF63]" : "outline-[#E0E0E0]"
      }`}
    >
      <ThemeMockup selected={selected} />
      <div className="absolute left-0 top-[166px] h-12 w-60 overflow-hidden border-t border-[#F9FAFB] bg-white">
        <div
          className={`absolute left-[8px] inline-flex w-56 items-center justify-between ${
            selected ? "top-[12px]" : "top-[16px]"
          }`}
        >
          <div className="text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
            {label}
          </div>
          {selected ? (
            <div className="relative h-6 w-6 overflow-hidden">
              <CheckCircle className="absolute left-[1px] top-[1px] h-5 w-5 fill-[#BBFF63] text-[#BBFF63]" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <>
      <div className="absolute left-[378px] top-[122px] inline-flex w-[613px] items-center justify-between">
        <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
          Settings
        </div>
      </div>
      <div className="absolute left-[378px] top-[177px] inline-flex w-[1032px] flex-col items-start justify-start gap-6">
        <div className="flex self-stretch flex-col items-start justify-start gap-4">
          <LanguageField />
          <div className="flex w-[494px] flex-col items-start justify-start gap-4">
            <div className="self-stretch text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
              Select Theme
            </div>
            <div className="inline-flex items-center justify-start gap-6 self-stretch">
              <ThemeCard label="Light Mode " selected />
              <ThemeCard label="Dark Mode " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
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
    <div className="relative h-[1359px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Footer top="top-[917px]" />
      <Navbar />
      <AccountSidebar />
      <SettingsPanel />
    </div>
  );
}
