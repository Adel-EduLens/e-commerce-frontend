import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from '../components/shared';

const asset = (file: string) => `/home%20page/${encodeURIComponent(file)}`;

function AssetImage({
  file,
  className,
  alt = "",
}: {
  file: string;
  className: string;
  alt?: string;
}) {
  return (
    <img
      className={className}
      src={asset(file)}
      alt={alt}
      draggable={false}
    />
  );
}



function HeroBanner() {
  const outlineRects = [
    { w: "w-[1245.27px]", h: "h-[1016.09px]", l: "left-[956.49px]", t: "top-[-31.55px]" },
    { w: "w-[1202.33px]", h: "h-[981.05px]", l: "left-[977.96px]", t: "top-[-14.03px]" },
    { w: "w-[1159.39px]", h: "h-[946.02px]", l: "left-[999.43px]", t: "top-[3.49px]" },
    { w: "w-[1116.45px]", h: "h-[910.98px]", l: "left-[1020.90px]", t: "top-[21px]" },
    { w: "w-[1073.51px]", h: "h-[875.94px]", l: "left-[1042.37px]", t: "top-[38.52px]" },
    { w: "w-[1030.57px]", h: "h-[840.90px]", l: "left-[1063.84px]", t: "top-[56.04px]" },
    { w: "w-[987.63px]", h: "h-[805.87px]", l: "left-[1085.31px]", t: "top-[73.56px]" },
    { w: "w-[944.69px]", h: "h-[770.83px]", l: "left-[1106.78px]", t: "top-[91.08px]" },
    { w: "w-[901.75px]", h: "h-[735.79px]", l: "left-[1128.25px]", t: "top-[108.60px]" },
    { w: "w-[858.81px]", h: "h-[700.75px]", l: "left-[1149.72px]", t: "top-[126.12px]" },
    { w: "w-[815.87px]", h: "h-[665.71px]", l: "left-[1171.19px]", t: "top-[143.64px]" },
    { w: "w-[772.93px]", h: "h-[630.68px]", l: "left-[1192.66px]", t: "top-[161.16px]" },
    { w: "w-[729.99px]", h: "h-[595.64px]", l: "left-[1214.13px]", t: "top-[178.68px]" },
    { w: "w-[687.05px]", h: "h-[560.60px]", l: "left-[1235.60px]", t: "top-[196.20px]" },
    { w: "w-[644.11px]", h: "h-[525.56px]", l: "left-[1257.07px]", t: "top-[213.71px]" },
    { w: "w-[601.16px]", h: "h-[490.53px]", l: "left-[1278.54px]", t: "top-[231.23px]" },
    { w: "w-[558.22px]", h: "h-[455.49px]", l: "left-[1300.01px]", t: "top-[248.75px]" },
    { w: "w-[515.28px]", h: "h-96", l: "left-[1321.48px]", t: "top-[266.27px]" },
    { w: "w-[472.34px]", h: "h-96", l: "left-[1342.95px]", t: "top-[283.79px]" },
    { w: "w-96", h: "h-80", l: "left-[1364.42px]", t: "top-[301.30px]" },
    { w: "w-96", h: "h-80", l: "left-[1385.89px]", t: "top-[318.82px]" },
    { w: "w-80", h: "h-72", l: "left-[1407.36px]", t: "top-[336.34px]" },
    { w: "w-72", h: "h-60", l: "left-[1428.84px]", t: "top-[353.86px]" },
    { w: "w-64", h: "h-52", l: "left-[1450.31px]", t: "top-[371.38px]" },
    { w: "w-52", h: "h-44", l: "left-[1471.78px]", t: "top-[388.90px]" },
    { w: "w-44", h: "h-36", l: "left-[1493.25px]", t: "top-[406.42px]" },
    { w: "w-32", h: "h-28", l: "left-[1514.72px]", t: "top-[423.94px]" },
    { w: "w-20", h: "h-16", l: "left-[1536.19px]", t: "top-[441.46px]" },
    { w: "w-11", h: "h-9", l: "left-[1557.66px]", t: "top-[458.98px]" },
  ];

  return (
    <div className="absolute left-[24px] top-[151px] h-96 w-[1392px] overflow-hidden rounded-3xl bg-[#C4B5FD]">
      <div className="absolute left-[352px] top-[93px] w-[565px] font-['Montserrat'] text-5xl font-semibold text-[#1A1A1A]">
        From Factory to You – Big Quantities, Bigger Profits.
      </div>
      <img
        className="absolute left-[-188px] top-0 h-96 w-[543px]"
        src="https://placehold.co/543x362"
        alt=""
      />
      {outlineRects.map((r, i) => (
        <div
          key={i}
          className={`${r.w} ${r.h} ${r.l} ${r.t} absolute outline outline-2 outline-offset-[-1px] outline-slate-400/50`}
        />
      ))}
    </div>
  );
}

function FilterDropdown({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <div className={`${wide ? "w-44" : ""} flex items-center ${wide ? "justify-between" : "justify-center gap-2"} rounded-2xl bg-[#EDEDED] p-4`}>
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
        <div className="absolute left-[28px] top-[10px] h-6 w-0 origin-top-left rotate-90 overflow-hidden">
          <AssetImage
            file="weui_arrow-filled-1.svg"
            className="absolute left-0 top-0 h-6 w-6"
          />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="flex w-96 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        Search
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="mynaui_search.svg"
          className="absolute left-[8px] top-[8px] h-6 w-6"
        />
      </div>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <FilterDropdown label="Category" />
          <FilterDropdown label="Size" wide />
          <FilterDropdown label="Color" wide />
          <FilterDropdown label="Price" wide />
        </div>
        <SearchBar />
      </div>
    </div>
  );
}

