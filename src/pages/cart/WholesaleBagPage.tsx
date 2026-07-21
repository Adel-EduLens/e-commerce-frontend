import { useMemo, useState } from "react";
import { Trash2, Package, ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../lib/axios";
import { type CartItem, } from "../../store/useCartStore";
import {
  useWholesaleCartItems,
  useWholesaleCartStore,
} from "../../store/useWholesaleCartStore";
import { useAuthStore } from "../../store/useAuthStore";

const formatCurrency = (amount: number) =>
  `EGP ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;

function PlusIcon() {
  return (
    <div className="relative h-6 w-6">
      <div className="absolute left-1/2 top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
      <div className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
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

function WholesaleItemCard({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const minOrder = item.minOrder ?? 1;

  return (
    <div className="flex flex-col sm:flex-row gap-6 rounded-2xl bg-card p-6 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] relative">
      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full border border-stroke bg-card hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition text-foreground"
        aria-label={`Remove ${item.title}`}
      >
        <Trash2 className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Image */}
      <div className="h-44 w-36 overflow-hidden rounded-xl bg-background flex-shrink-0 flex items-center justify-center self-center sm:self-auto border border-stroke">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            className="h-full w-full object-contain"
            alt={item.title}
            draggable={false}
          />
        ) : (
          <Package className="h-16 w-16 text-gray-text" strokeWidth={1} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              Wholesale
            </span>
            {minOrder > 1 && (
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400">
                Min. {minOrder} pcs
              </span>
            )}
          </div>

          <h3 className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground pr-10">
            {item.title}
          </h3>

          <span className="font-['Montserrat'] text-2xl font-bold text-foreground">
            {formatCurrency(item.unitPrice)}
            <span className="text-sm font-normal text-gray-text ml-1">/ unit</span>
          </span>

          <div className="flex flex-wrap gap-2 mt-1">
            {item.color && (
              <span className="rounded-xl border border-stroke bg-background px-3 py-1 font-['Montserrat'] text-sm text-foreground">
                Color: <strong className="font-bold">{item.color}</strong>
              </span>
            )}
            {item.size && (
              <span className="rounded-xl border border-stroke bg-background px-3 py-1 font-['Montserrat'] text-sm text-foreground">
                Sizes: <strong className="font-bold">{item.size}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Quantity & total */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-stroke w-full">
          <div className="flex items-center gap-3 border border-stroke rounded-full px-3 py-1.5 bg-card w-max">
            <button
              type="button"
              onClick={onDecrease}
              disabled={item.quantity <= (minOrder)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-background hover:bg-stroke transition text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MinusIcon />
            </button>
            <span className="w-12 text-center font-['Montserrat'] text-lg font-medium text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-background hover:bg-stroke transition text-foreground"
            >
              <PlusIcon />
            </button>
          </div>

          <div className="font-['Montserrat'] text-base font-semibold text-gray-text">
            Total:{" "}
            <span className="text-foreground font-bold">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-card border border-stroke p-16 shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <Package className="h-12 w-12 text-primary" strokeWidth={1} />
      </div>
      <div className="text-center">
        <h2 className="font-['Montserrat'] text-2xl font-bold text-foreground mb-2">
          Your wholesale cart is empty
        </h2>
        <p className="font-['Montserrat'] text-base text-gray-text max-w-sm">
          Browse wholesale products and add them to your cart to place a bulk order.
        </p>
      </div>
      <button
        type="button"
        onClick={onBrowse}
        className="rounded-2xl bg-primary px-8 py-4 font-['Montserrat'] text-base font-semibold text-white hover:opacity-90 transition"
      >
        Browse Wholesale Products
      </button>
    </div>
  );
}

function SummaryCard({
  subtotal,
  onCheckout,
  disabled,
  itemCount,
}: {
  subtotal: number;
  onCheckout: () => void;
  disabled: boolean;
  itemCount: number;
}) {
  return (
    <div className="rounded-2xl bg-card p-6 border border-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)] flex flex-col gap-5 lg:sticky lg:top-24">
      <h2 className="font-['Montserrat'] text-xl font-bold text-foreground">
        Order Summary
      </h2>

      <div className="flex flex-col gap-3 border-b border-stroke pb-4">
        <div className="flex justify-between font-['Montserrat'] text-base text-foreground">
          <span className="text-gray-text">Items ({itemCount})</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between font-['Montserrat'] text-sm text-gray-text">
          <span>Taxes</span>
          <span>Included</span>
        </div>
      </div>

      <div className="flex justify-between items-center font-['Montserrat'] text-xl font-bold text-foreground">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled}
        className="w-full h-14 rounded-xl bg-primary text-white font-['Montserrat'] text-base font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        Proceed to complete order
      </button>

      <Link
        to="/wholesale"
        className="text-center font-['Montserrat'] text-sm text-primary hover:underline"
      >
        ← Continue Shopping
      </Link>
    </div>
  );
}

export default function WholesaleBagPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const items = useWholesaleCartItems();
  const removeItem = useWholesaleCartStore((s) => s.removeItem);
  const incrementQuantity = useWholesaleCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useWholesaleCartStore((s) => s.decrementQuantity);
  const [isValidating, setIsValidating] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleCheckout = async () => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", "/wholesale-bag");
      toast.error("Please login to proceed to checkout");
      navigate("/login");
      return;
    }

    if (!items.length) {
      toast.error("Your wholesale cart is empty");
      return;
    }

    setIsValidating(true);
    const toastId = toast.loading("Validating stock...");

    try {
      // Validate stock for each product
      const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));
      const errors: string[] = [];

      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          const item = items.find((i) => i.productId === productId);
          if (!item) return;
          try {
            const { data } = await api.get(`/products/${productId}`);
            const product = data.data;
            const colorObj = product.colors?.find(
              (c: any) =>
                (c.colorName || c.color) &&
                item.color &&
                (c.colorName || c.color).toLowerCase() === item.color.toLowerCase()
            );
            const availableStock = colorObj && colorObj.stock !== undefined ? colorObj.stock : (product.stock ?? 999999);

            if (availableStock > 0 && item.quantity > availableStock) {
              errors.push(
                `"${item.title}" (${item.color}) — requested ${item.quantity} but only ${availableStock} available.`
              );
            }
          } catch {
            errors.push(`Could not verify stock for "${item?.title}"`);
          }
        })
      );

      toast.dismiss(toastId);

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        setIsValidating(false);
        return;
      }

      // Validate minimum orders
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = { sum: 0, minOrder: item.minOrder || 1, title: item.title };
        }
        acc[item.productId].sum += item.quantity;
        return acc;
      }, {} as Record<string, { sum: number; minOrder: number; title: string }>);

      for (const productId in grouped) {
        const { sum, minOrder, title } = grouped[productId];
        if (sum < minOrder) {
          toast.error(
            `"${title}" requires a minimum order of ${minOrder} units (you have ${sum}).`
          );
          setIsValidating(false);
          return;
        }
      }

      navigate("/wholesale-checkout");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to validate your cart. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-['Montserrat'] text-3xl font-bold text-foreground">
              Wholesale Cart
            </h1>
            <p className="font-['Montserrat'] text-sm text-gray-text">
              {itemCount} {itemCount === 1 ? "unit" : "units"} across {items.length}{" "}
              {items.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
        <Link
          to="/wholesale"
          className="inline-flex items-center gap-2 rounded-2xl border border-stroke bg-card px-4 py-2.5 font-['Montserrat'] text-sm font-semibold text-foreground hover:bg-background transition"
        >
          ← Browse Wholesale
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Items */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {items.length === 0 ? (
            <EmptyState onBrowse={() => navigate("/wholesale")} />
          ) : (
            items.map((item) => (
              <WholesaleItemCard
                key={item.id}
                item={item}
                onRemove={() => {
                  removeItem(item.id);
                  toast.success(`"${item.title}" removed from wholesale cart`);
                }}
                onIncrease={() => incrementQuantity(item.id)}
                onDecrease={() => decrementQuantity(item.id)}
              />
            ))
          )}
        </div>

        {/* Right: Summary */}
        {items.length > 0 && (
          <div className="w-full lg:w-[380px] shrink-0">
            <SummaryCard
              subtotal={subtotal}
              onCheckout={handleCheckout}
              disabled={!items.length || isValidating}
              itemCount={itemCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
