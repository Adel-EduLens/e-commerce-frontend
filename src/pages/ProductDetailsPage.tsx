import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brush,
  Heart,
  RotateCcw,
  ScanFace,
  Share2,
  Shirt,
  ShoppingBag,
  Tag,
  ThumbsUp,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { Footer, Navbar, ProductCard } from "../components/shared";

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

const GALLERY_IMAGES = [
  "image 11.png",
  "image 9.png",
  "image 7.png",
  "image 6.png",
  "image 8.png",
] as const;

const COLOR_OPTIONS = [
  { name: "Black", swatchClassName: "bg-[#1A1A1A]" },
  { name: "Rose", swatchClassName: "bg-[#F6D1C9]" },
  { name: "Taupe", swatchClassName: "bg-[#A29F8E]" },
  { name: "Sand", swatchClassName: "bg-[#D1BBA4]" },
] as const;

const SIZE_OPTIONS = ["S", "M", "L"] as const;

const REVIEW_FILTERS = [
  { label: "Filter by rating all", value: "all" },
  { label: "Filter by rating 5", value: "5" },
  { label: "Filter by rating 4+", value: "4plus" },
] as const;

const REVIEW_SORTS = [
  { label: "Sort by highest", value: "highest" },
  { label: "Sort by newest", value: "newest" },
  { label: "Sort by helpful", value: "helpful" },
] as const;

const PRODUCT_DESCRIPTION =
  "Crafted from a premium cotton blend, this round neck t-shirt dress is soft, breathable, and easy to style for everyday wear. The relaxed fit, polished finish, and clean silhouette make it a dependable staple for casual and elevated looks alike.";

const PRODUCT_REVIEWS = [
  {
    id: 1,
    author: "Mariam K.",
    initial: "M",
    displayDate: "Mar 20, 2025",
    sortDate: "2025-03-20",
    rating: 5,
    title: "Amazing",
    body: "I love this fur coat! literally amazing trust me if you are looking for a fur coat this is the one!!! It’s so cute and the quality is amazing. It’s not oversized but it’s true to size so if you’re petite and looking for an xs this is perfect.",
    helpful: 4,
    images: ["image 11.png", "image 9.png"],
  },
  {
    id: 2,
    author: "Nour A.",
    initial: "N",
    displayDate: "Apr 05, 2025",
    sortDate: "2025-04-05",
    rating: 4,
    title: "So flattering",
    body: "The fit is very clean and flattering, and the fabric feels much better than I expected. I styled it with sneakers and a denim jacket and it looked effortless.",
    helpful: 7,
    images: ["image 7.png", "image 8.png"],
  },
  {
    id: 3,
    author: "Salma H.",
    initial: "S",
    displayDate: "Feb 14, 2025",
    sortDate: "2025-02-14",
    rating: 5,
    title: "Worth it",
    body: "Beautiful material, easy sizing, and the color looks even better in person. I ended up ordering another piece from the same collection after trying this one.",
    helpful: 3,
    images: ["image 6.png", "image 11.png"],
  },
] as const;

type SizeOption = (typeof SIZE_OPTIONS)[number];
type ReviewFilterValue = (typeof REVIEW_FILTERS)[number]["value"];
type ReviewSortValue = (typeof REVIEW_SORTS)[number]["value"];
type ProductReview = (typeof PRODUCT_REVIEWS)[number];

function getVisibleReviews(
  filterValue: ReviewFilterValue,
  sortValue: ReviewSortValue
): ProductReview[] {
  return [...PRODUCT_REVIEWS]
    .filter((review) => {
      if (filterValue === "5") {
        return review.rating === 5;
      }

      if (filterValue === "4plus") {
        return review.rating >= 4;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortValue === "newest") {
        return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
      }

      if (sortValue === "helpful") {
        return b.helpful - a.helpful;
      }

      return b.rating - a.rating;
    });
}

type AssetImageProps = {
  file: string;
  className: string;
  alt?: string;
};

function AssetImage({ file, className, alt = "" }: AssetImageProps) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}

function StarRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-start gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <AssetImage
          key={index}
          file="material-symbols_star.svg"
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}

