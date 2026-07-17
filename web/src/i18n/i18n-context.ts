import { createContext, useContext } from "react";
import { en } from "./en";
import type { Locale, Translations } from "./types";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

// Display metadata uses endonyms so users recognize their language even when
// they do not speak the current UI language. Languages intentionally are not
// paired with country flags because no single jurisdiction represents one.
export const LOCALE_META: Record<Locale, { name: string }> = {
  en: { name: "English" },
  zh: { name: "简体中文" },
  "zh-hant": { name: "繁體中文" },
  ja: { name: "日本語" },
  de: { name: "Deutsch" },
  es: { name: "Español" },
  fr: { name: "Français" },
  tr: { name: "Türkçe" },
  uk: { name: "Українська" },
  af: { name: "Afrikaans" },
  ko: { name: "한국어" },
  it: { name: "Italiano" },
  ga: { name: "Gaeilge" },
  pt: { name: "Português" },
  ru: { name: "Русский" },
  hu: { name: "Magyar" },
};

export function useI18n() {
  return useContext(I18nContext);
}
