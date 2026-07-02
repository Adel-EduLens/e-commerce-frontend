import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const checkoutAsset = (file: string) => `/checkout/${encodeURIComponent(file)}`;
const homeAsset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

function AssetImage({
  file,
  className,
  alt = "",
  base = "checkout",
}: {
  file: string;
  className: string;
  alt?: string;
  base?: "checkout" | "home";
}) {
  const src = base === "home" ? homeAsset(file) : checkoutAsset(file);
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable={false}
    />
  );
}

function ArrowCircle() {
  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
      <AssetImage
        file="weui_arrow-filled.svg"
        className="absolute left-[18px] top-[12px] h-6 w-3"
      />
    </div>
  );
}

function Navbar() {
  const navItems = ["Shop", "Wholesale", "Design Lab", "Dropshipping"];

  return (
    <div className="absolute left-[48px] top-[18px] h-20 w-[1344px] rounded-2xl bg-[#F9FAFB] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <AssetImage
        file="logo gen-z 2 copy 1.png"
        className="absolute left-[16px] top-[16px] h-12 w-[90px]"
        alt="Gen Z"
        base="home"
      />
      <div className="absolute left-[138px] top-[20px] inline-flex items-center justify-start gap-4">
        <div className="flex items-center justify-center gap-2.5 rounded-lg bg-[#BBFF63] px-4 py-2">
          <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
            Home
          </div>
        </div>
        {navItems.map((item) => (
          <div
            key={item}
            className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]"
          >
            {item}
          </div>
        ))}
      </div>
      <div className="absolute left-[1148px] top-[18px] inline-flex items-center justify-start gap-6">
        <AssetImage
          file="material-symbols-light_shopping-bag-outline.svg"
          className="h-11 w-11"
        />
        <AssetImage file="mdi-light_heart.svg" className="h-11 w-11" />
        <AssetImage
          file="iconamoon_profile-light.svg"
          className="h-11 w-11"
        />
      </div>
      <div className="absolute left-[741px] top-[16px] inline-flex w-96 items-center justify-start gap-2 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <AssetImage file="mynaui_search.svg" className="h-8 w-8" />
        <div className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">
          Search
        </div>
      </div>
    </div>
  );
}

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

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="inline-flex w-48 flex-col items-start justify-center gap-4">
      <div className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
        {title}
      </div>
      {items.map((item) => (
        <div
          key={item}
          className="self-stretch font-['Montserrat'] text-2xl font-medium text-[#6B7280]"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  const columns = [
    { title: "About", items: ["About Us", "Design Lab", "Dropship"] },
    { title: "Shop", items: ["Men", "Kids", "Women"] },
    {
      title: "Help",
      items: ["FAQ", "Contact", "Shipping", "Returns", "Track Order"],
    },
    { title: "Legal", items: ["Privacy", "Terms", "Cookies"] },
  ];
  const socials = [
    "prime_twitter.svg",
    "ri_facebook-fill.svg",
    "ic_outline-tiktok.svg",
    "iconoir_instagram.svg",
  ];

  return (
    <div className="absolute left-0 top-[2172px] h-96 w-[1440px] overflow-hidden border-t border-[#E0E0E0]">
      <div className="absolute left-[323px] top-[69px] font-['Montserrat'] text-[250px] font-medium text-gray-500/20">
        GEN Z
      </div>
      <div className="absolute left-[24px] top-[32px] h-96 w-[1392px]">
        <div className="absolute left-0 top-[80px] inline-flex items-start justify-start gap-8">
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              items={column.items}
            />
          ))}
        </div>
        <div className="absolute left-[1096px] top-0 inline-flex items-center justify-start gap-6">
          {socials.map((social) => (
            <div
              key={social}
              className="relative h-14 w-14 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]"
            >
              <AssetImage
                file={social}
                className="absolute left-[12px] top-[12px] h-8 w-8"
              />
            </div>
          ))}
        </div>
        <div className="absolute left-[932px] top-[72px] font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
          SIGN UP FOR DISCOUNTS + UPDATES
        </div>
        <div className="absolute left-0 top-[358px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
          © 2025 GenZ, LLC. All Rights Reserved.
        </div>
        <div className="absolute left-[932px] top-[117px] inline-flex w-[460px] items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
            Phone Number or Email
          </div>
          <ArrowCircle />
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
    <div className="relative h-[2614px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Footer />
      <Navbar />
      {/* Order Summary - right side */}
      <OrderSummary />
      {/* Left column: Delivery + Payment + Remember Me */}
      <div className="absolute left-[23px] top-[122px] inline-flex w-[685px] flex-col items-end justify-start gap-12">
        <DeliverySection />
        <PaymentMethodSection />
        <RememberMeSection />
      </div>
    </div>
  );
}
