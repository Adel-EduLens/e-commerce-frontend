import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, Footer } from "../components/shared";
import { useState } from "react";
const ds = (file: string) =>
  `/dropshipping/${file.split("/").map(encodeURIComponent).join("/")}`;
const homeAsset = (file: string) =>
  `/home%20page/${file.split("/").map(encodeURIComponent).join("/")}`;

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
  return <img className={className} src={src} alt={alt} draggable={false} />;
}

function HeroSection() {
  return (
    <div className="absolute left-[24px] top-[24px] h-[770px] w-[1392px] rounded-3xl bg-[#BBFF63]">
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
    <>
      <AssetImage
        file="image 45.png"
        base="dropshipping"
        className="absolute left-[518px] top-0 h-[794px] w-[1191px]"
      />
    </>
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
        <div className="absolute left-[618px] top-[282px] h-40 w-40 overflow-hidden rounded-full bg-[#BBFF63] flex items-center justify-center">
          <img src={ds("lucide_box.svg")} className="size-20 " alt="" />
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
        <img
          src={ds("Line 9.svg")}
          className="absolute left-[740px] top-[224px]"
          alt=""
        />
        <img
          src={ds("Line 10.svg")}
          className="absolute left-[565px] top-[227px]"
          alt=""
        />
        <img
          src={ds("Line 11.svg")}
          className="absolute left-[755px] top-[415px]"
          alt=""
        />
        <img
          src={ds("Line 12.svg")}
          className="absolute left-[568px] top-[410px]"
          alt=""
        />
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
          <img
            src={ds("login.svg")}
            className="absolute left-[216px] top-[-24px] h-32 w-32"
            alt=""
          />
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
          <img
            src={ds("lock.svg")}
            className="absolute left-[198px] top-[-16px] h-32 w-32"
            alt=""
          />
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
          <img
            src={ds("vuesax/linear/user-octagon.svg")}
            className="absolute left-[232px] top-[-16px] h-32 w-32"
            alt=""
          />
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
          <img
            src={ds("vuesax/linear/search-favorite.svg")}
            className="absolute left-[232px] top-[-16px] h-32 w-32"
            alt=""
          />
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

export function CollapsibleFAQ({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`rounded-3xl p-8 transition-colors duration-300 ${
              isOpen ? "bg-[#1C1B2E]" : "bg-[#EDEDED]"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between"
            >
              <h3
                className={`text-2xl font-medium ${
                  isOpen ? "text-[#BBFF63]" : "text-[#1A1A1A]"
                }`}
              >
                {faq.question}
              </h3>

              <div
                className={`rounded-full bg-white p-3 transition-transform duration-300 ${
                  isOpen ? "rotate-90" : ""
                }`}
              >
                <AssetImage file="weui_arrow-filled.svg" className="h-6 w-3" />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xl text-white">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "Can Cancel at any time ?",
      answer:
        "You can return items within 14 days of receiving your order, as long as they are in their original condition, unused, and with the receipt or proof of purchase.",
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order from your account page.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide.",
    },
    {
      question: "How can I contact support?",
      answer: "You can contact us via email or live chat.",
    },
  ];
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
  
        
          <CollapsibleFAQ faqs={faqs} />
          
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
    <div className="relative h-[4490px] mx-auto w-[1440px] overflow-hidden bg-[#F9FAFB]">
      <Navbar />
      <HeroSection />
      <HeroImage />
      <WhyDropshipSection />
      <HowWeStartSection />
      <EverythingYouNeedSection />
      <FAQSection />
      <Footer top="top-[4048px]" />
    </div>
  );
}
