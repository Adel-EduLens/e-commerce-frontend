import { useState } from "react";
import TraderShopBannerPage from "./TraderShopBannerPage";
import TraderHomeBannerPage from "./TraderHomeBannerPage";
import TraderFAQsPage from "./TraderFAQsPage";
import TraderHelpCenterPage from "./TraderHelpCenterPage";

type WebsiteSettingsTab = "shop-banners" | "home-banners" | "faqs" | "help-center";

interface TraderWebsiteSettingsPageProps {
  defaultTab?: WebsiteSettingsTab;
}

const tabs: { id: WebsiteSettingsTab; label: string }[] = [
  { id: "shop-banners", label: "Shop Banners" },
  { id: "home-banners", label: "Homepage Banners" },
  { id: "faqs", label: "FAQs" },
  { id: "help-center", label: "Help Center" },
];

export default function TraderWebsiteSettingsPage({
  defaultTab = "shop-banners",
}: TraderWebsiteSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<WebsiteSettingsTab>(defaultTab);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-['Montserrat'] text-2xl font-bold text-foreground sm:text-3xl">
          Website Settings
        </h1>
        <p className="mt-1 text-sm text-gray-text">
          Manage the content shown across your website.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-stroke pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-white text-gray-text hover:bg-background hover:text-foreground"
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
    </section>
  );
}
