import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "../ui/star";
import { useNavigate } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { Heart, Tag, Truck, RotateCcw, Scale, Bell, BellRing, Check, Scissors, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "../../store/useCartStore";
import { useWholesaleCartStore } from "../../store/useWholesaleCartStore";
import { useToggleWishlist, useWishlistStatus } from "../../hooks/useWishlist";
import type { DetailItem } from "../../types/DetailItem";
import { useTranslation } from "react-i18next";
import {
  addCompareProduct,
  removeCompareProduct,
  isProductCompared,
} from "../../utils/compareStorage";
import { useState } from "react";
import { Modal } from "../../components/ui/modal";
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
  productType?: 'SHOP' | 'WHOLESALE' | 'RENTAL' | 'RETAIL';
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
  const addWholesaleItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();

  const { data: wishlistStatus } = useWishlistStatus(productType, item.id);
  const toggleWishlist = useToggleWishlist();
  const isFavorite = Boolean(wishlistStatus?.isWishlisted);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const targetType = productType === "WHOLESALE" ? "WHOLESALE_RESTOCK" : (productType === "RENTAL" || productType === "RETAIL") ? "RENTAL_RESTOCK" : "SHOP_RESTOCK";
  const targetId = String(item.id);

  const { data: checkData } = useNotifyMeCheck(targetType, targetId);
  const isSubscribed = typeof checkData === 'boolean' ? checkData : checkData?.isSubscribed ?? false;

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const func = () => {
      setIsCompared(isProductCompared(item.id, (productType as "WHOLESALE" | "RETAIL" | "SHOP") || "SHOP"));
    }
    func();
  }, [item.id, productType]);

  const isWholesale = productType === 'WHOLESALE';
  const isRetail = productType === 'RETAIL' || productType === 'RENTAL';
  const isGiftCard =
    (productType as string) === 'GIFT_CARD' ||
    Boolean(rawProduct?.giftCardAmounts) ||
    Boolean(item?.giftCardAmounts) ||
    (Array.isArray(rawProduct?.productTypes) &&
      rawProduct.productTypes.some(
        (pt: any) => (typeof pt === 'string' ? pt : pt?.type) === 'GIFT_CARD'
      ));

  const parsedAmounts = (() => {
    const rawStr = rawProduct?.giftCardAmounts || item?.giftCardAmounts;
    if (!rawStr) return [10, 15, 50, 75, 100, 150, 200];
    const list = String(rawStr)
      .split(',')
      .map((s: string) => Number(s.trim()))
      .filter((n: number) => !isNaN(n) && n > 0);
    return list.length > 0 ? list : [10, 15, 50, 75, 100, 150, 200];
  })();

  const [selectedAmount, setSelectedAmount] = useState<number>(() => parsedAmounts[0] || 1000);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>("10");

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  // Retrieve sizes & stock quantity for the currently selected color
  const colorObj = isWholesale
    ? (rawProduct?.wholesaleColors || rawProduct?.colors || [])?.find((c: any) => {
        const name = c.color || c.colorName || "";
        return selectedColor && name.toLowerCase() === selectedColor.toLowerCase();
      }) || (rawProduct?.wholesaleColors || rawProduct?.colors || [])[0]
    : (rawProduct?.colors || [])?.find((c: any) => {
        const name = c.colorName || c.color || "";
        return selectedColor && name.toLowerCase() === selectedColor.toLowerCase();
      }) || (rawProduct?.colors || [])[0];

  // Retail products have a flat `sizes` array with quantity per size+color combo,
  // whereas shop/wholesale products nest variants/sizes under each color object.
  const colorVariants = isWholesale
    ? ((colorObj?.sizes || colorObj?.variants || []) as any[]).map((s: any) => ({
        size: typeof s === "string" ? s : s.size,
        quantity: s.quantity ?? colorObj?.stock ?? 0,
      }))
    : isRetail
      ? ((rawProduct?.sizes || []) as any[]).filter(
        (s: any) => !s.color || !selectedColor || s.color.toLowerCase() === selectedColor.toLowerCase()
      ).map((s: any) => ({ size: s.size, quantity: s.quantity ?? 0 }))
      : ((colorObj?.variants || colorObj?.sizes || []) as any[]).map((s: any) => ({
        size: typeof s === "string" ? s : s.size,
        quantity: s.quantity ?? 0,
      }));

  // Find currently selected size variant info
  const selectedVariant = colorVariants.find((v: any) => v.size === selectedSize);

  // Sync selectedSize when selectedColor changes if current selectedSize is not available for new color
  useEffect(() => {
    if (colorVariants && colorVariants.length > 0) {
      const isValid = colorVariants.some((v: any) => v.size === selectedSize);
      if (!isValid) {
        setSelectedSize(colorVariants[0].size);
      }
    }
  }, [selectedColor, colorVariants, selectedSize, setSelectedSize]);

  const hasColors = isWholesale
    ? ((Array.isArray(rawProduct?.wholesaleColors) && rawProduct.wholesaleColors.length > 0) ||
       (Array.isArray(rawProduct?.colors) && rawProduct.colors.length > 0))
    : Array.isArray(rawProduct?.colors) && rawProduct.colors.length > 0;

  const hasSizes = isWholesale
    ? ((Array.isArray(rawProduct?.wholesaleColors) && rawProduct.wholesaleColors.some((c: any) => (c.sizes && c.sizes.length > 0) || (c.variants && c.variants.length > 0))) ||
       (Array.isArray(rawProduct?.colors) && rawProduct.colors.some((c: any) => c.variants && c.variants.length > 0)))
    : Array.isArray(rawProduct?.sizes) && rawProduct.sizes.length > 0;

  const availableStock = (() => {
    const stockVal = (() => {
      if (isWholesale) {
        if (colorVariants && colorVariants.length > 0) {
          const minSizeQty = Math.min(...colorVariants.map((v: any) => v.quantity ?? 0));
          return colorObj?.stock !== undefined && colorObj?.stock !== null
            ? Math.min(colorObj.stock, minSizeQty)
            : minSizeQty;
        }
        return colorObj?.stock ?? (rawProduct?.stock as number) ?? item.stock ?? 0;
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
    // For wholesale, if min size quantity is less than minOrder requirement, stock is effectively 0 (insufficient to satisfy minimum order)
    const requiredMinOrder = isWholesale
      ? (colorObj?.minOrder ?? item.minOrder ?? rawProduct?.minOrder ?? 1)
      : (item.minOrder || 1);

    if (isWholesale && stockVal < requiredMinOrder) {
      return 0;
    }
    return stockVal;
  })();

  // Guard quantity: cannot exceed availableStock or fall below requiredMinOrder
  useEffect(() => {
    const requiredMinOrder = isWholesale
      ? (colorObj?.minOrder ?? item.minOrder ?? rawProduct?.minOrder ?? 1)
      : (item.minOrder || 1);

    if (availableStock > 0) {
      if (quantity > availableStock) {
        setQuantity(availableStock);
      } else if (quantity < requiredMinOrder) {
        setQuantity(requiredMinOrder);
      }
    } else {
      setQuantity(requiredMinOrder);
    }
  }, [selectedSize, selectedColor, availableStock, quantity, setQuantity, item.minOrder, colorObj, isWholesale, rawProduct]);

  // Flash deal price calculation
  const isRentalInfo = productType === 'RENTAL';
  const basePrice =
    isWholesale ? (rawProduct?.wholesalePrice ?? rawProduct?.shopPrice ?? rawProduct?.retailPrice ?? rawProduct?.blankPrice ?? item.price ?? 0) :
      isRentalInfo ? (rawProduct?.rentalPrice ?? rawProduct?.retailPrice ?? rawProduct?.shopPrice ?? rawProduct?.wholesalePrice ?? rawProduct?.blankPrice ?? item.price ?? 0) :
      isRetail ? (rawProduct?.retailPrice ?? rawProduct?.shopPrice ?? rawProduct?.wholesalePrice ?? rawProduct?.blankPrice ?? item.price ?? 0) :
        (rawProduct?.shopPrice ?? rawProduct?.retailPrice ?? rawProduct?.wholesalePrice ?? rawProduct?.blankPrice ?? item.price ?? 0);

  const hasFlashDeal =
    rawProduct?.isFlashDeals &&
    rawProduct?.flashDealPrice &&
    rawProduct?.flashDealPrice < basePrice;

  const activePrice = isGiftCard
    ? selectedAmount
    : Number(hasFlashDeal ? rawProduct.flashDealPrice : basePrice);
  const oldPrice = hasFlashDeal ? basePrice : null;
  const discountPercent = hasFlashDeal && basePrice > 0
    ? Math.round(((basePrice - Number(rawProduct.flashDealPrice)) / basePrice) * 100)
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

    if (availableStock <= 0) {
      toast.error(t("outOfStockOption"));
      return;
    }

    const currentCartQty = isWholesale
      ? useWholesaleCartStore.getState().items
        .filter((cartItem) => cartItem.productId === String(item.id) && (!selectedColor || cartItem.color.toLowerCase() === selectedColor.toLowerCase()) && (!selectedSize || cartItem.size === selectedSize))
        .reduce((sum, cartItem) => sum + cartItem.quantity, 0)
      : useCartStore.getState().items
        .filter((cartItem) => cartItem.productId === String(item.id) && (!selectedColor || cartItem.color.toLowerCase() === selectedColor.toLowerCase()) && (!selectedSize || cartItem.size === selectedSize))
        .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

    if (currentCartQty + quantity > availableStock) {
      toast.error(t("cannotCheckoutStock", { count: availableStock }));
      return;
    }

    if (externalAddToCart) {
      externalAddToCart();
      return;
    }

    if (isGiftCard) {
      addItem({
        id: `${item.id}-${selectedAmount}-giftcard`,
        productId: String(item.id),
        title: item.name,
        unitPrice: selectedAmount,
        currency: "EGP",
        size: `$${selectedAmount}`,
        color: "Gift Card",
        colorHex: "#000000",
        imageSrc: item.images?.[0]?.url || "",
        quantity,
        productType: "GIFT_CARD",
      });
      toast.success(t("addedToBag", { count: quantity, size: `$${selectedAmount}`, color: "Gift Card" }) || "Added gift card to cart!");
      return;
    }

    const minQty = isWholesale ? (colorObj?.minOrder ?? item.minOrder ?? 1) : (item.minOrder || 1);

    if (isWholesale) {
      const sizesForSelectedColor = colorObj
        ? (colorObj.sizes || []).map((s: any) => s.size).join(", ")
        : (item.sizes || []).map((s: any) => typeof s === "string" ? s : s.size).filter(Boolean).join(", ");

      const cartItemId = `${item.id}-${selectedColor ? selectedColor.toLowerCase() : "all"}-wholesale`;

      useWholesaleCartStore.getState().addItem({
        id: cartItemId,
        productId: String(item.id),
        categoryId: item.category?.id ? String(item.category.id) : (item.categories?.[0]?.id ? String(item.categories[0].id) : undefined),
        category: item.category || item.categories?.[0] || undefined,
        categories: item.categories || (item.category ? [item.category] : undefined),
        title: item.name,
        unitPrice: activePrice,
        currency: "EGP",
        size: sizesForSelectedColor || "All Sizes",
        color: selectedColor || "All Colors",
        colorHex: "",
        imageSrc:
          item.images.find(
            (img) => img.color && selectedColor && img.color.toLowerCase() === selectedColor.toLowerCase()
          )?.url || item.images[0]?.url || "",
        quantity,
        minOrder: minQty,
        productType: "WHOLESALE",
      });

      queryClient.invalidateQueries({ queryKey: ["wholesale"] });
      queryClient.invalidateQueries({ queryKey: ["wholesales"] });

      toast.success(
        t(quantity > 1 ? "addedToBagPlural" : "addedToBag", {
          count: quantity,
          size: sizesForSelectedColor || "All Sizes",
          color: selectedColor || "All Colors",
        })
      );
    } else {
      const matchingImage = item.images.find(
        (image) =>
          image.color &&
          image.color.toLowerCase() === selectedColor.toLowerCase()
      );

      const rentalDeposit = rawProduct?.depositAmount !== undefined && rawProduct?.depositAmount !== null ? Number(rawProduct.depositAmount) : undefined;
      const rentalUnitPrice = rentalDeposit !== undefined ? rentalDeposit : activePrice;

      addItem({
        id: `${item.id}-${selectedSize}-${selectedColor}-${productType}`,
        productId: String(item.id),
        categoryId: item.category?.id ? String(item.category.id) : (item.categories?.[0]?.id ? String(item.categories[0].id) : undefined),
        category: item.category || item.categories?.[0] || undefined,
        categories: item.categories || (item.category ? [item.category] : undefined),
        title: item.name,
        unitPrice: productType === "RENTAL" ? rentalUnitPrice : activePrice,
        currency: "EGP",
        size: selectedSize,
        color: selectedColor,
        colorHex: selectedColor,
        imageSrc: matchingImage?.url || item.images[0]?.url || "",
        quantity,
        minOrder: item.minOrder || 1,
        productType: productType,
        depositAmount: rentalDeposit || 0,
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

    if (externalBuyNow) {
      externalBuyNow();
      return;
    }

    // Calculate total quantity of this product in the wholesale cart after adding this item
    const currentCartQty = isWholesale
      ? useWholesaleCartStore.getState().items
        .filter((cartItem) => cartItem.productId === String(item.id))
        .reduce((sum, cartItem) => sum + cartItem.quantity, 0)
      : useCartStore.getState().items
        .filter((cartItem) => cartItem.productId === String(item.id))
        .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const newTotalQty = currentCartQty + quantity;

    if (isWholesale && newTotalQty < minQty) {
      toast.error(t("wholesaleMinCartQtyError", { totalQty: newTotalQty, minQty }));
      handleAddToCart();
      return;
    }

    handleAddToCart();
    navigate(isWholesale ? "/wholesale-bag" : "/checkout");
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
        {!isGiftCard && (
          <button
            type="button"
            onClick={handleCompare}
            className="ml-auto text-xs text-primary hover:underline font-semibold"
          >
            {isCompared ? `✓ ${t("inComparison")}` : t("addToCompareLink")}
          </button>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-foreground">
          {activePrice.toLocaleString()} {t("egp")}
        </span>
        {isRetail && (
          <span className="text-sm font-medium text-gray-text">
            {t("rentalPricePerDay")}
          </span>
        )}
        {oldPrice && (
          <>
            <span className="text-base text-gray-text line-through">{oldPrice.toLocaleString()} {t("egp")}</span>
            <span className="bg-primary-tint text-primary text-xs font-bold px-2 py-0.5 rounded">
              {discountPercent}% {t("off")}
            </span>
          </>
        )}
      </div>

      {/* Retail Deposits */}
      {isRetail && (rawProduct?.depositAmount !== undefined && rawProduct?.depositAmount !== null) && (
        <div className="flex flex-col gap-1 mb-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-text">{t("depositAmount")}</span>
            <span className="font-bold">{rawProduct.depositAmount} {t("egp")}</span>
          </div>
          {rawProduct?.securityDeposit !== undefined && rawProduct?.securityDeposit !== null && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-text">{t("securityDeposit")}</span>
              <span className="font-bold">{rawProduct.securityDeposit} {t("egp")}</span>
            </div>
          )}
        </div>
      )}

      {/* Brand */}
      {item.brandName && (
        <div className="flex items-center gap-2 py-2 border-t border-b border-stroke">
          <span className="text-xs font-bold text-gray-text uppercase tracking-wider">{t("brandLabel")}</span>
          <span className="text-sm font-bold text-foreground uppercase tracking-wide">{item.brandName}</span>
        </div>
      )}

      {/* GIFT CARD OPTIONS */}
      {isGiftCard && (
        <div className="flex flex-col gap-5 py-2 border-t border-stroke">
          {/* Amount selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
              {t("amount") || "Amount"}
            </label>
            <div className="flex flex-wrap gap-2">
              {parsedAmounts.map((amt) => {
                const isSelected = !isCustomAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setIsCustomAmount(false);
                    }}
                    className={`h-9 min-w-[50px] px-3.5 rounded-lg font-bold text-xs border transition-all ${
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-sm scale-105"
                        : "bg-card text-foreground border-stroke hover:border-foreground/50 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setIsCustomAmount(true);
                  const parsedCustom = Number(customAmountInput) || 10;
                  setSelectedAmount(parsedCustom);
                }}
                className={`h-9 px-3.5 rounded-lg font-bold text-xs border transition-all ${
                  isCustomAmount
                    ? "bg-foreground text-background border-foreground shadow-sm scale-105"
                    : "bg-card text-foreground border-stroke hover:border-foreground/50 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomAmount && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold text-gray-text">$</span>
                <input
                  type="number"
                  min="1"
                  value={customAmountInput}
                  onChange={(e) => {
                    setCustomAmountInput(e.target.value);
                    const val = Number(e.target.value) || 0;
                    if (val > 0) setSelectedAmount(val);
                  }}
                  className="w-32 rounded-lg border border-stroke px-3 py-1.5 text-xs outline-none focus:border-primary bg-card text-foreground"
                  placeholder="Enter amount"
                />
              </div>
            )}
          </div>

          {/* Send as a gift form container matching design */}
          <div className="flex flex-col gap-3 rounded-xl border border-stroke p-4 bg-card/60 shadow-xs">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              {t("sendAsGift") || "Send as a gift"}
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-text">
                {t("toName") || "To"}
              </label>
              <input
                type="text"
                placeholder="Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-xs outline-none focus:border-primary text-foreground bg-card"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-text">
                {t("toEmail") || "Email"}
              </label>
              <input
                type="email"
                placeholder="Email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-xs outline-none focus:border-primary text-foreground bg-card"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-text">
                {t("giftMessage") || "Message"}
              </label>
              <textarea
                rows={3}
                placeholder="(Optional)"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="w-full rounded-lg border border-stroke px-3 py-2 text-xs outline-none focus:border-primary text-foreground bg-card resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Colors */}
      {item.colors.length > 0 && !isGiftCard && (
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
                  className={`w-7 h-7 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                      : "border-stroke opacity-75 hover:opacity-100 hover:border-gray-text"
                  }`}
                >
                  <span
                    className="w-full h-full rounded-full inline-block border border-black/10"
                    style={{ backgroundColor: color.color ? color.color.toLowerCase() : "#ddd" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {colorVariants.length > 0 && !isGiftCard && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-foreground/80 uppercase tracking-wider">
              {isWholesale ? t("availableSizes") : t("sizeLabel", { size: selectedSize })}
            </div>
            {item.sizeguide && (
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="flex items-center gap-1 text-xs text-info hover:text-info/80 transition-colors"
              >
                <Scissors className="h-3 w-3" />
                {t("sizeGuide")}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant: any) => {
              if (isWholesale) {
                return (
                  <span
                    key={variant.size}
                    className="h-9 min-w-[36px] px-3 rounded-md font-semibold text-xs border border-stroke bg-card text-foreground flex items-center justify-center cursor-default select-none"
                  >
                    {variant.size}
                  </span>
                );
              }
              const isSelected = variant.size === selectedSize;
              const isOutOfStock = variant.quantity <= 0;
              return (
                <button
                  key={variant.size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`h-9 min-w-[36px] px-3 rounded-md font-semibold text-xs transition-all border outline-none ${
                    isSelected
                      ? "bg-foreground text-background border-foreground shadow-sm scale-105"
                      : isOutOfStock
                        ? "bg-background text-gray-text/40 border-stroke line-through opacity-50 cursor-not-allowed"
                        : "bg-card text-foreground border-stroke hover:border-foreground/50 hover:bg-gray-50 active:scale-95 cursor-pointer"
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
            disabled={availableStock <= 0 || quantity <= (isWholesale ? (colorObj?.minOrder ?? item.minOrder ?? 1) : (item.minOrder || 1))}
            onClick={() => setQuantity(Math.max(isWholesale ? (colorObj?.minOrder ?? item.minOrder ?? 1) : (item.minOrder || 1), quantity - 1))}
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
            className={`flex-1 h-11 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-200 border-2 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed ${(isNotifySubscribed ?? isSubscribed)
              ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md active:scale-[0.98]"
              : "border-primary text-primary bg-transparent hover:bg-primary/10 active:scale-[0.98]"
              }`}
          >
            {subscribeMutation.isPending || unsubscribeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-current" />
                <span>{t("loading") ?? "Loading..."}</span>
              </>
            ) : (isNotifySubscribed ?? isSubscribed) ? (
              <>
                <Check className="h-4 w-4 stroke-[3] text-white" />
                <span>{t("subscribedForRestock")}</span>
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                <span>{t("notifyMeInStock")}</span>
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

      {/* Size Guide Modal */}
      {item.sizeguide && (
        <Modal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} title={t("sizeGuide")}>
          <div className="w-full flex items-center justify-center">
            <img src={item.sizeguide} alt="Size Guide" className="max-w-full rounded-md object-contain" />
          </div>
        </Modal>
      )}
    </div>
  );
}