function DefaultProductCard() {
  return (
    <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="absolute left-[8px] top-[8px] h-64 w-80 overflow-hidden rounded-lg bg-[#F9FAFB]">
        <img
          className="absolute left-[34px] top-0 h-96 w-60"
          src="https://placehold.co/247x371"
          alt=""
        />
        <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <AssetImage
            file="mdi_heart.svg"
            className="absolute left-[8px] top-[8px] h-6 w-6"
          />
        </div>
      </div>
      <div className="absolute left-[16px] top-[288px] w-80 font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
        Amber Blaze Classic Tee
      </div>
      <div className="absolute left-[16px] top-[320px] w-80 font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
        $250-450
      </div>
      <div className="absolute left-[16px] top-[357px] w-80 font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
        Min.order: 50 pieces
      </div>
    </div>
  );
}

function Variant2ProductCard() {
  return (
    <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-[#C4B5FD] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="absolute left-[8px] top-[8px] h-96 w-80 overflow-hidden rounded-lg bg-[#C4B5FD]">
        <img
          className="absolute left-[34px] top-0 h-96 w-60"
          src="https://placehold.co/247x371"
          alt=""
        />
        <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <AssetImage
            file="mdi_heart.svg"
            className="absolute left-[8px] top-[8px] h-6 w-6"
          />
        </div>
      </div>
      <div className="absolute left-[8px] top-[280px] h-28 w-80 rounded-lg bg-white">
        <div className="absolute left-[8px] top-[8px] inline-flex w-72 flex-col items-start justify-start gap-2">
          <div className="self-stretch font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
            Amber Blaze Classic Tee
          </div>
          <div className="self-stretch font-['Montserrat'] text-2xl font-semibold text-[#1A1A1A]">
            $250-450
          </div>
          <div className="self-stretch font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
            Min.order: 50 pieces
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewAllButton() {
  return (
    <div className="inline-flex items-center justify-start gap-2 rounded-2xl bg-[#BBFF63] p-4">
      <div className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
        View All
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-3.svg"
          className="absolute left-[14px] top-[8px] h-6 w-3"
        />
      </div>
    </div>
  );
}

function ProductSection({ title, top }: { title: string; top: string }) {
  return (
    <div className={`absolute left-[24px] ${top} inline-flex w-[1392px] flex-col items-start justify-start gap-10`}>
      <div className="self-stretch font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        {title}
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-8">
        <div className="flex w-full flex-col items-start justify-start gap-6">
          <FilterBar />
          <div className="inline-flex w-full items-center justify-start gap-6">
            <DefaultProductCard />
            <DefaultProductCard />
            <Variant2ProductCard />
            <DefaultProductCard />
          </div>
        </div>
        <ViewAllButton />
      </div>
    </div>
  );
}

function CategoriesSection() {
  const categories = [
    { name: "Men", imgTop: "top-0" },
    { name: "Kids", imgTop: "top-[-84px]" },
    { name: "Women", imgTop: "top-0" },
  ];

  return (
    <div className="absolute left-[24px] top-[1462px] inline-flex w-[1392px] flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Explore Our Categories
      </div>
      <div className="inline-flex w-full items-center justify-start gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="relative h-[547px] w-96 overflow-hidden bg-white">
            <img
              className={`absolute left-0 ${cat.imgTop} h-[672px] w-96`}
              src="https://placehold.co/448x672"
              alt=""
            />
            <div className="absolute left-[88px] top-[471px] h-14 w-72 overflow-hidden bg-white">
              <div className={`absolute ${cat.name === "Women" ? "left-[62px]" : "left-[96px]"} top-[7px] font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]`}>
                {cat.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="absolute left-[24px] top-[3984px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Frequently asked questions
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <img
          className="h-[721px] w-[566px] rounded-3xl"
          src="https://placehold.co/566x721"
          alt=""
        />
        <div className="inline-flex w-[802px] flex-col items-start justify-start gap-8">
          {/* Expanded FAQ */}
          <div className="flex w-full flex-col items-start justify-start gap-8 overflow-hidden rounded-3xl bg-[#1A1A1A] p-8">
            <div className="inline-flex w-full items-center justify-between">
              <div className="font-['Montserrat'] text-2xl font-medium text-[#BBFF63]">
                Can Cancel at any time ?
              </div>
              <div className="relative h-12 w-0 origin-top-left rotate-90 overflow-hidden rounded-full bg-white">
                <AssetImage
                  file="weui_arrow-filled-1.svg"
                  className="absolute left-[12px] top-[18px] h-3 w-6"
                />
              </div>
            </div>
            <div className="inline-flex w-full items-center justify-start">
              <div className="w-[620px] font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
                You can return items within 14 days of receiving your order, as long as they are in their original condition, unused, and with the receipt or proof of purchase. For more details, please visit our &quot;Return Policy&quot; page.
              </div>
            </div>
          </div>
          {/* Collapsed FAQs */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex w-full flex-col items-start justify-start gap-8 overflow-hidden rounded-3xl bg-gray-200 p-8">
              <div className="inline-flex w-full items-center justify-between">
                <div className="font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
                  Can Cancel at any time ?
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
                  <AssetImage
                    file="weui_arrow-filled-3.svg"
                    className="absolute left-[18px] top-[12px] h-6 w-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default function WholesalePage() {
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
    <div className="relative h-[5441px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <HeroBanner />
      <ProductSection title="Best Deals" top="top-[593px]" />
      <CategoriesSection />
      <ProductSection title="Most Popular" top="top-[2246px]" />
      <ProductSection title="Premium Collections" top="top-[3115px]" />
      <FAQSection />
      <Footer top="top-[5059px]" />
    </div>
  );
}
