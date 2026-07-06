import {
  Bell,
  Clock,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Smile,
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

const items: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/user" },
  { icon: ShoppingBag, label: "My Orders", path: "/my-orders" },
  { icon: Wallet, label: "Wallet & Rewards", path: "/wallet-rewards" },
  { icon: User, label: "My Info", path: "/contact-details" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Clock, label: "Notify Me List", path: "/notify-me-list" },
  { icon: Smile, label: "Avatar", path: "/avatar" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function SidebarRow({
  item,
  active,
  onClick,
}: {
  item: SidebarItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <div
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-start gap-4 rounded-lg p-4 transition-shadow ${
        active
          ? "self-stretch bg-card shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] border border-stroke"
          : "self-stretch hover:bg-card/50"
      }`}
    >
      <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
      <div className="whitespace-nowrap font-['Montserrat'] text-lg font-medium text-foreground">
        {item.label}
      </div>
    </div>
  );
}

export default function AccountSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  const handleSignOut = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="inline-flex w-56 shrink-0 flex-col items-start justify-start gap-24">
      <div className="flex self-stretch flex-col items-start justify-start gap-3 rounded-lg">
        {items.map((item) => (
          <SidebarRow
            key={item.label}
            item={item}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      <div
        onClick={handleSignOut}
        className="inline-flex cursor-pointer items-center justify-start gap-4 self-stretch p-4 transition-opacity hover:opacity-70"
      >
        <LogOut className="h-6 w-6 text-[#DC2626]" strokeWidth={1.5} />
        <div className="font-['Montserrat'] text-lg font-medium text-[#DC2626]">
          Sign Out
        </div>
      </div>
    </div>
  );
}
