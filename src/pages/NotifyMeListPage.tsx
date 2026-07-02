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

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;
const placeholderProduct =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='166' viewBox='0 0 140 166'%3E%3Crect width='140' height='166' fill='%23D9D9D9'/%3E%3C/svg%3E";

type AssetImageProps = {
  file: string;
  className: string;
  alt?: string;
};

function AssetImage({ file, className, alt = "" }: AssetImageProps) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}

function ArrowCircle() {
  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
      <AssetImage
        file="weui_arrow-filled-3.svg"
        className="absolute left-[18px] top-[12px] h-6 w-3"
      />
    </div>
  );
}

function Navbar() {
  const navItems = ["Shop", "Wholesale", "Design Lab", "Dropshipping"];

  return (
    <div className="absolute left-[24px] top-[18px] h-20 w-[1344px] rounded-2xl bg-[#F9FAFB] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <AssetImage
        file="logo gen-z 2 copy 1.png"
        className="absolute left-[16px] top-[16px] h-12 w-[90px]"
        alt="Gen Z"
      />
      <div className="absolute left-[138px] top-[20px] inline-flex items-center justify-start gap-4">
        <div className="flex items-center justify-center gap-2.5 rounded-lg bg-[#BBFF63] px-4 py-2">
          <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
            Home
          </div>
        </div>
        {navItems.map((item) => (
          <div
            key={item}
            className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="absolute left-[1148px] top-[18px] inline-flex items-center justify-start gap-6">
        <AssetImage
          file="material-symbols-light_shopping-bag-outline.svg"
          className="h-11 w-11"
        />
        <AssetImage file="mdi-light_heart.svg" className="h-11 w-11" />
        <AssetImage
          file="iconamoon_profile-light.svg"
          className="h-11 w-11"
        />
      </div>
      <div className="absolute left-[741px] top-[16px] inline-flex w-96 items-center justify-start gap-2 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <AssetImage file="mynaui_search-1.svg" className="h-8 w-8" />
        <div className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">
          Search
        </div>
      </div>
    </div>
  );
}

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

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="inline-flex w-48 flex-col items-start justify-center gap-4">
      <div className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
        {title}
      </div>
      {items.map((item) => (
        <div
          key={item}
          className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#6B7280]"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  const columns = [
    { title: "About", items: ["About Us", "Design Lab", "Dropship"] },
    { title: "Shop", items: ["Men", "Kids", "Women"] },
    {
      title: "Help",
      items: ["FAQ", "Contact", "Shipping", "Returns", "Track Order"],
    },
    { title: "Legal", items: ["Privacy", "Terms", "Cookies"] },
  ];
  const socials = [
    "prime_twitter.svg",
    "ri_facebook-fill.svg",
    "ic_outline-tiktok.svg",
    "iconoir_instagram.svg",
  ];

  return (
    <div className="absolute left-0 top-[863px] h-96 w-[1440px] overflow-hidden border-t border-[#E0E0E0]">
      <div className="absolute left-[323px] top-[69px] font-['Montserrat'] text-[250px] font-medium text-gray-500/20">
        GEN Z
      </div>
      <div className="absolute left-[24px] top-[32px] h-96 w-[1392px]">
        <div className="absolute left-0 top-[80px] inline-flex items-start justify-start gap-8">
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              items={column.items}
            />
          ))}
        </div>
        <div className="absolute left-[1096px] top-0 inline-flex items-center justify-start gap-6">
          {socials.map((social) => (
            <div
              key={social}
              className="relative h-14 w-14 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
            >
              <AssetImage
                file={social}
                className="absolute left-[12px] top-[12px] h-8 w-8"
              />
            </div>
          ))}
        </div>
        <div className="absolute left-[932px] top-[72px] font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          SIGN UP FOR DISCOUNTS + UPDATES
        </div>
        <div className="absolute left-0 top-[358px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          © 2025 GenZ, LLC. All Rights Reserved.
        </div>
        <div className="absolute left-[932px] top-[117px] inline-flex w-[460px] items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            Phone Number or Email
          </div>
          <ArrowCircle />
        </div>
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
    <div className="relative h-[1305px] w-[1440px] overflow-hidden rounded-3xl bg-[#F9FAFB]">
      <Footer />
      <Navbar />
      <AccountSidebar />
      <NotifyMePanel />
    </div>
  );
}
