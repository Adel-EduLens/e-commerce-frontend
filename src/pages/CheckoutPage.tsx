import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";



function OrderSummary() {
  return (
    <div className="absolute left-[850px] top-[122px] inline-flex w-[566px] flex-col items-start justify-start gap-8 rounded-2xl bg-white px-4 py-6 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      {/* Product items */}
      <div className="flex w-[534px] flex-col items-start justify-start gap-4 border-b border-[#E0E0E0] pb-4">
        {/* Product 1 */}
        <div className="relative h-28 self-stretch rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <img
            className="absolute left-0 top-0 h-28 w-24"
            src="/checkout/Rectangle%203.png"
            alt=""
          />
          <div className="absolute left-[126px] top-[25px] inline-flex w-60 flex-col items-start justify-start gap-4">
            <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
              Amber Blaze Classic Tee
            </div>
            <div className="self-stretch font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              $250
            </div>
          </div>
          <div className="absolute left-[88px] top-[1px] h-6 w-6 overflow-hidden rounded-lg bg-[#0F1115]">
            <div className="absolute left-[8px] top-[2px] w-2 font-['Montserrat'] text-base font-semibold text-[#BBFF63]">
              1
            </div>
          </div>
        </div>
        {/* Product 2 */}
        <div className="relative h-28 self-stretch rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <img
            className="absolute left-0 top-0 h-28 w-24"
            src="/checkout/Rectangle%203.png"
            alt=""
          />
          <div className="absolute left-[126px] top-[25px] inline-flex w-60 flex-col items-start justify-start gap-4">
            <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
              Amber Blaze Classic Tee
            </div>
            <div className="self-stretch font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
              $250
            </div>
          </div>
          <div className="absolute left-[88px] top-0 h-6 w-6 overflow-hidden rounded-lg bg-[#0F1115]">
            <div className="absolute left-[8px] top-[2px] w-2 font-['Montserrat'] text-base font-semibold text-[#BBFF63]">
              1
            </div>
          </div>
        </div>
      </div>
      {/* Discount + Totals */}
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        {/* Discount code input */}
        <div className="inline-flex items-center justify-between self-stretch rounded-lg pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
            Enter discount code
          </div>
          <div className="flex h-16 items-center justify-center rounded-br-lg rounded-tr-lg bg-[#1A1A1A] p-2.5">
            <div className="font-['Montserrat'] text-base font-semibold text-white">
              Apply
            </div>
          </div>
        </div>
        {/* Price breakdown */}
        <div className="relative h-40 self-stretch">
          <div className="absolute left-0 top-0 inline-flex w-[534px] flex-col items-start justify-start gap-4 border-b border-[#E0E0E0] pb-4">
            <div className="inline-flex items-center justify-between self-stretch">
              <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
                Subtotal
              </div>
              <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
                $235.00
              </div>
            </div>
            <div className="inline-flex items-center justify-between self-stretch">
              <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
                Estimated Shipping
              </div>
              <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
                Calculated at Checkout
              </div>
            </div>
            <div className="inline-flex items-center justify-between self-stretch">
              <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
                Estimated Taxes
              </div>
              <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
                Calculated at Checkout
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-[140px] font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
            Total
          </div>
          <div className="absolute left-[453px] top-[140px] font-['Montserrat'] text-xl font-bold text-[#1A1A1A]">
            $235.00
          </div>
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

function DeliverySection() {
  return (
    <div className="flex flex-col items-start justify-start gap-8 self-stretch">
      <div className="inline-flex items-center justify-start gap-6">
        <div className="font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
          DELIVERY
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <div className="flex flex-col items-start justify-start gap-6 self-stretch">
          {/* First name / Last name */}
          <div className="inline-flex items-center justify-start gap-6 self-stretch">
            <div className="flex h-16 w-80 items-center justify-start gap-2.5 rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                First name
              </div>
            </div>
            <div className="flex h-16 w-80 items-center justify-start gap-2.5 rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Last name
              </div>
            </div>
          </div>
          {/* Phone Number */}
          <div className="inline-flex h-16 items-center justify-start gap-2.5 self-stretch rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Phone Number
            </div>
          </div>
          {/* Email Address */}
          <div className="inline-flex h-16 items-center justify-start gap-2.5 self-stretch rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Email Address
            </div>
          </div>
          {/* Country / City */}
          <div className="inline-flex items-center justify-start gap-6 self-stretch">
            <div className="flex h-16 w-80 items-center justify-between rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Country
              </div>
              <DropdownArrow />
            </div>
            <div className="flex h-16 w-80 items-center justify-between rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                City
              </div>
              <DropdownArrow />
            </div>
          </div>
          {/* Area */}
          <div className="inline-flex h-16 items-center justify-between self-stretch rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Area
            </div>
            <DropdownArrow />
          </div>
          {/* Street Address / Apartment */}
          <div className="inline-flex items-center justify-start gap-6 self-stretch">
            <div className="flex h-16 w-80 items-center justify-start gap-2.5 rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Street Adress
              </div>
            </div>
            <div className="flex h-16 w-80 items-center justify-start gap-2.5 rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Apartment
              </div>
            </div>
          </div>
        </div>
        {/* Map */}
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <div className="self-stretch font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
            Select on Map
          </div>
          <img
            className="h-96 self-stretch rounded-lg"
            src="/checkout/%F0%9F%8C%8E%20Map%20Maker_%20Cairo%2C%20Cairo%2C%20Egypt%20(Standard).png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSection() {
  return (
    <div className="flex flex-col items-start justify-start gap-8 self-stretch">
      <div className="flex h-20 w-96 flex-col items-start justify-start gap-2">
        <div className="inline-flex items-center justify-start gap-6">
          <div className="font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
            PAYMENT  METHOD
          </div>
        </div>
        <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#6B7280]">
          All transactions are secure and encrypted.
        </div>
      </div>
      <div className="relative h-96 self-stretch rounded-lg bg-[#EDEDED] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        {/* Credit card form fields */}
        <div className="absolute left-[16px] top-[87px] inline-flex w-[652px] flex-col items-start justify-start gap-4">
          <div className="inline-flex h-16 items-center justify-start gap-2.5 self-stretch rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Card number
            </div>
          </div>
          <div className="inline-flex items-center justify-between self-stretch">
            <div className="flex h-16 w-80 items-center justify-start gap-2.5 rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Expiration date (MM / YY)
              </div>
            </div>
            <div className="flex h-16 w-80 items-center justify-between rounded-lg bg-white px-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
                Security code
              </div>
              <DropdownArrow />
            </div>
          </div>
          <div className="inline-flex h-16 items-center justify-start gap-2.5 self-stretch rounded-lg bg-white pl-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Name on card
            </div>
          </div>
        </div>
        {/* Credit card header */}
        <div className="absolute left-[1px] top-0 inline-flex w-[684px] items-center justify-between rounded-tl-lg rounded-tr-lg p-4 outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]">
          <div className="flex items-center justify-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-6 w-6" alt="" />
            <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
              Credit card
            </div>
          </div>
          <div className="flex items-center justify-start gap-2">
            <img src="/checkout/logos_visaelectron.svg" className="h-8 w-10" alt="Visa" />
            <img src="/checkout/logos_mastercard.svg" className="h-8 w-10" alt="Mastercard" />
            <div className="relative h-8 w-10 overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
              <div className="absolute left-[10px] top-[6px] font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
                +3
              </div>
            </div>
          </div>
        </div>
        {/* Cash on Delivery */}
        <div className="absolute left-[1px] top-[362px] inline-flex w-[684px] items-center justify-between rounded-lg bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="flex items-center justify-center gap-2.5">
            <img src="/checkout/ri_radio-button-line.svg" className="h-6 w-6" alt="" />
            <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
              Cash on Delivery
            </div>
          </div>
          <img src="/checkout/iconoir_hand-cash.svg" className="h-10 w-10" alt="" />
        </div>
      </div>
    </div>
  );
}

function RememberMeSection() {
  return (
    <div className="flex flex-col items-end justify-start gap-8 self-stretch">
      <div className="flex flex-col items-start justify-start gap-8 self-stretch">
        <div className="inline-flex items-center justify-start gap-6">
          <div className="font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
            REMEMBER ME
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <div className="inline-flex items-center justify-between self-stretch rounded-lg bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
            <div className="flex items-center justify-center gap-2.5">
              <img src="/checkout/ri_radio-button-line.svg" className="h-6 w-6" alt="" />
              <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
                Save my information for a faster checkout
              </div>
            </div>
          </div>
          <div className="inline-flex items-center justify-start gap-2">
            <img src="/checkout/material-symbols_lock-outline.svg" className="h-4 w-4" alt="" />
            <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
              Secure and encrypted
            </div>
          </div>
        </div>
      </div>
      {/* Terms + Pay now */}
      <div className="flex flex-col items-center justify-center gap-4 self-stretch">
        <div className="self-stretch text-center">
          <span className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            By submitting your order, you agree to our{" "}
          </span>
          <span className="font-['Montserrat'] text-base font-semibold text-[#0284C7] underline">
            Terms of Service
          </span>
          <span className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
            {" "}
            &amp;{" "}
          </span>
          <span className="font-['Montserrat'] text-base font-semibold text-[#0284C7] underline">
            Privacy Policy
          </span>
        </div>
        <div className="inline-flex h-16 items-center justify-center gap-2 self-stretch rounded-2xl bg-[#BBFF63] p-4">
          <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
            Pay now
          </div>
        </div>
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
    <div className="relative w-full overflow-hidden">
      {/* Order Summary - right side */}
      <OrderSummary />
      {/* Left column: Delivery + Payment + Remember Me */}
      <div className="absolute left-0 top-0 inline-flex w-[685px] flex-col items-end justify-start gap-12">
        <DeliverySection />
        <PaymentMethodSection />
        <RememberMeSection />
      </div>
    </div>
  );
}
