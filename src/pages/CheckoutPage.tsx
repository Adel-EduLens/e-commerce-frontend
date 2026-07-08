import { useState, useMemo } from "react";
import { useCartStore } from "../store/useCartStore";
import GoogleMapPicker from "../components/GoogleMap";
import { api } from "../lib/axios";
import { toast } from "sonner";

function OrderSummary({
  items,
  subtotal,
  shipping,
  discountAmount,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
  couponError,
  setCouponError,
}: {
  items: any[];
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  couponCode: string;
  setCouponCode: (val: string) => void;
  appliedCoupon: any;
  setAppliedCoupon: (val: any) => void;
  couponError: string;
  setCouponError: (val: string) => void;
}) {
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const { data } = await api.get(`/coupons/validate/${couponCode.trim().toUpperCase()}`);
      const coupon = data?.data;
      if (coupon) {
        // Check if coupon actually applies to any item in cart
        let appliesToCart = false;
        items.forEach((item) => {
          let isQualifying = true;
          if (coupon.categoryId && item.categoryId !== coupon.categoryId) {
            isQualifying = false;
          }
          if (coupon.productId && item.productId !== coupon.productId) {
            isQualifying = false;
          }
          if (isQualifying) {
            appliesToCart = true;
          }
        });

        if (!appliesToCart) {
          setCouponError("This coupon does not apply to the items in your cart");
          toast.error("This coupon does not apply to the items in your cart");
          setAppliedCoupon(null);
          return;
        }

        // Apply and use the coupon immediately
        const { data: useData } = await api.post(`/coupons/use/${coupon.code}`);
        const updatedCoupon = useData?.data || coupon;

        setAppliedCoupon(updatedCoupon);
        toast.success(`Coupon "${updatedCoupon.code}" applied!`);
      } else {
        setCouponError("Invalid coupon code");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to validate coupon";
      setCouponError(msg);
      toast.error(msg);
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const formatCurrency = (v: number) => `EGP ${v.toFixed(2)}`;

  return (
    <div className="w-full flex flex-col gap-8 rounded-2xl bg-white px-4 py-6 outline outline-1 outline-offset-[-1px] outline-stroke">
      <div className="flex flex-col gap-4 border-b border-stroke pb-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4 rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] p-2">
            <div className="relative shrink-0">
              <img
                className="h-24 w-20 sm:h-28 sm:w-24 rounded object-cover bg-gray-100"
                src={item.imageSrc || "/checkout/Rectangle%203.png"}
                alt={item.title}
              />
              <div className="absolute -right-2 -top-1 h-6 w-6 overflow-hidden rounded-lg bg-[#0F1115] flex items-center justify-center">
                <span className="font-['Montserrat'] text-sm font-semibold text-primary">{item.quantity}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-1">
              <div className="font-['Montserrat'] text-base sm:text-xl font-medium text-foreground">
                {item.title}
              </div>
              <div className="font-['Montserrat'] text-sm font-medium text-gray-500">
                Size: {item.size} &middot; Color: {item.color}
              </div>
              <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
                {formatCurrency(item.unitPrice * item.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke">
          <input
            placeholder="Enter discount code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isValidating || !!appliedCoupon}
            className="flex-1 h-14 sm:h-16 px-4 font-['Montserrat'] text-sm sm:text-base font-medium text-foreground placeholder:text-gray-text outline-none bg-white disabled:bg-gray-50"
          />
          {appliedCoupon ? (
            <button
              onClick={() => {
                setAppliedCoupon(null);
                setCouponCode("");
                setCouponError("");
              }}
              className="flex h-14 sm:h-16 items-center justify-center bg-red-500 px-4 sm:px-6"
            >
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-white">Remove</span>
            </button>
          ) : (
            <button
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponCode.trim()}
              className="flex h-14 sm:h-16 items-center justify-center bg-secondary px-4 sm:px-6 disabled:opacity-50"
            >
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-white">
                {isValidating ? "Applying..." : "Apply"}
              </span>
            </button>
          )}
        </div>
        {couponError && (
          <div className="text-red-500 text-xs font-semibold px-1">
            {couponError}
          </div>
        )}
        {appliedCoupon && (
          <div className="text-green-600 text-xs font-semibold px-1">
            Discount Applied: {appliedCoupon.discount}% OFF
          </div>
        )}
        <div className="flex flex-col gap-3 border-b border-stroke pb-4">
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">Subtotal</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="font-['Montserrat'] text-sm sm:text-base font-medium">Discount ({appliedCoupon?.discount}%)</span>
              <span className="font-['Montserrat'] text-sm sm:text-base font-bold">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">Estimated Shipping</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">Estimated Taxes</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">Included</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">Total</span>
          <span className="font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

function DropdownArrow() {
  return (
    <div className="relative h-6 w-0 origin-top-left rotate-90 overflow-hidden">
      <img src="/checkout/weui_arrow-filled-1.svg" className="absolute left-0 top-0 h-6 w-6" alt="" />
    </div>
  );
}

function FormInput({ placeholder, value, onChange, className = "" }: { placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; className?: string }) {
  return (
    <div className={`flex h-14 sm:h-16 items-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full px-4 font-['Montserrat'] text-sm sm:text-base font-medium text-foreground placeholder:text-gray-text outline-none"
      />
    </div>
  );
}

function FormSelect({ placeholder, value, onChange, options = [], className = "" }: { placeholder: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; options?: string[]; className?: string }) {
  return (
    <div className={`relative flex h-14 sm:h-16 items-center justify-between rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full h-full px-4 appearance-none bg-transparent font-['Montserrat'] text-sm sm:text-base font-medium text-foreground outline-none z-10"
      >
        <option value="" disabled className="text-gray-text">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        {value && !options.includes(value) && <option value={value}>{value}</option>}
      </select>
      <div className="absolute right-4 z-0 pointer-events-none">
        <DropdownArrow />
      </div>
    </div>
  );
}

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment: string;
};

function DeliverySection({
  data,
  onChange,
}: {
  data: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}) {

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">DELIVERY</h2>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput placeholder="First name" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} />
          <FormInput placeholder="Last name" value={data.lastName} onChange={e => onChange("lastName", e.target.value)} />
        </div>
        <FormInput placeholder="Phone Number" value={data.phone} onChange={e => onChange("phone", e.target.value)} />
        <FormInput placeholder="Email Address" value={data.email} onChange={e => onChange("email", e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormSelect placeholder="Country" value={data.country} onChange={e => onChange("country", e.target.value)} options={["Egypt", "Saudi Arabia", "UAE"]} />
          <FormSelect placeholder="City" value={data.city} onChange={e => onChange("city", e.target.value)} options={["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"]} />
        </div>
        <FormInput placeholder="Area" value={data.area} onChange={e => onChange("area", e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput placeholder="Street Address" value={data.streetAddress} onChange={e => onChange("streetAddress", e.target.value)} />
          <FormInput placeholder="Apartment" value={data.apartment} onChange={e => onChange("apartment", e.target.value)} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">Select on Map</div>
          <GoogleMapPicker
            onLocationPick={(loc) => {
              if (loc.city) onChange("city", loc.city);
              if (loc.area) onChange("area", loc.area);
              if (loc.streetAddress) onChange("streetAddress", loc.streetAddress);
            }}
            searchQuery={[data.streetAddress, data.area, data.city, data.country].filter(Boolean).join(", ")}
          />
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSection() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">PAYMENT METHOD</h2>
        <p className="font-['Montserrat'] text-base sm:text-xl font-medium text-gray-text">
          All transactions are secure and encrypted.
        </p>
      </div>
      <div className="rounded-lg bg-gray-light outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-secondary">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">Credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/checkout/logos_visaelectron.svg" className="h-6 w-8 sm:h-8 sm:w-10" alt="Visa" />
            <img src="/checkout/logos_mastercard.svg" className="h-6 w-8 sm:h-8 sm:w-10" alt="Mastercard" />
            <div className="flex h-6 w-8 sm:h-8 sm:w-10 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke">
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">+3</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <FormInput placeholder="Card number" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput placeholder="Expiration date (MM / YY)" />
            <FormSelect placeholder="Security code" />
          </div>
          <FormInput placeholder="Name on card" />
        </div>
        <div className="flex items-center justify-between rounded-b-lg bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RememberMeSection({ onPay }: { onPay: () => void }) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">REMEMBER ME</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center rounded-lg bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              Save my information for a faster checkout
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/checkout/material-symbols_lock-outline.svg" className="h-4 w-4" alt="" />
          <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-gray-text">
            Secure and encrypted
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
            By submitting your order, you agree to our{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#0284C7] underline">
            Terms of Service
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
            {" "}&amp;{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#0284C7] underline">
            Privacy Policy
          </span>
        </div>
        <button onClick={onPay} className="w-full h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-primary">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">Pay now</span>
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "Egypt",
    city: "",
    area: "",
    streetAddress: "",
    apartment: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    
    let qualifyingSubtotal = 0;
    let hasMatchingItem = false;
    items.forEach((item) => {
      let isQualifying = true;
      if (appliedCoupon.categoryId && item.categoryId !== appliedCoupon.categoryId) {
        isQualifying = false;
      }
      if (appliedCoupon.productId && item.productId !== appliedCoupon.productId) {
        isQualifying = false;
      }
      if (isQualifying) {
        qualifyingSubtotal += item.unitPrice * item.quantity;
        hasMatchingItem = true;
      }
    });

    if (!hasMatchingItem) {
      return 0;
    }

    return (qualifyingSubtotal * appliedCoupon.discount) / 100;
  }, [appliedCoupon, items]);

  const shipping = 50; // Flat shipping rate
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      toast.error("Please fill in all required contact details");
      return;
    }

    try {
      console.log("Processing checkout with data:", formData);
      
      toast.success("Order placed successfully!");
      clearCart();
      alert("Order placed successfully! Your cart has been cleared.");
    } catch (err) {
      toast.error("An error occurred during checkout");
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col gap-8 sm:gap-12">
          <DeliverySection data={formData} onChange={handleChange} />
          <PaymentMethodSection />
          <RememberMeSection onPay={handleCheckout} />
        </div>
        <div className="w-full lg:w-[480px] xl:w-[566px] shrink-0 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discountAmount={discountAmount}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            couponError={couponError}
            setCouponError={setCouponError}
          />
        </div>
      </div>
    </div>
  );
}