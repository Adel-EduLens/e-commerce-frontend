import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "../ui/star";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { Heart, Tag, Truck, RotateCcw, Scale, Bell, Check } from "lucide-react";
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
import { useAuthStore } from "../../store/useAuthStore";
import { useNotifyMeCheck, useNotifyMeSubscribe, useNotifyMeUnsubscribe } from "../../hooks/useNotifyMe";

type ProductInfoPanelProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  item: DetailItem;
  reviewCount?: number;
  productType?: 'SHOP' | 'WHOLESALE' | 'RETAIL';
  rawProduct?: any;
  /** When provided, overrides the internal add-to-cart logic */
  onAddToCart?: () => void;
  /** When provided, overrides the internal buy-now logic */
  onBuyNow?: () => void;
  /** When provided, overrides the internal notify-me logic */
  onNotifyMe?: () => void;
  /** External loading state for add-to-cart */
  isAddingToCart?: boolean;
  /** External subscribed state for notify-me */
  isNotifySubscribed?: boolean;
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
  onAddToCart: externalAddToCart,
  onBuyNow: externalBuyNow,
  onNotifyMe: externalNotifyMe,
  isAddingToCart = false,
  isNotifySubscribed,
}: ProductInfoPanelProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();

  const { data: wishlistStatus } = useWishlistStatus(productType, item.id);
  const toggleWishlist = useToggleWishlist();
  const isFavorite = Boolean(wishlistStatus?.isWishlisted);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const targetType = productType === "WHOLESALE" ? "WHOLESALE_RESTOCK" : productType === "RETAIL" ? "RETAIL_RESTOCK" : "SHOP_RESTOCK";
  const targetId = String(item.id);

  const { data: checkData } = useNotifyMeCheck(targetType, targetId);
  const isSubscribed = checkData?.isSubscribed ?? false;

  const subscribeMutation = useNotifyMeSubscribe();
  const unsubscribeMutation = useNotifyMeUnsubscribe();

  const handleNotifyMeToggle = () => {
    if (!isAuthenticated) {
      toast.error(t("loginToSubscribe"));
      navigate("/login");
      return;
    }

    if (isSubscribed) {
      unsubscribeMutation.mutate({ targetType, targetId });
    } else {
      subscribeMutation.mutate({ targetType, targetId });
    }
  };

  const { t } = useTranslation("productDetails");

  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
  const func=()=>{
    setIsCompared(isProductCompared(item.id, (productType as "WHOLESALE" | "RETAIL" | "SHOP") || "SHOP"));
  }
  func();
  }, [item.id, productType]);

  const isWholesale = productType === 'WHOLESALE';
  const isRetail = productType === 'RETAIL';

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

  // Retail products have a flat `sizes` array with quantity per size+color combo,
  // whereas shop products nest variants under each color object.
  const colorVariants = isWholesale
    ? (colorObj?.sizes || []).map((s: any) => ({ size: s.size, quantity: colorObj?.stock ?? 0 }))
    : isRetail
    ? ((rawProduct?.sizes || []) as any[]).filter(
        (s: any) => !s.color || !selectedColor || s.color.toLowerCase() === selectedColor.toLowerCase()
      ).map((s: any) => ({ size: s.size, quantity: s.quantity ?? 0 }))
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
      if (isRetail) {
        // Retail: use size-level quantity if a variant is selected, otherwise product-level stock
        if (hasSizes && selectedVariant) {
          return selectedVariant.quantity;
        }
        return (rawProduct?.stock as number) ?? item.stock ?? 0;
      }
      if (hasColors && hasSizes) {
        return selectedVariant ? selectedVariant.quantity : 0;
      }
      return rawProduct?.stock ?? 0;
    })();
    // For wholesale, if stock is less than 1, it's effectively 0 (insufficient stock)
    const minQty = isWholesale ? 1 : (item.minOrder || 1);
    if (isWholesale && minQty && stockVal < minQty) {
      return 0;
    }
    return stockVal;
  })();

  // Guard quantity: cannot exceed availableStock or fall below minOrder (for retail) / 1 (for wholesale)
  useEffect(() => {
    const minQty = isWholesale ? 1 : (item.minOrder || 1);
    if (availableStock > 0) {
      if (quantity > availableStock) {
        setQuantity(availableStock);
      } else if (quantity < minQty) {
        setQuantity(minQty);
      }
    } else {
      setQuantity(minQty);
    }
  }, [selectedSize, selectedColor, availableStock, quantity, setQuantity, item.minOrder, colorObj, isWholesale]);

  // Flash deal price calculation
  const hasFlashDeal =
    rawProduct?.isFlashDeals &&
    rawProduct?.flashDealPrice &&
    rawProduct?.flashDealPrice < item.price;

  const activePrice = Number(hasFlashDeal ? rawProduct.flashDealPrice : item.price);
  const oldPrice = hasFlashDeal ? item.price : null;
  const discountPercent = hasFlashDeal
    ? Math.round(((item.price - Number(rawProduct.flashDealPrice)) / item.price) * 100)
    : null;

  // Stock status styling
  const stockLabel =
    availableStock === 0
      ? t("outOfStock")
      : availableStock <= 5
        ? t("lowStock")
        : t("inStock");

  const stockBadgeClass =
    availableStock === 0
      ? "text-red-600 bg-red-50 border-red-200"
      : availableStock <= 5
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-green-600 bg-green-50 border-green-200";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name}`,
          url: window.location.href,
        });
      } catch {
        // share cancelled/failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
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
    if (externalAddToCart) {
      externalAddToCart();
      return;
    }
    if (availableStock <= 0) {
      toast.error(t("outOfStockOption"));
      return;
    }
    
    const minQty = isWholesale ? (colorObj?.minOrder ?? item.minOrder ?? 1) : (item.minOrder || 1);
    if (isWholesale && minQty && quantity < minQty) {
      toast.error(t("wholesaleMinCartQtyError", { totalQty: quantity, minQty }));
      return;
    }

    if (isWholesale && colorObj) {
      const sizesForSelectedColor = colorObj
        ? (colorObj.sizes || []).map((s: any) => s.size).join(", ")
        : "";

      const cartItemId = `${item.id}-${selectedColor.toLowerCase()}-wholesale`;

      addItem({
        id: cartItemId,
        productId: String(item.id),
        categoryId: item.category?.id ? String(item.category.id) : undefined,
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
        minOrder: minQty,
        productType: "WHOLESALE",
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
        productId: String(item.id),
        categoryId: item.category?.id ? String(item.category.id) : undefined,
        title: item.name,
        unitPrice: activePrice,
        currency: "EGP",
        size: selectedSize,
        color: selectedColor,
        colorHex: selectedColor,
        imageSrc: matchingImage?.url || item.images[0]?.url || "",
        quantity,
        minOrder: item.minOrder || 1,
        productType: "STANDARD",
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
    if (externalBuyNow) {
      externalBuyNow();
      return;
    }
    if (availableStock <= 0) {
      toast.error(t("outOfStockOption"));
      return;
    }
    if (quantity > availableStock) {
      toast.error(t("cannotCheckoutStock", { count: availableStock }));
      return;
    }
    const minQty = isWholesale ? (colorObj?.minOrder ?? item.minOrder ?? 1) : (item.minOrder || 1);
    
    if (isWholesale && quantity < minQty) {
      toast.error(t("lessThanMinOrder", { quantity, minQty }));
      return;
    }

    // Calculate total quantity of this product in the cart after adding this item
    const currentCartQty = useCartStore.getState().items
      .filter((cartItem) => cartItem.productId === item.id)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const newTotalQty = currentCartQty + quantity;

    if (isWholesale && newTotalQty < minQty) {
      toast.error(t("wholesaleMinCartQtyError", { totalQty: newTotalQty, minQty }));
      handleAddToCart();
      return;
    }

    handleAddToCart();
    navigate("/checkout");
  };

  const handleCompare = () => {
    try {
      if (isCompared) {
        removeCompareProduct(item.id, (productType as any) || "SHOP");
        setIsCompared(false);
        toast.success(t("removedFromCompareToast"));
        return;
      }

      addCompareProduct(item.id, (productType as any) || "SHOP");
      setIsCompared(true);
      toast.success(t("addedToCompareToast"));
    } catch {
      toast.error(t("compareLimitError"));
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
          {isCompared ? `✓ ${t("inComparison")}` : t("addToCompareLink")}
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-foreground">
          {activePrice.toLocaleString()} {t("egp")}
        </span>
        {oldPrice && (
          <>
            <span className="text-base text-gray-text line-through">{oldPrice.toLocaleString()} {t("egp")}</span>
            <span className="bg-primary-tint text-primary text-xs font-bold px-2 py-0.5 rounded">
              {discountPercent}% {t("off")}
            </span>
          </>
        )}
      </div>

      {/* Brand */}
      {item.brandName && (
        <div className="flex items-center gap-2 py-2 border-t border-b border-stroke">
          <span className="text-xs font-bold text-gray-text uppercase tracking-wider">{t("brandLabel")}</span>
          <span className="text-sm font-bold text-foreground uppercase tracking-wide">{item.brandName}</span>
        </div>
      )}

      {/* Colors */}
      {item.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            {isWholesale ? t("packageColor") : t("colorLabel")} <span className="text-foreground normal-case font-bold">{selectedColor}</span>
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
              {t("sizeGuide")}
            </button>
          </div>
        </div>
      )}

      {/* Sizes */}
      {colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
            {isWholesale ? t("availableSizes") : t("sizeLabel", { size: selectedSize })}
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
          {isWholesale && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md font-medium mt-1">
              {t("wholesaleSizesNote")}
            </p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{t("quantityLabel")}</span>
        <div className="inline-flex items-center border border-stroke rounded-md bg-card">
          <button
            type="button"
            disabled={availableStock <= 0 || quantity <= (isWholesale ? 1 : (item.minOrder || 1))}
            onClick={() => setQuantity(Math.max(isWholesale ? 1 : (item.minOrder || 1), quantity - 1))}
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
        {productType === "WHOLESALE" && (colorObj?.minOrder ?? item.minOrder) && (
          <span className="text-xs font-semibold text-danger bg-red-50 border border-red-200 px-2 py-0.5 rounded ml-2">
            {t("minOrderLabel", { min: colorObj?.minOrder ?? item.minOrder })}
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
        {isFavorite ? t("wishlisted") : t("addToFavorite")}
      </button>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {availableStock > 0 ? (
          <>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 h-11 btn-cart-gradient rounded-md font-bold text-sm flex items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BsBag className="h-4 w-4" />
              {isAddingToCart ? t("adding") ?? 'Adding...' : t("addToCart")}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 h-11 bg-foreground text-background rounded-md font-bold text-sm flex items-center justify-center hover:opacity-90 transition"
            >
              {t("buyNow")}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={externalNotifyMe ?? handleNotifyMeToggle}
            disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
            className={`flex-1 h-11 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition border-2 ${
              (isNotifySubscribed ?? isSubscribed)
                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                : "border-primary text-primary bg-transparent hover:bg-primary/5"
            }`}
          >
            {(isNotifySubscribed ?? isSubscribed) ? (
              <>
                <Check className="h-4 w-4" />
                {t("subscribedForRestock")}
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 animate-bounce" />
                {t("notifyMeInStock")}
              </>
            )}
          </button>
        )}
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
