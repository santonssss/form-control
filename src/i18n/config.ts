import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/en.json";
import ru from "../locales/ru/ru.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
});

export default i18n;
