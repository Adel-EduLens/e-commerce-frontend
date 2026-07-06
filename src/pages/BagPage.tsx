import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductCard } from "../components/shared";
import { useAuthStore } from "../store/useAuthStore";
import { type CartItem, useCartStore } from "../store/useCartStore";
import { api } from "../lib/axios";
import { useRecentStore } from "../store/useRecentStore";

type BagTab = "favorites" | "recent";

const FAVORITE_PRODUCTS = [
  { title: "Amber Blaze Classic Tee", sizeLabel: "XS - XXL", price: "1000 EGP" },
  { title: "Urban Drift Hoodie", sizeLabel: "S - XL", price: "850 EGP", featured: true },
  { title: "Relaxed Denim Set", sizeLabel: "M - XXL", price: "1200 EGP" },
  { title: "Soft Motion Knit", sizeLabel: "XS - L", price: "780 EGP" },
] as const;

const RECENT_PRODUCTS = [
  { title: "Contour Street Jacket", sizeLabel: "S - XL", price: "1350 EGP" },
  { title: "Neutral Ease Tee", sizeLabel: "XS - XXL", price: "620 EGP", featured: true },
  { title: "Tailored Cargo Pant", sizeLabel: "M - XXL", price: "940 EGP" },
  { title: "Canvas Weekend Tote", sizeLabel: "One Size", price: "450 EGP" },
] as const;

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} EGP`;

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
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="rounded-2xl bg-card p-6 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] flex flex-col gap-6">
      <div className="bg-background-hover p-4 rounded-xl border border-stroke flex flex-col gap-2">
        <div className="font-['Montserrat'] text-xs font-semibold text-foreground">
          Enter an active coupon code to apply:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 font-['Montserrat'] text-[10px] font-semibold text-red-600 dark:bg-red-950 dark:border-red-900 dark:text-red-400">
            DYNAMIC DISCOUNTS ACTIVE
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={couponCode}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder="Enter discount code"
          className="flex-1 h-12 rounded-xl px-4 border border-stroke bg-background text-foreground font-['Montserrat'] text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-text"
        />
        <button
          type="button"
          onClick={onApplyCoupon}
          className="h-12 px-6 rounded-xl bg-foreground text-background font-['Montserrat'] text-sm font-semibold hover:opacity-90 transition"
        >
          {isCouponApplied ? "Applied" : "Apply"}
        </button>
      </div>

      <hr className="border-stroke" />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between font-['Montserrat'] text-base text-foreground">
          <span>Subtotal</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && appliedCouponDetails && (
          <div className="flex justify-between font-['Montserrat'] text-base text-green-600 font-medium">
            <span>Discount ({appliedCouponDetails.code})</span>
            <span className="font-bold">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>Estimated Shipping</span>
          <span>Calculated at Checkout</span>
        </div>

        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>Estimated Taxes</span>
          <span>Calculated at Checkout</span>
        </div>
      </div>

      <hr className="border-stroke" />

      <div className="flex justify-between items-center font-['Montserrat'] text-xl font-bold text-foreground">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="w-full h-14 rounded-xl bg-foreground text-background font-['Montserrat'] text-base font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
      >
        Proceed to Checkout
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
  const hasDiscount = useMemo(() => {
    if (!appliedCoupon) return false;
    if (!appliedCoupon.categoryId && !appliedCoupon.productId) return true;
    if (appliedCoupon.productId && item.productId === appliedCoupon.productId) return true;
    if (appliedCoupon.categoryId && item.categoryId === appliedCoupon.categoryId) return true;
    return false;
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
        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full border border-stroke bg-card hover:bg-background-hover transition text-foreground"
        aria-label={`Remove ${item.title} from bag`}
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
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="font-['Montserrat'] text-base text-gray-text line-through">
                  {formatCurrency(item.unitPrice)}
                </span>
                <span className="rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 font-['Montserrat'] text-xs font-semibold text-red-600 dark:text-red-400">
                  {appliedCoupon!.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="font-['Montserrat'] text-2xl font-bold text-foreground">
                {formatCurrency(item.unitPrice)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="rounded-xl border border-stroke bg-card px-3 py-1 font-['Montserrat'] text-sm text-foreground">
              Size: <strong className="font-bold">{item.size}</strong>
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-stroke bg-card px-3 py-1 font-['Montserrat'] text-sm text-foreground">
              Color:
              <span
                className="h-4 w-4 rounded-full border border-stroke"
                style={{ backgroundColor: item.colorHex }}
                aria-label={item.color}
              />
            </span>
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
            Line total:{" "}
            <span className={hasDiscount ? "text-green-600 dark:text-green-400 font-bold" : "text-foreground"}>
              {formatCurrency(discountedPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyBagState({ onAddItems }: { onAddItems: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card border border-stroke p-12 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
      <div className="font-['Montserrat'] text-3xl font-bold text-foreground">
        Your bag is empty
      </div>
      <div className="max-w-md text-center font-['Montserrat'] text-base font-medium text-gray-text">
        Add a few pieces you love and they&apos;ll show up here with editable quantities,
        discount codes, and checkout totals.
      </div>
      <button
        type="button"
        onClick={onAddItems}
        className="rounded-2xl bg-primary px-6 py-4 font-['Montserrat'] text-base font-semibold text-foreground hover:bg-[#a8e854] transition"
      >
        Browse Products
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
  const recentProducts = useRecentStore((state) => state.products);
  const products = selectedTab === "favorites" ? FAVORITE_PRODUCTS : recentProducts;

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
          Favorites
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("recent")}
          className={`pb-4 font-['Montserrat'] text-xl sm:text-2xl lg:text-3xl font-bold transition-all ${selectedTab === "recent"
              ? "border-b-[3px] border-foreground text-foreground"
              : "text-gray-text hover:text-foreground"
            }`}
        >
          Recently Viewed
        </button>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-text font-['Montserrat'] text-base font-semibold">
          No recently viewed items yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const title = "title" in product ? product.title : product.name;
            const price = "price" in product
              ? (typeof product.price === "number" ? `${product.price} EGP` : product.price)
              : "";
            const sizeLabel = "sizeLabel" in product
              ? product.sizeLabel
              : product.sizes.map((s) => s.size).join(" - ");
            const imageSrc = "imageSrc" in product
              ? product.imageSrc
              : product.images?.[0]?.url;

            return (
              <ProductCard
                key={`${selectedTab}-${title}`}
                title={title}
                sizeLabel={sizeLabel}
                price={price}
                imageSrc={imageSrc}
                featured={"featured" in product && Boolean(product.featured)}
                accentClassName="bg-primary"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BagPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponType | null>(null);
  const [selectedTab, setSelectedTab] = useState<BagTab>("favorites");
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (subtotal === 0 && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode("");
    }
  }, [appliedCoupon, subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    return items.reduce((total, item) => {
      let applies = false;
      if (!appliedCoupon.categoryId && !appliedCoupon.productId) {
        applies = true;
      } else if (appliedCoupon.productId && item.productId === appliedCoupon.productId) {
        applies = true;
      } else if (appliedCoupon.categoryId && item.categoryId === appliedCoupon.categoryId) {
        applies = true;
      }

      if (applies) {
        return total + (item.unitPrice * (appliedCoupon.discount / 100)) * item.quantity;
      }
      return total;
    }, 0);
  }, [appliedCoupon, items]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddItems = () => {
    navigate("/season-must-haves");
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error("Enter a discount code first");
      return;
    }

    try {
      const { data } = await api.get(`/coupons/validate/${normalizedCode}`);
      const coupon = data.data;

      const appliesToSomeItem = items.some((item) => {
        if (!coupon.categoryId && !coupon.productId) return true;
        if (coupon.productId && item.productId === coupon.productId) return true;
        if (coupon.categoryId && item.categoryId === coupon.categoryId) return true;
        return false;
      });

      if (!appliesToSomeItem) {
        toast.error("This coupon code does not apply to any items in your bag");
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      toast.success("Discount code applied successfully");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid coupon code";
      toast.error(errorMsg);
    }
  };

  const handleCheckout = () => {
    if (!items.length) {
      toast.error("Your bag is empty");
      return;
    }

    toast.success("Taking you to checkout");
    navigate("/checkout");
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    toast.success(`${item.title} removed from bag`);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <h1 className="font-['Montserrat'] text-4xl font-bold text-foreground">
            MY BAG
          </h1>
          <span className="font-['Montserrat'] text-xl font-medium text-gray-text">
            ({itemCount} item{itemCount === 1 ? "" : "s"})
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddItems}
          className="flex items-center gap-2 rounded-2xl bg-card border border-stroke px-4 py-2 shadow-sm hover:bg-background-hover transition"
        >
          <PlusIcon />
          <span className="font-['Montserrat'] text-base font-semibold text-foreground">
            Add Items
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start mb-16">
        {/* Left Side: Bag Items */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {items.length ? (
            items.map((item) => (
              <BagItemCard
                key={item.id}
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
            checkoutDisabled={!items.length}
          />
        </div>
      </div>

      {/* Favorites tab */}
      <FavoritesSection selectedTab={selectedTab} onSelectTab={setSelectedTab} />
    </div>
  );
}
