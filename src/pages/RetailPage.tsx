import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsSection from "../components/shared/ProductsSection";
import CategoriesSection from "../components/shared/CategorySection";
import FaqSection from "../components/shared/FaqSection";
import { asset } from "../lib/utils";
function HeroOutlineFan() {
  const outlineRects = [
    { w: 'w-[1245.27px]', h: 'h-[1016.09px]', l: 'left-[956.49px]', t: 'top-[-31.55px]' },
    { w: 'w-[1202.33px]', h: 'h-[981.05px]', l: 'left-[977.96px]', t: 'top-[-14.03px]' },
    { w: 'w-[1159.39px]', h: 'h-[946.02px]', l: 'left-[999.43px]', t: 'top-[3.49px]' },
    { w: 'w-[1116.45px]', h: 'h-[910.98px]', l: 'left-[1020.90px]', t: 'top-[21px]' },
    { w: 'w-[1073.51px]', h: 'h-[875.94px]', l: 'left-[1042.37px]', t: 'top-[38.52px]' },
    { w: 'w-[1030.57px]', h: 'h-[840.90px]', l: 'left-[1063.84px]', t: 'top-[56.04px]' },
    { w: 'w-[987.63px]', h: 'h-[805.87px]', l: 'left-[1085.31px]', t: 'top-[73.56px]' },
    { w: 'w-[944.69px]', h: 'h-[770.83px]', l: 'left-[1106.78px]', t: 'top-[91.08px]' },
    { w: 'w-[901.75px]', h: 'h-[735.79px]', l: 'left-[1128.25px]', t: 'top-[108.60px]' },
    { w: 'w-[858.81px]', h: 'h-[700.75px]', l: 'left-[1149.72px]', t: 'top-[126.12px]' },
    { w: 'w-[815.87px]', h: 'h-[665.71px]', l: 'left-[1171.19px]', t: 'top-[143.64px]' },
    { w: 'w-[772.93px]', h: 'h-[630.68px]', l: 'left-[1192.66px]', t: 'top-[161.16px]' },
    { w: 'w-[729.99px]', h: 'h-[595.64px]', l: 'left-[1214.13px]', t: 'top-[178.68px]' },
    { w: 'w-[687.05px]', h: 'h-[560.60px]', l: 'left-[1235.60px]', t: 'top-[196.20px]' },
    { w: 'w-[644.11px]', h: 'h-[525.56px]', l: 'left-[1257.07px]', t: 'top-[213.71px]' },
    { w: 'w-[601.16px]', h: 'h-[490.53px]', l: 'left-[1278.54px]', t: 'top-[231.23px]' },
    { w: 'w-[558.22px]', h: 'h-[455.49px]', l: 'left-[1300.01px]', t: 'top-[248.75px]' },
    { w: 'w-[515.28px]', h: 'h-96', l: 'left-[1321.48px]', t: 'top-[266.27px]' },
    { w: 'w-[472.34px]', h: 'h-96', l: 'left-[1342.95px]', t: 'top-[283.79px]' },
    { w: 'w-96', h: 'h-80', l: 'left-[1364.42px]', t: 'top-[301.30px]' },
    { w: 'w-96', h: 'h-80', l: 'left-[1385.89px]', t: 'top-[318.82px]' },
    { w: 'w-80', h: 'h-72', l: 'left-[1407.36px]', t: 'top-[336.34px]' },
    { w: 'w-72', h: 'h-60', l: 'left-[1428.84px]', t: 'top-[353.86px]' },
    { w: 'w-64', h: 'h-52', l: 'left-[1450.31px]', t: 'top-[371.38px]' },
    { w: 'w-52', h: 'h-44', l: 'left-[1471.78px]', t: 'top-[388.90px]' },
    { w: 'w-44', h: 'h-36', l: 'left-[1493.25px]', t: 'top-[406.42px]' },
    { w: 'w-32', h: 'h-28', l: 'left-[1514.72px]', t: 'top-[423.94px]' },
    { w: 'w-20', h: 'h-16', l: 'left-[1536.19px]', t: 'top-[441.46px]' },
    { w: 'w-11', h: 'h-9', l: 'left-[1557.66px]', t: 'top-[458.98px]' },
  ]

  return (
    <>
      {outlineRects.map((r, i) => (
        <div
          key={i}
          className={`${r.w} ${r.h} ${r.l} ${r.t} absolute rounded-full outline outline-2 outline-offset-[-1px] outline-slate-400/50`}
        />
      ))}
    </>
  )
}

function HeroBanner() {
  return (
    <div className="relative mx-4 sm:mx-6 overflow-hidden rounded-3xl bg-[#fcd34d]">
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:py-16 lg:px-[352px] lg:min-h-[384px]">
        <div className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-5xl font-semibold text-foreground max-w-lg">
          Discover Retail Essentials in One Polished Catalog.
        </div>
      </div>
      <img
        className="hidden lg:block absolute left-[-188px] top-0 h-96 w-[543px] object-cover"
        src={asset("medium-shot-man-posing-with-blue-background-removebg-preview 1.png")}
        alt=""
      />
      <div className="hidden lg:block">
        <HeroOutlineFan />
      </div>
    </div>
  )
}

export default function RetailPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const filterParam = searchParams.get("filter");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, filterParam]);

  if (categoryId || filterParam) {
    return (
      <div className="w-full pt-8 overflow-hidden">
        <HeroBanner />
        <ProductsSection
          title={categoryId ? "Category Results" : "Featured Products"}
          navigateTo="/retail"
          productType="RETAIL"
          query={categoryId ? { categoryId } : { filter: filterParam ?? undefined }}
        />
        <FaqSection />
      </div>
    );
  }

  return (
    <div className="w-full pt-8 overflow-hidden">
      <HeroBanner />
      <ProductsSection
        title="featuredProducts"
        navigateTo="/retail?filter=featured"
        productType="RETAIL"
        query={{ filter: "featured" }}
      />
      <CategoriesSection isRetail={true} />
      <FaqSection />
    </div>
  );
}
