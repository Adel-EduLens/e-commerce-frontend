import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useTranslation } from "react-i18next";
import { asset } from "../../lib/utils";
import { MdCompare } from "react-icons/md";
import { Scale } from "lucide-react";
import { getCompareProducts } from "../../utils/compareStorage";
const navLinks = [
  { label: "home", path: "/" },
  { label: "shop", path: "/products" },
  { label: "wholesale", path: "/wholesale" },
  { label: "retail", path: "/retail" },
  { label: "designLab", path: "/design-lab" },
  { label: "dropshipping", path: "/dropshipping" },
];

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative flex h-16 lg:h-20 w-full items-center rounded-2xl bg-card px-4 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke">
        <Link to="/" className="shrink-0">
          <img
            className="h-10 w-[75px] lg:h-12 lg:w-[90px] logo-theme"
            src={asset("logo gen-z 2 copy 1.png")}
            alt="Gen Z"
            draggable={false}
          />
        </Link>
        <div className="ms-6 me-4 hidden lg:inline-flex items-center justify-start gap-4">
          {navLinks.map((item) => {
            const isActive =
              item.label === "Home"
                ? location.pathname === "/"
                : item.label === "Shop"
                  ? location.pathname === item.path ||
                    location.pathname.startsWith("/collections/")
                  : location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`font-['Montserrat'] text-base xl:text-lg font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "flex items-center justify-center gap-2.5 rounded-lg bg-primary px-4 py-2 text-foreground"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </div>
        <div className="ms-auto flex items-center gap-3 lg:gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:inline-flex w-64 xl:w-96 items-center justify-start gap-2 rounded-3xl bg-background p-2 outline outline-1 outline-offset-[-1px] outline-stroke"
          >
            <button type="submit" className="focus:outline-none">
              <Search
                className="h-6 w-6 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent font-['Montserrat'] text-base font-semibold text-foreground placeholder:text-gray-text focus:outline-none text-start"
            />
          </form>
          <div className="inline-flex items-center justify-start gap-4 lg:gap-6">
            <Link
              to="/bag"
              className="relative flex items-center justify-center"
            >
              <ShoppingBag
                className="h-6 w-6 lg:h-8 lg:w-8 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-2 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center border border-background">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/compare" className="hidden sm:block relative">
              <Scale className="h-6 w-6 lg:h-8 lg:w-8 text-foreground hover:text-primary transition-colors" />
              {compareItemsCount > 0 && (
                <span className="absolute -top-1 -end-2 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center border border-background">
                  {compareItemsCount}
                </span>
              )}
            </Link>
            <Link to="/favorites" className="hidden sm:block">
              <Heart
                className="h-6 w-6 lg:h-8 lg:w-8 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </Link>
            <Link to="/settings" className="hidden sm:block">
              <User
                className="h-6 w-6 lg:h-8 lg:w-8 text-foreground hover:text-primary transition-colors"
                strokeWidth={1.5}
              />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center"
            aria-label="Toggle menu"
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
        <div className="absolute start-0 end-0 top-[calc(100%+4px)] z-50 flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-lg outline outline-1 outline-stroke lg:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2 rounded-2xl bg-background p-2 outline outline-1 outline-stroke"
          >
            <button type="submit" className="focus:outline-none">
              <Search className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent font-['Montserrat'] text-sm font-semibold text-foreground placeholder:text-gray-text focus:outline-none text-start"
            />
          </form>
          {navLinks.map((item) => {
            const isActive =
              item.label === "Home"
                ? location.pathname === "/"
                : item.label === "Shop"
                  ? location.pathname === item.path ||
                    location.pathname.startsWith("/collections/")
                  : location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 font-['Montserrat'] text-base font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-foreground"
                    : "text-foreground hover:bg-background"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-4 border-t border-stroke pt-3 sm:hidden">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <MdCompare className="h-5 w-5" />
              <span className="font-['Montserrat'] text-sm font-medium">
                Compare
              </span>
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-sm font-medium">
                Favorites
              </span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-['Montserrat'] text-sm font-medium">
                Account
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
