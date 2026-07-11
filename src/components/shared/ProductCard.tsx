import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star } from "../ui/star";
import { asset } from "../../lib/utils";
import { MdCompare } from "react-icons/md";
import { Heart } from "lucide-react";
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
type ImageType = {
  id: string;
  url: string;
  color?: string;
  productId?: string;
};

export type ProductCardProps = {
  title?: string;
  subtitle?: string;
  colors?: string[];
  images?: ImageType[];
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
  description?: string;
  isFlashDeals?: boolean;
  productId?: string;
  productType?: "SHOP" | "WHOLESALE" | "RETAIL";
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
  title = "Linen shirt",
  subtitle = "Minimalist design, maximum airflow",
  colors = [],
  images = [],
  sizeLabel = "M-L-XL-XXL",
  price = "120$",
  to = "/product-details",
  imageSrc = defaultImage,
  imageAlt,
  className = "",
  rating = 4.5,
  flashDealPrice,
  flashDealEndsAt,
  isFlashDeals = false,
  productId = "",
  productType = "SHOP",
  isMustHave = false,
  showTypeBadge = false,
}: ProductCardProps) {
  const showFlashDeal = isFlashDeals && flashDealPrice !== undefined;
  const { label: countdownLabel, expired } = useCountdown(
    showFlashDeal ? flashDealEndsAt : undefined,
  );
  const [activeImage, setActiveImage] = useState(imageSrc);
  const [isCompared, setIsCompared] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const actualProductId =
    productId ||
    (to ? to.split("/").filter(Boolean).pop() : "") ||
    title ||
    "unknown-id";

  const { data: wishlistStatus } = useWishlistStatus(
    productType,
    actualProductId,
  );
  const toggleWishlist = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const existingCartItem = cartItems.find(
    (item) =>
      item.productId === actualProductId ||
      item.id === `${actualProductId}-default-default`,
  );
  const isInCart = Boolean(existingCartItem);

  useEffect(() => {
    setActiveImage(imageSrc);
  }, [imageSrc]);
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

  const handleToggleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (existingCartItem) {
      removeItem(existingCartItem.id);
      toast.success("Removed from cart");
    } else {
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
    }
  };
  const handleColorClick = (color: string) => {
    setActiveImage(images?.find((c) => c.color === color)?.url || "");
  };

  return (
    <div
      className={`group flex flex-col w-full overflow-hidden rounded-2xl bg-card border border-card-border shadow-sm transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Image container */}
      <Link
        to={to}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-muted"
      >
        <img
          className="h-full w-full object-cover"
          src={activeImage}
          alt={imageAlt ?? title}
          draggable={false}
        />

        {/* Badges Container */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 items-start z-30">
          {isMustHave && (
            <div className="rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm bg-danger">
              Must Have
            </div>
          )}
          {showTypeBadge && productType === "WHOLESALE" && (
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

        {/* Heart icon */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={toggleWishlist.isPending}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:scale-105 disabled:opacity-70"
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            className={`transition-colors ${isWishlisted ? "text-white" : "text-gray-300"}`}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Compare button (optional, moved to top right below heart) */}
        <button
          onClick={handleCompare}
          aria-label={isCompared ? "Remove from compare" : "Add to compare"}
          className={`absolute right-3 top-16 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-105 ${
            isCompared
              ? "bg-primary text-primary-foreground"
              : "bg-black/60 text-gray-300 hover:text-white"
          }`}
        >
          <MdCompare size={18} />
        </button>

        {/* Carousel indicators (mock) */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
          {images.slice(0, 3).map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImage(img.url);
              }}
              className={`h-2 w-2 rounded-full ${
                activeImage === img.url ? "bg-danger" : "bg-black"
              }`}
            />
          ))}
        </div>
      </Link>

      {/* Info container */}
      <div className="flex flex-col p-5 font-['Montserrat']">
        {/* Title */}
        <Link
          to={to}
          className="text-xl sm:text-2xl font-medium text-card-text hover:underline line-clamp-1"
        >
          {title}
        </Link>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-text line-clamp-1">{subtitle}</p>

        {/* Colors and Sizes */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {colors.map((c, i) => (
              <div
                key={i}
                onClick={() => handleColorClick(c)}
                className={`h-6 w-6 rounded-full ${
                  i === 0
                    ? "ring-1 ring-gray-400 ring-offset-2 ring-offset-card"
                    : ""
                }`}
                style={{
                  backgroundColor: c,
                }}
              />
            ))}
          </div>

          <div className="rounded-full border border-gray-500 px-3 py-1 text-xs text-gray-400">
            {sizeLabel}
          </div>
        </div>

        {/* Rating and Price */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star fill={1} size={20} />
            <span className="text-base font-medium text-foreground">{rating}</span>
          </div>
          <div className="text-2xl font-bold text-danger">
            {showFlashDeal && flashDealPrice
              ? `$${flashDealPrice.toFixed(2)}`
              : price}
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleToggleCart}
          className="mt-5 w-full rounded-xl bg-danger py-3 text-center text-base font-medium text-white transition-colors hover:bg-red-800"
        >
          {isInCart ? "Remove from cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
