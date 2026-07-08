import { useEffect, useState } from "react";
import { Star } from "../ui/star";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BsBag } from "react-icons/bs";
import { Heart, RotateCcw, Tag, Truck, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "../../store/useCartStore";
import { useToggleWishlist, useWishlistStatus } from "../../hooks/useWishlist";

import { ArrowCircle } from "./ui/ArrowCircle";
import { Modal } from "../ui/modal";
import type { DetailItem } from "../../types/DetailItem";
import { useTranslation } from "react-i18next";

import { Scale } from "lucide-react";
import {
  addCompareProduct,
  removeCompareProduct,
  isProductCompared,
} from "../../utils/compareStorage";
import { useNotifyMeCheck, useNotifyMeSubscribe } from "../../hooks/useNotifyMe";
import { useAuthStore } from "../../store/useAuthStore";
type ProductInfoPanelProps = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  item: DetailItem;
  reviewCount?: number;
  productType?: 'SHOP' | 'WHOLESALE';
};

export function ProductInfoPanel({
  selectedColor,
  setSelectedColor,
  item,
  reviewCount = 0,
  productType = 'SHOP',
}: ProductInfoPanelProps) {
  const navigate = useNavigate();

  const addItem = useCartStore((state) => state.addItem);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { data: wishlistStatus } = useWishlistStatus(productType, item.id)
  const toggleWishlist = useToggleWishlist()
  const isFavorite = Boolean(wishlistStatus?.isWishlisted)

  const { t } = useTranslation("productDetails");

  const [isCompared, setIsCompared] = useState(false);
  useEffect(() => {
    const func = async () => {
      setIsCompared(isProductCompared(item.id));
    };
    func();
  }, [item.id]);
  useEffect(() => {
    const func = async () => {
      if (item.sizes.length > 0) {
        setSelectedSize(item.sizes[0].size);
      }
    };
    func();
  }, [item]);

  const isOutOfStock = (item.stock ?? 0) <= 0;
  const user = useAuthStore((state) => state.user);
  const notifyMeTargetType = productType === 'WHOLESALE' ? 'WHOLESALE_RESTOCK' as const : 'SHOP_RESTOCK' as const
  const { data: notifyStatus } = useNotifyMeCheck(notifyMeTargetType, item.id);
  const subscribeMutation = useNotifyMeSubscribe();
  const isAlreadySubscribed = notifyStatus?.isSubscribed ?? false;

  const handleNotifyMe = () => {
    if (!user) {
      toast.error("Please login to get notified");
      navigate("/login");
      return;
    }
    subscribeMutation.mutate({ targetType: notifyMeTargetType, targetId: item.id });
  };

  const getColorValue = (color: string) => {
    const option = new Option();
    option.style.color = color;

    return option.style.color ? color : "#D1D5DB";
  };

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
          toast.success(data.isWishlisted ? t("favoriteAdded") : t("favoriteRemoved"))
        },
      }
    )
  };

  const handleAddToCart = () => {
    const matchingImage = item.images.find(
      (image) =>
        image.color &&
        image.color.toLowerCase() === selectedColor.toLowerCase(),
    );

    addItem({
      id: `${item.id}-${selectedSize}-${selectedColor}`,
      productId: item.id,
      categoryId: item.category.id,
      title: item.name,
      unitPrice: item.price,
      currency: "EGP",
      size: selectedSize,
      color: selectedColor,
      colorHex: "#000000",
      imageSrc: matchingImage?.url ?? item.images[0]?.url ?? "",
      quantity,
    });

    toast.success(
      t(quantity > 1 ? "addedToBagPlural" : "addedToBag", {
        count: quantity,
        size: selectedSize,
        color: selectedColor,
      }),
    );
  };

  const handleBuyNow = () => {
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
  const description = item.description ?? "";

  return (
    <div className="flex felx-1 w-full flex-col items-start justify-start gap-4 lg:w-[33%]">
      <h1 className="font-['Montserrat'] text-xl font-semibold text-foreground sm:text-2xl">
        {item.name}
      </h1>

      {description && (
        <p className="max-w-[420px] font-['Montserrat'] text-sm font-normal leading-6 text-foreground">
          {isDescriptionExpanded
            ? description
            : description.length > 116
              ? `${description.slice(0, 116)}...`
              : description}

          {description.length > 116 && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded((prev) => !prev)}
              className="ml-1 font-semibold text-foreground"
            >
              {isDescriptionExpanded ? t("showLess") : t("readMore")}
            </button>
          )}
        </p>
      )}

      <div className="font-['Montserrat'] text-xl font-semibold text-foreground sm:text-2xl">
        {item.price} EGP
      </div>

      {item.brandName && (
        <div className="inline-flex items-center justify-start gap-2">
          <Tag className="h-6 w-6 text-foreground" strokeWidth={1.5} />

          <div className="font-['Montserrat'] text-base font-medium text-gray-text">
            {item.brandName}
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-start gap-4 sm:gap-[73px]">
        <div className="flex items-center justify-start gap-2">
          <div className="font-['Montserrat'] text-base font-semibold text-foreground">
            {item.rating}
          </div>

          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = Math.min(1, Math.max(0, item.rating - index));
              return <Star key={index} fill={fill} />;
            })}
          </div>

          <div className="font-['Montserrat'] text-base font-medium text-gray-text">
            {reviewCount} {t("reviews")}
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-start gap-2"
        >
          <RiShareForwardLine className="h-6 w-6 fill-foreground text-foreground" />

          <div className="font-['Montserrat'] text-base font-medium text-foreground">
            {t("share")}
          </div>
        </button>
      </div>
      {/* Color */}

      {item.colors.length > 0 && (
        <div className="flex flex-col items-start justify-start gap-2">
          <div className="font-['Montserrat'] text-lg text-foreground sm:text-xl">
            <span className="font-medium text-gray-text">{t("color")}:</span>{" "}
            <span className="font-normal text-foreground">{selectedColor}</span>
          </div>

          <div className="flex items-center justify-start gap-2">
            {item.colors.map((color) => {
              const isSelected =
                selectedColor.toLowerCase() === color.color.toLowerCase();

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.color)}
                  className="relative h-6 w-6"
                  aria-label={`Select ${color.color} color`}
                >
                  <div
                    className="absolute left-0 top-0 h-6 w-6 rounded-full border"
                    style={{ backgroundColor: getColorValue(color.color) }}
                    title={color.color}
                  />

                  {isSelected && (
                    <div className="absolute left-[1px] top-[1px] h-[22px] w-[22px] rounded-full border-2 border-card" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {item.sizes.length > 0 && (
        <div className="flex w-full flex-wrap items-start justify-start gap-x-10 gap-y-2 sm:gap-x-[167px]">
          <div className="font-['Montserrat'] text-lg text-foreground sm:text-xl">
            <span className="font-medium text-gray-text">{t("size")}:</span>{" "}
            <span className="font-normal text-foreground">{selectedSize}</span>
          </div>

          {item.sizeguide !== undefined && (
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="font-['Montserrat'] text-base font-medium text-gray-text underline"
            >
              {t("sizeGuide")}
            </button>
          )}

          <div className="flex items-center justify-start gap-2.5">
            {item.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size.size)}
                className={`relative flex size-8 items-center justify-center overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-stroke ${
                  size.size === selectedSize ? "bg-primary" : ""
                }`}
              >
                <span
                  className={`font-['Poppins']  font-normal text-foreground 
                  ${size.size.toLocaleLowerCase() === "xxl" || size.size.toLocaleLowerCase() === "xxs" ? "text-sm" : "text-lg sm:text-xl"}
                  
                  `}
                >
                  {size.size}
                </span>
              </button>
            ))}
           
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="font-['Montserrat'] text-lg font-medium text-gray-text sm:text-xl">
          {t("quantity")}:
        </div>

        <div className="inline-flex items-center justify-start gap-4 rounded-3xl bg-gray-light p-2">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(item.minOrder ?? 1, current - 1),
              )
            }
            aria-label={t("decreaseQuantity")}
          >
            <ArrowCircle direction="prev" />
          </button>

          <div className="font-['Montserrat'] text-lg font-medium text-foreground sm:text-xl">
            {quantity}
          </div>

          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(10, current + 1))}
            aria-label={t("increaseQuantity")}
          >
            <ArrowCircle />
          </button>
        </div>
      </div>
      {/* CTAs */}
      {isOutOfStock ? (
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-card border border-stroke px-4 py-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-urgent animate-pulse" />
            <span className="font-['Montserrat'] text-sm font-semibold text-urgent">
              Out of Stock
            </span>
          </div>
          <button
            type="button"
            onClick={handleNotifyMe}
            disabled={isAlreadySubscribed || subscribeMutation.isPending}
            className={`flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-3.5 font-['Montserrat'] text-base font-bold transition-all ${
              isAlreadySubscribed
                ? "bg-primary/20 text-foreground border border-primary cursor-default"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl"
            }`}
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Bell className="h-5 w-5" fill={isAlreadySubscribed ? "currentColor" : "none"} />
            )}
            <span>
              {isAlreadySubscribed ? "You'll Be Notified" : "Notify Me When Available"}
            </span>
          </button>
        </div>
      ) : (
        <>
      <button
        type="button"
        onClick={handleCompare}
        className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 outline outline-1 outline-offset-[-1px] transition-all sm:rounded-2xl sm:px-4 sm:py-3.5 sm:justify-start ${
          isCompared
            ? "bg-primary text-primary-foreground outline-primary"
            : "bg-card text-foreground outline-stroke hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        <Scale className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        <span className="font-['Montserrat'] text-xs font-semibold sm:text-base">
          {isCompared ? t("removeFromCompare") : t("addToCompare")}
        </span>
      </button>
      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:gap-4">
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={toggleWishlist.isPending}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-card px-3 py-2.5 outline outline-1 outline-offset-[-1px] outline-stroke sm:rounded-2xl sm:px-4 sm:py-3.5 sm:justify-start disabled:opacity-70"
        >
          <Heart
            className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${isFavorite ? "text-red-500" : "text-foreground"}`}
            strokeWidth={2}
            fill={isFavorite ? "currentColor" : "none"}
          />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground sm:text-base">
            {isFavorite ? t("removeFromFavorite") : t("addToFavorite")}
          </span>
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-card px-3 py-2.5 outline outline-1 outline-offset-[-1px] outline-stroke sm:rounded-2xl sm:px-4 sm:py-3.5 sm:justify-start"
        >
          <BsBag
            className="h-5 w-5 text-foreground sm:h-6 sm:w-6"
            fill="currentColor"
          />
          <span className="font-['Montserrat'] text-xs font-semibold text-foreground sm:text-base">
            {t("addToCart")}
          </span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="col-span-2 flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-3 py-3 sm:col-span-1 sm:rounded-2xl sm:px-5 sm:py-3.5"
        >
          <span className="font-['Montserrat'] text-sm font-bold text-primary-foreground sm:text-base">
            {t("buyNow")}
          </span>
        </button>
      </div>
        </>
      )}
      {/* Delivery info */}
      <div className="flex w-full max-w-[320px] flex-col items-start justify-start gap-4">
        <div className="inline-flex items-center justify-start gap-1.5">
          <Truck
            className="h-8 w-8 shrink-0 text-foreground"
            fill="currentColor"
          />

          <div className="font-['Montserrat'] text-sm font-medium leading-6">
            <span className="text-urgent">
              {t("deliveryTitle")}
              <br />
            </span>

            <span className="text-foreground">{t("deliverySubtitle")}</span>
          </div>
        </div>

        <div className="inline-flex items-center justify-start gap-1.5">
          <RotateCcw className="h-8 w-8 shrink-0 text-foreground" />

          <div className="font-['Poppins'] text-sm font-medium leading-6 text-foreground">
            {t("freeReturns")}
          </div>
        </div>
      </div>
      {item.sizeguide !== undefined && (
        <Modal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          title="Size Guide"
        >
          {item.sizeguide ? (
            <img
              src={item.sizeguide}
              alt="Size Guide"
              className="w-full rounded-lg"
            />
          ) : (
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {t("sizeGuideUnavailable")}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
