import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "../ui/star";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { Heart, Tag, Truck, RotateCcw, Scale } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "../../store/useCartStore";
import { useToggleWishlist, useWishlistStatus } from "../../hooks/useWishlist";
import type { DetailItem } from "../../types/DetailItem";
import { useTranslation } from "react-i18next";
import {
  addCompareProduct,
  removeCompareProduct,
  isProductCompared,
} from "../../utils/compareStorage";
import { useState } from "react";

type ProductInfoPanelProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  item: DetailItem;
  reviewCount?: number;
  productType?: 'SHOP' | 'WHOLESALE';
  rawProduct?: any;
};

export function ProductInfoPanel({
  selectedColor,
  onColorChange,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  item,
  reviewCount = 0,
  productType = 'SHOP',
  rawProduct,
}: ProductInfoPanelProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();

  const { data: wishlistStatus } = useWishlistStatus(productType, item.id);
  const toggleWishlist = useToggleWishlist();
  const isFavorite = Boolean(wishlistStatus?.isWishlisted);

  const { t } = useTranslation("productDetails");

  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    setIsCompared(isProductCompared(item.id));
  }, [item.id]);

  const isWholesale = productType === 'WHOLESALE';

  // Retrieve sizes & stock quantity for the currently selected color
  const colorObj = isWholesale
    ? rawProduct?.wholesaleColors?.find(
      (c: any) =>
        c.color &&
        selectedColor &&
        c.color.toLowerCase() === selectedColor.toLowerCase()
    )
    : rawProduct?.colors?.find(
      (c: any) =>
        (c.colorName || c.color) &&
        selectedColor &&
        (c.colorName || c.color).toLowerCase() === selectedColor.toLowerCase()
    );

  const colorVariants = isWholesale
    ? (colorObj?.sizes || []).map((s: any) => ({ size: s.size, quantity: colorObj?.stock ?? 0 }))
    : colorObj?.variants || [];

  // Find currently selected size variant info
  const selectedVariant = colorVariants.find((v: any) => v.size === selectedSize);

  const hasColors = isWholesale
    ? Array.isArray(rawProduct?.wholesaleColors) && rawProduct.wholesaleColors.length > 0
    : Array.isArray(rawProduct?.colors) && rawProduct.colors.length > 0;

  const hasSizes = isWholesale
    ? Array.isArray(rawProduct?.wholesaleColors) && rawProduct.wholesaleColors.some((c: any) => c.sizes && c.sizes.length > 0)
    : Array.isArray(rawProduct?.sizes) && rawProduct.sizes.length > 0;

  const availableStock = (() => {
    const stockVal = (() => {
      if (isWholesale) {
        return colorObj?.stock ?? 0;
      }
      if (hasColors && hasSizes) {
        return selectedVariant ? selectedVariant.quantity : 0;
      }
      return rawProduct?.stock ?? 0;
    })();
    // For wholesale, if stock is less than minOrder, it's effectively 0 (insufficient stock)
    if (isWholesale && item.minOrder && stockVal < item.minOrder) {
      return 0;
    }
    return stockVal;
  })();

  // Guard quantity: cannot exceed availableStock or fall below minOrder
  useEffect(() => {
    const minQty = item.minOrder || 1;
    if (availableStock > 0) {
      if (quantity > availableStock) {
        setQuantity(availableStock);
      } else if (quantity < minQty) {
        setQuantity(minQty);
      }
    } else {
      setQuantity(1);
    }
  }, [selectedSize, selectedColor, availableStock, quantity, setQuantity, item.minOrder]);

  // Flash deal price calculation
  const hasFlashDeal =
    rawProduct?.isFlashDeals &&
    rawProduct?.flashDealPrice &&
    rawProduct?.flashDealPrice < item.price;

  const activePrice = hasFlashDeal ? rawProduct.flashDealPrice : item.price;
  const oldPrice = hasFlashDeal ? item.price : null;
  const discountPercent = hasFlashDeal
    ? Math.round(((item.price - rawProduct.flashDealPrice) / item.price) * 100)
    : null;

  // Stock status styling
  const stockLabel =
    availableStock === 0
      ? "Out of Stock"
      : availableStock <= 5
        ? "Low Stock"
        : "In Stock";

  const stockBadgeClass =
    availableStock === 0
      ? "text-red-600 bg-red-50 border-red-200"
      : availableStock <= 5
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-green-600 bg-green-50 border-green-200";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("copiedLink"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleToggleFavorite = () => {
    toggleWishlist.mutate(
      { productType, productId: item.id },
      {
        onSuccess: (data) => {
          toast.success(data.isWishlisted ? t("favoriteAdded") : t("favoriteRemoved"));
        },
      }
    );
  };
  const handleAddToCart = () => {
    if (availableStock <= 0) {
      toast.error("This option is currently out of stock.");
      return;
    }

    if (isWholesale) {
      const sizesForSelectedColor = colorObj
        ? (colorObj.sizes || []).map((s: any) => s.size).join(", ")
        : "";

      const cartItemId = `${item.id}-${selectedColor.toLowerCase()}-wholesale`;

      addItem({
        id: cartItemId,
        productId: item.id,
        categoryId: item.category.id,
        title: item.name,
        unitPrice: activePrice,
        currency: "EGP",
        size: sizesForSelectedColor,
        color: selectedColor,
        colorHex: "",
        imageSrc:
          item.images.find(
            (img) => img.color?.toLowerCase() === selectedColor.toLowerCase()
          )?.url || item.images[0]?.url || "",
        quantity,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["wholesale"] });
        queryClient.invalidateQueries({ queryKey: ["wholesales"] });
      });

      toast.success(
        t(quantity > 1 ? "addedToBagPlural" : "addedToBag", {
          count: quantity,
          size: sizesForSelectedColor,
          color: selectedColor,
        })
      );
    } else {
      const matchingImage = item.images.find(
        (image) =>
          image.color &&
          image.color.toLowerCase() === selectedColor.toLowerCase()
      );

      addItem({
        id: `${item.id}-${selectedSize}-${selectedColor}`,
        productId: item.id,
        categoryId: item.category.id,
        title: item.name,
        unitPrice: activePrice,
        currency: "EGP",
        size: selectedSize,
        color: selectedColor,
        colorHex: selectedColor,
        imageSrc: matchingImage?.url || item.images[0]?.url || "",
        quantity,
      });

      toast.success(
        t(quantity > 1 ? "addedToBagPlural" : "addedToBag", {
          count: quantity,
          size: selectedSize,
          color: selectedColor,
        })
      );
    }
  };

  const handleBuyNow = () => {
    if (availableStock <= 0) {
      toast.error("This option is currently out of stock.");
      return;
    }
    handleAddToCart();
    navigate("/checkout");
  };

  const handleCompare = () => {
    try {
      if (isCompared) {
        removeCompareProduct(item.id);
        setIsCompared(false);
        toast.success("Removed from compare");
        return;
      }

      addCompareProduct(item.id);
      setIsCompared(true);
      toast.success("Added to compare");
    } catch {
      toast.error("You can compare up to 4 products.");
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full font-['Montserrat'] select-none">

      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
          {item.name}
        </h1>
        {item.description && (
          <p className="text-xs text-gray-text leading-relaxed mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const fill = Math.min(1, Math.max(0, item.rating - index));
            return <Star key={index} fill={fill} size={15} />;
          })}
        </div>
        <span className="text-sm font-semibold text-foreground">{item.rating}</span>
        <span className="text-sm text-gray-text">({reviewCount} {t("reviews")})</span>
        <button
          type="button"
          onClick={handleCompare}
          className="ml-auto text-xs text-primary hover:underline font-semibold"
        >
          {isCompared ? "✓ In Comparison" : "+ Add to Product Comparison"}
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-foreground">
          {activePrice.toLocaleString()} EGP
        </span>
        {oldPrice && (
          <>
            <span className="text-base text-gray-text line-through">{oldPrice.toLocaleString()} EGP</span>
            <span className="bg-primary-tint text-primary text-xs font-bold px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Brand */}
      {item.brandName && (
        <div className="flex items-center gap-2 py-2 border-t border-b border-stroke">
          <span className="text-xs font-bold text-gray-text uppercase tracking-wider">Brand:</span>
          <span className="text-sm font-bold text-foreground uppercase tracking-wide">{item.brandName}</span>
        </div>
      )}

      {/* Colors */}
      {item.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            COLOR: <span className="text-foreground normal-case font-bold">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {item.colors.map((color) => {
              const isSelected =
                selectedColor &&
                color.color &&
                selectedColor.toLowerCase() === color.color.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange(color.color)}
                  title={color.color}
                  className={`w-7 h-7 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${isSelected ? "border-primary" : "border-stroke hover:border-gray-text"
                    }`}
                >
                  <span
                    className="w-full h-full rounded-full inline-block border border-black/10"
                    style={{ backgroundColor: color.color ? color.color.toLowerCase() : "#ddd" }}
                  />
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleShare}
              className="ml-auto text-xs text-gray-text hover:text-primary flex items-center gap-1"
            >
              <RiShareForwardLine className="h-4 w-4" />
              Size Guide
            </button>
          </div>
        </div>
      )}

      {/* Sizes */}
      {colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            {isWholesale ? "AVAILABLE SIZES:" : `SIZE: ${selectedSize}`}
          </div>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant: any) => {
              const isSelected = !isWholesale && variant.size === selectedSize;
              const isOutOfStock = variant.quantity <= 0;
              return (
                <button
                  key={variant.size}
                  type="button"
                  disabled={!isWholesale && isOutOfStock}
                  onClick={() => !isWholesale && setSelectedSize(variant.size)}
                  className={`h-9 min-w-[36px] px-3 rounded-md font-semibold text-xs transition-all border outline-none ${
                    isWholesale
                      ? "bg-card text-foreground border-stroke cursor-default"
                      : isSelected
                      ? "bg-foreground text-background border-foreground"
                      : isOutOfStock
                      ? "bg-background text-gray-text/50 border-stroke line-through cursor-not-allowed"
                      : "bg-card text-foreground border-stroke hover:border-gray-text"
                  }`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">QUANTITY:</span>
        <div className="inline-flex items-center border border-stroke rounded-md bg-card">
          <button
            type="button"
            disabled={availableStock <= 0 || quantity <= (item.minOrder || 1)}
            onClick={() => setQuantity(Math.max(item.minOrder || 1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center font-bold text-foreground/80 hover:bg-background disabled:opacity-40 rounded-l-md"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-foreground text-sm border-x border-stroke">
            {availableStock <= 0 ? 0 : quantity}
          </span>
          <button
            type="button"
            disabled={availableStock <= 0 || quantity >= availableStock}
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center font-bold text-foreground/80 hover:bg-background disabled:opacity-40 rounded-r-md"
          >
            +
          </button>
        </div>
        {/* Stock badge */}
        <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${stockBadgeClass}`}>
          {stockLabel}
        </span>
        {productType === "WHOLESALE" && item.minOrder && (
          <span className="text-xs font-semibold text-danger bg-red-50 border border-red-200 px-2 py-0.5 rounded ml-2">
            Min. Order: {item.minOrder}
          </span>
        )}
      </div>

      {/* Favorite */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        className={`flex items-center gap-2 text-sm font-semibold w-fit transition ${isFavorite ? "text-primary" : "text-gray-text hover:text-primary"
          }`}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
        {isFavorite ? "Wishlisted" : t("addToFavorite")}
      </button>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={availableStock <= 0}
          onClick={handleAddToCart}
          className="flex-1 h-11 bg-primary text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-pressed disabled:opacity-50 transition"
        >
          <BsBag className="h-4 w-4" />
          {t("addToCart")}
        </button>
        <button
          type="button"
          disabled={availableStock <= 0}
          onClick={handleBuyNow}
          className="flex-1 h-11 bg-foreground text-background rounded-md font-bold text-sm flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
        >
          {t("buyNow")}
        </button>
      </div>

      {/* Shipping Info */}
      <div className="flex flex-col gap-2 pt-2 border-t border-stroke">
        <div className="flex items-start gap-3 text-xs text-foreground/80">
          <Truck className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground">{t("deliveryTitle")}</span>
            {" "}— {t("deliverySubtitle")}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground/80">
          <RotateCcw className="h-4 w-4 text-foreground shrink-0" />
          <span className="font-bold text-foreground">{t("freeReturns")}</span>
        </div>
      </div>
    </div>
  );
}
