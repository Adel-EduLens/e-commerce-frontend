import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useWholesaleCartStore } from "../../store/useWholesaleCartStore";

const defaultImage = asset(
  "medium-shot-man-posing-with-blue-background-removebg-preview 1.png",
);

const COLOR_HEX: Record<string, string> = {
  black: "#111111",
  white: "#f8f8f8",
  red: "#e53e3e",
  blue: "#3182ce",
  green: "#38a169",
  yellow: "#d69e2e",
  orange: "#dd6b20",
  purple: "#805ad5",
  pink: "#d53f8c",
  gray: "#718096",
  grey: "#718096",
  brown: "#975a16",
  beige: "#d4a574",
  navy: "#2c3e7f",
};

function colorToHex(name?: string): string {
  if (!name || typeof name !== "string") return "#000";
  return COLOR_HEX[name.toLowerCase()] ?? name;
}

type ImageType = {
  id: string;
  url: string;
  color?: string;
  productId?: string;
};
type CompareProductType = "SHOP" | "WHOLESALE" | "RETAIL";
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
  brand?: string;
  category?: string;
  wholesaleSizes?: string[];
  minOrder?: number;
  wholesaleCard?: boolean;
  hideAddToCart?: boolean;
  hideQuickActions?: boolean;
  stock?: number;
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
  description,
  showTypeBadge = false,
  brand,
  category,
  wholesaleSizes = [],
  minOrder,
  wholesaleCard = false,
  hideAddToCart = false,
  hideQuickActions = false,
  stock,
}: ProductCardProps) {
  const showFlashDeal = isFlashDeals && flashDealPrice !== undefined;
  const safeColors = Array.isArray(colors)
    ? colors.filter((c) => typeof c === "string" && c.trim() !== "")
    : [];
  const { label: countdownLabel, expired } = useCountdown(
    showFlashDeal ? flashDealEndsAt : undefined,
  );
  const [activeImage, setActiveImage] = useState(imageSrc);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [isCompared, setIsCompared] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("productDetails");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const actualProductId =
    productId ||
    (to ? to.split("/").filter(Boolean).pop() : "") ||
    title ||
    "unknown-id";

  const computedTo =
    productType === "RETAIL"
      ? `/retail/shop/${actualProductId}`
      : productType === "WHOLESALE"
        ? `/wholesale/${actualProductId}`
        : `/product-details/${actualProductId}`;

  const targetTo = to && to !== "/product-details" ? to : computedTo;

  const { data: wishlistStatus } = useWishlistStatus(
    productType,
    actualProductId,
  );
  const toggleWishlist = useToggleWishlist();
  const isWishlisted = Boolean(wishlistStatus?.isWishlisted);
  const cartItems = useCartStore((s) => s.items);
  const wholesaleCartItems = useWholesaleCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const isWholesale = productType === "WHOLESALE";
  const useWholesaleCard = isWholesale && wholesaleCard;
  const compareType: CompareProductType = productType ?? "SHOP";

  const selectedColor = safeColors[activeColorIdx] ?? "Default";

  const existingCartItem = isWholesale
    ? wholesaleCartItems.find((item) =>
        String(item.productId) === String(actualProductId) &&
        (useWholesaleCard ? item.color?.toLowerCase() === selectedColor.toLowerCase() : true)
      )
    : cartItems.find((item) => {
        return (
          String(item.productId) === String(actualProductId) ||
          String(item.id).startsWith(String(actualProductId))
        );
      });

  const isInCart = Boolean(existingCartItem);

  useEffect(() => {
    setActiveImage(imageSrc);
  }, [imageSrc]);
  useEffect(() => {
    setIsCompared(
      isProductCompared(
        actualProductId,
        compareType,
      ),
    );
  }, [actualProductId, compareType]);

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t("pleaseLoginFirst"));
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
        removeCompareProduct(actualProductId, compareType);
        setIsCompared(false);
        toast.success(t("removedFromCompareToast"));
      } else {
        addCompareProduct(actualProductId, compareType);
        setIsCompared(true);
        toast.success(t("addedToCompareToast"));
      }
    } catch {
      toast.error(t("compareLimitError"));
    }
  };

  const handleToggleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (existingCartItem) {
      if (isWholesale) {
        useWholesaleCartStore.getState().removeItem(existingCartItem.id);
      } else {
        removeItem(existingCartItem.id);
      }
      toast.success(t("removedFromCartToast"));
    } else {
      if (stock !== undefined && stock <= 0) {
        toast.error(t("outOfStock", "Out of stock"));
        return;
      }

      const numPrice = Number(price.replace(/[^0-9.-]+/g, "")) || 0;

      if (isWholesale) {
        const allColorsStr = safeColors.join(", ") || "All Colors";
        const allSizesStr =
          wholesaleSizes.join(", ") || sizeLabel || "All Sizes";

        useWholesaleCartStore.getState().addItem({
          id: `${actualProductId}-${selectedColor.toLowerCase()}-wholesale`,
          productId: actualProductId,
          title,
          unitPrice: numPrice,
          currency: "EGP",
          size: allSizesStr, // Use all sizes as requested ("add the color selected an there sizes")
          color: useWholesaleCard ? selectedColor : allColorsStr,
          colorHex: useWholesaleCard ? colorToHex(selectedColor) : "",
          imageSrc: useWholesaleCard ? activeImage : imageSrc,
          quantity: minOrder || 1,
          minOrder: minOrder || 1,
          productType: "WHOLESALE",
        });
      } else {
        const firstSize = sizeLabel
          ? sizeLabel.includes("-")
            ? sizeLabel.split("-")[0].trim()
            : sizeLabel.includes(",")
              ? sizeLabel.split(",")[0].trim()
              : sizeLabel.trim()
          : "Default";
        const firstColor = safeColors.length > 0 ? safeColors[0] : "Default";
        const firstColorHex =
          safeColors.length > 0 ? colorToHex(safeColors[0]) : "#000";

        addItem({
          id: `${actualProductId}-${firstSize}-${firstColor}`,
          productId: actualProductId,
          title,
          unitPrice: numPrice,
          currency: "EGP",
          size: firstSize,
          color: firstColor,
          colorHex: firstColorHex,
          imageSrc,
          quantity: 1,
          minOrder: 1,
          productType: productType === "SHOP" ? "STANDARD" : productType,
        });
      }

      toast.success(t("addedToCartToast"));
    }
  };

  return (
    <div
      className={`group flex flex-col w-full overflow-hidden rounded-2xl bg-card border border-card-border shadow-sm transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {/* Image container */}
      <Link
        to={targetTo}
        className={`relative block aspect-[4/5] w-full overflow-hidden ${useWholesaleCard ? "bg-[#f0eeec]" : "bg-[#f5f5f5]"
          }`}
      >
        <img
          className={`h-full w-full object-cover ${useWholesaleCard
            ? "transition-transform duration-300 group-hover:scale-105"
            : ""
            }`}
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
          {showTypeBadge && isWholesale && (
            <div className="rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm bg-primary text-primary-foreground">
              Wholesale
            </div>
          )}
          {/* Flash deal countdown badge */}
          {showFlashDeal && countdownLabel && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm ${expired ? "bg-gray-text" : "bg-urgent"
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
          {stock !== undefined && stock <= 0 && (
            <div className="flex items-center gap-1 rounded-full px-3 py-1 font-['Montserrat'] text-xs font-semibold text-white shadow-sm bg-gray-500">
              {t("outOfStock", "Out of stock")}
            </div>
          )}
        </div>

        {/* Quick Actions (Wishlist & Compare) */}
        {!hideQuickActions && (
          <>
            {/* Heart icon */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={toggleWishlist.isPending}
              className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105 disabled:opacity-70 ${useWholesaleCard
                ? "bg-white shadow-md"
                : "bg-black/60 backdrop-blur-sm"
                }`}
            >
              <Heart
                size={useWholesaleCard ? 18 : 20}
                strokeWidth={useWholesaleCard ? 2 : 1.8}
                className={`transition-colors ${useWholesaleCard
                  ? isWishlisted
                    ? "text-primary"
                    : "text-[#555]"
                  : isWishlisted
                    ? "text-primary"
                    : "text-gray-300"
                  }`}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>

            {/* Compare button (optional, moved to top right below heart) */}
            {!useWholesaleCard && (
              <button
                onClick={handleCompare}
                aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                className={`absolute right-3 top-16 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-105 ${isCompared
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/60 text-gray-300 hover:text-white"
                  }`}
              >
                <MdCompare size={18} />
              </button>
            )}
          </>
        )}

        {/* Carousel indicators (mock) */}
        <div
          className={`${useWholesaleCard ? "bottom-3" : "bottom-4"} absolute left-1/2 flex -translate-x-1/2 gap-1.5 z-20`}
        >
          {images.slice(0, useWholesaleCard ? 5 : 3).map((img, index) => (
            <button
              key={`${img.id}-${index}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImage(img.url);
              }}
              className={`rounded-full ${useWholesaleCard
                ? activeImage === img.url
                  ? "h-1.5 w-4 bg-danger transition-all"
                  : "h-1.5 w-1.5 bg-black/40 transition-all"
                : activeImage === img.url
                  ? "h-2 w-2 bg-danger"
                  : "h-2 w-2 bg-black"
                }`}
            />
          ))}
        </div>
      </Link>

      {/* Info container */}
      <div
        className={`flex flex-col font-['Montserrat'] ${useWholesaleCard ? "gap-2 p-4" : "p-5"}`}
      >
        {/* Brand row for Wholesale */}
        {isWholesale && brand && (
          <div
            className={`flex items-center gap-2 ${useWholesaleCard ? "" : "mb-2"}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-black text-foreground shrink-0">
              {brand.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground uppercase tracking-wide truncate underline">
                {brand}
              </p>
              {category && (
                <p className="text-[11px] text-gray-text truncate">
                  {category}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <Link
          to={targetTo}
          className={`${useWholesaleCard ? "text-base font-semibold leading-snug" : "text-xl sm:text-2xl font-medium"} text-card-text hover:underline line-clamp-1`}
        >
          {title}
        </Link>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`${useWholesaleCard ? "text-xs" : "mt-1 text-sm"} text-gray-text line-clamp-1`}
          >
            {subtitle}
          </p>
        )}

        {/* Description for Wholesale */}
        {isWholesale && description && (
          <p className="mt-1 text-xs text-gray-text line-clamp-1">
            {description}
          </p>
        )}

        {/* Colors and Sizes */}
        <div
          className={`${useWholesaleCard ? "mt-1 gap-3" : "mt-4 justify-between"} flex items-center`}
        >
          <div className="flex items-center gap-2">
            {safeColors
              .slice(0, useWholesaleCard ? 4 : safeColors.length)
              .map((c, i) => {
                const matchedImg = images?.find(
                  (img) => img.color?.toLowerCase() === c.toLowerCase(),
                );
                const isSelected = useWholesaleCard
                  ? i === activeColorIdx
                  : matchedImg
                    ? activeImage === matchedImg.url
                    : i === 0;
                return (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColorIdx(i);
                      if (matchedImg) {
                        setActiveImage(matchedImg.url);
                      }
                    }}
                    title={c}
                    className={`${useWholesaleCard ? "h-5 w-5 border-2" : "h-6 w-6"} rounded-full cursor-pointer transition-all ${useWholesaleCard
                      ? isSelected
                        ? "border-foreground scale-110"
                        : "border-foreground/10 hover:border-gray-400"
                      : isSelected
                        ? "ring-1 ring-gray-400 ring-offset-2 ring-offset-card scale-110"
                        : "hover:scale-105 border-foreground/50 border"
                      }`}
                    style={{
                      backgroundColor: colorToHex(c),
                    }}
                  />
                );
              })}
            {useWholesaleCard && safeColors.length > 4 && (
              <span className="text-[10px] text-gray-text">
                +{safeColors.length - 4}
              </span>
            )}
          </div>

          {sizeLabel && (
            <div
              className={`rounded-full border ${useWholesaleCard
                ? "ml-auto shrink-0 whitespace-nowrap border-gray-400 px-2.5 py-0.5 text-[10px] text-gray-500"
                : "border-gray-500 px-3 py-1 text-xs text-gray-400"
                }`}
            >
              {sizeLabel}
            </div>
          )}
        </div>

        {/* Rating and Price */}
        <div
          className={`${useWholesaleCard ? "mt-2" : "mt-6"} flex items-center justify-between`}
        >
          <div
            className={`flex items-center ${useWholesaleCard ? "gap-1" : "gap-1.5"}`}
          >
            <Star fill={1} size={useWholesaleCard ? 16 : 20} />
            <span
              className={`${useWholesaleCard ? "text-sm" : "text-base"} font-medium text-foreground`}
            >
              {rating}
            </span>
          </div>
          <div
            className={`${useWholesaleCard ? "text-end text-xl font-extrabold leading-none" : "text-2xl font-bold"} text-danger`}
          >
            {showFlashDeal && flashDealPrice
              ? `${flashDealPrice.toLocaleString()} ${t("egp", "EGP")}`
              : price.replace(/\$|EGP/gi, ` ${t("egp", "EGP")}`).trim()}
            {isWholesale && (
              <span
                className={
                  useWholesaleCard ? "text-xs font-normal text-gray-text" : ""
                }
              >
                {` / ${t("pack", "Pack")}`}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        {!hideAddToCart && (
          <button
            onClick={handleToggleCart}
            disabled={stock !== undefined && stock <= 0 && !isInCart}
            className={`${useWholesaleCard ? "mt-2 text-sm font-semibold" : "mt-5 text-base font-medium"} w-full rounded-xl ${stock !== undefined && stock <= 0 && !isInCart ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-cart-gradient"} py-3 text-center transition-colors`}
          >
            {isInCart ? t("removeFromCart") : stock !== undefined && stock <= 0 ? t("outOfStock", "Out of stock") : t("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
}
