import { useEffect } from "react";
import {
  Bell,
  Clock,
  Gamepad2,
  Gift,
  LayoutDashboard,
  LogOut,
  PenLine,
  Plus,
  RotateCcwKey,
  Settings,
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
    { icon: User, label: "My Info", active: true },
    { icon: Bell, label: "Notifications" },
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

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex self-stretch flex-col items-start justify-start gap-4">
      <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="inline-flex items-center justify-start gap-2.5 self-stretch overflow-hidden border-b border-[#E0E0E0] pb-4">
        <div className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        {title}
      </div>
      <div className="relative h-8 w-8 overflow-hidden">
        <Icon className="absolute left-[4px] top-[4px] h-6 w-6 text-[#1A1A1A]" />
      </div>
    </div>
  );
}

function ContactDetailsPanel() {
  return (
    <div className="absolute left-[498px] top-[122px] inline-flex w-[537px] flex-col items-start justify-start gap-8">
      <SectionHeader title="CONTACT DETAILS" icon={PenLine} />
      <div className="flex self-stretch flex-col items-start justify-start gap-6">
        <DetailField label="Name" value="Maan Galal" />
        <DetailField label="Email" value="Maan Galal" />
        <DetailField label="Phone Number" value="+201024941663" />
        <div className="inline-flex items-center justify-start gap-2">
          <div className="relative h-6 w-6 overflow-hidden">
            <RotateCcwKey
              className="absolute left-[2px] top-[2px] h-5 w-5 text-[#B91C1C]"
              strokeWidth={1.8}
            />
          </div>
          <div className="font-['Montserrat'] text-xl font-medium text-[#B91C1C]">
            Reset your password
          </div>
        </div>
      </div>
      <SectionHeader title="ADDRESSRS" icon={Plus} />
      <div className="flex w-[537px] flex-col items-start justify-start gap-4">
        <DetailField label="Home" value="21 Example St, Cairo" />
      </div>
      <div className="flex w-[537px] flex-col items-start justify-start gap-4">
        <DetailField label="Work" value="15 Business Rd, Giza" />
      </div>
    </div>
  );
}

export default function ContactDetailsPage() {
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
    <div className="relative h-[1388px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Footer top="top-[946px]" />
      <Navbar />
      <AccountSidebar />
      <ContactDetailsPanel />
    </div>
  );
}
