import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

import authEn from "./locales/en/auth.json";
import authAr from "./locales/ar/auth.json";

import dropshippingEn from "./locales/en/dropshipping.json";
import dropshippingAr from "./locales/ar/dropshipping.json";

import settingEn from "./locales/en/setting.json";
import settingAr from "./locales/ar/setting.json";

import accountSidebarEn from "./locales/en/accountSidebar.json";
import accountSidebarAr from "./locales/ar/accountSidebar.json";

import navbarEn from "./locales/en/navbar.json";
import navbarAr from "./locales/ar/navbar.json";

import footerEn from "./locales/en/footer.json";
import footerAr from "./locales/ar/footer.json";

import productSectionEn from "./locales/en/productSection.json";
import productSectionAr from "./locales/ar/productSection.json";

import filtersEn from "./locales/en/filters.json";
import filtersAr from "./locales/ar/filters.json";

import ordersEn from "./locales/en/orders.json";
import ordersAr from "./locales/ar/orders.json";

import walletEn from "./locales/en/wallet.json";
import walletAr from "./locales/ar/wallet.json";

import contactEn from "./locales/en/contact.json";
import contactAr from "./locales/ar/contact.json";

import notificationsEn from "./locales/en/notifications.json";
import notificationsAr from "./locales/ar/notifications.json";

import notifyEn from "./locales/en/notify.json";
import notifyAr from "./locales/ar/notify.json";

import helpCenterEn from "./locales/en/help-center.json";
import helpCenterAr from "./locales/ar/help-center.json";

import bagEn from "./locales/en/bag.json";
import bagAr from "./locales/ar/bag.json";

import productDetailsEn from "./locales/en/product-details.json";
import productDetailsAr from "./locales/ar/product-details.json";

import reviewFormEn from "./locales/en/reviewForm.json";
import reviewFormAr from "./locales/ar/reviewForm.json";

import compareEn from "./locales/en/compare.json";
import compareAr from "./locales/ar/compare.json";

import traderLayoutEn from "./locales/en/traderLayout.json";
import traderLayoutAr from "./locales/ar/traderLayout.json";

import traderInventoryEn from "./locales/en/traderInventory.json";
import traderInventoryAr from "./locales/ar/traderInventory.json";

import traderWholesaleEn from "./locales/en/traderWholesale.json";
import traderWholesaleAr from "./locales/ar/traderWholesale.json";

import traderProductEn from "./locales/en/traderProduct.json";
import traderProductAr from "./locales/ar/traderProduct.json";

import traderOverviewEn from "./locales/en/traderOverview.json";
import traderOverviewAr from "./locales/ar/traderOverview.json";

import traderBrandsEn from "./locales/en/traderBrands.json";
import traderBrandsAr from "./locales/ar/traderBrands.json";

import traderCouponsEn from "./locales/en/traderCoupons.json";
import traderCouponsAr from "./locales/ar/traderCoupons.json";

import traderOrdersEn from "./locales/en/traderOrders.json";
import traderOrdersAr from "./locales/ar/traderOrders.json";

import traderDesignsEn from "./locales/en/traderDesigns.json";
import traderDesignsAr from "./locales/ar/traderDesigns.json";

import traderHelpCenterEn from "./locales/en/traderHelpCenter.json";
import traderHelpCenterAr from "./locales/ar/traderHelpCenter.json";

import traderWholesaleCategoriesEn from "./locales/en/traderWholesaleCategories.json";
import traderWholesaleCategoriesAr from "./locales/ar/traderWholesaleCategories.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        dropshipping: dropshippingEn,
        auth: authEn,
        setting: settingEn,
        accountSidebar: accountSidebarEn,
        navbar: navbarEn,
        translation: en,
        footer: footerEn,
        productSection: productSectionEn,
        filters: filtersEn,
        orders: ordersEn,
        wallet: walletEn,
        contact: contactEn,
        notifications: notificationsEn,
        notify: notifyEn,
        helpCenter: helpCenterEn,
        bag: bagEn,
        productDetails: productDetailsEn,
        reviewForm: reviewFormEn,
        compare: compareEn,
        traderLayout: traderLayoutEn,
        traderInventory: traderInventoryEn,
        traderWholesale: traderWholesaleEn,
        traderProduct: traderProductEn,
        traderOverview: traderOverviewEn,
        traderBrands: traderBrandsEn,
        traderCoupons: traderCouponsEn,
        traderOrders: traderOrdersEn,
        traderDesigns: traderDesignsEn,
        traderHelpCenter: traderHelpCenterEn,
        traderWholesaleCategories: traderWholesaleCategoriesEn,
      },
      ar: {
        dropshipping: dropshippingAr,
        auth: authAr,
        setting: settingAr,
        accountSidebar: accountSidebarAr,
        navbar: navbarAr,
        translation: ar,
        footer: footerAr,
        productSection: productSectionAr,
        filters: filtersAr,
        orders: ordersAr,
        wallet: walletAr,
        contact: contactAr,
        notifications: notificationsAr,
        notify: notifyAr,
        helpCenter: helpCenterAr,
        bag: bagAr,
        productDetails: productDetailsAr,
        reviewForm: reviewFormAr,
        compare: compareAr,
        traderLayout: traderLayoutAr,
        traderInventory: traderInventoryAr,
        traderWholesale: traderWholesaleAr,
        traderProduct: traderProductAr,
        traderOverview: traderOverviewAr,
        traderBrands: traderBrandsAr,
        traderCoupons: traderCouponsAr,
        traderOrders: traderOrdersAr,
        traderDesigns: traderDesignsAr,
        traderHelpCenter: traderHelpCenterAr,
        traderWholesaleCategories: traderWholesaleCategoriesAr,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
