import {
  Bell,
  Clock,
  Gift,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";

type SidebarItem = {
  labelKey: string;
  icon: LucideIcon;
  path: string;
};

const items: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    labelKey: "dashboard",
    path: "/dashboard/user",
  },
  {
    icon: ShoppingBag,
    labelKey: "myOrders",
    path: "/my-orders",
  },
  {
    icon: Wallet,
    labelKey: "walletRewards",
    path: "/wallet-rewards",
  },
  {
    icon: Gift,
    labelKey: "prizeWheel",
    path: "/prize-wheel",
  },
  {
    icon: User,
    labelKey: "myInfo",
    path: "/contact-details",
  },
  {
    icon: Bell,
    labelKey: "notifications",
    path: "/notifications",
  },
  {
    icon: Clock,
    labelKey: "notifyMeList",
    path: "/notify-me-list",
  },
  {
    icon: Settings,
    labelKey: "settings",
    path: "/settings",
  },
  {
    icon: HelpCircle,
    labelKey: "helpCenter",
    path: "/help-center",
  },
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
  const { t } = useTranslation("accountSidebar");
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
        {t(item.labelKey)}
      </div>
    </div>
  );
}

export function AccountMobileNav() {
  const { t } = useTranslation("accountSidebar");
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  const handleSignOut = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto py-2 scrollbar-none border-b border-stroke">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        return (
          <button
            key={item.labelKey}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 font-['Montserrat'] text-xs font-semibold transition-all cursor-pointer ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-stroke text-foreground hover:bg-gray-light"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            <span className="whitespace-nowrap">{t(item.labelKey)}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={handleSignOut}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-urgent/10 border border-urgent/20 px-3.5 py-2 font-['Montserrat'] text-xs font-semibold text-urgent transition-all cursor-pointer hover:bg-urgent/20"
      >
        <LogOut className="h-4 w-4 text-urgent" strokeWidth={2} />
        <span className="whitespace-nowrap">{t("signOut")}</span>
      </button>
    </div>
  );
}

export default function AccountSidebar() {
  const { t } = useTranslation("accountSidebar");
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
            key={item.labelKey}
            item={item}
            active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      <div
        onClick={handleSignOut}
        className="inline-flex cursor-pointer items-center justify-start gap-4 self-stretch p-4 transition-opacity hover:opacity-70"
      >
        <LogOut className="h-6 w-6 text-urgent" strokeWidth={1.5} />
        <div className="font-['Montserrat'] text-lg font-medium text-urgent">
          {t("signOut")}
        </div>
      </div>
    </div>
  );
}