function ArrowCircle({
  direction = "right",
  dark = false,
  size = 48,
}: {
  direction?: "right" | "left" | "down";
  dark?: boolean;
  size?: 40 | 48;
}) {
  const icon =
    direction === "down"
      ? "weui_arrow-filled-1.svg"
      : direction === "left" && dark
        ? "weui_arrow-filled-2.svg"
        : "weui_arrow-filled-3.svg";
  const iconClass =
    size === 40
      ? `absolute left-[14px] top-[8px] h-6 w-3 ${
          direction === "left" ? "rotate-180" : ""
        }`
      : direction === "left" && dark
        ? "absolute left-[16px] top-[8px] h-8 w-4"
        : direction === "down"
          ? "absolute left-[12px] top-[18px] h-3 w-6"
          : `absolute left-[18px] top-[12px] h-6 w-3 ${
              direction === "left" ? "rotate-180" : ""
            }`;

  return (
    <div
      className={`relative ${size === 40 ? "h-10 w-10" : "h-12 w-12"} overflow-hidden rounded-full ${
        dark ? "bg-[#0F1115]" : "bg-white"
      }`}
    >
      <AssetImage file={icon} className={iconClass} />
    </div>
  );
}

function DownFilter({
  label,
  onClick,
  isOpen = false,
}: {
  label: string;
  onClick?: () => void;
  isOpen?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center justify-start gap-2 rounded-2xl bg-[#EDEDED] p-4"
    >
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-1.svg"
          className={`absolute left-[4px] top-[10px] h-3 w-6 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
  );
}

function Gallery({
  images,
  selectedImageIndex,
  onSelectImage,
  onPrevious,
  onNext,
}: {
  images: readonly string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <AssetImage
        file={images[selectedImageIndex]}
        className="absolute left-[24px] top-[150px] h-[1013px] w-[750px] object-cover"
        alt="Selected product view"
      />
      <div className="absolute left-[792px] top-[150px] inline-flex w-[150px] flex-col items-center justify-start gap-6">
        <div className="self-stretch flex flex-col items-start justify-start gap-6">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onSelectImage(index)}
              className={`relative h-[150px] self-stretch cursor-pointer overflow-hidden rounded-3xl outline outline-1 outline-offset-[-1px] ${
                selectedImageIndex === index
                  ? "outline-[#1A1A1A]"
                  : "outline-[#E0E0E0]"
              }`}
              aria-label={`Open product image ${index + 1}`}
            >
              <AssetImage
                file={image}
                className="absolute left-0 top-0 h-[250px] w-[150px] object-cover"
                alt={`Product thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
        <div className="inline-flex origin-top-left rotate-[-90deg] items-center justify-start gap-6">
          <button type="button" onClick={onPrevious} aria-label="Previous image">
            <ArrowCircle direction="left" dark />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
            aria-label="Next image"
          >
            <ArrowCircle />
          </button>
        </div>
      </div>
      <div className="absolute left-[232px] top-[1034px] h-[50.47px] w-[311px] rounded-full border-[1.5px] border-[#87C3FF]" />
      <div className="absolute left-[289px] top-[1047.31px] h-5 w-[136px] rounded-full opacity-70" />
      <div className="absolute left-[269.24px] top-[1073.58px] h-[3.96px] w-[4.03px] rounded-full bg-[#1A1A1A]" />
      <div className="absolute left-[491.67px] top-[1075.56px] h-[3.96px] w-[4.03px] rounded-full bg-[#1A1A1A]" />
      <AssetImage
        file="Group 133.svg"
        className="absolute left-[354.89px] top-[1057.65px] h-16 w-[65px]"
      />
    </>
  );
}

function TryOnButton({
  label,
  left,
  top,
  icon: Icon,
  onClick,
}: {
  label: string;
  left: string;
  top: string;
  icon: typeof ScanFace;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute ${left} ${top} inline-flex items-center justify-start gap-2 rounded-2xl bg-white p-4`}
    >
      <Icon className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
      <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
        {label}
      </div>
    </button>
  );
}

function FloatingActions({
  onActionClick,
}: {
  onActionClick: (label: string) => void;
}) {
  return (
    <>
      <TryOnButton
        label="AR Try-On"
        left="left-[611px]"
        top="top-[174px]"
        icon={ScanFace}
        onClick={() => onActionClick("AR Try-On")}
      />
      <TryOnButton
        label="Customize"
        left="left-[607px]"
        top="top-[243px]"
        icon={Brush}
        onClick={() => onActionClick("Customize")}
      />
      <TryOnButton
        label="Avatar Try-On"
        left="left-[427px]"
        top="top-[174px]"
        icon={Shirt}
        onClick={() => onActionClick("Avatar Try-On")}
      />
    </>
  );
}

function ProductInfoPanel({
  selectedColor,
  selectedSize,
  quantity,
  isFavorite,
  isDescriptionExpanded,
  onSelectColor,
  onSelectSize,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onToggleFavorite,
  onToggleDescription,
  onShare,
  onAddToCart,
  onBuyNow,
}: {
  selectedColor: string;
  selectedSize: SizeOption;
  quantity: number;
  isFavorite: boolean;
  isDescriptionExpanded: boolean;
  onSelectColor: (colorName: string) => void;
  onSelectSize: (size: SizeOption) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onToggleFavorite: () => void;
  onToggleDescription: () => void;
  onShare: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}) {
  return (
    <div className="absolute left-[968px] top-[150px] inline-flex w-[438px] flex-col items-start justify-start gap-4">
      <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        Plain Maxi Tabard Dress
      </div>
      <div className="flex w-[309px] flex-col items-start justify-start gap-2">
        <div className="self-stretch font-['Montserrat'] text-sm font-normal leading-6 text-[#1A1A1A]">
          {isDescriptionExpanded
            ? PRODUCT_DESCRIPTION
            : `${PRODUCT_DESCRIPTION.slice(0, 116)}...`}{" "}
          <button
            type="button"
            onClick={onToggleDescription}
            className="font-semibold text-[#1A1A1A]"
          >
            {isDescriptionExpanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        1000 EGP
      </div>
      <div className="inline-flex items-center justify-start gap-2">
        <Tag className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
        <div className="flex w-[50px] flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
          Nike
        </div>
      </div>
      <div className="self-stretch inline-flex items-center justify-start gap-[73px]">
        <div className="flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            4.8
          </div>
          <StarRow />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
            (124 Reviews)
          </div>
        </div>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center justify-start gap-2"
        >
          <Share2 className="h-6 w-6 fill-[#1A1A1A] text-[#1A1A1A]" />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
            Share
          </div>
        </button>
      </div>
      <div className="flex w-[121px] flex-col items-start justify-start gap-2">
        <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl text-[#1A1A1A]">
          <span className="font-medium text-[#6B7280]">Color:</span>{" "}
          <span className="font-normal text-[#1A1A1A]">{selectedColor}</span>
        </div>
        <div className="inline-flex items-center justify-start gap-[7px] self-stretch">
          {COLOR_OPTIONS.map((color) => {
            const isSelected = selectedColor === color.name;

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color.name)}
                className="relative h-[25px] w-[25px]"
                aria-label={`Select ${color.name} color`}
              >
                <div
                  className={`absolute left-0 top-0 h-[25px] w-[25px] rounded-full ${color.swatchClassName}`}
                />
                {isSelected ? (
                  <div className="absolute left-[1px] top-[1px] h-[23px] w-[23px] rounded-full border-2 border-white" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="inline-flex w-[323px] flex-wrap content-start items-start justify-start gap-x-[167px] gap-y-2">
        <div className="flex flex-col justify-end font-['Montserrat'] text-xl text-[#1A1A1A]">
          <span className="font-medium text-[#6B7280]">Size:</span>{" "}
          <span className="font-normal text-[#1A1A1A]">{selectedSize}</span>
        </div>
        <button
          type="button"
          onClick={() => toast.message("Size guide is coming soon")}
          className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280] underline"
        >
          Size Guide
        </button>
        <div className="flex items-center justify-start gap-2.5">
          {SIZE_OPTIONS.map((size) => (
            <button
              type="button"
              onClick={() => onSelectSize(size)}
              key={size}
              className={`relative h-8 w-8 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] ${
                size === selectedSize ? "bg-[#BBFF63]" : ""
              }`}
            >
              <div
                className={`absolute top-[1px] flex flex-col justify-end font-['Poppins'] text-xl font-normal text-[#1A1A1A] ${
                  size === "S"
                    ? "left-[10px]"
                    : size === "M"
                      ? "left-[7px]"
                      : "left-[11px]"
                }`}
              >
                {size}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-[136px] flex-col items-start justify-start gap-2">
        <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          Quantity:
        </div>
        <div className="inline-flex items-center justify-start gap-4 self-stretch rounded-3xl bg-[#EDEDED] p-2">
          <button
            type="button"
            onClick={onDecreaseQuantity}
            aria-label="Decrease quantity"
          >
            <ArrowCircle direction="left" size={40} />
          </button>
          <div className="flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
            {quantity}
          </div>
          <button
            type="button"
            onClick={onIncreaseQuantity}
            aria-label="Increase quantity"
          >
            <ArrowCircle size={40} />
          </button>
        </div>
      </div>
      <div className="inline-flex items-center justify-start gap-4 self-stretch">
        <button
          type="button"
          onClick={onToggleFavorite}
          className="flex items-center justify-start gap-2 rounded-2xl bg-white px-2 py-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
        >
          <Heart
            className="h-6 w-6 text-[#1A1A1A]"
            strokeWidth={2}
            fill={isFavorite ? "#1A1A1A" : "none"}
          />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Add to favorite
          </div>
        </button>
        <button
          type="button"
          onClick={onAddToCart}
          className="flex items-center justify-start gap-2 rounded-2xl bg-white px-2 py-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
        >
          <ShoppingBag className="h-6 w-6 text-[#1A1A1A]" fill="#1A1A1A" />
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Add to Cart
          </div>
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          className="flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] px-2 py-4"
        >
          <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            Buy Now
          </div>
        </button>
      </div>
      <div className="flex w-[295px] flex-col items-start justify-start gap-4">
        <div className="inline-flex items-center justify-start gap-1.5 self-stretch">
          <Truck className="h-[34px] w-[34px] text-[#1A1A1A]" fill="#1A1A1A" />
          <div className="w-[252px] font-['Montserrat'] text-sm font-medium leading-6">
            <span className="text-[#D6001C]">
              Get it Tomorrow, 29th Sep,
              <br />
            </span>
            <span className="text-[#1A1A1A]">
              Order within 3 Hours &amp; 26minutes
            </span>
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-1.5">
          <RotateCcw className="h-[34px] w-[34px] text-[#1A1A1A]" />
          <div className="font-['Poppins'] text-sm font-medium leading-6 text-[#1A1A1A]">
            Free online returns within 14 days
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewAllButton() {
  return (
    <div className="inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4">
      <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
        View All
      </div>
      <ArrowCircle size={40} />
    </div>
  );
}

function ProductShelf({
  title,
  top,
}: {
  title: "Recommended for You" | "Complete the look";
  top: string;
}) {
  return (
    <div
      className={`absolute left-[24px] ${top} inline-flex w-[1392px] flex-col items-center justify-start gap-10`}
    >
      <div className="self-stretch font-['Montserrat'] text-5xl font-bold text-[#1A1A1A]">
        {title}
      </div>
      <div className="flex w-[1392px] flex-col items-center justify-start gap-8">
        <div className="self-stretch flex flex-col items-start justify-start gap-6">
          <div className="self-stretch inline-flex items-center justify-start gap-6">
            <ProductCard />
            <ProductCard featured />
            <ProductCard featured />
            <ProductCard />
          </div>
        </div>
        <ViewAllButton />
      </div>
    </div>
  );
}

function ReviewsSection({
  visibleReviews,
  displayedReviewIndex,
  filterOptions,
  sortOptions,
  filterLabel,
  sortLabel,
  selectedFilterIndex,
  selectedSortIndex,
  isHelpful,
  onSelectFilter,
  onSelectSort,
  onToggleHelpful,
  onViewNextReview,
}: {
  visibleReviews: ProductReview[];
  displayedReviewIndex: number;
  filterOptions: readonly { label: string; value: ReviewFilterValue }[];
  sortOptions: readonly { label: string; value: ReviewSortValue }[];
  filterLabel: string;
  sortLabel: string;
  selectedFilterIndex: number;
  selectedSortIndex: number;
  isHelpful: boolean;
  onSelectFilter: (index: number) => void;
  onSelectSort: (index: number) => void;
  onToggleHelpful: () => void;
  onViewNextReview: () => void;
}) {
  const review = visibleReviews[displayedReviewIndex] ?? visibleReviews[0];
  const helpfulCount = review.helpful + (isHelpful ? 1 : 0);
  const [openDropdown, setOpenDropdown] = useState<"filter" | "sort" | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <div className="absolute left-[24px] top-[1203px] inline-flex items-center justify-start gap-6">
        <div className="font-['Montserrat'] text-5xl font-bold text-[#1A1A1A]">
          Reviews
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            4.8
          </div>
          <StarRow />
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-medium text-[#6B7280]">
            (124 Reviews)
          </div>
        </div>
      </div>
      <div className="absolute left-[24px] top-[1286px] inline-flex items-center justify-start gap-[180px]">
        <div className="flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          Showing {displayedReviewIndex + 1} of {visibleReviews.length} reviews
        </div>
        <div
          ref={dropdownRef}
          className="relative flex items-center justify-start gap-4"
        >
          <div className="relative">
            <DownFilter
              label={filterLabel}
              isOpen={openDropdown === "filter"}
              onClick={() =>
                setOpenDropdown((currentValue) =>
                  currentValue === "filter" ? null : "filter"
                )
              }
            />
            {openDropdown === "filter" ? (
              <div className="absolute left-0 top-full z-20 mt-2 min-w-[280px] rounded-2xl bg-white p-2 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
                {filterOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSelectFilter(index);
                      setOpenDropdown(null);
                    }}
                    className={`block w-full rounded-xl px-4 py-3 text-left font-['Montserrat'] text-base font-medium ${
                      selectedFilterIndex === index
                        ? "bg-[#BBFF63] text-[#1A1A1A]"
                        : "text-[#6B7280] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative">
            <DownFilter
              label={sortLabel}
              isOpen={openDropdown === "sort"}
              onClick={() =>
                setOpenDropdown((currentValue) =>
                  currentValue === "sort" ? null : "sort"
                )
              }
            />
            {openDropdown === "sort" ? (
              <div className="absolute left-0 top-full z-20 mt-2 min-w-[260px] rounded-2xl bg-white p-2 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
                {sortOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSelectSort(index);
                      setOpenDropdown(null);
                    }}
                    className={`block w-full rounded-xl px-4 py-3 text-left font-['Montserrat'] text-base font-medium ${
                      selectedSortIndex === index
                        ? "bg-[#BBFF63] text-[#1A1A1A]"
                        : "text-[#6B7280] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="absolute left-[24px] top-[1366px] h-[365px] w-[918px]">
        <div className="absolute left-0 top-0 inline-flex items-center justify-start gap-6">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#EDEDED]">
            <div className="absolute left-[25px] top-[21px] flex flex-col justify-end font-['Montserrat'] text-[32px] font-medium text-[#1A1A1A]">
              {review.initial}
            </div>
          </div>
          <div className="inline-flex w-[127px] flex-col items-start justify-start gap-1.5">
            <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
              {review.author}
            </div>
            <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
              {review.displayDate}
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-[96px] inline-flex items-center justify-start gap-2">
          <div className="flex flex-col justify-end font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            {review.rating.toFixed(1)}
          </div>
          <StarRow />
        </div>
        <div className="absolute left-0 top-[144px] inline-flex items-center justify-start gap-4">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="relative h-20 w-20 overflow-hidden rounded-3xl"
            >
              <AssetImage
                file={image}
                className="absolute left-0 top-0 h-[134px] w-20 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-[248px] inline-flex w-[918px] flex-col items-start justify-start gap-4">
          <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
            {review.title}
          </div>
          <div className="self-stretch flex flex-col justify-end font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            {review.body}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleHelpful}
          className="absolute left-[748px] top-[12px] inline-flex items-center justify-start gap-2 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
        >
          <ThumbsUp className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <div className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
            Helpful ({helpfulCount})
          </div>
        </button>
      </div>
      <button
        type="button"
        onClick={onViewNextReview}
        className="absolute left-[402px] top-[1771px] inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4"
      >
        <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          View All
        </div>
      </button>
    </>
  );
}



export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0].name);
  const [selectedSize, setSelectedSize] = useState<SizeOption>("M");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [selectedSortIndex, setSelectedSortIndex] = useState(0);
  const [displayedReviewIndex, setDisplayedReviewIndex] = useState(0);
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const filterValue: ReviewFilterValue = REVIEW_FILTERS[selectedFilterIndex].value;
  const sortValue: ReviewSortValue = REVIEW_SORTS[selectedSortIndex].value;
  const visibleReviews = getVisibleReviews(filterValue, sortValue);

  const activeReview =
    visibleReviews[displayedReviewIndex] ?? visibleReviews[0] ?? PRODUCT_REVIEWS[0];
  const isHelpful = helpfulReviewIds.includes(activeReview.id);

  const handleGalleryStep = (direction: "previous" | "next") => {
    setSelectedImageIndex((currentIndex) => {
      if (direction === "previous") {
        return currentIndex === 0
          ? GALLERY_IMAGES.length - 1
          : currentIndex - 1;
      }

      return currentIndex === GALLERY_IMAGES.length - 1
        ? 0
        : currentIndex + 1;
    });
  };

  const handleActionClick = (label: string) => {
    toast.message(`${label} is coming soon`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    } catch {
      toast.error("Unable to copy the product link");
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite((currentValue) => {
      const nextValue = !currentValue;
      toast.success(
        nextValue ? "Added to favorites" : "Removed from favorites"
      );
      return nextValue;
    });
  };

  const handleAddToCart = () => {
    toast.success(
      `${quantity} item${quantity > 1 ? "s" : ""} added to bag (${selectedSize}, ${selectedColor})`
    );
  };

  const handleBuyNow = () => {
    toast.success("Taking you to checkout");
    navigate("/checkout");
  };

  const handleSelectFilter = (index: number) => {
    setSelectedFilterIndex(index);
    setDisplayedReviewIndex(0);
  };

  const handleSelectSort = (index: number) => {
    setSelectedSortIndex(index);
    setDisplayedReviewIndex(0);
  };

  const handleToggleHelpful = () => {
    setHelpfulReviewIds((currentIds) => {
      const alreadyHelpful = currentIds.includes(activeReview.id);

      toast.success(alreadyHelpful ? "Helpful vote removed" : "Marked as helpful");

      return alreadyHelpful
        ? currentIds.filter((id) => id !== activeReview.id)
        : [...currentIds, activeReview.id];
    });
  };

  const handleViewNextReview = () => {
    if (visibleReviews.length <= 1) {
      toast.message("You are viewing the only review in this filter");
      return;
    }

    setDisplayedReviewIndex((currentIndex) =>
      currentIndex === visibleReviews.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="relative h-[3584px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar top="top-[24px]" />
      <Gallery
        images={GALLERY_IMAGES}
        selectedImageIndex={selectedImageIndex}
        onSelectImage={setSelectedImageIndex}
        onPrevious={() => handleGalleryStep("previous")}
        onNext={() => handleGalleryStep("next")}
      />
      <FloatingActions onActionClick={handleActionClick} />
      <div className="absolute left-[24px] top-[122px] flex flex-col justify-end font-['Montserrat'] text-base font-normal text-[#6B7280]">
        Home / Women / Dresses
      </div>
      <ReviewsSection
        visibleReviews={visibleReviews}
        displayedReviewIndex={displayedReviewIndex}
        filterOptions={REVIEW_FILTERS}
        sortOptions={REVIEW_SORTS}
        filterLabel={REVIEW_FILTERS[selectedFilterIndex].label}
        sortLabel={REVIEW_SORTS[selectedSortIndex].label}
        selectedFilterIndex={selectedFilterIndex}
        selectedSortIndex={selectedSortIndex}
        isHelpful={isHelpful}
        onSelectFilter={handleSelectFilter}
        onSelectSort={handleSelectSort}
        onToggleHelpful={handleToggleHelpful}
        onViewNextReview={handleViewNextReview}
      />
      <ProductShelf title="Recommended for You" top="top-[1912px]" />
      <ProductShelf title="Complete the look" top="top-[2540px]" />
      <ProductInfoPanel
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        isFavorite={isFavorite}
        isDescriptionExpanded={isDescriptionExpanded}
        onSelectColor={setSelectedColor}
        onSelectSize={setSelectedSize}
        onDecreaseQuantity={() =>
          setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
        }
        onIncreaseQuantity={() =>
          setQuantity((currentQuantity) => Math.min(10, currentQuantity + 1))
        }
        onToggleFavorite={handleToggleFavorite}
        onToggleDescription={() =>
          setIsDescriptionExpanded((currentValue) => !currentValue)
        }
        onShare={handleShare}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
      <Footer top="top-[3142px]" height="h-[442px]" innerHeight="h-[378px]" />
    </div>
  );
}
