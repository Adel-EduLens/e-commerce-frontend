import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

import authEn from "./locales/en/auth.json";
import authAr from "./locales/ar/auth.json"
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        auth : authEn,
        translation: en,
      },
      ar: {
        auth :authAr , 
        translation: ar,
      },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;