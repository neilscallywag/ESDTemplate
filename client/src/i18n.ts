import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import translationEN from "~locales/en/translations.json";
import translationMY from "~locales/my/translations.json";

const resources = {
  en: {
    translation: translationEN,
  },
  my: {
    translation: translationMY,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
