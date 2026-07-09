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
    <div className="flex flex-col gap-5 w-full font-['Montserrat'] select-none">

      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-snug">
          {item.name}
        </h1>
        {item.description && (
          <p className="text-xs text-[#888] leading-relaxed mt-1 line-clamp-2">
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
        <span className="text-sm font-semibold text-[#1a1a1a]">{item.rating}</span>
        <span className="text-sm text-[#888]">({reviewCount} {t("reviews")})</span>
        <button
          type="button"
          onClick={handleCompare}
          className="ml-auto text-xs text-[#E8192C] hover:underline font-semibold"
        >
          {isCompared ? "✓ In Comparison" : "+ Add to Product Comparison"}
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-2xl font-extrabold text-[#1a1a1a]">
          {activePrice.toLocaleString()} EGP
        </span>
        {oldPrice && (
          <>
            <span className="text-base text-[#aaa] line-through">{oldPrice.toLocaleString()} EGP</span>
            <span className="bg-[#fff0f0] text-[#E8192C] text-xs font-bold px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {/* Brand */}
      {item.brandName && (
        <div className="flex items-center gap-2 py-2 border-t border-b border-[#f0f0f0]">
          <span className="text-xs font-bold text-[#888] uppercase tracking-wider">Brand:</span>
          <span className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wide">{item.brandName}</span>
        </div>
      )}

      {/* Colors */}
      {item.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-[#555] uppercase tracking-wider">
            COLOR: <span className="text-[#1a1a1a] normal-case font-bold">{selectedColor}</span>
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
                    isSelected ? "border-[#E8192C]" : "border-[#ddd] hover:border-[#999]"
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
              className="ml-auto text-xs text-[#888] hover:text-[#E8192C] flex items-center gap-1"
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
          <div className="text-xs font-bold text-[#555] uppercase tracking-wider">
            SIZE: <span className="text-[#1a1a1a] normal-case font-bold">{selectedSize}</span>
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
                  className={`h-9 min-w-[36px] px-3 rounded-md font-semibold text-xs transition-all border outline-none ${
                    isSelected
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : isOutOfStock
                      ? "bg-[#f5f5f5] text-[#ccc] border-[#eee] line-through cursor-not-allowed"
                      : "bg-white text-[#1a1a1a] border-[#ddd] hover:border-[#999]"
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
        <span className="text-xs font-bold text-[#555] uppercase tracking-wider">QUANTITY:</span>
        <div className="inline-flex items-center border border-[#ddd] rounded-md bg-white">
          <button
            type="button"
            disabled={availableStock <= 0}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center font-bold text-[#555] hover:bg-[#f5f5f5] disabled:opacity-40 rounded-l-md"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-[#1a1a1a] text-sm border-x border-[#ddd]">
            {availableStock <= 0 ? 0 : quantity}
          </span>
          <button
            type="button"
            disabled={availableStock <= 0 || quantity >= availableStock}
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center font-bold text-[#555] hover:bg-[#f5f5f5] disabled:opacity-40 rounded-r-md"
          >
            +
          </button>
        </div>
        {/* Stock badge */}
        <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${stockBadgeClass}`}>
          {stockLabel}
        </span>
      </div>

      {/* Favorite */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        className={`flex items-center gap-2 text-sm font-semibold w-fit transition ${
          isFavorite ? "text-[#E8192C]" : "text-[#888] hover:text-[#E8192C]"
        }`}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-[#E8192C] text-[#E8192C]" : ""}`} />
        {isFavorite ? "Wishlisted" : t("addToFavorite")}
      </button>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={availableStock <= 0}
          onClick={handleAddToCart}
          className="flex-1 h-11 bg-[#E8192C] text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c8001f] disabled:opacity-50 transition"
        >
          <BsBag className="h-4 w-4" />
          {t("addToCart")}
        </button>
        <button
          type="button"
          disabled={availableStock <= 0}
          onClick={handleBuyNow}
          className="flex-1 h-11 bg-[#1a1a1a] text-white rounded-md font-bold text-sm flex items-center justify-center hover:bg-black disabled:opacity-50 transition"
        >
          {t("buyNow")}
        </button>
      </div>

      {/* Shipping Info */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#f0f0f0]">
        <div className="flex items-start gap-3 text-xs text-[#555]">
          <Truck className="h-4 w-4 text-[#1a1a1a] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#1a1a1a]">{t("deliveryTitle")}</span>
            {" "}— {t("deliverySubtitle")}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#555]">
          <RotateCcw className="h-4 w-4 text-[#1a1a1a] shrink-0" />
          <span className="font-bold text-[#1a1a1a]">{t("freeReturns")}</span>
        </div>
      </div>
    </div>
  );
}
