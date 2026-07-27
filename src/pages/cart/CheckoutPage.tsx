import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore, type CartItem } from "../../store/useCartStore";
import { useCart } from "../../hooks/useCart";
import { useUser } from "../../store/useAuthStore";
import GoogleMapPicker from "../../components/shared/GoogleMap";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  MapPin,
  CheckCircle2,
  Compass,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMyAddresses, type Address } from "../../hooks/queries/addressQuery";
import {
  useShippingCountries,
  useShippingCities,
  type ShippingCountry,
  type ShippingCity,
} from "../../hooks/queries/shippingQuery";
import { LoadingSpinner } from "../../components/shared";
import { couponAppliesToItem, type Coupon } from "../../lib/couponUtils";

// =======================================================
// TYPES & PROPS (STRICT - NO ANY)
// =======================================================

type SavedAddressesSectionProps = {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
};

type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discountAmount: number;
  total: number;
  couponCode: string;
  setCouponCode: (val: string) => void;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (val: Coupon | null) => void;
  couponError: string;
  setCouponError: (val: string) => void;
  isGiftCardOnly?: boolean;
};

type SelectOption = { label: string; value: string } | string;

type FormSelectProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  className?: string;
  disabled?: boolean;
};

type FormInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
};

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
};

type DeliverySectionProps = {
  data: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onCountryChange: (countryName: string) => void;
  addresses: Address[];
  isAddressesLoading?: boolean;
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
  countries: ShippingCountry[];
  availableCities: ShippingCity[];
  isCountriesLoading: boolean;
  isCitiesLoading: boolean;
  isGiftCardOnly?: boolean;
};

