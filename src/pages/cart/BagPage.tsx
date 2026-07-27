import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { toast } from "sonner";
import { ProductCard, LoadingSpinner } from "../../components/shared";
import { type CartItem, useCartStore } from "../../store/useCartStore";
import { api } from "../../lib/axios";
import { couponAppliesToItem } from "../../lib/couponUtils";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { useWishlist } from "../../hooks/useWishlist";
import type { BagProduct } from "../../types/product";
type BagTab = "favorites" | "recent";


const formatCurrency = (amount: number, currencySuffix = "EGP") =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} ${currencySuffix}`;

function PlusIcon({ size = 24 }: { size?: 14 | 24 }) {
  const line = size === 24 ? "h-3.5 w-0.5" : "h-3 w-0.5";
  const cross = size === 24 ? "h-0.5 w-3.5" : "h-0.5 w-3";

  return (
    <div className={`relative ${size === 24 ? "h-6 w-6" : "h-3.5 w-3.5"}`}>
      <div
        className={`absolute left-1/2 top-1/2 ${line} -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground`}
      />
      <div
        className={`absolute left-1/2 top-1/2 ${cross} -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground`}
      />
    </div>
  );
}

function MinusIcon() {
  return (
    <div className="relative h-6 w-6">
      <div className="absolute left-[5px] top-[11px] h-0.5 w-3.5 rounded-full bg-foreground" />
    </div>
  );
}

type AppliedCouponType = {
  id: string;
  code: string;
  discount: number;
  categoryId: string | null;
  productId: string | null;
};

function SummaryCard({
  subtotal,
  discount,
  couponCode,
  isCouponApplied,
  appliedCouponDetails,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
  checkoutDisabled,
}: {
  subtotal: number;
  discount: number;
  couponCode: string;
  isCouponApplied: boolean;
  appliedCouponDetails: AppliedCouponType | null;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
  checkoutDisabled: boolean;
}) {
  const { t } = useTranslation("bag");
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="rounded-2xl bg-card p-6 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] flex flex-col gap-6">
      <div className="bg-background-hover p-4 rounded-xl border border-stroke flex flex-col gap-2">
        <div className="font-['Montserrat'] text-xs font-semibold text-foreground">
          {t("summary.couponTitle")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 font-['Montserrat'] text-[10px] font-semibold text-red-600 dark:bg-red-950 dark:border-red-900 dark:text-red-400">
            {t("summary.dynamicDiscount")}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={couponCode}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder={t("summary.couponPlaceholder")}
          className="flex-1 h-12 rounded-xl px-4 border border-stroke bg-background text-foreground font-['Montserrat'] text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-text"
        />
        <button
          type="button"
          onClick={onApplyCoupon}
          className="h-12 px-6 rounded-xl bg-foreground text-background font-['Montserrat'] text-sm font-semibold hover:opacity-90 transition"
        >
          {isCouponApplied ? t("summary.applied") : t("summary.apply")}
        </button>
      </div>

      <hr className="border-stroke" />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between font-['Montserrat'] text-base text-foreground">
          <span>{t("summary.subtotal")}</span>
          <span className="font-bold">{formatCurrency(subtotal, t("EGP", "EGP"))}</span>
        </div>

        {discount > 0 && appliedCouponDetails && (
          <div className="flex justify-between font-['Montserrat'] text-base text-green-600 font-medium">
            <span>
              {t("summary.discount", { code: appliedCouponDetails.code })}
            </span>
            <span className="font-bold">-{formatCurrency(discount, t("EGP", "EGP"))}</span>
          </div>
        )}

        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>{t("summary.estimatedShipping")}</span>
          <span>{t("summary.calculatedAtCheckout")}</span>
        </div>

        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>{t("summary.estimatedTaxes")}</span>
          <span>{t("summary.calculatedAtCheckout")}</span>
        </div>
      </div>

      <hr className="border-stroke" />

      <div className="flex justify-between items-center font-['Montserrat'] text-xl font-bold text-foreground">
        <span>{t("summary.total")}</span>
        <span>{formatCurrency(total, t("EGP", "EGP"))}</span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="w-full h-14 rounded-xl bg-primary text-background font-['Montserrat'] text-base font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
      >
        {t("summary.checkout")}
      </button>
    </div>
  );
}

function BagItemCard({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  appliedCoupon,
}: {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  appliedCoupon: AppliedCouponType | null;
}) {
  const { t } = useTranslation("bag");
  const hasDiscount = useMemo(() => {
    if (!appliedCoupon) return false;
    return couponAppliesToItem(appliedCoupon, item);
  }, [appliedCoupon, item]);

  const discountedPrice = hasDiscount
    ? item.unitPrice * (1 - appliedCoupon!.discount / 100)
    : item.unitPrice;

  return (
    <div className="flex flex-col sm:flex-row gap-6 rounded-2xl bg-card p-6 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] relative group">
      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute hover:bg-primary hover:text-white cursor-pointer top-4 end-4 h-10 w-10 flex items-center justify-center rounded-full border border-stroke bg-card hover:bg-background-hover transition text-foreground"
        aria-label={t("bagItem.remove", { title: item.title })}
      >
        <Trash2 className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Image */}
      <div className="h-44 w-36 overflow-hidden rounded-xl bg-background-hover flex-shrink-0 flex items-center justify-center self-center sm:self-auto">
        <img
          src={item.imageSrc}
          className="h-full w-full object-contain"
          alt={item.title}
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1 items-center sm:items-start text-center sm:text-left">
        <div className="flex flex-col gap-2 items-center sm:items-start">
          <h3 className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground pr-10">
            {item.title}
          </h3>
          <div className="flex items-center gap-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Montserrat'] text-2xl font-bold text-red-500">
                  {formatCurrency(discountedPrice, t("EGP", "EGP"))}
                </span>
                <span className="font-['Montserrat'] text-base text-gray-text line-through">
                  {formatCurrency(item.unitPrice, t("EGP", "EGP"))}
                </span>
                <span className="rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 font-['Montserrat'] text-xs font-semibold text-red-600 dark:text-red-400">
                  {t("bagItem.off", { discount: appliedCoupon!.discount })}
                </span>
              </div>
            ) : (
              <span className="font-['Montserrat'] text-2xl font-bold text-foreground">
                {formatCurrency(item.unitPrice, t("EGP", "EGP"))}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="rounded-xl border border-stroke bg-card px-3 py-1 font-['Montserrat'] text-sm text-foreground">
              {t("bagItem.size")}:{" "}
              <strong className="font-bold">{item.size}</strong>
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-stroke bg-card px-3 py-1 font-['Montserrat'] text-sm text-foreground">
              {t("bagItem.color")}:
              {!item.color.includes(",") && (
                <span
                  className="h-4 w-4 rounded-full border border-stroke"
                  style={{ backgroundColor: item.colorHex || item.color }}
                  aria-label={item.color}
                />
              )}
              <strong className="font-bold">{item.color}</strong>
            </span>
            {item.productType && (
              <span className="rounded-xl border border-primary bg-primary/10 px-3 py-1 font-['Montserrat'] text-sm text-primary font-bold">
                {item.productType === "STANDARD" || item.productType === "SHOP" ? "SHOP" : item.productType}
              </span>
            )}
          </div>
        </div>

        {/* Quantity and Line Total */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-stroke w-full">
          <div className="flex items-center gap-3 border border-stroke rounded-full px-3 py-1.5 bg-card w-max">
            <button
              type="button"
              onClick={onDecrease}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-background-hover hover:bg-stroke transition text-foreground"
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center font-['Montserrat'] text-lg font-medium text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-background-hover hover:bg-stroke transition text-foreground"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          <div className="font-['Montserrat'] text-base font-semibold text-gray-text text-right">
            {t("bagItem.lineTotal")}:
            <span
              className={
                hasDiscount
                  ? "text-green-600 dark:text-green-400 font-bold"
                  : "text-foreground"
              }
            >
              {formatCurrency(discountedPrice * item.quantity, t("EGP", "EGP"))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyBagState({ onAddItems }: { onAddItems: () => void }) {
  const { t } = useTranslation("bag");
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card border border-stroke p-12 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
      <div className="w-60 h-60">
        <img className="w-full h-full object-contain" src="/empty_cart.png" alt="Empty Bag" />
      </div>
      <div className="font-['Montserrat'] text-3xl font-bold text-foreground">
        {t("empty.title")}
      </div>
      <div className="max-w-md text-center font-['Montserrat'] text-base font-medium text-gray-text">
        {t("empty.description")}
      </div>
      <button
        type="button"
        onClick={onAddItems}
        className="rounded-2xl bg-primary px-6 py-4 font-['Montserrat'] text-base font-semibold text-white hover:bg-primary-pressed transition"
      >
        {t("empty.button")}
      </button>
    </div>
  );
}

function FavoritesSection({
  selectedTab,
  onSelectTab,
}: {
  selectedTab: BagTab;
  onSelectTab: (tab: BagTab) => void;
}) {
  const { t } = useTranslation("bag");
  const { data: recentlyViewedData } = useRecentlyViewed();
  const apiRecentlyViewed = Array.isArray(recentlyViewedData?.data)
    ? recentlyViewedData.data.map((item: any) => {
      const product = item.product;
      if (!product) return null;
      return { ...product, _productType: item.productType };
    }).filter(Boolean)
    : [];

  const { data: wishlistData } = useWishlist();
  const apiFavorites = Array.isArray(wishlistData?.data)
    ? wishlistData.data.map((item: any) => {
      const product = item.product || item.retailProduct || item.shopProduct || item.wholesaleProduct;
      if (!product) return null;
      return { ...product, _productType: item.productType };
    }).filter(Boolean)
    : [];

  const allProducts = selectedTab === "favorites" ? apiFavorites : apiRecentlyViewed;
  const products = allProducts.slice(0, 4);
  const viewAllLink = selectedTab === "favorites" ? "/favorites" : "/recently-viewed";

  return (
    <div className="w-full">
      <div className="flex gap-8 border-b border-stroke mb-8">
        <button
          type="button"
          onClick={() => onSelectTab("favorites")}
          className={`pb-4 font-['Montserrat'] text-xl sm:text-2xl lg:text-3xl font-bold transition-all ${selectedTab === "favorites"
            ? "border-b-[3px] border-foreground text-foreground"
            : "text-gray-text hover:text-foreground"
            }`}
        >
          {t("favorites.favorites")}
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("recent")}
          className={`pb-4 font-['Montserrat'] text-xl sm:text-2xl lg:text-3xl font-bold transition-all ${selectedTab === "recent"
            ? "border-b-[3px] border-foreground text-foreground"
            : "text-gray-text hover:text-foreground"
            }`}
        >
          {t("favorites.recentlyViewed")}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-text font-['Montserrat'] text-base font-semibold">
          {t("favorites.emptyRecent")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: BagProduct, index: number) => {
              const title = product.title || product.name || "Product";
              const rawPrice = product.depositAmount ?? product.rentalPrice ?? product.retailPrice ?? product.shopPrice ?? product.wholesalePrice ?? product.price ?? product.unitPrice ?? "";
              const price: string = typeof rawPrice === "number" ? `${rawPrice} ${t("EGP", "EGP")}` : typeof rawPrice === "string" ? rawPrice : String(rawPrice ?? "");
              const sizeLabel = product.sizeLabel || (Array.isArray(product.sizes) ? product.sizes.map((s: any) => typeof s === "string" ? s : (s.size || s.name || "")).filter(Boolean).join(" - ") : "") || Array.from(new Set(product.colors?.flatMap((c: any) => c.variants?.map((v: any) => v.size) ?? []) ?? [])).join(" - ");
              const imageSrc = product.imageSrc || product.image || (Array.isArray(product.images) && product.images.length > 0 ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0].url) : undefined) || product.colors?.[0]?.images?.[0]?.imageUrl || product.colors?.[0]?.images?.[0]?.url;

              return (
                <ProductCard
                  key={`${selectedTab}-${product.id || index}-${title}`}
                  productId={product.id?.toString()}
                  productType={product._productType}
                  title={title}
                  sizeLabel={sizeLabel}
                  price={price}
                  imageSrc={imageSrc}
                  featured={Boolean(product.featured)}
                  accentClassName="bg-primary"
                />
              );
            })}
          </div>
          {allProducts.length > 4 && (
            <div className="flex justify-center mt-8">
              <Link
                to={viewAllLink}
                className="rounded-2xl bg-primary px-8 py-4 font-['Montserrat'] text-base font-semibold text-foreground hover:opacity-90 transition"
              >
                {t("favorites.viewAll")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BagPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isLoading } = useCart();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const { t } = useTranslation("bag");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponType | null>(
    null,
  );
  const [isValidatingStock, setIsValidatingStock] = useState(false);
  const [selectedTab, setSelectedTab] = useState<BagTab>("favorites");
  const itemCount = useMemo(() => items.length, [items]);
  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  useEffect(() => {
    if (user && user.role === "trader") {
      toast.error(t("toast.userRequired"));
      navigate("/");
    }
  }, [user, navigate, t]);
  useEffect(() => {
    if (subtotal === 0 && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode("");
    }
  }, [appliedCoupon, subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    return items.reduce((total, item) => {
      const applies = couponAppliesToItem(appliedCoupon, item);

      if (applies) {
        return (
          total +
          item.unitPrice * (appliedCoupon.discount / 100) * item.quantity
        );
      }
      return total;
    }, 0);
  }, [appliedCoupon, items]);

  const handleAddItems = () => {
    navigate("/products");
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error(t("toast.enterCoupon"));
      return;
    }

    try {
      const { data } = await api.get(`/coupons/validate/${normalizedCode}`);
      const coupon = data.data;

      const appliesToSomeItem = items.some((item) => couponAppliesToItem(coupon, item));

      if (!appliesToSomeItem) {
        toast.error(t("toast.couponNotApplicable"));
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      toast.success(t("toast.couponApplied"));
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || t("toast.invalidCoupon");
      toast.error(errorMsg);
    }
  };

  const handleCheckout = async () => {
    if (!items.length) {
      toast.error(t("toast.emptyBag"));
      return;
    }
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/bag");
      toast.error(t("toast.loginFirst"));
      navigate("/login");
      return;
    }

    setIsValidatingStock(true);
    const toastId = toast.loading(t("toast.checkingStock"));

    try {
      // 1. Gather all unique products to check to avoid double-fetching
      const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));

      // 2. Fetch all products in parallel
      const productDetailsMap: Record<string, { type: string; data: any }> = {};
      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          const item = items.find((i) => i.productId === productId);
          if (!item) return;

          const isWholesale = item.productType === "WHOLESALE" || item.id.includes("-wholesale");
          const isRentalOrRetail = item.productType === "RENTAL" || item.productType === "RETAIL" || item.id.includes("rental-") || item.id.includes("retail-") || !isNaN(Number(productId));

          if (isWholesale) {
            const { data } = await api.get(`/wholesales/${productId}`);
            productDetailsMap[productId] = { type: "WHOLESALE", data: data.data };
          } else if (isRentalOrRetail) {
            const { data } = await api.get(`/products/${productId}`);
            productDetailsMap[productId] = { type: "RENTAL", data: data.data };
          } else {
            const { data } = await api.get(`/products/${productId}`);
            productDetailsMap[productId] = { type: "SHOP", data: data.data };
          }
        })
      );

      // 3. Validate stock for each item in the cart
      const errors: string[] = [];

      for (const item of items) {
        const productInfo = productDetailsMap[item.productId];
        if (!productInfo || !productInfo.data) {
          errors.push(t("toast.couldNotVerifyStock", { title: item.title }));
          continue;
        }

        const productData = productInfo.data;
        let availableStock = 0;

        if (productInfo.type === "WHOLESALE") {
          const colorObj = productData.wholesaleColors?.find(
            (c: any) => c.color && item.color && c.color.toLowerCase() === item.color.toLowerCase()
          );
          availableStock = colorObj ? colorObj.stock : 0;

          if (item.quantity > availableStock) {
            errors.push(
              t("toast.wholesaleStockError", { title: item.title, color: item.color, availableStock })
            );
          }
        } else if (productInfo.type === "RETAIL") {
          const matchingSize = productData.sizes?.find(
            (s: any) => s.name && item.size && s.name.toLowerCase() === item.size.toLowerCase()
          );
          availableStock = matchingSize ? matchingSize.stock : (productData.stock ?? 0);

          if (item.quantity > availableStock) {
            errors.push(
              t("toast.retailStockError", {
                title: item.title,
                size: item.size || t("bagItem.defaultSize"),
                availableStock
              })
            );
          }
        } else {
          // Standard / SHOP product
          const matchingSize = productData.sizes?.find(
            (s: any) =>
              s.size &&
              item.size &&
              s.size.toLowerCase() === item.size.toLowerCase() &&
              (!s.color || (item.color && s.color.toLowerCase() === item.color.toLowerCase()))
          );
          availableStock = matchingSize ? (matchingSize.quantity ?? matchingSize.stock ?? 0) : (productData.stock ?? 0);

          if (item.quantity > availableStock) {
            const variantDesc = item.color || item.size ? ` (${[item.color, item.size].filter(Boolean).join(" / ")})` : "";
            errors.push(
              t("toast.shopStockError", { title: item.title, variantDesc, availableStock })
            );
          }
        }
      }

      toast.dismiss(toastId);

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        setIsValidatingStock(false);
        return;
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      console.error("Stock validation error:", err);
      toast.error(t("toast.verifyStockError"));
      setIsValidatingStock(false);
      return;
    }

    setIsValidatingStock(false);

    // Validate wholesale minimum orders
    const wholesaleItems = items.filter((item) => item.productType === "WHOLESALE" || item.id.includes("-wholesale"));
    const groupedWholesale = wholesaleItems.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { sum: 0, minOrder: item.minOrder || 1, title: item.title };
      }
      acc[item.productId].sum += item.quantity;
      return acc;
    }, {} as Record<string, { sum: number; minOrder: number; title: string }>);

    for (const productId in groupedWholesale) {
      const { sum, minOrder, title } = groupedWholesale[productId];
      if (sum < minOrder) {
        toast.error(t("toast.wholesaleMinOrderError", { title, sum, minOrder }));
        return;
      }
    }

    toast.success(t("toast.checkout"));
    navigate("/checkout", {
      state: {
        appliedCoupon: appliedCoupon
      }
    });
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    toast.success(t("toast.removed", { title: item.title }));
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <h1 className="font-['Montserrat'] text-4xl font-bold text-foreground">
            {t("page.title")}
          </h1>
          <span className="font-['Montserrat'] text-xl font-medium text-gray-text">
            {t("page.itemCount", { count: itemCount })}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddItems}
          className="flex items-center gap-2 rounded-2xl bg-card border border-stroke px-4 py-2 shadow-sm hover:bg-background-hover transition"
        >
          <PlusIcon />
          <span className="font-['Montserrat'] text-base font-semibold text-foreground">
            {t("page.addItems")}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
        {/* Left Side: Bag Items */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {isLoading && items.length === 0 ? (
            <LoadingSpinner
              containerClassName="py-20 bg-card rounded-2xl border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]"
              text={t("loadingBagItems")}
            />
          ) : items.length ? (
            items.map((item) => (
              <BagItemCard
                key={`${item.productId}-${item.size || 'none'}-${item.color || 'none'}`}
                item={item}
                onRemove={() => handleRemoveItem(item)}
                onIncrease={() => incrementQuantity(item.id)}
                onDecrease={() => decrementQuantity(item.id)}
                appliedCoupon={appliedCoupon}
              />
            ))
          ) : (
            <EmptyBagState onAddItems={handleAddItems} />
          )}
        </div>

        {/* Right Side: Summary Card */}
        {items.length > 0 && (
          <div className="w-full lg:w-[424px] shrink-0">
            <SummaryCard
              subtotal={subtotal}
              discount={discount}
              couponCode={couponCode}
              isCouponApplied={Boolean(appliedCoupon)}
              appliedCouponDetails={appliedCoupon}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
              checkoutDisabled={!items.length || isValidatingStock}
            />
          </div>
        )}
      </div>

      {/* Favorites tab */}
      <FavoritesSection
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
    </div>
  );
}
