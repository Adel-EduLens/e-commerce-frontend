import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProductCard } from "../components/shared";
import { useAuthStore } from "../store/useAuthStore";
import { type CartItem, useCartStore } from "../store/useCartStore";

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
        className={`absolute left-1/2 top-1/2 ${line} -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A1A1A]`}
      />
      <div
        className={`absolute left-1/2 top-1/2 ${cross} -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A1A1A]`}
      />
    </div>
  );
}

function MinusIcon() {
  return (
    <div className="relative h-6 w-6">
      <div className="absolute left-[5px] top-[11px] h-0.5 w-3.5 rounded-full bg-[#1A1A1A]" />
    </div>
  );
}

function SummaryCard({
  subtotal,
  discount,
  couponCode,
  isCouponApplied,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
  checkoutDisabled,
}: {
  subtotal: number;
  discount: number;
  couponCode: string;
  isCouponApplied: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
  checkoutDisabled: boolean;
}) {
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="absolute left-[968px] top-[232px] h-[476px] w-[424px] overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <div className="absolute left-[35px] top-[20px] inline-flex items-center justify-start gap-1">
        <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
          Get 20% off 99+ Orders With Code:
        </div>
        <div className="flex items-center justify-center rounded-2xl bg-[#DC2626] px-2 py-1">
          <div className="font-['Montserrat'] text-base font-semibold text-white">
            FREE20
          </div>
        </div>
      </div>
      <input
        value={couponCode}
        onChange={(event) => onCouponChange(event.target.value)}
        placeholder="Enter discount code"
        className="absolute left-[16px] top-[68px] h-14 w-96 rounded-lg px-4 py-5 pr-28 font-['Montserrat'] text-base font-medium text-[#1A1A1A] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] placeholder:text-[#6B7280]"
      />
      <button
        type="button"
        onClick={onApplyCoupon}
        className="absolute left-[317px] top-[68px] inline-flex h-14 w-[91px] items-center justify-center rounded-br-lg rounded-tr-lg bg-[#1A1A1A] p-2.5"
      >
        <div className="font-['Montserrat'] text-base font-semibold text-white">
          {isCouponApplied ? "Applied" : "Apply"}
        </div>
      </button>
      <div className="absolute left-0 top-[152px] h-0 w-96 outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
      <div className="absolute left-[16px] top-[176px] inline-flex w-96 items-center justify-between">
        <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          Subtotal
        </div>
        <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
          {formatCurrency(subtotal)}
        </div>
      </div>
      {discount > 0 ? (
        <div className="absolute left-[16px] top-[212px] inline-flex w-96 items-center justify-between">
          <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
            Discount (FREE20)
          </div>
          <div className="font-['Montserrat'] text-base font-bold text-[#16A34A]">
            -{formatCurrency(discount)}
          </div>
        </div>
      ) : null}
      <div className="absolute left-[16px] top-[248px] inline-flex w-96 items-center justify-between">
        <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          Estimated Shipping
        </div>
        <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
          Calculated at Checkout
        </div>
      </div>
      <div className="absolute left-[16px] top-[284px] inline-flex w-96 items-center justify-between">
        <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          Estimated Taxes
        </div>
        <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
          Calculated at Checkout
        </div>
      </div>
      <div className="absolute left-0 top-[356px] h-0 w-96 outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
      <div className="absolute left-[16px] top-[380px] inline-flex w-96 items-center justify-between">
        <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          Total
        </div>
        <div className="font-['Montserrat'] text-xl font-bold text-[#1A1A1A]">
          {formatCurrency(total)}
        </div>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="absolute left-[16px] top-[420px] inline-flex h-14 w-96 items-center justify-center rounded-lg bg-[#1A1A1A] p-2.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="font-['Montserrat'] text-xl font-semibold text-white">
          Proceed to Checkout
        </div>
      </button>
    </div>
  );
}

function BagHeader({
  itemCount,
  onAddItems,
}: {
  itemCount: number;
  onAddItems: () => void;
}) {
  return (
    <div className="absolute left-[24px] top-[162px] inline-flex w-[920px] items-center justify-between">
      <div className="flex items-center justify-start gap-6">
        <div className="font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
          MY BAG
        </div>
        <div className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          ({itemCount} item{itemCount === 1 ? "" : "s"})
        </div>
      </div>
      <button
        type="button"
        onClick={onAddItems}
        className="flex items-center justify-start gap-2 rounded-2xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
      >
        <PlusIcon />
        <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
          Add Items
        </div>
      </button>
    </div>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="absolute left-0 top-[142px] inline-flex w-32 items-center justify-start gap-4 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <button
        type="button"
        onClick={onDecrease}
        className="relative h-10 w-10 overflow-hidden rounded-full bg-[#EDEDED]"
        aria-label="Decrease item quantity"
      >
        <div className="absolute left-[8px] top-[8px] h-6 w-6 overflow-hidden">
          <MinusIcon />
        </div>
      </button>
      <div className="text-end font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
        {quantity}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        className="relative h-10 w-10 overflow-hidden rounded-full bg-[#EDEDED]"
        aria-label="Increase item quantity"
      >
        <div className="absolute left-[8px] top-[8px] h-6 w-6 overflow-hidden">
          <PlusIcon />
        </div>
      </button>
    </div>
  );
}

