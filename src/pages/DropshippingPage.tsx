
import { useTranslation } from "react-i18next";
import { CollapsibleFAQ } from "../components/shared";

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

/* ----------------------------- Hero Section ----------------------------- */

function HeroSection() {
  const { t } = useTranslation("dropshipping");

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-[#BBFF63] px-6 py-10 sm:px-10 sm:py-14 lg:h-[770px] lg:px-0 lg:py-0">
      <div className="relative z-10 flex flex-col lg:block lg:h-full">
        <h1 className="max-w-full font-['Montserrat'] text-4xl font-bold text-[#1A1A1A] sm:text-6xl lg:absolute lg:start-[24px] lg:top-[122px] lg:w-[833px] lg:text-8xl">
          {t("hero.title")}
        </h1>

        <p className="mt-6 max-w-md font-['Montserrat'] text-xl font-medium text-[#1A1A1A] sm:text-2xl lg:absolute lg:start-[24px] lg:top-[614px] lg:mt-0 lg:max-w-none lg:text-3xl">
          {t("hero.tagline")}
        </p>

        <div className="mt-8 inline-flex w-fit items-center justify-start gap-2 rounded-2xl bg-[#1A1A1A] p-4 lg:absolute lg:start-[24px] lg:top-[682px] lg:mt-0">
          <span className="font-['Montserrat'] text-lg font-semibold text-white sm:text-xl">
            {t("hero.cta")}
          </span>
        </div>

        {/* Decorative elements: desktop only */}
        <div className="pointer-events-none absolute end-[calc(100%-1261px)] top-[509px] hidden h-0 w-[554.16px] origin-top-right rotate-[47.41deg] outline outline-2 outline-offset-[-1px] outline-[#1A1A1A] rtl:rotate-[-47.41deg] lg:block" />
        <div className="pointer-events-none absolute end-[calc(100%-1202px)] top-[134px] hidden h-[480px] w-[480px] rounded-full border-2 border-[#1A1A1A] lg:block" />

        <AssetImage
          file="image 45.png"
          base="dropshipping"
          className="relative mt-8 h-56 w-full rounded-2xl object-cover hidden lg:block lg:absolute lg:end-0 lg:top-0 lg:mt-0 lg:h-[794px] lg:w-[990px] lg:rounded-none lg:object-fill rtl:lg:scale-x-[-1]"
        />
      </div>
    </div>
  );
}

/* ------------------------- Why Dropship Section -------------------------- */

function WhyDropshipSection() {
  const { t } = useTranslation("dropshipping");

  const cards = [
    {
      key: "zeroInventory",
      icon: "mingcute_inventory-line.svg",
      position: "lg:start-0 lg:top-0",
    },
    {
      key: "fastShipping",
      icon: "la_shipping-fast.svg",
      position: "lg:start-0 lg:top-[386px]",
    },
    {
      key: "wideCatalog",
      icon: "fluent-mdl2_product-catalog.svg",
      position: "lg:end-0 lg:top-0",
    },
    {
      key: "earnProfits",
      icon: "hugeicons_money-03.svg",
      position: "lg:end-0 lg:top-[386px]",
    },
  ] as const;

  return (
    <div className="mt-16 flex flex-col gap-10">
      <h2 className="max-w-full font-['Montserrat'] text-4xl font-bold text-foreground sm:text-5xl lg:w-[774px] lg:text-6xl">
        {t("why.title")}
      </h2>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:h-[676px] lg:gap-0">
        {cards.map((card) => (
          <div
            key={card.key}
            className={`relative h-auto min-h-[288px] w-full overflow-hidden rounded-2xl bg-card p-6 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke lg:absolute lg:h-72 lg:w-[566px] lg:p-0 ${card.position}`}
          >
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#BBFF63] lg:absolute lg:start-[24px] lg:top-[24px]">
              <AssetImage file={card.icon} className="h-11 w-11" />
            </div>
            <div className="mt-6 font-['Montserrat'] text-2xl font-semibold text-foreground sm:text-3xl lg:absolute lg:start-[24px] lg:top-[148px] lg:mt-0 lg:text-4xl">
              {t(`why.${card.key}.title`)}
            </div>
            <div className="mt-3 max-w-md font-['Montserrat'] text-lg font-medium text-gray-text sm:text-xl lg:absolute lg:start-[24px] lg:top-[208px] lg:mt-0 lg:w-[518px] lg:text-2xl">
              {t(`why.${card.key}.desc`)}
            </div>
          </div>
        ))}

        {/* Center circle: desktop only */}
        <div className="hidden h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#BBFF63] lg:absolute lg:start-[590px] lg:top-[282px] lg:flex">
          <img src={ds("lucide_box.svg")} className="size-20" alt="" />
        </div>

        {/* Connector lines: desktop only, mirrored for RTL */}
        <img
          src={ds("Line 9.svg")}
          className="absolute start-[675px] top-[210px] hidden lg:block rtl:scale-x-[-1]"
          alt=""
        />
        <img
          src={ds("Line 10.svg")}
          className="absolute start-[565px] top-[212px] hidden lg:block rtl:scale-x-[-1]"
          alt=""
        />
        <img
          src={ds("Line 11.svg")}
          className="absolute start-[690px] top-[440px] hidden lg:block rtl:scale-x-[-1]"
          alt=""
        />
        <img
          src={ds("Line 12.svg")}
          className="absolute start-[568px] top-[430px] hidden lg:block rtl:scale-x-[-1]"
          alt=""
        />
      </div>
    </div>
  );
}

