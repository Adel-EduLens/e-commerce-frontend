import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

import authEn from "./locales/en/auth.json";
import authAr from "./locales/ar/auth.json"

import dropshippingEn from "./locales/en/dropshipping.json";
import dropshippingAr from "./locales/ar/dropshipping.json"

import settingEn from "./locales/en/setting.json";
import settingAr from "./locales/ar/setting.json";

import accountSidebarEn from "./locales/en/accountSidebar.json";
import accountSidebarAr from "./locales/ar/accountSidebar.json";

import navbarEn from "./locales/en/navbar.json";
import navbarAr from "./locales/ar/navbar.json";

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
      },
      ar: {
        dropshipping: dropshippingAr,
        auth: authAr,
        setting: settingAr,
        accountSidebar: accountSidebarAr,
        navbar: navbarAr,
        translation: ar,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;