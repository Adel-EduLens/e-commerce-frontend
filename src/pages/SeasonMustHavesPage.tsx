import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from '../components/shared';

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

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

function DownCircle() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
      <AssetImage
        file="weui_arrow-filled-1.svg"
        className="absolute left-[4px] top-[10px] h-3 w-6"
      />
    </div>
  );
}

function FilterButton({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div
      className={`${wide ? "w-44 justify-between" : "justify-center gap-2"} flex items-center rounded-2xl bg-[#EDEDED] p-4`}
    >
      <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
        {label}
      </div>
      <DownCircle />
    </div>
  );
}

function Filters() {
  return (
    <div className="absolute left-[24px] top-[396px] inline-flex w-[1392px] flex-col items-start justify-start gap-3">
      <div className="self-stretch font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="self-stretch inline-flex items-center justify-between">
        <div className="flex items-center justify-start gap-4">
          <FilterButton label="Sort by" />
          <FilterButton label="Filter by" wide />
        </div>
        <div className="flex w-96 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
          <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            Search
          </div>
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
            <AssetImage
              file="mynaui_search.svg"
              className="absolute left-[8px] top-[8px] h-6 w-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="absolute left-[170px] top-[8px] inline-flex items-center justify-start gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <AssetImage
          key={index}
          file="material-symbols_star.svg"
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}

function ProductInfo({ variant = false }: { variant?: boolean }) {
  return (
    <div
      className={`absolute left-[8px] h-24 w-80 rounded-lg bg-white ${
        variant
          ? "top-[282px] outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]"
          : "top-[274px]"
      }`}
    >
      <Stars />
      <div className="absolute left-[8px] top-[8px] w-40 font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
        Amber Blaze Classic Tee
      </div>
      <div className="absolute left-[8px] top-[66.50px] font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
        XS - XXL
      </div>
      <div className="absolute left-[246px] top-[62px] font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        $250
      </div>
    </div>
  );
}

function ProductCard({ variant = false }: { variant?: boolean }) {
  if (variant) {
    return (
      <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-[#BEA1DF] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
        <div className="absolute left-[8px] top-[8px] h-96 w-80 overflow-hidden rounded-lg bg-[#BEA1DF]">
          <AssetImage
            file="medium-shot-man-posing-with-blue-background-removebg-preview 1.png"
            className="absolute left-[23px] top-0 h-[404px] w-[269px]"
          />
          <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
            <AssetImage
              file="mdi_heart.svg"
              className="absolute left-[8px] top-[8px] h-6 w-6"
            />
          </div>
        </div>
        <ProductInfo variant />
      </div>
    );
  }

  return (
    <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="absolute left-[8px] top-[8px] h-64 w-80 overflow-hidden rounded-lg bg-[#F9FAFB]">
        <AssetImage
          file="medium-shot-man-posing-with-blue-background-removebg-preview 1.png"
          className="absolute left-[34px] top-0 h-[371px] w-[247px]"
        />
        <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <AssetImage
            file="mdi_heart.svg"
            className="absolute left-[8px] top-[8px] h-6 w-6"
          />
        </div>
      </div>
      <ProductInfo />
    </div>
  );
}

function ProductRow({ top }: { top: number }) {
  return (
    <div
      className="absolute left-[24px] inline-flex w-[1392px] flex-col items-start justify-start gap-6"
      style={{ top }}
    >
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        <ProductCard />
        <ProductCard variant />
        <ProductCard variant />
        <ProductCard />
      </div>
    </div>
  );
}



export default function SeasonMustHavesPage() {
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
    <div className="relative h-[2226px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      
      <Navbar />
      <div className="absolute left-[24px] top-[122px] w-[909px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        This Season’s Must-Haves
      </div>
      <Filters />
      <ProductRow top={552} />
      <ProductRow top={977} />
      <ProductRow top={1402} />
      <Footer top="top-[1784px]" />
    </div>
  );
}
