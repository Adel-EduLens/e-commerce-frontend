import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ds = (file: string) => `/dropshipping/${encodeURIComponent(file)}`;
const homeAsset = (file: string) => `/home%20page%20/${encodeURIComponent(file)}`;

function AssetImage({
  file,
  className,
  alt = "",
  base = "dropshipping",
}: {
  file: string;
  className: string;
  alt?: string;
  base?: "dropshipping" | "home";
}) {
  const src = base === "home" ? homeAsset(file) : ds(file);
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
    <div className="absolute left-[24px] top-[18px] h-20 w-[1344px] rounded-2xl bg-[#F9FAFB] shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
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

function HeroSection() {
  return (
    <div className="absolute left-[24px] top-[24px] h-[770px] w-[1392px] rounded-3xl bg-[#BBFF63]">
      <Navbar />
      <div className="absolute left-[24px] top-[614px] font-['Montserrat'] text-3xl font-medium text-[#1A1A1A]">
        No inventory, no hassle — just profit
      </div>
      <div className="absolute left-[707px] top-[509px] h-0 w-[554.16px] origin-top-left rotate-[-47.41deg] outline outline-2 outline-offset-[-1px] outline-[#1A1A1A]" />
      <div className="absolute left-[722px] top-[134px] h-[480px] w-[480px] rounded-full border-2 border-[#1A1A1A]" />
      <div className="absolute left-[24px] top-[682px] inline-flex items-center justify-start gap-2 rounded-2xl bg-[#1A1A1A] p-4">
        <div className="font-['Montserrat'] text-xl font-semibold text-white">
          Become a Partner
        </div>
      </div>
      <div className="absolute left-[24px] top-[122px] w-[833px] font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Start Your Online Business with Zero Investment
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <img
      className="absolute left-[518px] top-0 h-[794px] w-[1191px]"
      src={ds("image 45.png")}
      alt=""
    />
  );
}

function WhyDropshipSection() {
  return (
    <>
      <div className="absolute left-[24px] top-[876px] w-[774px] font-['Montserrat'] text-6xl font-bold text-[#1A1A1A]">
        Why Dropship with Us?
      </div>
      <div className="absolute left-[24px] top-[1072px] h-[676px] w-[1392px]">
        {/* Zero Inventory */}
        <div className="absolute left-0 top-0 h-72 w-[566px] overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[24px] top-[148px] text-center font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Zero Inventory
          </div>
          <div className="absolute left-[24px] top-[208px] w-[518px] font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            No stock needed — we ship directly to your customers.
          </div>
          <div className="absolute left-[24px] top-[24px] h-24 w-24 overflow-hidden rounded-full bg-[#BBFF63]">
            <AssetImage
              file="mingcute_inventory-line.svg"
              className="absolute left-[28px] top-[28px] h-11 w-11"
            />
          </div>
        </div>
        {/* Fast & Reliable Shipping */}
        <div className="absolute left-0 top-[386px] h-72 w-[566px] overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[24px] top-[148px] text-center font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Fast &amp; Reliable Shipping
          </div>
          <div className="absolute left-[24px] top-[208px] w-[518px] font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            Quick deliveries with trusted logistics partners.
          </div>
          <div className="absolute left-[24px] top-[24px] h-24 w-24 overflow-hidden rounded-full bg-[#BBFF63]">
            <AssetImage
              file="la_shipping-fast.svg"
              className="absolute left-[28px] top-[28px] h-11 w-11"
            />
          </div>
        </div>
        {/* Earn Profits Easily */}
        <div className="absolute left-[826px] top-[386px] h-72 w-[566px] overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[24px] top-[148px] text-center font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Earn Profits Easily
          </div>
          <div className="absolute left-[24px] top-[208px] w-[518px] font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            Set your price, keep the margin.
          </div>
          <div className="absolute left-[24px] top-[24px] h-24 w-24 overflow-hidden rounded-full bg-[#BBFF63]">
            <AssetImage
              file="hugeicons_money-03.svg"
              className="absolute left-[28px] top-[28px] h-11 w-11"
            />
          </div>
        </div>
        {/* Center circle with icon */}
        <div className="absolute left-[618px] top-[282px] h-40 w-40 overflow-hidden rounded-full bg-[#BBFF63]">
          <AssetImage
            file="vuesax/linear/user-octagon.svg"
            className="absolute left-[48px] top-[48px] h-14 w-14"
          />
        </div>
        {/* Wide Catalog */}
        <div className="absolute left-[826px] top-0 h-72 w-[566px] overflow-hidden rounded-2xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[24px] top-[148px] text-center font-['Montserrat'] text-4xl font-semibold text-[#1A1A1A]">
            Wide Catalog
          </div>
          <div className="absolute left-[24px] top-[208px] w-[518px] font-['Montserrat'] text-2xl font-medium text-[#6B7280]">
            Thousands of products across fashion, accessories, and more.
          </div>
          <div className="absolute left-[24px] top-[24px] h-24 w-24 overflow-hidden rounded-full bg-[#BBFF63]">
            <AssetImage
              file="fluent-mdl2_product-catalog.svg"
              className="absolute left-[28px] top-[28px] h-11 w-11"
            />
          </div>
        </div>
        {/* Connector lines */}
        <div className="absolute left-[741px] top-[279.17px] h-20 w-12 origin-top-left -rotate-90 outline outline-2 outline-offset-[-1px] outline-[#0F1115]" />
        <div className="absolute left-[824.50px] top-[489px] h-20 w-16 origin-top-left -rotate-180 outline outline-2 outline-offset-[-1px] outline-[#0F1115]" />
        <div className="absolute left-[569px] top-[405px] h-20 w-16 outline outline-2 outline-offset-[-1px] outline-[#0F1115]" />
        <div className="absolute left-[565px] top-[279.17px] h-20 w-12 origin-top-left -rotate-90 outline outline-2 outline-offset-[-1px] outline-[#0F1115]" />
      </div>
    </>
  );
}

function HowWeStartSection() {
  return (
    <div className="absolute left-[24px] top-[1828px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="inline-flex items-center justify-between self-stretch">
        <div className="w-[594px] font-['Montserrat'] text-6xl font-semibold text-[#1A1A1A]">
          Here's How We Start Together
        </div>
        <div className="inline-flex w-72 flex-col items-start justify-start gap-6">
          <div className="self-stretch font-['Montserrat'] text-lg font-normal text-[#6B7280]">
            Joining us is easy and takes only a few moments
          </div>
          <div className="inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-[40px] bg-[#BBFF63] px-6 py-3">
            <div className="font-['Montserrat'] text-lg font-medium text-[#1A1A1A]">
              Get Started
            </div>
          </div>
        </div>
      </div>
      <div className="inline-flex items-start justify-start gap-6 self-stretch">
        {/* Step 1 - Sign Up */}
        <div className="relative h-56 w-80 overflow-hidden rounded-3xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
            <div className="text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
              1
            </div>
          </div>
          <div className="absolute left-[16px] top-[128px] inline-flex w-72 flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start gap-2 self-stretch">
              <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-[#1A1A1A]">
                Sign Up
              </div>
              <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
                Create your free dropshipping account
              </div>
            </div>
          </div>
          <div className="absolute left-[216px] top-[-24px] h-32 w-32 opacity-40 overflow-hidden outline outline-[5px] outline-offset-[-5px] outline-[#BBFF63]">
            <div className="absolute left-[71.17px] top-[101.67px] h-8 w-20 origin-top-left -rotate-90 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[20.33px] top-[61px] h-0 w-14 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[55.92px] top-[81.33px] h-5 w-10 origin-top-left -rotate-90 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
          </div>
        </div>
        {/* Step 2 - Select Products */}
        <div className="relative h-56 w-80 overflow-hidden rounded-3xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
            <div className="w-1.5 text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
              2
            </div>
          </div>
          <div className="absolute left-[16px] top-[131px] inline-flex w-72 flex-col items-start justify-start gap-2">
            <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-[#1A1A1A]">
              Select Products
            </div>
            <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
              Add items from our catalog to your store
            </div>
          </div>
          <div className="absolute left-[198px] top-[-16px] h-32 w-32 opacity-40 overflow-hidden outline outline-[5px] outline-offset-[-5px] outline-[#BBFF63]">
            <div className="absolute left-[20.33px] top-[50.83px] h-14 w-20 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[61px] top-[71.17px] h-4 w-0 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[40.67px] top-[50.83px] h-10 w-9 origin-top-left -rotate-90 rounded-[1px] outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
          </div>
        </div>
        {/* Step 3 - Promote & Sell */}
        <div className="relative h-56 w-80 overflow-hidden rounded-3xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
            <div className="w-1.5 text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
              3
            </div>
          </div>
          <div className="absolute left-[16px] top-[130px] inline-flex w-72 flex-col items-start justify-start gap-2">
            <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-[#1A1A1A]">
              Promote &amp; Sell
            </div>
            <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
              Share products online and attract customers
            </div>
          </div>
          <div className="absolute left-[246.79px] top-[-6.09px] h-24 w-24 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
          <div className="absolute left-[281.16px] top-[15.97px] h-6 w-6 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
          <div className="absolute left-[272.66px] top-[51.86px] h-4 w-10 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
          <div className="absolute left-[232px] top-[-16.25px] h-32 w-32 border-[6px] border-[#BBFF63] opacity-0" />
        </div>
        {/* Step 4 - We Ship, You Earn */}
        <div className="relative h-56 w-80 overflow-hidden rounded-3xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
          <div className="absolute left-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
            <div className="text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
              4
            </div>
          </div>
          <div className="absolute left-[16px] top-[124px] inline-flex w-72 flex-col items-start justify-start gap-2">
            <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-[#1A1A1A]">
              We Ship, You Earn
            </div>
            <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
              We handle delivery, you keep the profit
            </div>
          </div>
          <div className="absolute left-[228px] top-[-20px] h-28 w-28 opacity-40 outline outline-[5px] outline-offset-[-5px] outline-[#BBFF63]">
            <div className="absolute left-[10px] top-[10px] h-24 w-24 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[66.89px] top-[16.05px] h-7 w-8 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-[94.14px] top-[93.60px] h-4 w-4 outline outline-[6px] outline-offset-[-3px] outline-[#BBFF63]" />
            <div className="absolute left-0 top-0 h-28 w-28 opacity-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EverythingYouNeedSection() {
  const cards = [
    {
      num: "1",
      numWidth: "",
      title: "Marketing Kit",
      desc: "Ready-to-use product images & videos",
      topOffset: "top-[80px]",
    },
    {
      num: "2",
      numWidth: "w-1.5",
      title: "Pricing Calculator",
      desc: "Estimate your profit margin",
      topOffset: "top-[80px]",
    },
    {
      num: "3",
      numWidth: "w-1.5",
      title: "Sales Dashboard",
      desc: "Track orders, earnings, and performance",
      topOffset: "top-[80px]",
    },
    {
      num: "4",
      numWidth: "",
      title: "Wallet Integration",
      desc: "Easy access to your balance & payouts.",
      topOffset: "top-[81px]",
    },
  ];

  return (
    <div className="absolute left-[24px] top-[2322px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="w-[594px] font-['Montserrat'] text-6xl font-semibold text-[#1A1A1A]">
        Everything You Need to Succeed
      </div>
      <div className="inline-flex items-center justify-start gap-6 self-stretch">
        {cards.map((card) => (
          <div
            key={card.num}
            className="relative h-96 w-80 overflow-hidden rounded-3xl bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]"
          >
            <div className="absolute left-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
              <div
                className={`text-center font-['Outfit'] text-base font-medium text-[#1A1A1A] ${card.numWidth}`}
              >
                {card.num}
              </div>
            </div>
            <div
              className={`absolute left-[16px] ${card.topOffset} inline-flex w-72 flex-col items-start justify-start gap-2`}
            >
              <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-[#1A1A1A]">
                {card.title}
              </div>
              <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
                {card.desc}
              </div>
            </div>
            <img
              className="absolute left-[16px] top-[174px] h-48 w-72 rounded-3xl"
              src={ds("image 17.png")}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="absolute left-[24px] top-[2973px] inline-flex w-[1392px] flex-col items-start justify-start gap-10">
      <div className="self-stretch text-center font-['Montserrat'] text-8xl font-bold text-[#1A1A1A]">
        Frequently asked questions
      </div>
      <div className="inline-flex items-center justify-between self-stretch">
        <img
          className="h-[721px] w-[566px] rounded-3xl"
          src={ds("image 17(1).png")}
          alt=""
        />
        <div className="inline-flex w-[802px] flex-col items-start justify-start gap-8">
          {/* Expanded FAQ */}
          <div className="flex flex-col items-start justify-start gap-8 overflow-hidden self-stretch rounded-3xl bg-[#1C1B2E] p-8">
            <div className="inline-flex items-center justify-between self-stretch">
              <div className="font-['Montserrat'] text-2xl font-medium text-[#BBFF63]">
                Can Cancel at any time ?
              </div>
              <div className="relative h-12 w-0 origin-top-left rotate-90 overflow-hidden rounded-full bg-white">
                <div className="absolute left-[12px] top-[18px] h-3 w-6 overflow-hidden">
                  <div className="absolute left-[5.63px] top-[3.09px] h-2 w-3 bg-[#1A1A1A]" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-[878px] self-stretch">
              <div className="w-[620px] font-['Montserrat'] text-2xl font-medium text-white">
                You can return items within 14 days of receiving your order, as
                long as they are in their original condition, unused, and with
                the receipt or proof of purchase. For more details, please visit
                our &quot;Return Policy&quot; page.
              </div>
            </div>
          </div>
          {/* Collapsed FAQs */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-start justify-start gap-8 overflow-hidden self-stretch rounded-3xl bg-[#EDEDED] p-8"
            >
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="font-['Montserrat'] text-2xl font-medium text-[#1A1A1A]">
                  Can Cancel at any time ?
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
                  <div className="absolute left-[18px] top-[12px] h-6 w-3 overflow-hidden">
                    <div className="absolute left-[3.09px] top-[5.64px] h-3 w-2 bg-[#1A1A1A]" />
                  </div>
                </div>
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
    <div className="absolute left-0 top-[4048px] h-96 w-[1440px] overflow-hidden border-t border-[#E0E0E0]">
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

export default function DropshippingPage() {
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
    <div className="relative h-[4490px] w-[1440px] overflow-hidden rounded-3xl bg-[#F9FAFB]">
      <HeroSection />
      <HeroImage />
      <WhyDropshipSection />
      <HowWeStartSection />
      <EverythingYouNeedSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
