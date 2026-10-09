import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, readStoredLanguage } from './languages';
import en from './locales/en.json';
import tr from './locales/tr.json';

export const resources = {
  tr: { translation: tr },
  en: { translation: en },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

export { i18n };
