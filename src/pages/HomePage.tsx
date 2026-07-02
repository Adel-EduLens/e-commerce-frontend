import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

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

function ArrowCircle({ direction = "right" }: { direction?: "right" | "left" | "down" }) {
  const icon =
    direction === "left"
      ? "weui_arrow-filled-2.svg"
      : direction === "down"
        ? "weui_arrow-filled-1.svg"
        : "weui_arrow-filled-3.svg";
  const iconClass =
    direction === "down"
      ? "absolute left-[12px] top-[18px] h-3 w-6"
      : direction === "left"
        ? "absolute left-[16px] top-[8px] h-8 w-4"
        : "absolute left-[18px] top-[12px] h-6 w-3";

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
      <AssetImage file={icon} className={iconClass} />
    </div>
  );
}

function FilterButton({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className={`${compact ? "justify-center gap-2" : "w-44 justify-between"} flex items-center rounded-2xl bg-[#EDEDED] p-4`}
    >
      <div className="font-['Montserrat'] text-xl font-medium text-[#6B7280]">
        {label}
      </div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
        <AssetImage
          file="weui_arrow-filled-1.svg"
          className="absolute left-[4px] top-[10px] h-3 w-6"
        />
      </div>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-6">
      <div className="self-stretch flex flex-col items-start justify-start gap-4">
        <div className="self-stretch font-['Montserrat'] text-2xl font-bold text-[#1A1A1A]">
          Filter by
        </div>
        <div className="self-stretch inline-flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <FilterButton label="Category" compact />
            <FilterButton label="Size" />
            <FilterButton label="Color" />
            <FilterButton label="Price" />
          </div>
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
        </div>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="absolute left-[170px] top-[8px] inline-flex items-center justify-start gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="relative h-6 w-6 overflow-hidden">
          <AssetImage
            file="material-symbols_star.svg"
            className="absolute left-0 top-0 h-6 w-6"
          />
        </div>
      ))}
    </div>
  );
}

function ProductInfo({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`${featured ? "top-[282px] outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]" : "top-[274px]"} absolute left-[8px] h-24 w-80 rounded-lg bg-white`}
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

function ProductCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-violet-300 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
        <div className="absolute left-[8px] top-[8px] h-96 w-80 overflow-hidden rounded-lg bg-violet-300">
          <AssetImage
            file="medium-shot-man-posing-with-blue-background-removebg-preview 1.png"
            className="absolute left-[23px] top-0 h-[369px] w-[269px]"
          />
          <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
            <AssetImage
              file="mdi_heart.svg"
              className="absolute left-[8px] top-[8px] h-6 w-6"
            />
          </div>
        </div>
        <ProductInfo featured />
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

function ProductGrid({ featuredIndex }: { featuredIndex?: number }) {
  return (
    <div className="w-[1392px] flex flex-col items-center justify-start gap-8">
      <FilterBar />
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCard key={index} featured={featuredIndex === index} />
        ))}
      </div>
      <ViewAllButton />
    </div>
  );
}

function HeroSection() {
  return (
    <>
      <div className="absolute left-[24px] top-[24px] h-[978px] w-[1392px] rounded-3xl bg-[#BBFF63]">
        <div className="absolute left-[625px] top-[162px] h-[480px] w-[480px] rounded-full border-2 border-[#1A1A1A]" />
        <div className="absolute left-[30px] top-[367.19px] h-32 w-[504.79px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-[#1A1A1A]" />
        <div className="absolute left-[24px] top-[121px] inline-flex w-[649px] flex-col items-start justify-start">
          <div className="self-stretch font-['Montserrat'] text-9xl font-bold text-[#1A1A1A]">
            Discover
          </div>
          <div className="relative h-56 w-[517.21px]">
            <div className="absolute left-0 top-[84.19px] h-32 w-[504px] origin-top-left rotate-[-7.42deg] rounded-3xl bg-[#1A1A1A]" />
            <div className="absolute left-[8px] top-0 font-['Montserrat'] text-9xl font-bold text-white">
              fashion
            </div>
          </div>
          <div className="self-stretch font-['Montserrat'] text-7xl font-bold text-[#1A1A1A]">
            Fits Your Story
          </div>
        </div>
        <div className="absolute left-[24px] top-[649px] h-72 w-[597px]">
          <div className="absolute left-0 top-0 h-64 w-[597px] overflow-hidden rounded-3xl bg-[#F9FAFB] opacity-75">
            <div className="absolute left-[24px] top-[50px] h-36 w-80 font-['Inter'] text-2xl font-medium text-[#1A1A1A]">
              step into the spotilght with our latest drop. each piece is made
              to turn heads while keeping you comfortable from day to night.
              <br />
            </div>
            <div className="absolute left-[354px] top-[11px] h-60 w-56 overflow-hidden rounded-2xl">
              <AssetImage
                file="medium-shot-man-posing-with-blue-background 1_2.png"
                className="absolute left-[1px] top-0 h-60 w-[222px]"
              />
            </div>
          </div>
          <div className="absolute left-0 top-[28px] h-64 w-[597px] overflow-hidden rounded-3xl bg-[#F9FAFB]">
            <div className="absolute left-[24px] top-[50px] h-36 w-80 font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
              step into the spotilght with our latest drop. each piece is made
              to turn heads while keeping you comfortable from day to night.
              <br />
            </div>
            <div className="absolute left-[354px] top-[11px] h-60 w-56 overflow-hidden rounded-2xl">
              <AssetImage
                file="medium-shot-man-posing-with-blue-background 1.png"
                className="absolute left-[1px] top-0 h-60 w-[222px]"
              />
            </div>
          </div>
        </div>
        <div className="absolute left-[675px] top-[7px] h-[971px] w-[788px] overflow-hidden">
          <AssetImage
            file="image 1.png"
            className="absolute left-0 top-0 h-[971px] w-[741px]"
          />
        </div>
        <div className="absolute left-[1001px] top-[772px] h-40 w-96 overflow-hidden rounded-3xl bg-[#F9FAFB]">
          <div className="absolute left-[24px] top-[24px] h-28 w-80 font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
            Unlock fresh styles, exclusive drops, and a whole new vibe
            that&apos;s set to dominarte 2025
            <br />
            <br />
          </div>
        </div>
      </div>
      <div className="absolute left-[603px] top-[537px] h-0 w-[554.16px] origin-top-left rotate-[-47.41deg] border-t-2 border-[#1A1A1A]" />
    </>
  );
}

