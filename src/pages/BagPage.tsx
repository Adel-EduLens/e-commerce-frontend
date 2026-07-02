import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer, ProductCard } from "../components/shared";

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

type AssetImageProps = {
  file: string;
  className: string;
  alt?: string;
};

function AssetImage({ file, className, alt = "" }: AssetImageProps) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}

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

function SummaryCard() {
  const totals = [
    ["Subtotal", "$235.00"],
    ["Estimated Shipping", "Calculated at Checkout"],
    ["Estimated Taxes", "Calculated at Checkout"],
  ];

  return (
    <div className="absolute left-[968px] top-[232px] h-[436px] w-[424px] overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <div className="absolute left-[35px] top-[20px] inline-flex items-center justify-start gap-1">
        <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
          Get 20% off $99+ Orders With Code:
        </div>
        <div className="flex items-center justify-center rounded-2xl bg-[#DC2626] px-2 py-1">
          <div className="font-['Montserrat'] text-base font-semibold text-white">
            FREE20
          </div>
        </div>
      </div>
      <div className="absolute left-[16px] top-[68px] inline-flex w-96 items-center justify-start gap-2.5 rounded-lg px-4 py-5 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <div className="font-['Montserrat'] text-base font-medium text-[#6B7280]">
          Enter discount code
        </div>
      </div>
      <div className="absolute left-[364px] top-[68px] inline-flex h-14 items-center justify-center gap-2.5 rounded-br-lg rounded-tr-lg bg-[#1A1A1A] p-2.5">
        <div className="font-['Montserrat'] text-base font-semibold text-white">
          Apply
        </div>
      </div>
      <div className="absolute left-0 top-[152px] h-0 w-96 outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
      {totals.map(([label, value], index) => (
        <div
          key={label}
          className="absolute left-[16px] inline-flex w-96 items-center justify-between"
          style={{ top: 176 + index * 36 }}
        >
          <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
            {label}
          </div>
          <div className="font-['Montserrat'] text-base font-bold text-[#1A1A1A]">
            {value}
          </div>
        </div>
      ))}
      <div className="absolute left-0 top-[292px] h-0 w-96 outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
      <div className="absolute left-[16px] top-[316px] inline-flex w-96 items-center justify-between">
        <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          Total
        </div>
        <div className="font-['Montserrat'] text-xl font-bold text-[#1A1A1A]">
          $235.00
        </div>
      </div>
      <div className="absolute left-[16px] top-[364px] inline-flex h-14 w-96 items-center justify-center gap-2.5 rounded-lg bg-[#1A1A1A] p-2.5">
        <div className="font-['Montserrat'] text-xl font-semibold text-white">
          Proceed to Checkout
        </div>
      </div>
    </div>
  );
}

function BagHeader() {
  return (
    <div className="absolute left-[24px] top-[162px] inline-flex w-[920px] items-center justify-between">
      <div className="flex items-center justify-start gap-6">
        <div className="font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
          MY BAG
        </div>
        <div className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          ( 1 item)
        </div>
      </div>
      <div className="flex items-center justify-start gap-2 rounded-2xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <PlusIcon />
        <div className="font-['Montserrat'] text-base font-semibold text-[#1A1A1A]">
          Add Items
        </div>
      </div>
    </div>
  );
}

function QuantityControl() {
  return (
    <div className="absolute left-0 top-[142px] inline-flex w-32 items-center justify-start gap-4 rounded-3xl bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#EDEDED]">
        <div className="absolute left-[8px] top-[8px] h-6 w-6 overflow-hidden">
          <MinusIcon />
        </div>
      </div>
      <div className="text-end font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
        1
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#EDEDED]">
        <div className="absolute left-[8px] top-[8px] h-6 w-6 overflow-hidden">
          <PlusIcon />
        </div>
      </div>
    </div>
  );
}

function BagItem() {
  return (
    <div className="absolute left-[24px] top-[232px] h-60 w-[920px] rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="absolute left-[864px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <Trash2
          className="absolute left-[8px] top-[8px] h-6 w-6 text-[#1A1A1A]"
          strokeWidth={1.5}
        />
      </div>
      <div className="absolute left-0 top-0 h-60 w-48 overflow-hidden rounded-l-lg bg-[#F9FAFB]">
        <AssetImage
          file="medium-shot-man-posing-with-blue-background-removebg-preview 1.png"
          className="absolute left-[8px] top-0 h-[284px] w-[176px] object-contain"
          alt="Amber Blaze Classic Tee"
        />
      </div>
      <div className="absolute left-[221px] top-[8px] h-48 w-60">
        <div className="absolute left-0 top-0 w-60 whitespace-nowrap font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          Amber Blaze Classic Tee
        </div>
        <div className="absolute left-0 top-[40px] w-60 font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
          $250
        </div>
        <div className="absolute left-0 top-[85px] inline-flex items-center justify-start gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="font-['Montserrat'] text-base text-[#1A1A1A]">
            <span className="font-medium">Size: </span>
            <span className="font-bold">XXL</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <div className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
              Color:
            </div>
            <div className="h-6 w-6 rounded-full bg-[#FECACA]" />
          </div>
        </div>
        <QuantityControl />
      </div>
    </div>
  );
}

function FavoritesSection() {
  return (
    <div className="absolute left-[24px] top-[965px] inline-flex w-[1392px] flex-col items-start justify-start gap-8">
      <div className="relative h-16 w-[920px]">
        <div className="absolute left-0 top-[71px] h-0 w-[920px] outline outline-1 outline-offset-[-0.50px] outline-[#E0E0E0]" />
        <div className="absolute left-0 top-0 inline-flex items-center justify-center border-b-[3px] border-[#1A1A1A] py-4">
          <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
            Favorites
          </div>
        </div>
        <div className="absolute left-[185px] top-[16px] font-['Montserrat'] text-3xl font-bold text-[#6B7280]">
          Recently Viewed
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-6">
        <div className="self-stretch flex flex-col items-start justify-start gap-6">
          <div className="self-stretch inline-flex items-center justify-start gap-6">
            <ProductCard />
            <ProductCard featured />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  );
}



export default function BagPage() {
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
    <div className="relative h-[1949px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <SummaryCard />
      <BagHeader />
      <BagItem />
      <FavoritesSection />
      <Footer top="top-[1507px]" />
    </div>
  );
}
