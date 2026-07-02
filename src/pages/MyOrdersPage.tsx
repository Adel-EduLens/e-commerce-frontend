import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  User,
  Bell,
  Clock,
  Gift,
  Gamepad2,
  Settings,
  LogOut,
  Search,
  Heart,
  ShoppingCart,
  ChevronRight,
  FileText,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

type Tab = "active" | "completed" | "returns";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ShoppingBag, label: "My Orders", active: true },
  { icon: Wallet, label: "Wallet & Rewards" },
  { icon: User, label: "My Info" },
  { icon: Bell, label: "Notifications" },
  { icon: Clock, label: "Notify Me List" },
  { icon: Gift, label: "Gift Cards" },
  { icon: Gamepad2, label: "Avatar" },
  { icon: Settings, label: "Settings" },
];

const orderItems = [
  { id: 1, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
  { id: 2, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
  { id: 3, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
];

const orderSteps = [
  { icon: FileText, label: "New Order", date: "25 Sep, 2025", completed: true },
  { icon: CheckCircle2, label: "Confirmed", date: "25 Sep, 2025", completed: true },
  { icon: Package, label: "Shipped", date: "25 Sep, 2025", completed: true },
  { icon: Truck, label: "Delivered", date: "Pending Delivery", completed: false },
];

function Navbar() {
  const navItems = ["Shop", "Wholesale", "Design Lab", "Dropshipping"];

  return (
    <div className="mx-12 mt-[18px] flex h-20 items-center rounded-2xl bg-[#F9FAFB] px-4 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <img
        src={asset("logo gen-z 2 copy 1.png")}
        className="h-12 w-[90px]"
        alt="Gen Z"
        draggable={false}
      />
      <div className="ml-8 flex items-center gap-4">
        <div className="flex items-center justify-center rounded-lg bg-[#BBFF63] px-4 py-2">
          <span className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">Home</span>
        </div>
        {navItems.map((item) => (
          <span key={item} className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
            {item}
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex w-96 items-center gap-2 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <Search className="h-8 w-8 text-[#6B7280]" strokeWidth={1.5} />
          <span className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">Search</span>
        </div>
        <div className="flex items-center gap-6 ml-4">
          <ShoppingCart className="h-11 w-11 text-[#1A1A1A]" strokeWidth={1.2} />
          <Heart className="h-11 w-11 text-[#1A1A1A]" strokeWidth={1.2} />
          <User className="h-11 w-11 text-[#1A1A1A]" strokeWidth={1.2} />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-56 flex flex-col justify-between py-6 pl-6 shrink-0">
      <div className="flex flex-col gap-3">
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-4 rounded-lg p-4 cursor-pointer ${
              item.active
                ? "bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
                : "hover:bg-white/50"
            }`}
          >
            <item.icon className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
            <span className="font-['Montserrat'] text-lg font-medium text-[#1A1A1A]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 p-4 cursor-pointer mt-24">
        <LogOut className="h-6 w-6 text-red-600" strokeWidth={1.5} />
        <span className="font-['Montserrat'] text-lg font-medium text-red-600">Sign Out</span>
      </div>
    </div>
  );
}

function OrderTabs({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "returns", label: "Returns" },
  ];

  return (
    <div className="relative">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-4 font-['Montserrat'] text-base font-bold cursor-pointer ${
              activeTab === tab.key
                ? "text-[#1A1A1A] border-b-[3px] border-[#1A1A1A]"
                : "text-[#6B7280]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-80 h-px bg-[#E0E0E0]" />
    </div>
  );
}

function OrderHeader() {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#1A1A1A] p-4">
      <div className="flex flex-col gap-2">
        <span className="font-['Montserrat'] text-base font-bold text-[#BBFF63]">
          Order #24653565
        </span>
        <div className="flex items-center gap-4">
          <span className="font-['Montserrat'] text-base font-medium text-white/70">
            25 Sep, 2025
          </span>
          <span className="font-['Montserrat'] text-base font-medium text-white/70">15:04</span>
        </div>
      </div>
    </div>
  );
}

function OrderItemCard({ item }: { item: typeof orderItems[0] }) {
  return (
    <div className="flex rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] overflow-hidden">
      <div className="p-2 shrink-0">
        <div className="h-[166px] w-[140px] rounded-lg bg-[#F0F0F0]" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          {item.name}
        </span>
        <span className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          {item.price}
        </span>
        <div className="flex items-center gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <span className="font-['Montserrat'] text-base">
            <span className="font-medium text-[#1A1A1A]">Size: </span>
            <span className="font-bold text-[#1A1A1A]">{item.size}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
              Color:
            </span>
            <div className={`h-6 w-6 rounded-full ${item.color}`} />
          </div>
        </div>
        <span className="font-['Montserrat'] text-sm font-semibold text-[#1A1A1A]">
          ({item.qty})
        </span>
      </div>
    </div>
  );
}

function OrderStatus() {
  return (
    <div className="w-80 shrink-0 rounded-lg bg-[#1A1A1A] p-4 self-start">
      <span className="font-['Montserrat'] text-base font-bold text-[#BBFF63]">Order Status</span>

      <div className="mt-8 flex flex-col">
        {orderSteps.map((step, index) => (
          <div key={step.label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${
                    step.completed ? "bg-[#2A2D35]" : "bg-[#2A2D35]"
                  }`}
                >
                  <step.icon
                    className={`h-8 w-8 ${step.completed ? "text-[#BBFF63]" : "text-zinc-400"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`font-['Montserrat'] text-base font-bold ${
                      step.completed ? "text-[#BBFF63]" : "text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`font-['Montserrat'] text-sm font-medium ${
                      step.completed ? "text-white/70" : "text-zinc-400"
                    }`}
                  >
                    {step.date}
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                {step.completed ? (
                  <div className="h-8 w-8 rounded-full bg-[#BBFF63] flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2} />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-400" />
                )}
              </div>
            </div>
            {index < orderSteps.length - 1 && (
              <div
                className={`ml-[35px] h-12 w-0.5 ${
                  step.completed && orderSteps[index + 1]?.completed
                    ? "bg-[#BBFF63]"
                    : step.completed
                      ? "bg-[#BBFF63]"
                      : "bg-zinc-400"
                }`}
              />
            )}
          </div>
        ))}
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
    { title: "Help", items: ["FAQ", "Contact", "Shipping", "Returns", "Track Order"] },
    { title: "Legal", items: ["Privacy", "Terms", "Cookies"] },
  ];
  const socials = [
    "prime_twitter.svg",
    "ri_facebook-fill.svg",
    "ic_outline-tiktok.svg",
    "iconoir_instagram.svg",
  ];

  return (
    <div className="relative mt-16 border-t border-[#E0E0E0] overflow-hidden">
      <div className="absolute left-[323px] top-[69px] font-['Montserrat'] text-[250px] font-medium text-gray-500/20 pointer-events-none select-none">
        GEN Z
      </div>
      <div className="relative mx-6 pt-8 pb-8">
        <div className="flex gap-8 mt-[80px]">
          {columns.map((column) => (
            <FooterColumn key={column.title} title={column.title} items={column.items} />
          ))}
        </div>

        <div className="absolute right-0 top-8 flex items-center gap-6">
          {socials.map((social) => (
            <div
              key={social}
              className="relative h-14 w-14 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
            >
              <img
                src={asset(social)}
                className="absolute left-[12px] top-[12px] h-8 w-8"
                alt=""
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-[72px] font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          SIGN UP FOR DISCOUNTS + UPDATES
        </div>

        <div className="absolute right-0 top-[117px] flex w-[460px] items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <span className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            Phone Number or Email
          </span>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <ChevronRight className="h-6 w-6 text-[#1A1A1A]" />
          </div>
        </div>

        <div className="mt-[280px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          © 2025 GenZ, LLC. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      <Navbar />

      <div className="flex mt-6">
        <Sidebar />

        <div className="flex-1 px-6">
          <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6 flex gap-6">
            {/* Order Items Column */}
            <div className="flex-1 flex flex-col gap-4">
              <OrderHeader />
              {orderItems.map((item) => (
                <OrderItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Order Status Column */}
            <OrderStatus />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
