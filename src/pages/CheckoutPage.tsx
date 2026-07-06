import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Lock, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { api } from "../lib/axios";
import GoogleMapPicker, { type PickedLocation } from "../components/GoogleMap";

type PaymentMethod = "credit" | "cod";

const formatCurrency = (v: number) => `${v.toLocaleString()} EGP`;

/* ───────────────────── Order Summary (right) ───────────────────── */

function OrderSummary({
  subtotal,
  discount,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
}: {
  subtotal: number;
  discount: number;
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  onApplyDiscount: () => void;
}) {
  const items = useCartStore((s) => s.items);
  const shipping = 50;
  const total = subtotal - discount + shipping;

  return (
    <div className="w-full lg:w-[420px] shrink-0">
      <div className="rounded-3xl border border-stroke bg-card p-6 space-y-5 lg:sticky lg:top-28">
        <h3 className="font-['Montserrat'] text-xl font-bold text-foreground">
          Order Summary
        </h3>

        {/* Items */}
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="relative w-20 h-24 rounded-xl bg-gray-light overflow-hidden shrink-0">
                {item.imageSrc && (
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute -top-0.5 right-0 w-6 h-6 rounded-bl-lg bg-[#0F1115] flex items-center justify-center">
                  <span className="font-['Montserrat'] text-xs font-semibold text-[#BBFF63]">
                    {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-['Montserrat'] text-sm font-semibold text-foreground truncate">
                  {item.title}
                </div>
                <div className="font-['Montserrat'] text-xs text-gray-text mt-0.5">
                  Size: {item.size} · {item.color}
                </div>
                <div className="font-['Montserrat'] text-base font-bold text-foreground mt-1">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-stroke" />

        {/* Discount */}
        <div className="flex items-stretch rounded-xl overflow-hidden border border-stroke">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => onDiscountCodeChange(e.target.value)}
            placeholder="Enter discount code"
            className="flex-1 px-4 py-3 bg-background font-['Montserrat'] text-sm text-foreground placeholder:text-gray-text focus:outline-none"
          />
          <button
            type="button"
            onClick={onApplyDiscount}
            className="px-5 bg-foreground text-background font-['Montserrat'] text-sm font-semibold hover:opacity-90 transition shrink-0"
          >
            Apply
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-3">
          <div className="flex justify-between font-['Montserrat'] text-sm">
            <span className="font-medium text-foreground">Subtotal</span>
            <span className="font-bold text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between font-['Montserrat'] text-sm">
              <span className="font-medium text-green-600">Discount</span>
              <span className="font-bold text-green-600">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-['Montserrat'] text-sm">
            <span className="font-medium text-foreground">Shipping</span>
            <span className="font-bold text-foreground">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between font-['Montserrat'] text-sm">
            <span className="font-medium text-foreground">Estimated Taxes</span>
            <span className="font-bold text-gray-text">Included</span>
          </div>
        </div>

        <hr className="border-stroke" />

        <div className="flex justify-between font-['Montserrat'] text-xl font-bold text-foreground">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Delivery Section ───────────────────── */

function DeliverySection({
  firstName, setFirstName,
  lastName, setLastName,
  phone, setPhone,
  email, setEmail,
  country, setCountry,
  city, setCity,
  area, setArea,
  streetAddress, setStreetAddress,
  apartment, setApartment,
  onLocationPick,
}: {
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  city: string; setCity: (v: string) => void;
  area: string; setArea: (v: string) => void;
  streetAddress: string; setStreetAddress: (v: string) => void;
  apartment: string; setApartment: (v: string) => void;
  onLocationPick: (loc: PickedLocation) => void;
}) {
  return (
    <div className="rounded-3xl border border-stroke bg-card p-6 sm:p-8 space-y-6">
      <h2 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        DELIVERY
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
          />
        </div>

        {/* Phone */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
        />

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
        />

        {/* Country / City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-14 rounded-xl border border-stroke bg-background px-4 pr-10 font-['Montserrat'] text-base text-foreground appearance-none focus:outline-none focus:border-foreground transition"
            >
              <option value="Egypt">Egypt</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">UAE</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-text pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-14 rounded-xl border border-stroke bg-background px-4 pr-10 font-['Montserrat'] text-base text-foreground appearance-none focus:outline-none focus:border-foreground transition"
            >
              <option value="">City</option>
              <option value="Cairo">Cairo</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Giza">Giza</option>
              <option value="Mansoura">Mansoura</option>
              <option value="Tanta">Tanta</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-text pointer-events-none" />
          </div>
        </div>

        {/* Area */}
        <div className="relative">
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area"
            className="w-full h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
          />
        </div>

        {/* Street / Apartment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Street Address"
            className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
          />
          <input
            type="text"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="Apartment"
            className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="space-y-3">
        <div className="font-['Montserrat'] text-base font-bold text-foreground flex items-center gap-2">
          📍 Select on Map
          <span className="font-['Montserrat'] text-xs font-normal text-gray-text">
            — click to auto-fill your address
          </span>
        </div>
        <GoogleMapPicker
          onLocationPick={onLocationPick}
          searchQuery={[streetAddress, area, city, country].filter(Boolean).join(", ")}
        />
      </div>
    </div>
  );
}

/* ───────────────────── Payment Method ───────────────────── */

function PaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
  cardNumber, setCardNumber,
  expiryDate, setExpiryDate,
  securityCode, setSecurityCode,
  nameOnCard, setNameOnCard,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (v: PaymentMethod) => void;
  cardNumber: string; setCardNumber: (v: string) => void;
  expiryDate: string; setExpiryDate: (v: string) => void;
  securityCode: string; setSecurityCode: (v: string) => void;
  nameOnCard: string; setNameOnCard: (v: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-stroke bg-card p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
          PAYMENT METHOD
        </h2>
        <p className="font-['Montserrat'] text-base font-medium text-gray-text mt-1">
          All transactions are secure and encrypted.
        </p>
      </div>

      {/* Credit Card option */}
      <div className="rounded-xl border border-stroke overflow-hidden">
        <button
          type="button"
          onClick={() => setPaymentMethod("credit")}
          className={`w-full flex items-center justify-between p-4 transition ${paymentMethod === "credit" ? "bg-gray-light" : "bg-card hover:bg-gray-light/50"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "credit" ? "border-foreground" : "border-stroke"
              }`}>
              {paymentMethod === "credit" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
            </div>
            <CreditCard className="h-5 w-5 text-foreground" />
            <span className="font-['Montserrat'] text-base font-semibold text-foreground">
              Credit card
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/checkout/logos_visaelectron.svg" className="h-7 w-9" alt="Visa" />
            <img src="/checkout/logos_mastercard.svg" className="h-7 w-9" alt="Mastercard" />
          </div>
        </button>

        {paymentMethod === "credit" && (
          <div className="p-4 bg-gray-light space-y-4 border-t border-stroke">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card number"
              className="w-full h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM / YY"
                className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
              />
              <input
                type="text"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Security code"
                className="h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
              />
            </div>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder="Name on card"
              className="w-full h-14 rounded-xl border border-stroke bg-background px-4 font-['Montserrat'] text-base text-foreground placeholder:text-gray-text focus:outline-none focus:border-foreground transition"
            />
          </div>
        )}
      </div>

      {/* Cash on Delivery */}
      <button
        type="button"
        onClick={() => setPaymentMethod("cod")}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${paymentMethod === "cod" ? "border-foreground bg-gray-light" : "border-stroke bg-card hover:bg-gray-light/50"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-foreground" : "border-stroke"
            }`}>
            {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
          </div>
          <Banknote className="h-5 w-5 text-foreground" />
          <span className="font-['Montserrat'] text-base font-semibold text-foreground">
            Cash on Delivery
          </span>
        </div>
      </button>
    </div>
  );
}

/* ───────────────────── Remember Me + Pay ───────────────────── */

function RememberMeSection({
  saveInfo,
  setSaveInfo,
  onPayNow,
  isSubmitting,
}: {
  saveInfo: boolean;
  setSaveInfo: (v: boolean) => void;
  onPayNow: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="rounded-3xl border border-stroke bg-card p-6 sm:p-8 space-y-6">
      <h2 className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-foreground">
        REMEMBER ME
      </h2>

      <button
        type="button"
        onClick={() => setSaveInfo(!saveInfo)}
        className="w-full flex items-center gap-3 p-4 rounded-xl border border-stroke bg-background transition hover:bg-gray-light"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${saveInfo ? "border-foreground" : "border-stroke"
          }`}>
          {saveInfo && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
        </div>
        <span className="font-['Montserrat'] text-base font-semibold text-foreground">
          Save my information for a faster checkout
        </span>
      </button>

      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-gray-text" />
        <span className="font-['Montserrat'] text-sm font-medium text-gray-text">
          Secure and encrypted
        </span>
      </div>

      {/* Terms + Pay */}
      <div className="space-y-4">
        <p className="text-center font-['Montserrat'] text-sm font-semibold text-foreground">
          By submitting your order, you agree to our{" "}
          <span className="text-[#0284C7] underline cursor-pointer">Terms of Service</span>
          {" "}&{" "}
          <span className="text-[#0284C7] underline cursor-pointer">Privacy Policy</span>
        </p>

        <button
          type="button"
          onClick={onPayNow}
          disabled={isSubmitting}
          className="w-full h-16 rounded-2xl bg-[#BBFF63] font-['Montserrat'] text-xl font-semibold text-[#1A1A1A] hover:bg-[#a8e854] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {isSubmitting ? "Processing..." : "Pay now"}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── Main CheckoutPage ───────────────────── */

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  // Delivery
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  // Discount
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Remember me
  const [saveInfo, setSaveInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!items.length) {
      navigate("/bag");
    }
  }, [items, navigate]);

  const subtotal = useMemo(
    () => items.reduce((t, i) => t + i.unitPrice * i.quantity, 0),
    [items]
  );

  const handleApplyDiscount = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a discount code");
      return;
    }

    try {
      const { data } = await api.get(`/coupons/validate/${code}`);
      const coupon = data.data;

      const matchingItems = items.filter((item) => {
        if (!coupon.categoryId && !coupon.productId) return true;
        if (coupon.productId && item.productId === coupon.productId) return true;
        if (coupon.categoryId && item.categoryId === coupon.categoryId) return true;
        return false;
      });

      if (!matchingItems.length) {
        toast.error("This coupon does not apply to any items in your order");
        return;
      }

      const discountAmount = matchingItems.reduce(
        (total, item) => total + (item.unitPrice * (coupon.discount / 100)) * item.quantity,
        0
      );

      setDiscount(discountAmount);
      toast.success(`Coupon applied: ${coupon.discount}% OFF`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid coupon code";
      toast.error(msg);
    }
  };

  const handlePayNow = () => {
    // Validate delivery
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!city) {
      toast.error("Please select your city");
      return;
    }
    if (!streetAddress.trim()) {
      toast.error("Please enter your street address");
      return;
    }

    // Validate payment
    if (paymentMethod === "credit") {
      if (!cardNumber.trim()) {
        toast.error("Please enter your card number");
        return;
      }
      if (!expiryDate.trim()) {
        toast.error("Please enter the expiration date");
        return;
      }
      if (!securityCode.trim()) {
        toast.error("Please enter the security code");
        return;
      }
      if (!nameOnCard.trim()) {
        toast.error("Please enter the name on card");
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      toast.success("Order placed successfully! 🎉");
      navigate("/");
    }, 1500);
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8 bg-background min-h-screen">
      {/* Back button */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/bag")}
          className="flex items-center gap-2 text-gray-text hover:text-foreground transition font-['Montserrat'] text-sm font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Bag
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left – Delivery + Payment + Remember Me */}
        <div className="flex-1 space-y-8">
          <DeliverySection
            firstName={firstName} setFirstName={setFirstName}
            lastName={lastName} setLastName={setLastName}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
            country={country} setCountry={setCountry}
            city={city} setCity={setCity}
            area={area} setArea={setArea}
            streetAddress={streetAddress} setStreetAddress={setStreetAddress}
            apartment={apartment} setApartment={setApartment}
            onLocationPick={(loc) => {
              if (loc.city) setCity(loc.city);
              if (loc.area) setArea(loc.area);
              if (loc.streetAddress) setStreetAddress(loc.streetAddress);
              toast.success("Address filled from map pin");
            }}
          />
          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardNumber={cardNumber} setCardNumber={setCardNumber}
            expiryDate={expiryDate} setExpiryDate={setExpiryDate}
            securityCode={securityCode} setSecurityCode={setSecurityCode}
            nameOnCard={nameOnCard} setNameOnCard={setNameOnCard}
          />
          <RememberMeSection
            saveInfo={saveInfo}
            setSaveInfo={setSaveInfo}
            onPayNow={handlePayNow}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right – Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          discountCode={discountCode}
          onDiscountCodeChange={setDiscountCode}
          onApplyDiscount={handleApplyDiscount}
        />
      </div>
    </div>
  );
}
