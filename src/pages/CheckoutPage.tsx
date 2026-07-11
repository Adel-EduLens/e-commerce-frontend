import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store/useCartStore";
import { useCart } from "../hooks/useCart";
import GoogleMapPicker from "../components/GoogleMap";
import { api } from "../lib/axios";
import { toast } from "sonner";
import {
  MapPin,
  CheckCircle2,
  Compass,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMyAddresses } from "../hooks/queries/addressQuery";
import type { Address } from "../hooks/queries/addressQuery";
type SavedAddressesSectionProps = {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
};
function SavedAddressesSection({
  addresses,
  selectedAddressId,
  onSelect,
}: SavedAddressesSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-stroke bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5"
      >
        <div>
          <h3 className="font-semibold text-foreground">Saved Addresses</h3>

          <p className="text-sm text-gray-text">
            {addresses.length} saved address
            {addresses.length !== 1 && "es"}
          </p>
        </div>

        <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-stroke p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => {
              const active = selectedAddressId === address.id;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => onSelect(address)}
                  className={`
          rounded-xl
          border
          p-4
          text-left
          transition-all
          duration-300

          ${active
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md"
                      : "border-stroke bg-card hover:border-primary/40"
                    }
        `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {address.area}
                      </h4>

                      <p className="mt-1 text-sm text-gray-text">
                        {address.streetAddress}
                      </p>

                      {address.apartment && (
                        <p className="text-sm text-gray-text">
                          Apt {address.apartment}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-gray-text">
                        {address.city}, {address.country}
                      </p>
                    </div>

                    {active && <CheckCircle2 className="text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
      const { data } = await api.get(
        `/coupons/validate/${couponCode.trim().toUpperCase()}`,
      );
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
          setCouponError(
            "This coupon does not apply to the items in your cart",
          );
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
          <div
            key={`${item.productId}-${item.size || 'none'}-${item.color || 'none'}`}
            className="relative flex items-start gap-4 rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] p-2"
          >
            <div className="relative shrink-0">
              <img
                className="h-24 w-20 sm:h-28 sm:w-24 rounded object-cover bg-gray-100"
                src={item.imageSrc || "/checkout/Rectangle%203.png"}
                alt={item.title}
              />
              <div className="absolute -right-2 -top-1 h-6 w-6 overflow-hidden rounded-lg bg-[#0F1115] flex items-center justify-center">
                <span className="font-['Montserrat'] text-sm font-semibold text-primary">
                  {item.quantity}
                </span>
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
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-white">
                Remove
              </span>
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
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              Subtotal
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="font-['Montserrat'] text-sm sm:text-base font-medium">
                Discount ({appliedCoupon?.discount}%)
              </span>
              <span className="font-['Montserrat'] text-sm sm:text-base font-bold">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              Estimated Shipping
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              Estimated Taxes
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              Included
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">
            Total
          </span>
          <span className="font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function DropdownArrow() {
  return (
    <div className="relative h-6 w-0 origin-top-left rotate-90 overflow-hidden">
      <img
        src="/checkout/weui_arrow-filled-1.svg"
        className="absolute left-0 top-0 h-6 w-6"
        alt=""
      />
    </div>
  );
}

function FormInput({
  placeholder,
  value,
  onChange,
  className = "",
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex h-14 sm:h-16 items-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden ${className}`}
    >
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

function FormSelect({
  placeholder,
  value,
  onChange,
  options = [],
  className = "",
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: string[];
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-14 sm:h-16 items-center justify-between rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden ${className}`}
    >
      <select
        value={value}
        onChange={onChange}
        className="w-full h-full px-4 appearance-none bg-transparent font-['Montserrat'] text-sm sm:text-base font-medium text-foreground outline-none z-10"
      >
        <option value="" disabled className="text-gray-text">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        {value && !options.includes(value) && (
          <option value={value}>{value}</option>
        )}
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
  mapAddress?: string;
  latitude?: string;
  longitude?: string;
  isAddressesLoading?: boolean;
};

function DeliverySection({
  data,
  onChange,
  addresses,
  selectedAddressId,
  isAddressesLoading,
  onSelectAddress,
}: {
  data: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;

  addresses: Address[];
  isAddressesLoading?: boolean;
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
}) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
        DELIVERY
      </h2>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            placeholder="First name"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          <FormInput
            placeholder="Last name"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
        <FormInput
          placeholder="Phone Number"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        <FormInput
          placeholder="Email Address"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {isAddressesLoading && (
          <div className="p-10 text-center">Saved Addresses are loading...</div>
        )}
        {!isAddressesLoading && addresses && addresses.length > 0 && (
          <SavedAddressesSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={onSelectAddress}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormSelect
            placeholder="Country"
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            options={["Egypt", "Saudi Arabia", "UAE"]}
          />
          <FormSelect
            placeholder="City"
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            options={["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"]}
          />
        </div>
        <FormInput
          placeholder="Area"
          value={data.area}
          onChange={(e) => onChange("area", e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            placeholder="Street Address"
            value={data.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
          />
          <FormInput
            placeholder="Apartment"
            value={data.apartment}
            onChange={(e) => onChange("apartment", e.target.value)}
          />
        </div>

        {/* Confirmed Map Location Field */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary shrink-0" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              Confirmed Delivery Coordinates
            </span>
          </div>

          {!data.mapAddress ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-stroke bg-gray-50/50 dark:bg-zinc-900/50 text-gray-text transition-all duration-300">
              <Compass className="h-5 w-5 text-gray-400 animate-pulse shrink-0" />
              <p className="font-['Montserrat'] text-xs sm:text-sm font-medium">
                No location confirmed yet. Please select your delivery location
                on the map below and click{" "}
                <span className="font-semibold text-foreground">
                  Confirm Location
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/10 dark:from-green-500/10 dark:to-emerald-500/10 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] transition-all duration-300">
              <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-green-500/5 blur-xl pointer-events-none" />

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                      Confirmed Map Address
                    </span>
                    {data.latitude && data.longitude && (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 font-['Montserrat'] text-[10px] font-semibold text-green-700 dark:text-green-300">
                        {parseFloat(data.latitude).toFixed(5)},{" "}
                        {parseFloat(data.longitude).toFixed(5)}
                      </span>
                    )}
                  </div>
                  <p className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground leading-relaxed break-words">
                    {data.mapAddress}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
            Select on Map
          </div>
          <GoogleMapPicker
            onLocationPick={(loc) => {
              // Set the confirmed address field and coordinates
              const fullAddr =
                loc.displayAddress ||
                [loc.streetAddress, loc.area, loc.city]
                  .filter(Boolean)
                  .join(", ");
              onChange("mapAddress", fullAddr);
              if (loc.lat) onChange("latitude", loc.lat.toString());
              if (loc.lng) onChange("longitude", loc.lng.toString());
            }}
            searchQuery={[data.streetAddress, data.city, data.country]
              .filter(Boolean)
              .join(", ")}
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
        <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
          PAYMENT METHOD
        </h2>
        <p className="font-['Montserrat'] text-base sm:text-xl font-medium text-gray-text">
          All transactions are secure and encrypted.
        </p>
      </div>
      <div className="rounded-lg bg-gray-light outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-secondary">
          <div className="flex items-center gap-2.5">
            <img
              src="/checkout/ri_radio-button-line.svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              alt=""
            />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              Credit card
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/checkout/logos_visaelectron.svg"
              className="h-6 w-8 sm:h-8 sm:w-10"
              alt="Visa"
            />
            <img
              src="/checkout/logos_mastercard.svg"
              className="h-6 w-8 sm:h-8 sm:w-10"
              alt="Mastercard"
            />
            <div className="flex h-6 w-8 sm:h-8 sm:w-10 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-stroke">
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
                +3
              </span>
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
            <img
              src="/checkout/ri_radio-button-line.svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              alt=""
            />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RememberMeSection({
  onPay,
  loading,
}: {
  onPay: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
        REMEMBER ME
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center rounded-lg bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
          <div className="flex items-center gap-2.5">
            <img
              src="/checkout/ri_radio-button-line.svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              alt=""
            />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
              Save my information for a faster checkout
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/checkout/material-symbols_lock-outline.svg"
            className="h-4 w-4"
            alt=""
          />
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
            {" "}
            &amp;{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#0284C7] underline">
            Privacy Policy
          </span>
        </div>
        <button
          onClick={onPay}
          disabled={loading}
          className="w-full h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-primary disabled:opacity-70 disabled:cursor-not-allowed gap-2.5 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-foreground" />
              <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">
                Processing...
              </span>
            </>
          ) : (
            <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">
              Pay now
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const initialCoupon = location.state?.appliedCoupon || null;
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    mapAddress: "",
    latitude: "",
    longitude: "",
  });

  const { isLoading: isCartLoading } = useCart();
  const { data: addresses = [], isLoading: isAddressesLoading } =
    useMyAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const [couponCode, setCouponCode] = useState(initialCoupon?.code || "");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(initialCoupon);
  const [couponError, setCouponError] = useState("");

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    let qualifyingSubtotal = 0;
    let hasMatchingItem = false;
    items.forEach((item) => {
      let isQualifying = true;
      if (
        appliedCoupon.categoryId &&
        item.categoryId !== appliedCoupon.categoryId
      ) {
        isQualifying = false;
      }
      if (
        appliedCoupon.productId &&
        item.productId !== appliedCoupon.productId
      ) {
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

  if (isCartLoading || isAddressesLoading) {
    return (
      <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" strokeWidth={1.5} />
        <p className="font-['Montserrat'] text-lg font-semibold text-foreground">
          Preparing checkout...
        </p>
      </div>
    );
  }

  const shipping = 50; // Flat shipping rate
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email
    ) {
      toast.error("Please fill in all required contact details");
      return;
    }
    if (
      !formData.country ||
      !formData.city ||
      !formData.area ||
      !formData.streetAddress
    ) {
      toast.error("Please fill in all delivery address details");
      return;
    }
    if (!formData.mapAddress) {
      toast.error(
        "Please select and confirm your delivery location on the map",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const orderPayload = {
        ...formData,
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: "COD", // Defaulting to Cash on Delivery for this checkout flow
        items: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
          imageSrc: item.imageSrc || null,
        })),
      };

      console.log("Sending order payload to backend:", orderPayload);
      await api.post("/orders", orderPayload);

      await clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success("Order placed successfully! Your cart has been cleared.");
      navigate("/my-orders");
    } catch (err: any) {
      console.error("Order creation failed:", err);
      const errMsg =
        err.response?.data?.message || "An error occurred during checkout";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col gap-8 sm:gap-12">
          <DeliverySection
            data={formData}
            onChange={handleChange}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(address) => {
              setSelectedAddressId(address.id);

              setFormData((prev) => ({
                ...prev,
                country: address.country,
                city: address.city,
                area: address.area,
                streetAddress: address.streetAddress,
                apartment: address.apartment ?? "",
              }));
            }}
          />
          <PaymentMethodSection />
          <RememberMeSection onPay={handleCheckout} loading={isSubmitting} />
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
