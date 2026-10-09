import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  storeLanguage,
  type SupportedLanguage,
} from '@/i18n/languages';

export interface LanguageState {
  readonly language: SupportedLanguage;
  readonly setLanguage: (language: SupportedLanguage) => void;
}

export function useLanguage(): LanguageState {
  const { i18n } = useTranslation();
  const language = isSupportedLanguage(i18n.language)
    ? i18n.language
    : DEFAULT_LANGUAGE;

  function setLanguage(next: SupportedLanguage): void {
    storeLanguage(next);
    void i18n.changeLanguage(next);
  }

  return { language, setLanguage };
}
