import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Heart, Menu, Package, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCartStore, useCartItemCount } from "../../store/useCartStore";
import { useWholesaleCartCount } from "../../store/useWholesaleCartStore";
import { useTranslation } from "react-i18next";
import { asset } from "../../lib/utils";
import { Scale } from "lucide-react";
import { getCompareProducts } from "../../utils/compareStorage";
import { useAuthStore } from "../../store/useAuthStore";
import { useMarkAllRead, useNotifications } from "../../hooks/queries/notificationQuery";
import { useCart } from "../../hooks/useCart";

const navLinks = [
  { label: "home", path: "/" },
  { label: "shop", path: "/products" },
  { label: "wholesale", path: "/wholesale" },
  { label: "retail", path: "/rental" },
  { label: "designLab", path: "/createYourDesign" },
  { label: "dropshipping", path: "/dropshipping" },
];

function NotificationBell() {
  const { t } = useTranslation("navbar");
  const { data } = useNotifications();
  const markAllRead = useMarkAllRead();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({ top: 0 });

  const unread = data?.unread ?? 0;
  const recent = (data?.notifications ?? []).slice(0, 5);

  const updateCoords = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const isRTL = document.documentElement.dir === "rtl";
    const dropdownWidth = 320;
    const margin = 16;
    const top = rect.bottom + 10;

    if (isRTL) {
      const left = Math.max(
        margin,
        Math.min(rect.left, window.innerWidth - dropdownWidth - margin)
      );
      setDropdownStyle({ top, left });
    } else {
      const right = Math.max(
        margin,
        Math.min(window.innerWidth - rect.right, window.innerWidth - dropdownWidth - margin)
      );
      setDropdownStyle({ top, right });
    }
  };

  const handleOpen = () => {
    updateCoords();
    setOpen((p) => !p);
  };

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const handleScrollOrResize = () => updateCoords();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSeeAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  const dropdown = open ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="fixed z-[9999] w-80 max-w-[calc(100vw-32px)] rounded-2xl bg-card shadow-[0px_8px_24px_-4px_rgba(30,37,45,0.18)] outline outline-1 outline-stroke overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stroke">
        <span className="font-['Montserrat'] text-sm font-bold text-foreground">
          {t("notifications", "Notifications")} {unread > 0 && <span className="text-primary">({unread})</span>}
        </span>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-stroke">
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-center font-['Montserrat'] text-sm text-gray-text">
            {t("noNotificationsYet", "No notifications yet")}
          </p>
        ) : (
          recent.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setOpen(false);
                if (n.productId) {
                  const titleLower = (n.title || "").toLowerCase();
                  const msgLower = ((n.message ?? n.body) || "").toLowerCase();
                  if (titleLower.includes("wholesale") || msgLower.includes("wholesale")) {
                    navigate(`/wholesale/${n.productId}`);
                  } else if (titleLower.includes("rental") || titleLower.includes("retail") || msgLower.includes("rental") || msgLower.includes("retail")) {
                    navigate(`/rental/${n.productId}`);
                  } else {
                    navigate(`/product-details/${n.productId}`);
                  }
                }
              }}
              className="w-full flex items-start gap-3 px-4 py-3 text-start hover:bg-background transition-colors"
            >
              {n.imageUrl ? (
                <img src={n.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-['Montserrat'] text-xs font-semibold text-foreground truncate">{n.title}</p>
                <p className="font-['Montserrat'] text-xs text-gray-text line-clamp-2 mt-0.5">{n.message ?? n.body}</p>
              </div>
              {!n.isRead && (
                <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-stroke p-3 flex gap-2">
        {unread > 0 && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex-1 rounded-xl border border-stroke bg-card py-2 font-['Montserrat'] text-sm font-bold text-foreground hover:bg-gray-light transition disabled:opacity-50"
          >
            {t("readAll", "Read All")}
          </button>
        )}
        <button
          type="button"
          onClick={handleSeeAll}
          className="flex-1 rounded-xl text-white bg-primary py-2 font-['Montserrat'] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {t("seeAll", "See All")}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="relative flex items-center justify-center"
        aria-label={t("notifications", "Notifications")}
      >
        <Bell
          className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors"
          strokeWidth={1.5}
        />
        {unread > 0 && (
          <span className="absolute -top-1 -end-2 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {createPortal(dropdown, document.body)}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation("navbar");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get("search") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.length;
  const wholesaleCartCount = useWholesaleCartCount();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Fetch/sync cart when user is authenticated
  useCart();

  const [compareItemsCount, setCompareItemsCount] = useState(
    getCompareProducts().length,
  );

  useEffect(() => {
    const updateCompareCount = () => {
      setCompareItemsCount(getCompareProducts().length);
    };
    window.addEventListener("compareUpdated", updateCompareCount);
    return () => {
      window.removeEventListener("compareUpdated", updateCompareCount);
    };
  }, []);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (item: (typeof navLinks)[number]) =>
    item.label === "home"
      ? location.pathname === "/"
      : item.label === "shop"
        ? location.pathname.startsWith(item.path) ||
        location.pathname.startsWith("/collections/") ||
        location.pathname.startsWith("/product-details/")
        : location.pathname.startsWith(item.path);

  return (
    <div className="relative w-full max-w-full">
      <div className="relative flex h-16 lg:h-20 w-full max-w-full items-center gap-2 overflow-hidden rounded-2xl bg-card px-3 sm:px-4 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke">

        <Link to="/" className="shrink-0">
          <img
            className="h-8 w-auto max-w-[64px] sm:h-9 sm:max-w-[75px] lg:h-11 lg:max-w-[90px] logo-theme object-contain"
            src={`${asset("Logo.png")}?v=2`}
            alt="Gen Z"
            draggable={false}
          />
        </Link>

        <div className="ms-4 me-2 hidden lg:flex shrink-0 items-center gap-2 xl:gap-4">
          {navLinks.map((item) => {
            const isActive = isLinkActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`shrink-0 font-['Montserrat'] text-sm xl:text-lg font-semibold whitespace-nowrap transition-colors ${isActive
                  ? "flex items-center justify-center gap-2.5 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                  : "text-foreground hover:text-primary"
                  }`}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </div>

        <div className="ms-auto flex min-w-0 shrink items-center gap-1.5 sm:gap-2 lg:gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:inline-flex w-32 lg:w-60 xl:w-64 2xl:w-80 min-w-0 shrink items-center gap-2 rounded-3xl bg-background p-2 outline outline-1 outline-offset-[-1px] outline-stroke"
          >
            <button type="submit" className="focus:outline-none shrink-0">
              <Search
                className="h-5 w-5 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full min-w-0 bg-transparent font-['Montserrat'] text-sm font-semibold text-foreground placeholder:text-gray-text focus:outline-none text-start"
            />
          </form>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            <Link
              to="/bag"
              className="relative flex shrink-0 items-center justify-center mr-2.5 md:mr-0"
            >
              <ShoppingBag
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-2 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-primary text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/wholesale-bag"
              title="Wholesale Cart"
              className="relative flex shrink-0 items-center justify-center mr-2.5 md:mr-0"
            >
              <Package
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
              {wholesaleCartCount > 0 && (
                <span className="absolute -top-1 -end-2 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-primary text-[10px] font-bold text-white">
                  {wholesaleCartCount}
                </span>
              )}
            </Link>

            <Link to="/compare" className="relative flex shrink-0 items-center justify-center mr-2.5 md:mr-0">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors" />
              {compareItemsCount > 0 && (
                <span className="absolute -top-1 -end-2 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-red-500 text-[10px] font-bold text-white">
                  {compareItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated && <NotificationBell />}

            <Link to="/favorites" className="hidden md:block shrink-0" aria-label={t("favorites", "Favorites")}>
              <Heart
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </Link>

            <Link to="/settings" className="hidden md:block shrink-0" aria-label={t("account", "Account")}>
              <User
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden flex shrink-0 items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute start-0 end-0 top-[calc(100%+4px)] z-50 flex max-h-[80vh] w-full max-w-full flex-col gap-2 overflow-y-auto rounded-2xl bg-card p-4 shadow-lg outline outline-1 outline-stroke lg:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex lg:hidden w-full items-center gap-2 rounded-2xl bg-background p-2 outline outline-1 outline-stroke"
          >
            <button type="submit" className="focus:outline-none shrink-0">
              <Search className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full min-w-0 bg-transparent font-['Montserrat'] text-sm font-semibold text-foreground placeholder:text-gray-text focus:outline-none text-start"
            />
          </form>

          {navLinks.map((item) => {
            const isActive = isLinkActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 font-['Montserrat'] text-base font-semibold transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-background"
                  }`}
              >
                {t(item.label)}
              </Link>
            );
          })}

          <div className="flex flex-wrap items-center gap-4 border-t border-stroke pt-3 md:hidden">
            {isAuthenticated && (
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-foreground"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
                <span className="font-['Montserrat'] text-sm font-medium">
                  {t("notifications", "Notifications")}
                </span>
              </Link>
            )}
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-sm font-medium">
                {t("favorites", "Favorites")}
              </span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-sm font-medium">
                {t("account", "Account")}
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}