function BagItemCard({
  item,
  top,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  top: number;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div
      className="absolute left-[24px] h-60 w-[920px] rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
      style={{ top }}
    >
      <button
        type="button"
        onClick={onRemove}
        className="absolute left-[864px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
        aria-label={`Remove ${item.title} from bag`}
      >
        <Trash2
          className="absolute left-[8px] top-[8px] h-6 w-6 text-[#1A1A1A]"
          strokeWidth={1.5}
        />
      </button>
      <div className="absolute left-0 top-0 h-60 w-48 overflow-hidden rounded-l-lg bg-[#F9FAFB]">
        <img
          src={item.imageSrc}
          className="absolute left-[8px] top-0 h-[284px] w-[176px] object-contain"
          alt={item.title}
          draggable={false}
        />
      </div>
      <div className="absolute left-[221px] top-[8px] h-48 w-72">
        <div className="absolute left-0 top-0 w-72 whitespace-nowrap font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          {item.title}
        </div>
        <div className="absolute left-0 top-[40px] w-72 font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
          {formatCurrency(item.unitPrice)}
        </div>
        <div className="absolute left-0 top-[85px] inline-flex items-center justify-start gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="font-['Montserrat'] text-base text-[#1A1A1A]">
            <span className="font-medium">Size: </span>
            <span className="font-bold">{item.size}</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
              Color:
            </div>
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: item.colorHex }}
              aria-label={item.color}
            />
          </div>
        </div>
        <QuantityControl
          quantity={item.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>
      <div className="absolute left-[676px] top-[183px] font-['Montserrat'] text-base font-semibold text-[#6B7280]">
        Line total: {formatCurrency(item.unitPrice * item.quantity)}
      </div>
    </div>
  );
}

function EmptyBagState({ onAddItems }: { onAddItems: () => void }) {
  return (
    <div className="absolute left-[24px] top-[232px] flex h-60 w-[920px] flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Your bag is empty
      </div>
      <div className="w-[520px] text-center font-['Montserrat'] text-base font-medium text-[#6B7280]">
        Add a few pieces you love and they&apos;ll show up here with editable quantities,
        discount codes, and checkout totals.
      </div>
      <button
        type="button"
        onClick={onAddItems}
        className="rounded-2xl bg-[#BBFF63] px-6 py-4 font-['Montserrat'] text-base font-semibold text-[#1A1A1A]"
      >
        Browse Products
      </button>
    </div>
  );
}

function FavoritesSection({
  top,
  selectedTab,
  onSelectTab,
}: {
  top: number;
  selectedTab: BagTab;
  onSelectTab: (tab: BagTab) => void;
}) {
  const products = selectedTab === "favorites" ? FAVORITE_PRODUCTS : RECENT_PRODUCTS;

  return (
    <div
      className="absolute left-[24px] inline-flex w-[1392px] flex-col items-start justify-start gap-8"
      style={{ top }}
    >
      <div className="relative h-16 w-[920px]">
        <div className="absolute left-0 top-[71px] h-0 w-[920px] outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
        <button
          type="button"
          onClick={() => onSelectTab("favorites")}
          className={`absolute left-0 top-0 inline-flex items-center justify-center py-4 font-['Montserrat'] text-3xl font-bold ${
            selectedTab === "favorites"
              ? "border-b-[3px] border-[#1A1A1A] text-[#1A1A1A]"
              : "text-[#6B7280]"
          }`}
        >
          Favorites
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("recent")}
          className={`absolute left-[185px] top-[16px] font-['Montserrat'] text-3xl font-bold ${
            selectedTab === "recent" ? "text-[#1A1A1A]" : "text-[#6B7280]"
          }`}
        >
          Recently Viewed
        </button>
      </div>
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        {products.map((product) => (
          <ProductCard
            key={`${selectedTab}-${product.title}`}
            title={product.title}
            sizeLabel={product.sizeLabel}
            price={product.price}
            featured={"featured" in product && Boolean(product.featured)}
            accentClassName="bg-[#BBFF63]"
          />
        ))}
      </div>
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
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
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
    if (appliedCoupon === "FREE20" && subtotal >= 99) {
      return subtotal * 0.2;
    }

    return 0;
  }, [appliedCoupon, subtotal]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const extraItems = Math.max(items.length - 1, 0);
  const favoritesTop = 965 + extraItems * 264;
  const footerTop = 1507 + extraItems * 264;
  const pageHeight = 1949 + extraItems * 264;

  const handleAddItems = () => {
    navigate("/season-must-haves");
  };

  const handleApplyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error("Enter a discount code first");
      return;
    }

    if (normalizedCode !== "FREE20") {
      toast.error("That discount code is not valid");
      return;
    }

    if (subtotal < 99) {
      toast.error("FREE20 requires at least 99 EGP in your bag");
      return;
    }

    setAppliedCoupon(normalizedCode);
    setCouponCode(normalizedCode);
    toast.success("Discount code applied");
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
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: pageHeight }}
    >
      <SummaryCard
        subtotal={subtotal}
        discount={discount}
        couponCode={couponCode}
        isCouponApplied={Boolean(appliedCoupon && discount > 0)}
        onCouponChange={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        onCheckout={handleCheckout}
        checkoutDisabled={!items.length}
      />
      <BagHeader itemCount={itemCount} onAddItems={handleAddItems} />
      {items.length ? (
        items.map((item, index) => (
          <BagItemCard
            key={item.id}
            item={item}
            top={232 + index * 264}
            onRemove={() => handleRemoveItem(item)}
            onIncrease={() => incrementQuantity(item.id)}
            onDecrease={() => decrementQuantity(item.id)}
          />
        ))
      ) : (
        <EmptyBagState onAddItems={handleAddItems} />
      )}
      <FavoritesSection
        top={favoritesTop}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
    </div>
  );
}
