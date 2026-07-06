import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function OrderSummary() {
  return (
    <div className="w-full flex flex-col gap-8 rounded-2xl bg-white px-4 py-6 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <div className="flex flex-col gap-4 border-b border-[#E0E0E0] pb-4">
        {[1, 2].map((i) => (
          <div key={i} className="relative flex items-start gap-4 rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] p-2">
            <div className="relative shrink-0">
              <img
                className="h-24 w-20 sm:h-28 sm:w-24 rounded object-cover"
                src="/checkout/Rectangle%203.png"
                alt=""
              />
              <div className="absolute -right-2 -top-1 h-6 w-6 overflow-hidden rounded-lg bg-[#0F1115] flex items-center justify-center">
                <span className="font-['Montserrat'] text-sm font-semibold text-[#BBFF63]">1</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-1">
              <div className="font-['Montserrat'] text-base sm:text-xl font-medium text-[#1A1A1A]">
                Amber Blaze Classic Tee
              </div>
              <div className="font-['Montserrat'] text-lg sm:text-2xl font-semibold text-[#1A1A1A]">
                $250
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <input
            placeholder="Enter discount code"
            className="flex-1 h-14 sm:h-16 px-4 font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A] placeholder:text-[#6B7280] outline-none bg-white"
          />
          <button className="flex h-14 sm:h-16 items-center justify-center bg-[#1A1A1A] px-4 sm:px-6">
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-white">Apply</span>
          </button>
        </div>
        <div className="flex flex-col gap-3 border-b border-[#E0E0E0] pb-4">
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A]">Subtotal</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-[#1A1A1A]">$235.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A]">Estimated Shipping</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-[#1A1A1A]">Calculated at Checkout</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A]">Estimated Taxes</span>
            <span className="font-['Montserrat'] text-sm sm:text-base font-bold text-[#1A1A1A]">Calculated at Checkout</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-[#1A1A1A]">Total</span>
          <span className="font-['Montserrat'] text-lg sm:text-xl font-bold text-[#1A1A1A]">$235.00</span>
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

function FormInput({ placeholder, className = "" }: { placeholder: string; className?: string }) {
  return (
    <div className={`flex h-14 sm:h-16 items-center rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] ${className}`}>
      <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#6B7280]">{placeholder}</span>
    </div>
  );
}

function FormSelect({ placeholder, className = "" }: { placeholder: string; className?: string }) {
  return (
    <div className={`flex h-14 sm:h-16 items-center justify-between rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] ${className}`}>
      <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#6B7280]">{placeholder}</span>
      <DropdownArrow />
    </div>
  );
}

function DeliverySection() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-[#1A1A1A]">DELIVERY</h2>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput placeholder="First name" />
          <FormInput placeholder="Last name" />
        </div>
        <FormInput placeholder="Phone Number" />
        <FormInput placeholder="Email Address" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormSelect placeholder="Country" />
          <FormSelect placeholder="City" />
        </div>
        <FormSelect placeholder="Area" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput placeholder="Street Address" />
          <FormInput placeholder="Apartment" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-['Montserrat'] text-sm sm:text-base font-bold text-[#1A1A1A]">Select on Map</div>
          <img
            className="h-48 sm:h-72 lg:h-96 w-full rounded-lg object-cover"
            src="/checkout/%F0%9F%8C%8E%20Map%20Maker_%20Cairo%2C%20Cairo%2C%20Egypt%20(Standard).png"
            alt=""
          />
        </div>
<<<<<<< HEAD

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

        {/* Map picker — click a location and the fields below get filled in automatically */}
        <GoogleMapPicker onSelect={onLocationPick} />

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
              {city && !["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"].includes(city) && (
                <option value={city}>{city}</option>
              )}
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
=======
>>>>>>> 8d57eab12baec90eb6b7e2be392eed45a4f3f1c2
      </div>
    </div>
  );
}

function PaymentMethodSection() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-[#1A1A1A]">PAYMENT METHOD</h2>
        <p className="font-['Montserrat'] text-base sm:text-xl font-medium text-[#6B7280]">
          All transactions are secure and encrypted.
        </p>
      </div>
      <div className="rounded-lg bg-[#EDEDED] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0] overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">Credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/checkout/logos_visaelectron.svg" className="h-6 w-8 sm:h-8 sm:w-10" alt="Visa" />
            <img src="/checkout/logos_mastercard.svg" className="h-6 w-8 sm:h-8 sm:w-10" alt="Mastercard" />
            <div className="flex h-6 w-8 sm:h-8 sm:w-10 items-center justify-center rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">+3</span>
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
        <div className="flex items-center justify-between rounded-b-lg bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">Cash on Delivery</span>
          </div>
          <img src="/checkout/iconoir_hand-cash.svg" className="h-8 w-8 sm:h-10 sm:w-10" alt="" />
        </div>
      </div>
    </div>
  );
}

function RememberMeSection() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h2 className="font-['Montserrat'] text-2xl sm:text-4xl font-bold text-[#1A1A1A]">REMEMBER ME</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center rounded-lg bg-white p-3 sm:p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="flex items-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-5 w-5 sm:h-6 sm:w-6" alt="" />
            <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">
              Save my information for a faster checkout
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/checkout/material-symbols_lock-outline.svg" className="h-4 w-4" alt="" />
          <span className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#6B7280]">
            Secure and encrypted
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">
            By submitting your order, you agree to our{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#0284C7] underline">
            Terms of Service
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#1A1A1A]">
            {" "}&amp;{" "}
          </span>
          <span className="font-['Montserrat'] text-sm sm:text-base font-semibold text-[#0284C7] underline">
            Privacy Policy
          </span>
        </div>
        <button className="w-full h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-[#BBFF63]">
          <span className="font-['Montserrat'] text-lg sm:text-xl font-semibold text-[#1A1A1A]">Pay now</span>
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col gap-8 sm:gap-12">
          <DeliverySection />
          <PaymentMethodSection />
          <RememberMeSection />
        </div>
        <div className="w-full lg:w-[480px] xl:w-[566px] shrink-0 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}