function Navbar() {
  const navItems = ["Shop", "Wholesale", "Design Lab", "Dropshipping"];

  return (
    <div className="absolute left-[48px] top-[48px] h-20 w-[1344px] rounded-2xl bg-[#F9FAFB] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
      <AssetImage
        file="logo gen-z 2 copy 1.png"
        className="absolute left-[16px] top-[16px] h-12 w-[90px]"
        alt="Gen Z"
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
        <AssetImage file="mynaui_search-1.svg" className="h-8 w-8" />
        <div className="font-['Montserrat'] text-base font-semibold text-[#6B7280]">
          Search
        </div>
      </div>
    </div>
  );
}

function CollectionSection() {
  return (
    <div className="absolute left-[24px] top-[1082px] h-[770px] w-[1392px]">
      <div className="absolute left-0 top-0 h-[770px] w-[1029px] overflow-hidden rounded-3xl">
        <AssetImage
          file="image 2.png"
          className="absolute left-0 top-0 h-[770px] w-[1029px]"
        />
        <div className="absolute left-[32px] top-[32px] inline-flex w-80 flex-col items-start justify-start gap-7">
          <div className="self-stretch flex flex-col items-start justify-start gap-5">
            <div className="self-stretch font-['Inter'] text-8xl font-normal leading-[75px] text-white">
              Color of
              <br />
              Summer
              <br />
              Outfit
            </div>
            <div className="self-stretch font-['Inter'] text-lg font-normal leading-6 text-white opacity-80">
              100+ Collections for your outfit inspirations in this summer
            </div>
          </div>
          <div className="inline-flex h-12 w-72 items-center justify-center rounded-[200px] bg-[#1A1A1A] outline outline-1 outline-offset-[-1px]">
            <div className="h-6 w-44 text-center font-['Inter'] text-sm font-medium leading-6 tracking-wide text-white">
              VIEW COLLECTIONS
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[1040px] top-0 inline-flex w-[352px] flex-col items-start justify-start gap-2.5">
        <div className="relative h-[380px] self-stretch overflow-hidden rounded-[40px] bg-[#EDEDED]">
          <AssetImage
            file="image 4.png"
            className="absolute left-0 top-0 h-[380px] w-[352px]"
          />
          <div className="absolute left-[30px] top-[30px] font-['Inter'] text-4xl font-normal leading-10 text-[#1A1A1A]">
            Outdoor
            <br />
            Active
          </div>
        </div>
        <div className="relative h-[380px] self-stretch overflow-hidden rounded-[40px] bg-[#EDEDED]">
          <AssetImage
            file="image 5.png"
            className="absolute left-0 top-0 h-[380px] w-[352px]"
          />
          <div className="absolute left-[30px] top-[30px] font-['Inter'] text-4xl font-normal leading-10 text-[#1A1A1A]">
            Casual
            <br />
            Comfort
          </div>
        </div>
      </div>
    </div>
  );
}

