import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star } from "../ui/star";
import { asset } from "../../lib/utils";
import { MdCompare } from "react-icons/md";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  addCompareProduct,
  removeCompareProduct,
  isProductCompared,
} from "../../utils/compareStorage";
import { useToggleWishlist, useWishlistStatus } from "../../hooks/useWishlist";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

const defaultImage = asset(
  "medium-shot-man-posing-with-blue-background-removebg-preview 1.png",
);

export type ProductCardProps = {
  title?: string;
  sizeLabel?: string;
  price?: string;
  to?: string;
  featured?: boolean;
  accentClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  rating?: number;
  flashDealPrice?: number;
  flashDealEndsAt?: string;
  isMustHave?: boolean;
  isFlashDeals?: boolean;
  productId?: string;
  productType?: 'SHOP' | 'WHOLESALE' | 'RETAIL';
  showTypeBadge?: boolean;
};

function useCountdown(endsAt?: string) {
  const [label, setLabel] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endsAt) return;

    const target = new Date(endsAt).getTime();

    const tick = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        setExpired(true);
        setLabel("Deal ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) setLabel(`${days}d ${hours}h left`);
      else if (hours > 0) setLabel(`${hours}h ${minutes}m left`);
      else setLabel(`${minutes}m left`);
    };

    tick();
    const interval = setInterval(tick, 60 * 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return { label, expired };
}

export default function ProductCard({
  title = "Amber Blaze Classic Tee",
  sizeLabel = "XS - XXL",
  price = "$250",
  to = "/product-details",
  featured = false,
  accentClassName = "bg-[#BEA1DF]",
  imageSrc = defaultImage,
  imageAlt,
  className = "",
  rating = 0,
  flashDealPrice,
  flashDealEndsAt,
  isFlashDeals = false,
  productId = "",
  productType = "SHOP",
  showTypeBadge = false,
}: ProductCardProps) {
  const rootTone = featured ? accentClassName : "bg-white";
  const mediaTone = featured ? accentClassName : "bg-background";

  const showFlashDeal = isFlashDeals && flashDealPrice !== undefined;
  const { label: countdownLabel, expired } = useCountdown(
    showFlashDeal ? flashDealEndsAt : undefined,
  );
  const [isCompared, setIsCompared] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const actualProductId =
    productId ||
    (to ? to.split("/").filter(Boolean).pop() : "") ||
    title ||
    "unknown-id";

  const { data: wishlistStatus } = useWishlistStatus(productType, actualProductId);
  const toggleWishlist = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setIsCompared(isProductCompared(actualProductId));
  }, [actualProductId]);

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    toggleWishlist.mutate({ productType, productId: actualProductId });
  };

  const handleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isCompared) {
        removeCompareProduct(actualProductId);
        setIsCompared(false);
        toast.success("Removed from compare");
      } else {
        addCompareProduct(actualProductId);
        setIsCompared(true);
        toast.success("Added to compare");
      }
    } catch {
      toast.error("You can compare up to 4 products.");
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const numPrice = Number(price.replace(/[^0-9.-]+/g, "")) || 0;
    
    addItem({
      id: `${actualProductId}-default-default`,
      productId: actualProductId,
      title,
      unitPrice: numPrice,
      currency: "EGP",
      size: sizeLabel || "Default",
      color: "Default",
      colorHex: "#000",
      imageSrc,
      quantity: 1,
    });
    
    toast.success("Added to cart");
  };

  return (
    <Link
      to={to}
      aria-label={`Open details for ${title}`}
      className={`group relative block w-full overflow-hidden rounded-2xl shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BBFF63]/60 ${rootTone} ${className}`}
    >
      <div
        className={`relative mx-2 mt-2 overflow-hidden rounded-lg ${mediaTone} aspect-[4/5]`}
      >
        <img
          className="absolute inset-0 h-full w-full object-contain"
          src={imageSrc}
          alt={imageAlt ?? title}
          draggable={false}
        />
        <button
          onClick={handleCompare}
          aria-label={isCompared ? "Remove from compare" : "Add to compare"}
          className={`absolute bottom-2 left-2 z-30 flex h-10 w-10 items-center justify-center rounded-full outline outline-1 outline-gray-light transition-all ${
            isCompared
              ? "bg-primary text-primary-foregro und"
              : "bg-white text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <MdCompare  size={18} />
        </button>
        {/* Badges Container */}
        <div className="absolute left-2 top-2 flex flex-col gap-2 items-start z-30">
          {showTypeBadge && productType === 'WHOLESALE' && (
            <div className="rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm bg-primary text-primary-foreground">
              Wholesale
            </div>
          )}
          {/* Flash deal countdown badge */}
          {showFlashDeal && countdownLabel && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm ${
                expired ? "bg-gray-text" : "bg-urgent"
              }`}
            >
              <svg
                className="h-3 w-3 shrink-0"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 6v4l2.5 2"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {countdownLabel}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={toggleWishlist.isPending}
          aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-gray-light transition-all hover:scale-105 disabled:opacity-70"
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            className={`transition-colors ${isWishlisted ? "text-red-500" : "text-slate-400"}`}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute bottom-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-gray-light transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground text-foreground"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <div
        className={`mx-2 mb-2 mt-1 rounded-lg bg-white p-2 ${
          featured
            ? "outline outline-1 outline-offset-[-1px] outline-secondary"
            : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="font-['Montserrat'] text-sm sm:text-base lg:text-xl font-medium leading-tight text-foreground line-clamp-2 flex-1">
            {title}
          </div>
          <div className="flex items-center shrink-0">
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = Math.min(1, Math.max(0, rating - index));
              return <Star key={index} fill={fill} />;
            })}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-['Montserrat'] text-xs sm:text-sm lg:text-base font-medium text-foreground">
            {sizeLabel}
          </div>
          {showFlashDeal ? (
            <div className="flex flex-col items-end">
              <span className="font-['Montserrat'] text-xs font-medium text-gray-text line-through">
                {price}
              </span>
              <span className="font-['Montserrat'] text-base sm:text-lg lg:text-2xl font-semibold text-urgent">
                ${flashDealPrice!.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="font-['Montserrat'] text-base sm:text-lg lg:text-2xl font-semibold text-foreground">
              {price}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