/* ------------------------- How We Start Section --------------------------- */

function HowWeStartSection() {
  const { t } = useTranslation("dropshipping");

  const steps = [
    { key: "signUp", icon: "login.svg" },
    { key: "selectProducts", icon: "lock.svg" },
    { key: "promoteAndSell", icon: "vuesax/linear/user-octagon.svg" },
    { key: "shipAndEarn", icon: "vuesax/linear/search-favorite.svg" },
  ] as const;

  return (
    <div className="mt-16 flex w-full flex-col items-start justify-start gap-10">
      <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <h2 className="max-w-full font-['Montserrat'] text-4xl font-semibold text-foreground sm:text-5xl lg:w-[594px] lg:text-6xl">
          {t("howWeStart.title")}
        </h2>
        <div className="flex w-full flex-col items-start justify-start gap-6 sm:w-72">
          <p className="self-stretch font-['Montserrat'] text-lg font-normal text-[#6B7280]">
            {t("howWeStart.subtitle")}
          </p>
          <div className="inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-[40px] bg-[#BBFF63] px-6 py-3">
            <span className="font-['Montserrat'] text-lg font-medium text-[#1A1A1A]">
              {t("howWeStart.cta")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.key}
            className="relative h-56 w-full overflow-hidden rounded-3xl bg-card shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke"
          >
            <div className="absolute start-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
              <div className="text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
                {i + 1}
              </div>
            </div>
            <div className="absolute start-[16px] top-[128px] inline-flex w-[calc(100%-32px)] flex-col items-start justify-start gap-2">
              <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-foreground">
                {t(`howWeStart.steps.${step.key}.title`)}
              </div>
              <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
                {t(`howWeStart.steps.${step.key}.desc`)}
              </div>
            </div>
            <img
              src={ds(step.icon)}
              className="absolute end-[16px] top-[-16px] h-32 w-32 rtl:scale-x-[-1]"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- Everything You Need Section ------------------------ */

function EverythingYouNeedSection() {
  const { t } = useTranslation("dropshipping");

  const cards = [
    "marketingKit",
    "pricingCalculator",
    "salesDashboard",
    "walletIntegration",
  ] as const;

  return (
    <div className="mt-16 flex w-full flex-col items-start justify-start gap-10">
      <h2 className="max-w-full font-['Montserrat'] text-4xl font-semibold text-foreground sm:text-5xl lg:w-[594px] lg:text-6xl">
        {t("everything.title")}
      </h2>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card}
            className="relative h-auto w-full overflow-hidden rounded-3xl bg-card pb-6 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] outline outline-1 outline-offset-[-1px] outline-stroke"
          >
            <div className="absolute start-[16px] top-[16px] inline-flex h-10 w-10 flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#BBFF63] px-2 py-0.5">
              <div className="text-center font-['Outfit'] text-base font-medium text-[#1A1A1A]">
                {cards.indexOf(card) + 1}
              </div>
            </div>
            <div className="ms-4 me-4 mt-14 flex flex-col items-start justify-start gap-2">
              <div className="self-stretch font-['Montserrat'] text-lg font-semibold text-foreground">
                {t(`everything.cards.${card}.title`)}
              </div>
              <div className="self-stretch font-['Montserrat'] text-base font-normal text-[#6B7280]">
                {t(`everything.cards.${card}.desc`)}
              </div>
            </div>
            <img
              className="mx-4 mt-6 h-48 w-[calc(100%-32px)] rounded-3xl object-cover"
              src={ds("image 17.png")}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- FAQ Section -------------------------------- */

function FAQSection() {
  const { t } = useTranslation("dropshipping");

  const faqKeys = [
    "cancel",
    "trackOrder",
    "internationalShipping",
    "contactSupport",
  ] as const;

  const faqs = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  return (
    <div className="mb-16 mt-16 flex w-full flex-col items-start justify-start gap-10">
      <h2 className="w-full text-center font-['Montserrat'] text-4xl font-bold text-foreground sm:text-6xl lg:text-8xl">
        {t("faq.title")}
      </h2>
      <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-start">
        <img
          className="h-[360px] w-full max-w-[566px] rounded-3xl object-cover lg:h-[721px]"
          src={ds("image 17(1).png")}
          alt=""
        />
        <div className="flex w-full flex-col items-stretch justify-start gap-8 lg:w-[802px] ">
          <CollapsibleFAQ faqs={faqs} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Page ------------------------------------- */

export default function DropshippingPage() {

 


  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <HeroSection />
      <WhyDropshipSection />
      <HowWeStartSection />
      <EverythingYouNeedSection />
      <FAQSection />
    </div>
  );
}