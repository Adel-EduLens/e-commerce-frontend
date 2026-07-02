import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const asset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

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

function ArrowCircle() {
  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
      <AssetImage
        file="weui_arrow-filled-3.svg"
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

function StarRating() {
  return (
    <div className="absolute left-[170px] top-[8px] inline-flex items-center justify-start gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <AssetImage
          key={i}
          file="material-symbols_star.svg"
          className="h-6 w-6"
        />
      ))}
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
      <div className="absolute left-[8px] top-[274px] h-24 w-80 rounded-lg bg-white">
        <StarRating />
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
    </div>
  );
}

function Variant2ProductCard() {
  return (
    <div className="relative h-96 w-80 overflow-hidden rounded-2xl bg-[#C4B5FD] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="absolute left-[8px] top-[8px] h-96 w-80 overflow-hidden rounded-lg bg-[#C4B5FD]">
        <img
          className="absolute left-[23px] top-0 h-96 w-64"
          src="https://placehold.co/269x404"
          alt=""
        />
        <div className="absolute left-[266px] top-[8px] h-10 w-10 overflow-hidden rounded-full bg-white outline outline-1 outline-offset-[-1px] outline-[#EDEDED]">
          <AssetImage
            file="mdi_heart.svg"
            className="absolute left-[8px] top-[8px] h-6 w-6"
          />
        </div>
      </div>
      <div className="absolute left-[8px] top-[282px] h-24 w-80 rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#1A1A1A]">
        <StarRating />
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
    </div>
  );
}

function ProductRow({ top }: { top: string }) {
  return (
    <div className={`absolute left-[24px] ${top} inline-flex items-center justify-start gap-6`}>
      <DefaultProductCard />
      <Variant2ProductCard />
      <DefaultProductCard />
      <DefaultProductCard />
    </div>
  );
}

function FilterSection() {
  return (
    <div className="absolute left-[24px] top-[211px] inline-flex w-[1392px] flex-col items-start justify-start gap-3">
      <div className="self-stretch font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
        Filter by
      </div>
      <div className="inline-flex items-center justify-between self-stretch">
        <div className="flex items-center justify-start gap-4">
          {/* Sort by */}
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#EDEDED] p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
              Sort by
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
          {/* Filter by */}
          <div className="flex w-44 items-center justify-between rounded-2xl bg-[#EDEDED] p-4">
            <div className="font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
              Filter by
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
        </div>
        {/* Search */}
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
    <div className="absolute left-0 top-[2041px] h-96 w-[1440px] overflow-hidden border-t border-[#E0E0E0]">
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

export default function FavoritesPage() {
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
    <div className="relative h-[2483px] w-[1440px] overflow-hidden rounded-3xl bg-[#F9FAFB]">
      <Footer />
      <Navbar />
      <div className="absolute left-[24px] top-[122px] font-['Montserrat'] text-4xl font-bold text-[#1A1A1A]">
        Favorites
      </div>
      <FilterSection />
      <ProductRow top="top-[375px]" />
      <ProductRow top="top-[784px]" />
      <ProductRow top="top-[1193px]" />
      <ProductRow top="top-[1602px]" />
    </div>
  );
}