function MustHavesSection() {
  return (
    <div className="absolute left-[24px] top-[1932px] h-[904px] w-[1392px]">
      <div className="absolute left-0 top-0 w-[909px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        This Season’s Must-Haves
      </div>
      <div className="absolute left-0 top-[274px] inline-flex w-[1392px] flex-col items-center justify-start gap-8">
        <FilterBar />
        <div className="self-stretch inline-flex items-center justify-start gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
        <ViewAllButton />
      </div>
    </div>
  );
}

function CategoriesSection() {
  const categories = [
    { label: "Men", file: "image 8.png", labelLeft: "left-[96px]" },
    { label: "Kids", file: "image 9.png", labelLeft: "left-[96px]" },
    { label: "Women", file: "image 7.png", labelLeft: "left-[62px]" },
  ];

  return (
    <div className="absolute left-[24px] top-[2916px] inline-flex w-[1392px] flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Explore Our Categories
      </div>
      <div className="self-stretch inline-flex items-center justify-start gap-6">
        {categories.map((category) => (
          <div
            key={category.label}
            className="relative h-[547px] w-[448px] overflow-hidden bg-white"
          >
            <AssetImage
              file={category.file}
              className="absolute left-0 top-0 h-[547px] w-[448px]"
            />
            <div className="absolute left-[88px] top-[471px] h-14 w-72 overflow-hidden bg-white">
              <div
                className={`absolute ${category.labelLeft} top-[7px] font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]`}
              >
                {category.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendedSection() {
  return (
    <div className="absolute left-[24px] top-[3715px] inline-flex w-[1392px] flex-col items-center justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Recommended for You
      </div>
      <ProductGrid />
    </div>
  );
}

function VoteRings() {
  const rings = [
    ["w-[992.90px] h-[992.90px]", "left-[894px] top-[-479px]"],
    ["w-[958.66px] h-[958.66px]", "left-[911.12px] top-[-461.88px]"],
    ["w-[924.42px] h-[924.42px]", "left-[928.24px] top-[-444.76px]"],
    ["w-[890.19px] h-[890.19px]", "left-[945.36px] top-[-427.64px]"],
    ["w-[855.95px] h-[855.95px]", "left-[962.48px] top-[-410.52px]"],
    ["w-[821.71px] h-[821.71px]", "left-[979.59px] top-[-393.41px]"],
    ["w-[787.47px] h-[787.47px]", "left-[996.71px] top-[-376.29px]"],
    ["w-[753.23px] h-[753.23px]", "left-[1013.83px] top-[-359.17px]"],
    ["w-[719px] h-[719px]", "left-[1030.95px] top-[-342.05px]"],
    ["w-[684.76px] h-[684.76px]", "left-[1048.07px] top-[-324.93px]"],
    ["w-[650.52px] h-[650.52px]", "left-[1065.19px] top-[-307.81px]"],
    ["w-[616.28px] h-[616.28px]", "left-[1082.31px] top-[-290.69px]"],
    ["w-[582.04px] h-[582.04px]", "left-[1099.43px] top-[-273.57px]"],
    ["w-[547.81px] h-[547.81px]", "left-[1116.55px] top-[-256.45px]"],
    ["w-[513.57px] h-[513.57px]", "left-[1133.67px] top-[-239.33px]"],
    ["w-[479.33px] h-[479.33px]", "left-[1150.78px] top-[-222.22px]"],
    ["h-96 w-96", "left-[1167.90px] top-[-205.10px]"],
    ["h-96 w-96", "left-[1185.02px] top-[-187.98px]"],
    ["h-96 w-96", "left-[1202.14px] top-[-170.86px]"],
    ["h-80 w-80", "left-[1219.26px] top-[-153.74px]"],
    ["h-80 w-80", "left-[1236.38px] top-[-136.62px]"],
    ["h-72 w-72", "left-[1253.50px] top-[-119.50px]"],
    ["h-60 w-60", "left-[1270.62px] top-[-102.38px]"],
    ["h-52 w-52", "left-[1287.74px] top-[-85.26px]"],
    ["h-44 w-44", "left-[1304.86px] top-[-68.14px]"],
    ["h-36 w-36", "left-[1321.97px] top-[-51.03px]"],
    ["h-24 w-24", "left-[1339.09px] top-[-33.91px]"],
    ["h-16 w-16", "left-[1356.21px] top-[-16.79px]"],
    ["h-9 w-9", "left-[1373.33px] top-[0.33px]"],
  ];

  return (
    <>
      {rings.map(([size, position]) => (
        <div
          key={`${size}-${position}`}
          className={`absolute ${position} ${size} rounded-full outline outline-2 outline-offset-[-1px] outline-slate-400/50`}
        />
      ))}
    </>
  );
}

function VoteSection() {
  return (
    <div className="absolute left-[24px] top-[4582px] h-[1242px] w-[1392px]">
      <div className="absolute left-0 top-0 w-[646px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Vote for next design
      </div>
      <div className="absolute left-0 top-[266px] h-[772px] w-[1392px] overflow-hidden rounded-3xl bg-[#BBFF63]">
        <div className="absolute left-[604px] top-[672px] h-16 w-52 rounded-2xl bg-white">
          <div className="absolute left-[12px] top-[12px] inline-flex items-center justify-start gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#1A1A1A]">
              <AssetImage
                file="weui_arrow-filled-2.svg"
                className="absolute left-[16px] top-[8px] h-8 w-4"
              />
            </div>
            <div className="flex items-center justify-start gap-1">
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#BBFF63]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
              <div className="h-2 w-2 rounded-full bg-[#E0E0E0]" />
            </div>
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#1A1A1A]">
              <AssetImage
                file="weui_arrow-filled.svg"
                className="absolute left-[16px] top-[8px] h-8 w-4"
              />
            </div>
          </div>
        </div>
        <VoteRings />
        <div className="absolute left-[714px] top-[196px] w-[539px] font-['Montserrat'] text-5xl font-semibold text-[#1A1A1A]">
          Streetwear Oversized Jacket – SS2025
        </div>
        <div className="absolute left-[714px] top-[330px] w-[496px] font-['Montserrat'] text-4xl font-normal text-[#1A1A1A]">
          Willy Bogner
        </div>
        <div className="absolute left-[714px] top-[390px] inline-flex w-24 flex-col items-start justify-start gap-4">
          <div className="self-stretch font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Vote
          </div>
          <div className="self-stretch font-['Montserrat'] text-4xl font-normal text-[#1A1A1A]">
            1,200
          </div>
        </div>
        <div className="absolute left-[1222px] top-[669px] inline-flex items-center justify-center gap-2 rounded-3xl bg-white p-4">
          <AssetImage file="lucide_vote.svg" className="h-8 w-8" />
          <div className="font-['Montserrat'] text-3xl font-medium text-[#1A1A1A]">
            Vote
          </div>
        </div>
      </div>
      <AssetImage
        file="image 11.png"
        className="absolute left-[4px] top-[157px] h-[1085px] w-[665px]"
      />
    </div>
  );
}

function FlashDealsSection() {
  return (
    <div className="absolute left-[24px] top-[5774px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="inline-flex items-center justify-center gap-11">
        <div className="font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
          Flash Deals
        </div>
        <div className="flex items-center justify-start gap-6">
          <div className="font-['Montserrat'] text-3xl font-semibold text-[#1A1A1A]">
            Ends in
          </div>
          <div className="flex items-center justify-start gap-2">
            {["08", ":", "30", ":", "48"].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="font-['Montserrat'] text-3xl font-semibold text-[#1A1A1A]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProductGrid featuredIndex={2} />
    </div>
  );
}

function FaqSection() {
  return (
    <div className="absolute left-[24px] top-[6641px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Frequently asked questions
      </div>
      <div className="self-stretch inline-flex items-center justify-between">
        <AssetImage
          file="image 17.png"
          className="h-[721px] w-[566px] rounded-3xl"
        />
        <div className="inline-flex w-[802px] flex-col items-start justify-start gap-8">
          <div className="self-stretch flex flex-col items-start justify-start gap-8 overflow-hidden rounded-3xl bg-[#1A1A1A] p-8">
            <div className="self-stretch inline-flex items-center justify-between">
              <div className="font-['Montserrat'] text-2xl font-medium text-[#BBFF63]">
                Can Cancel at any time ?
              </div>
              <ArrowCircle direction="down" />
            </div>
            <div className="self-stretch inline-flex items-center justify-start gap-[878px]">
              <div className="w-[620px] font-['Montserrat'] text-2xl font-medium text-white">
                You can return items within 14 days of receiving your order, as
                long as they are in their original condition, unused, and with
                the receipt or proof of purchase. For more details, please visit
                our &quot;Return Policy&quot; page.
              </div>
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="self-stretch flex flex-col items-start justify-start gap-8 overflow-hidden rounded-3xl bg-[#EDEDED] p-8"
            >
              <div className="self-stretch inline-flex items-center justify-between">
                <div className="font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
                  Can Cancel at any time ?
                </div>
                <ArrowCircle />
              </div>
            </div>
          ))}
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
    <div className="absolute left-0 top-[7676px] h-96 w-[1440px] overflow-hidden border-t border-[#E0E0E0]">
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

export function HomePage() {
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
    <div className="relative h-[8118px] w-[1440px] overflow-hidden rounded-3xl bg-[#F9FAFB]">
      <HeroSection />
      <Navbar />
      <CollectionSection />
      <MustHavesSection />
      <CategoriesSection />
      <RecommendedSection />
      <VoteSection />
      <FlashDealsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

export default HomePage;
