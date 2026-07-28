import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TraderShopBannerPage from "./TraderShopBannerPage";
import TraderHomeBannerPage from "./TraderHomeBannerPage";
import TraderFAQsPage from "./TraderFAQsPage";
import TraderHelpCenterPage from "./TraderHelpCenterPage";
import TraderShippingSettings from "./TraderShippingSettings";
import TraderTerms from "../../../components/trader/TraderTerms";
import TraderPrivacy from "../../../components/trader/TraderPrivacy";

type WebsiteSettingsTab =
  | "shop-banners"
  | "home-banners"
  | "faqs"
  | "help-center"
  | "shipping"
  | "terms"
  | "privacy";

interface TraderWebsiteSettingsPageProps {
  defaultTab?: WebsiteSettingsTab;
}

export default function TraderWebsiteSettingsPage({
  defaultTab = "shop-banners",
}: TraderWebsiteSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<WebsiteSettingsTab>(defaultTab);
  const { t } = useTranslation("traderShipping");

  const tabs: { id: WebsiteSettingsTab; label: string }[] = [
    { id: "shop-banners", label: t("tabs.shopBanners") },
    { id: "home-banners", label: t("tabs.homeBanners") },
    { id: "faqs", label: t("tabs.faqs") },
    { id: "help-center", label: t("tabs.helpCenter") },
    { id: "shipping", label: t("tabs.shipping") },
    { id: "terms", label: t("tabs.terms", "Terms & Conditions") },
    { id: "privacy", label: t("tabs.privacy", "Privacy Policy") },
  ];

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (currentTab) {
      document.title = `${t("websiteSettings")} | ${currentTab.label}`;
    } else {
      document.title = t("websiteSettings");
    }
  }, [activeTab, t]);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-['Montserrat'] text-2xl font-bold text-foreground sm:text-3xl">
          {t("websiteSettings")}
        </h1>
        <p className="mt-1 text-sm text-gray-text">
          {t("websiteSettingsSubtitle")}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-stroke pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-card text-gray-text hover:bg-background hover:text-foreground border border-stroke"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shop-banners" && <TraderShopBannerPage />}
      {activeTab === "home-banners" && <TraderHomeBannerPage />}
      {activeTab === "faqs" && <TraderFAQsPage />}
      {activeTab === "help-center" && <TraderHelpCenterPage />}
      {activeTab === "shipping" && <TraderShippingSettings />}
      {activeTab === "terms" && <TraderTerms />}
      {activeTab === "privacy" && <TraderPrivacy />}
    </section>
  );
}
