import { useEffect } from "react";
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

  const { data: wishlistStatus } = useWishlistStatus(productType, item.id);
  const toggleWishlist = useToggleWishlist();
  const isFavorite = Boolean(wishlistStatus?.isWishlisted);

  const { t } = useTranslation("productDetails");

  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    setIsCompared(isProductCompared(item.id));
  }, [item.id]);

  // Retrieve sizes & stock quantity for the currently selected color
  const colorObj = rawProduct?.colors?.find(
    (c: any) =>
      c.colorName &&
      selectedColor &&
      c.colorName.toLowerCase() === selectedColor.toLowerCase()
  );
  const colorVariants = colorObj?.variants || [];
  
  // Find currently selected size variant info
  const selectedVariant = colorVariants.find((v: any) => v.size === selectedSize);
  const availableStock = selectedVariant ? selectedVariant.quantity : 0;

  // Guard quantity: cannot exceed availableStock
  useEffect(() => {
    if (availableStock > 0 && quantity > availableStock) {
      setQuantity(availableStock);
    } else if (availableStock === 0) {
      setQuantity(1);
    }
  }, [selectedSize, selectedColor, availableStock, quantity, setQuantity]);

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
    <div className="flex flex-col gap-6 w-full font-['Montserrat'] select-none">
      {/* Brand & Title */}
      <div className="flex flex-col gap-1">
        {item.brandName && (
          <span className="text-xs uppercase tracking-wider font-bold text-gray-text flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            {item.brandName}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {item.name}
        </h1>
      </div>

      {/* Ratings & Review summary */}
      <div className="flex items-center gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-1 bg-gray-50 border border-stroke rounded-lg px-2 py-1">
          <span className="font-bold text-foreground">{item.rating}</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = Math.min(1, Math.max(0, item.rating - index));
              return <Star key={index} fill={fill} size={14} />;
            })}
          </div>
        </div>
        <span className="text-gray-text hover:underline cursor-pointer">
          {reviewCount} {t("reviews")}
        </span>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-primary ml-auto text-gray-text"
        >
          <RiShareForwardLine className="h-5 w-5" />
          <span>{t("share")}</span>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm font-normal leading-relaxed text-gray-text">
        {item.description}
      </p>

      <hr className="border-stroke" />

      {/* Prices & Discount badge */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-extrabold text-foreground">
          {activePrice} EGP
        </span>
        {oldPrice && (
          <>
            <span className="text-lg text-gray-text line-through">
              {oldPrice} EGP
            </span>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Colors Selector */}
      {item.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-text uppercase tracking-wider">
            {t("color")}: <span className="text-foreground normal-case font-bold">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-3">
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
                  className={`w-8 h-8 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${
                    isSelected ? "border-primary scale-110 shadow-sm" : "border-transparent"
                  }`}
                  title={color.color}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: color.color ? color.color.toLowerCase() : "#ddd" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Selector */}
      {colorVariants.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-gray-text uppercase tracking-wider">
            {t("size")}: <span className="text-foreground normal-case font-bold">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant: any) => {
              const isSelected = variant.size === selectedSize;
              const isOutOfStock = variant.quantity <= 0;
              return (
                <button
                  key={variant.size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`h-10 min-w-10 rounded-xl px-3 font-semibold text-sm transition-all border outline-none ${
                    isSelected
                      ? "bg-primary text-foreground border-primary scale-[1.02] shadow-sm"
                      : isOutOfStock
                      ? "bg-gray-100 text-gray-300 border-gray-200 line-through cursor-not-allowed opacity-50"
                      : "bg-white text-foreground border-stroke hover:border-gray-text"
                  }`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Badge */}
      <div className="flex items-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stockBadgeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {stockLabel} ({availableStock} units)
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-text uppercase tracking-wider">
          {t("quantity")}:
        </span>
        <div className="inline-flex items-center border border-stroke rounded-xl bg-gray-50 p-1">
          <button
            type="button"
            disabled={availableStock <= 0}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:bg-white border border-transparent hover:border-stroke disabled:opacity-40"
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-foreground">
            {availableStock <= 0 ? 0 : quantity}
          </span>
          <button
            type="button"
            disabled={availableStock <= 0 || quantity >= availableStock}
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold hover:bg-white border border-transparent hover:border-stroke disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <hr className="border-stroke" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            disabled={availableStock <= 0}
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-card text-foreground border border-stroke hover:bg-gray-50 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-gray-text disabled:opacity-50 transition"
          >
            <BsBag className="h-5 w-5" />
            {t("addToCart")}
          </button>
          <button
            type="button"
            disabled={availableStock <= 0}
            onClick={handleBuyNow}
            className="flex-1 h-12 bg-primary text-foreground rounded-xl font-bold flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
          >
            {t("buyNow")}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="flex-1 h-10 bg-card hover:bg-gray-50 text-gray-text hover:text-foreground border border-stroke rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
            {isFavorite ? "Wishlisted" : t("addToFavorite")}
          </button>
          <button
            type="button"
            onClick={handleCompare}
            className={`flex-1 h-10 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isCompared
                ? "bg-primary text-foreground border-primary"
                : "bg-card hover:bg-gray-50 text-gray-text hover:text-foreground border-stroke"
            }`}
          >
            <Scale className="h-4 w-4" />
            {isCompared ? "Compared" : t("addToCompare")}
          </button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="flex flex-col gap-3 bg-gray-50 border border-stroke rounded-xl p-4 mt-2">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-text">
          <Truck className="h-5 w-5 text-foreground shrink-0" />
          <div>
            <span className="font-bold text-foreground">{t("deliveryTitle")}</span> — {t("deliverySubtitle")}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-text">
          <RotateCcw className="h-5 w-5 text-foreground shrink-0" />
          <div className="font-bold text-foreground">{t("freeReturns")}</div>
        </div>
      </div>
    </div>
  );
}