// =======================================================
// SUB-COMPONENTS
// =======================================================

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
                  className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md"
                      : "border-stroke bg-card hover:border-primary/40"
                  }`}
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
  isGiftCardOnly = false,
}: OrderSummaryProps) {
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const { data } = await api.get<{ data: Coupon }>(
        `/coupons/validate/${couponCode.trim().toUpperCase()}`
      );
      const coupon = data?.data;
      if (coupon) {
        if (coupon.type === "influencer") {
          setAppliedCoupon(coupon);
          toast.success(`Coupon "${coupon.code}" applied!`);
        } else {
          const appliesToCart = items.some((item) =>
            couponAppliesToItem(coupon, item)
          );

          if (!appliesToCart) {
            setCouponError(
              "This coupon does not apply to the items in your cart"
            );
            toast.error("This coupon does not apply to the items in your cart");
            setAppliedCoupon(null);
            return;
          }

          setAppliedCoupon(coupon);
          toast.success(`Coupon "${coupon.code}" applied!`);
        }
      } else {
        setCouponError("Invalid coupon code");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || "Failed to validate coupon";
      setCouponError(msg);
      toast.error(msg);
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const formatCurrency = (v: number) => `EGP ${v.toFixed(2)}`;

  return (
    <div className="w-full flex flex-col gap-8 rounded-2xl bg-card px-4 py-6 outline outline-1 outline-offset-[-1px] outline-stroke">
      <div className="flex flex-col gap-4 border-b border-stroke pb-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size || "none"}-${item.color || "none"}`}
            className="relative flex items-start gap-4 rounded-lg bg-card shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] p-2"
          >
            <div className="relative shrink-0">
              <img
                className="h-24 w-20 sm:h-28 sm:w-24 rounded object-cover bg-gray-100"
                src={item.imageSrc || "/checkout/Rectangle%203.png"}
                alt={item.title}
              />
              <div className="absolute -right-2 -top-1 h-6 w-6 overflow-hidden rounded-lg bg-secondary flex items-center justify-center">
                <span className="font-['Montserrat'] text-sm font-semibold text-primary">
                  {item.quantity}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-1">
              <div className="font-['Montserrat'] text-base sm:text-xl font-medium text-foreground">
                {item.title}
              </div>
              {item.productType !== "GIFT_CARD" &&
                item.size &&
                item.color &&
                item.size !== "Default" &&
                item.color !== "Default" && (
                  <div className="font-['Montserrat'] text-sm font-medium text-gray-500">
                    Size: {item.size} &middot; Color: {item.color}
                  </div>
                )}
              <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-foreground">
                {formatCurrency(item.unitPrice * item.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {!isGiftCardOnly && (
          <>
            <div className="flex items-center overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke">
              <input
                placeholder="Enter discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isValidating || !!appliedCoupon}
                className="flex-1 h-14 sm:h-16 px-4 font-['Montserrat'] text-sm sm:text-base font-medium text-foreground placeholder:text-gray-text outline-none bg-card disabled:bg-gray-50"
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
                  className="flex h-14 sm:h-16 items-center justify-center bg-primary px-4 sm:px-6 disabled:opacity-50"
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
          </>
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
          {!isGiftCardOnly && (
            <div className="flex items-center justify-between">
              <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
                Estimated Shipping
              </span>
              <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
                {formatCurrency(shipping)}
              </span>
            </div>
          )}
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
  disabled = false,
}: FormInputProps) {
  return (
    <div
      className={`flex h-14 sm:h-16 items-center rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden transition-colors ${
        disabled
          ? "bg-gray-100 dark:bg-zinc-800/80 cursor-not-allowed"
          : "bg-card"
      } ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-full px-4 font-['Montserrat'] text-sm sm:text-base font-medium placeholder:text-gray-text outline-none disabled:cursor-not-allowed bg-transparent ${
          disabled ? "text-gray-500 dark:text-gray-400 font-semibold" : "text-foreground"
        }`}
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
  disabled = false,
}: FormSelectProps) {
  return (
    <div
      className={`relative flex h-14 sm:h-16 items-center justify-between rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-stroke overflow-hidden ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-full px-4 appearance-none bg-transparent font-['Montserrat'] text-sm sm:text-base font-medium text-foreground outline-none z-10 disabled:cursor-not-allowed"
      >
        <option value="" disabled className="text-gray-text">
          {placeholder}
        </option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
        {value &&
          !options.some(
            (opt) => (typeof opt === "string" ? opt : opt.value) === value
          ) && <option value={value}>{value}</option>}
      </select>
      <div className="absolute right-4 z-0 pointer-events-none">
        <DropdownArrow />
      </div>
    </div>
  );
}

function DeliverySection({
  data,
  onChange,
  onCountryChange,
  addresses,
  selectedAddressId,
  isAddressesLoading,
  onSelectAddress,
  countries,
  availableCities,
  isCountriesLoading,
  isCitiesLoading,
  isGiftCardOnly = false,
}: DeliverySectionProps) {
  const countryOptions = useMemo(() => {
    return countries.map((c) => ({
      label: c.code ? `${c.name} (${c.code})` : c.name,
      value: c.name,
    }));
  }, [countries]);

  const cityOptions = useMemo(() => {
    return availableCities.map((c) => ({
      label: `${c.name} (${c.shippingCost} EGP)`,
      value: c.name,
    }));
  }, [availableCities]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
        {isGiftCardOnly ? "USER INFORMATION" : "DELIVERY"}
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
          disabled={true}
        />

        {!isGiftCardOnly && (
          <>
            {isAddressesLoading && (
              <div className="p-6 text-center text-sm text-gray-text">
                Saved Addresses are loading...
              </div>
            )}
            {!isAddressesLoading && addresses && addresses.length > 0 && (
              <SavedAddressesSection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelect={onSelectAddress}
              />
            )}

            {/* Dynamic Country & City Select Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormSelect
                placeholder={
                  isCountriesLoading ? "Loading countries..." : "Select Country"
                }
                value={data.country}
                onChange={(e) => onCountryChange(e.target.value)}
                options={countryOptions}
                disabled={isCountriesLoading || countryOptions.length === 0}
              />
              <FormSelect
                placeholder={
                  !data.country
                    ? "Select Country first"
                    : isCitiesLoading
                    ? "Loading cities..."
                    : cityOptions.length === 0
                    ? "No cities available"
                    : "Select City"
                }
                value={data.city}
                onChange={(e) => onChange("city", e.target.value)}
                options={cityOptions}
                disabled={
                  !data.country || isCitiesLoading || cityOptions.length === 0
                }
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
          </>
        )}
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
            <div className="flex h-6 w-8 sm:h-8 sm:w-10 items-center justify-center rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-stroke">
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
        <div className="flex items-center justify-between rounded-b-lg bg-card p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
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
        <div className="flex items-center rounded-lg bg-card p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-stroke">
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
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-info underline">
            Terms of Service
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
            {" "}
            &amp;{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-info underline">
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

// =======================================================
// MAIN CHECKOUT PAGE COMPONENT
// =======================================================

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useUser();
  const initialCoupon = (location.state?.appliedCoupon as Coupon | null) || null;
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirectBuy = !!(location.state?.directBuyItem || location.state?.items);
  const checkoutItems: CartItem[] = useMemo(() => {
    if (location.state?.items && Array.isArray(location.state.items) && location.state.items.length > 0) {
      return location.state.items;
    }
    if (location.state?.directBuyItem) {
      return [location.state.directBuyItem];
    }
    return cartItems;
  }, [location.state, cartItems]);

  // Dynamic Shipping Queries
  const { data: countries = [], isLoading: isCountriesLoading } = useShippingCountries();
  const { data: cities = [], isLoading: isCitiesLoading } = useShippingCities();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: user?.email || "",
    country: "",
    city: "",
    area: "",
    streetAddress: "",
    apartment: "",
    mapAddress: "",
    latitude: "",
    longitude: "",
  });

  const { isLoading: isCartLoading } = useCart();
  const { data: addresses = [], isLoading: isAddressesLoading } = useMyAddresses();

  // Auto-populate user email when user is available
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user?.email]);

  // Auto-set initial country once countries load if none selected yet
  useEffect(() => {
    if (countries.length > 0 && !formData.country) {
      const defaultCountry = countries[0];
      const defaultCountryCities = cities.filter((c) => c.countryId === defaultCountry.id);
      setFormData((prev) => ({
        ...prev,
        country: defaultCountry.name,
        city: defaultCountryCities.length > 0 ? defaultCountryCities[0].name : "",
      }));
    }
  }, [countries, cities, formData.country]);

  // Match selected country object
  const selectedCountryObj = useMemo(() => {
    if (!formData.country) return undefined;
    return countries.find(
      (c) =>
        c.name.toLowerCase() === formData.country.trim().toLowerCase() ||
        (c.code && c.code.toLowerCase() === formData.country.trim().toLowerCase())
    );
  }, [countries, formData.country]);

  // Available cities for currently selected country
  const availableCities = useMemo(() => {
    if (!selectedCountryObj) return [];
    return cities.filter((c) => c.countryId === selectedCountryObj.id);
  }, [cities, selectedCountryObj]);

  const isGiftCardOnly = useMemo(() => {
    if (checkoutItems.length === 0) return false;
    return checkoutItems.every(
      (item) => item.productType === "GIFT_CARD" || item.id?.includes("gift-card") || item.productId?.includes("gift-card")
    );
  }, [checkoutItems]);

  // Match selected city object for dynamic shipping cost
  const selectedCityObj = useMemo(() => {
    if (!formData.city) return undefined;
    return availableCities.find(
      (c) => c.name.toLowerCase() === formData.city.trim().toLowerCase()
    );
  }, [availableCities, formData.city]);

  // Calculate dynamic shipping cost based on selected city
  const shipping = useMemo(() => {
    if (isGiftCardOnly) return 0;
    if (selectedCityObj && typeof selectedCityObj.shippingCost === "number") {
      return selectedCityObj.shippingCost;
    }
    return 50; // Fallback shipping cost
  }, [isGiftCardOnly, selectedCityObj]);

  // Redirect back to bag if any wholesale item doesn't meet minimum order
  useEffect(() => {
    if (isCartLoading) return;
    if (checkoutItems.length === 0) return;

    const wholesaleItems = checkoutItems.filter(
      (item) => item.productType === "WHOLESALE" || item.id.includes("-wholesale")
    );
    const groupedWholesale = wholesaleItems.reduce(
      (acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            sum: 0,
            minOrder: item.minOrder || 1,
            title: item.title,
          };
        }
        acc[item.productId].sum += item.quantity;
        return acc;
      },
      {} as Record<string, { sum: number; minOrder: number; title: string }>
    );

    for (const productId in groupedWholesale) {
      const { sum, minOrder, title } = groupedWholesale[productId];
      if (sum < minOrder) {
        toast.error(
          `Cannot access checkout. The total packages for wholesale product "${title}" in your cart (${sum}) is less than the minimum order requirement (${minOrder}).`
        );
        navigate("/bag");
        return;
      }
    }
  }, [checkoutItems, isCartLoading, navigate]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState(initialCoupon?.code || "");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(initialCoupon);
  const [couponError, setCouponError] = useState("");

  const subtotal = useMemo(
    () => checkoutItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [checkoutItems]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === "influencer") {
      return (subtotal * appliedCoupon.discount) / 100;
    }

    let qualifyingSubtotal = 0;
    let hasMatchingItem = false;
    checkoutItems.forEach((item) => {
      if (couponAppliesToItem(appliedCoupon, item)) {
        qualifyingSubtotal += item.unitPrice * item.quantity;
        hasMatchingItem = true;
      }
    });

    if (!hasMatchingItem) {
      return 0;
    }

    return (qualifyingSubtotal * appliedCoupon.discount) / 100;
  }, [appliedCoupon, checkoutItems, subtotal]);

  if (isCartLoading || isAddressesLoading) {
    return (
      <LoadingSpinner
        text="Preparing checkout..."
        containerClassName="h-[75vh]"
        className="h-12 w-12"
      />
    );
  }

  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (newCountryName: string) => {
    const matchingCountry = countries.find(
      (c) => c.name.toLowerCase() === newCountryName.toLowerCase()
    );
    const countryCities = matchingCountry
      ? cities.filter((c) => c.countryId === matchingCountry.id)
      : [];

    const defaultCity = countryCities.length > 0 ? countryCities[0].name : "";

    setFormData((prev) => ({
      ...prev,
      country: newCountryName,
      city: defaultCity,
    }));
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

    if (!isGiftCardOnly) {
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
        toast.error("Please select and confirm your delivery location on the map");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (isGiftCardOnly) {
        const giftCardPayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          items: checkoutItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            title: item.title,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            recipientName: item.recipientName || null,
            recipientEmail: item.recipientEmail || null,
            giftMessage: item.giftMessage || null,
          })),
        };

        await api.post("/gift-cards/purchase", giftCardPayload);

        if (!isDirectBuy) {
          await clearCart();
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        }

        queryClient.invalidateQueries({ queryKey: ["sentGiftCards"] });
        queryClient.invalidateQueries({ queryKey: ["receivedGiftCards"] });

        toast.success("Gift card sent successfully!");
        navigate("/my-gift-cards", { state: { activeTab: "sent" } });
        return;
      }

      const orderPayload = {
        ...formData,
        subtotal,
        discount: discountAmount,
        shipping,
        total,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: "COD",
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
          imageSrc: item.imageSrc || null,
          productType: item.productType || null,
          recipientName: item.recipientName || null,
          recipientEmail: item.recipientEmail || null,
          giftMessage: item.giftMessage || null,
        })),
      };

      await api.post("/orders", orderPayload);

      if (!isDirectBuy) {
        await clearCart();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      toast.success(isDirectBuy ? "Order placed successfully!" : "Order placed successfully! Your cart has been cleared.");
      navigate("/my-orders");
    } catch (err) {
      console.error("Order creation failed:", err);
      const error = err as AxiosError<{ message?: string }>;
      const errMsg =
        error.response?.data?.message || "An error occurred during checkout";
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
            onCountryChange={handleCountryChange}
            addresses={addresses}
            isAddressesLoading={isAddressesLoading}
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
            countries={countries}
            availableCities={availableCities}
            isCountriesLoading={isCountriesLoading}
            isCitiesLoading={isCitiesLoading}
            isGiftCardOnly={isGiftCardOnly}
          />
          <PaymentMethodSection />
          <RememberMeSection onPay={handleCheckout} loading={isSubmitting} />
        </div>
        <div className="w-full lg:w-[480px] xl:w-[566px] shrink-0 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            items={checkoutItems}
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
            isGiftCardOnly={isGiftCardOnly}
          />
        </div>
      </div>
    </div>
  );
}
