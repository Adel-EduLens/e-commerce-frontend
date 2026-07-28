import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWholesaleCartItems, useWholesaleCartStore } from "../../store/useWholesaleCartStore";
import { useUser } from "../../store/useAuthStore";
import GoogleMapPicker from "../../components/shared/GoogleMap";
import { api } from "../../lib/axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  CheckCircle2,
  Compass,
  Loader2,
  ChevronDown,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyAddresses } from "../../hooks/queries/addressQuery";
import type { Address } from "../../hooks/queries/addressQuery";
import { LoadingSpinner } from "../../components/shared";

/* ─── Sub-components using index.css design tokens ─────────────────────────── */

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
  const { t } = useTranslation("bag");
  const [open, setOpen] = useState(false);
  const addressLabel =
    addresses.length === 1
      ? t("wholesaleCheckout.savedAddress_one", "saved address")
      : t("wholesaleCheckout.savedAddress_other", "saved addresses");

  return (
    <div className="rounded-2xl border border-stroke bg-card shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 interactive-transition hover:bg-gray-light/40"
      >
        <div>
          <h3 className="font-semibold text-foreground">
            {t("wholesaleCheckout.savedAddresses", "Saved Addresses")}
          </h3>
          <p className="text-sm text-gray-text">
            {addresses.length} {addressLabel}
          </p>
        </div>
        <ChevronDown className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
                  className={`rounded-xl border p-4 text-left interactive-transition ${
                    active
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md"
                      : "border-stroke bg-card hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">{address.area}</h4>
                      <p className="mt-1 text-sm text-gray-text">{address.streetAddress}</p>
                      {address.apartment && (
                        <p className="text-sm text-gray-text">
                          {t("wholesaleCheckout.apt", "Apt {{apt}}", { apt: address.apartment })}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-text">
                        {address.city}, {address.country}
                      </p>
                    </div>
                    {active && <CheckCircle2 className="text-primary h-5 w-5" />}
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
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex h-14 sm:h-16 items-center rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-stroke focus-within:outline-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden interactive-transition ${
        disabled ? "opacity-60 bg-gray-light cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-full px-4 font-['Montserrat'] text-sm sm:text-base font-medium text-foreground placeholder:text-gray-text outline-none bg-transparent ${
          disabled ? "cursor-not-allowed text-gray-text" : ""
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
  translationCategory,
}: {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: string[];
  className?: string;
  translationCategory?: "countries" | "cities";
}) {
  const { t } = useTranslation("bag");

  const getOptionLabel = (opt: string) => {
    if (!translationCategory) return opt;
    return t(`wholesaleCheckout.${translationCategory}.${opt}`, opt);
  };

  return (
    <div
      className={`relative flex h-14 sm:h-16 items-center justify-between rounded-lg bg-card outline outline-1 outline-offset-[-1px] outline-stroke focus-within:outline-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden interactive-transition ${className}`}
    >
      <select
        value={value}
        onChange={onChange}
        className="w-full h-full px-4 appearance-none bg-card font-['Montserrat'] text-sm sm:text-base font-medium text-foreground outline-none z-10 cursor-pointer"
      >
        <option value="" disabled className="text-gray-text bg-card">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-card text-foreground">
            {getOptionLabel(opt)}
          </option>
        ))}
        {value && !options.includes(value) && (
          <option value={value} className="bg-card text-foreground">
            {getOptionLabel(value)}
          </option>
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
  const { t } = useTranslation("bag");

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
        {t("wholesaleCheckout.deliveryHeader", "DELIVERY")}
      </h2>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            placeholder={t("wholesaleCheckout.firstName", "First name")}
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          <FormInput
            placeholder={t("wholesaleCheckout.lastName", "Last name")}
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
        <FormInput
          placeholder={t("wholesaleCheckout.phone", "Phone Number")}
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        <FormInput
          placeholder={t("wholesaleCheckout.email", "Email Address")}
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled
        />

        {isAddressesLoading && (
          <div className="p-10 text-center font-['Montserrat'] text-gray-text">
            {t("wholesaleCheckout.loadingAddresses", "Saved Addresses are loading...")}
          </div>
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
            placeholder={t("wholesaleCheckout.country", "Country")}
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            options={["Egypt", "Saudi Arabia", "UAE"]}
            translationCategory="countries"
          />
          <FormSelect
            placeholder={t("wholesaleCheckout.city", "City")}
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            options={["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"]}
            translationCategory="cities"
          />
        </div>
        <FormInput
          placeholder={t("wholesaleCheckout.area", "Area")}
          value={data.area}
          onChange={(e) => onChange("area", e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            placeholder={t("wholesaleCheckout.streetAddress", "Street Address")}
            value={data.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
          />
          <FormInput
            placeholder={t("wholesaleCheckout.apartment", "Apartment")}
            value={data.apartment}
            onChange={(e) => onChange("apartment", e.target.value)}
          />
        </div>

        {/* Map location */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary shrink-0" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {t("wholesaleCheckout.confirmedCoordinates", "Confirmed Delivery Coordinates")}
            </span>
          </div>

          {!data.mapAddress ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-stroke bg-gray-light/30 text-gray-text">
              <Compass className="h-5 w-5 text-gray-text animate-pulse shrink-0" />
              <p className="font-['Montserrat'] text-xs sm:text-sm font-medium">
                {t(
                  "wholesaleCheckout.noLocationConfirmed",
                  "No location confirmed yet. Please select your delivery location on the map below and click "
                )}
                <span className="font-semibold text-foreground">
                  {t("wholesaleCheckout.confirmLocation", "Confirm Location")}
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]">
              <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {t("wholesaleCheckout.confirmedMapAddress", "Confirmed Map Address")}
                    </span>
                    {data.latitude && data.longitude && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-['Montserrat'] text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
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
            {t("wholesaleCheckout.selectOnMap", "Select on Map")}
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
      </div>
    </div>
  );
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: {
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const { t } = useTranslation("bag");
  const formatCurr = (v: number) =>
    `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)} ${t("EGP", "EGP")}`;

  return (
    <div className="w-full flex flex-col gap-8 rounded-2xl bg-card px-4 py-6 outline outline-1 outline-offset-[-1px] outline-stroke shadow-[0_2px_8px_-2px_rgba(30,37,45,0.08)]">
      {/* Item list */}
      <div className="flex flex-col gap-4 border-b border-stroke pb-4 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.color}`}
            className="relative flex items-start gap-4 rounded-xl bg-card border border-stroke p-3 interactive-transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative shrink-0">
              <div className="h-24 w-20 sm:h-28 sm:w-24 overflow-hidden rounded-xl bg-background border border-stroke flex items-center justify-center">
                {item.imageSrc ? (
                  <img
                    className="h-full w-full object-contain"
                    src={item.imageSrc}
                    alt={item.title}
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-text" strokeWidth={1.5} />
                )}
              </div>
              <div className="absolute -right-2 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-xs">
                <span className="font-['Montserrat'] text-xs font-bold text-white">
                  {item.quantity}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    {t("wholesaleBag.wholesale", "Wholesale")}
                  </span>
                  {item.minOrder > 1 && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      {t("wholesaleBag.minOrderPcs", "Min. {{count}} pcs", { count: item.minOrder })}
                    </span>
                  )}
                </div>
                <h4 className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.color && (
                    <span className="inline-flex items-center rounded-lg border border-stroke bg-background px-2.5 py-0.5 font-['Montserrat'] text-xs font-medium text-foreground">
                      {t("wholesaleCheckout.color", "Color:")} <strong className="font-semibold ml-1">{item.color}</strong>
                    </span>
                  )}
                  {item.size && (
                    <span className="inline-flex items-center rounded-lg border border-stroke bg-background px-2.5 py-0.5 font-['Montserrat'] text-xs font-medium text-foreground">
                      Size: <strong className="font-semibold ml-1">{item.size}</strong>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-2 pt-2 border-t border-stroke/50">
                <span className="font-['Montserrat'] text-xs font-medium text-gray-text">
                  {formatCurr(item.unitPrice)} × {item.quantity}
                </span>
                <span className="font-['Montserrat'] text-base sm:text-lg font-bold text-foreground">
                  {formatCurr(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 border-b border-stroke pb-4">
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              {t("wholesaleCheckout.subtotal", "Subtotal")}
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {formatCurr(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              {t("wholesaleCheckout.shipping", "Estimated Shipping")}
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {formatCurr(shipping)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-foreground">
              {t("wholesaleCheckout.taxes", "Estimated Taxes")}
            </span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-foreground">
              {t("wholesaleCheckout.included", "Included")}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-foreground">
            {t("wholesaleCheckout.total", "Total")}
          </span>
          <span className="font-['Montserrat'] text-lg sm:text-xl font-bold text-foreground">
            {formatCurr(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */

export default function WholesaleCheckoutPage() {
  const { t } = useTranslation("bag");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUser();
  const items = useWholesaleCartItems();
  const clearCart = useWholesaleCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: user?.email || "",
    country: "Egypt",
    city: "",
    area: "",
    streetAddress: "",
    apartment: "",
    mapAddress: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user?.email]);

  const { data: addresses = [], isLoading: isAddressesLoading } = useMyAddresses();

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items]
  );

  const shipping = 50;
  const total = subtotal + shipping;

  const productText =
    items.length === 1
      ? t("wholesaleCheckout.product", "product")
      : t("wholesaleCheckout.products", "products");

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isAddressesLoading) {
    return (
      <LoadingSpinner
        text={t("wholesaleCheckout.loadingCheckout", "Preparing wholesale checkout...")}
        containerClassName="h-[75vh]"
        className="h-12 w-12 text-primary"
      />
    );
  }

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (items.length === 0) {
      toast.error(t("wholesaleCheckout.toast.emptyBag", "Your wholesale bag is empty"));
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      toast.error(
        t(
          "wholesaleCheckout.toast.contactDetailsRequired",
          "Please fill in all required contact details"
        )
      );
      return;
    }
    if (!formData.country || !formData.city || !formData.area || !formData.streetAddress) {
      toast.error(
        t(
          "wholesaleCheckout.toast.addressDetailsRequired",
          "Please fill in all delivery address details"
        )
      );
      return;
    }
    if (!formData.mapAddress) {
      toast.error(
        t(
          "wholesaleCheckout.toast.mapLocationRequired",
          "Please select and confirm your delivery location on the map"
        )
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        ...formData,
        subtotal,
        discount: 0,
        shipping,
        total,
        couponCode: null,
        paymentMethod: "COD",
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

      await api.post("/wholesale-orders", orderPayload);

      await clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["wholesale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["wholesale"] });
      queryClient.invalidateQueries({ queryKey: ["wholesales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["trader-products"] });

      toast.success(
        t("wholesaleCheckout.toast.orderSuccess", "Wholesale order placed successfully!")
      );
      navigate("/my-orders");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        t("wholesaleCheckout.toast.orderError", "An error occurred during checkout");
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-background min-h-screen">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-bold text-foreground">
            {t("wholesaleCheckout.headerTitle", "Wholesale Checkout")}
          </h1>
          <p className="font-['Montserrat'] text-sm text-gray-text">
            {t(
              "wholesaleCheckout.headerSubtitle",
              "{{count}} {{productText}} · No payment required now",
              { count: items.length, productText }
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        {/* Left: Delivery form */}
        <div className="flex-1 flex flex-col gap-8 sm:gap-12">
          <DeliverySection
            data={formData}
            onChange={handleChange}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            isAddressesLoading={isAddressesLoading}
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

          {/* Place order section */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-foreground">
                {t("wholesaleCheckout.placeOrderHeader", "PLACE ORDER")}
              </h2>
              <p className="font-['Montserrat'] text-base sm:text-xl font-medium text-gray-text">
                {t(
                  "wholesaleCheckout.placeOrderDescription",
                  "Wholesale orders are processed upon confirmation. Payment will be arranged separately."
                )}
              </p>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 sm:p-5 flex items-start gap-3 shadow-xs">
              <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                  {t(
                    "wholesaleCheckout.codTitle",
                    "Wholesale Order (Cash on Delivery)"
                  )}
                </p>
                <p className="font-['Montserrat'] text-xs text-gray-text mt-1">
                  {t(
                    "wholesaleCheckout.codDescription",
                    "Your order will be confirmed and our team will contact you to arrange delivery and payment terms."
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
                  {t("wholesaleCheckout.agreeTerms", "By submitting your order, you agree to our ")}
                </span>
                <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-info hover:underline cursor-pointer">
                  {t("wholesaleCheckout.termsOfService", "Terms of Service")}
                </span>
                <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-foreground">
                  {t("wholesaleCheckout.and", " & ")}
                </span>
                <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-info hover:underline cursor-pointer">
                  {t("wholesaleCheckout.privacyPolicy", "Privacy Policy")}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-primary hover:opacity-95 active:scale-[0.99] interactive-transition text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 gap-2.5 shadow-md shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-white">
                      {t("wholesaleCheckout.processing", "Processing...")}
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 text-white" />
                    <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-white">
                      {t("wholesaleCheckout.placeOrderButton", "Place Wholesale Order")}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="w-full lg:w-[480px] xl:w-[566px] shrink-0 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
