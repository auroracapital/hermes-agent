import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Locale, Translations } from "./types";
import { en } from "./en";
import { I18nContext, type I18nContextValue } from "./i18n-context";

const TRANSLATION_LOADERS: Record<Locale, () => Promise<Translations>> = {
  en: async () => en,
  zh: async () => (await import("./zh")).zh,
  "zh-hant": async () => (await import("./zh-hant")).zhHant,
  ja: async () => (await import("./ja")).ja,
  de: async () => (await import("./de")).de,
  es: async () => (await import("./es")).es,
  fr: async () => (await import("./fr")).fr,
  tr: async () => (await import("./tr")).tr,
  uk: async () => (await import("./uk")).uk,
  af: async () => (await import("./af")).af,
  ko: async () => (await import("./ko")).ko,
  it: async () => (await import("./it")).it,
  ga: async () => (await import("./ga")).ga,
  pt: async () => (await import("./pt")).pt,
  ru: async () => (await import("./ru")).ru,
  hu: async () => (await import("./hu")).hu,
};

const TRANSLATION_CACHE = new Map<Locale, Translations>([["en", en]]);
const SUPPORTED_LOCALES = Object.keys(TRANSLATION_LOADERS) as Locale[];
const STORAGE_KEY = "hermes-locale";

async function loadTranslations(locale: Locale): Promise<Translations> {
  const cached = TRANSLATION_CACHE.get(locale);
  if (cached) return cached;
  const translations = await TRANSLATION_LOADERS[locale]();
  TRANSLATION_CACHE.set(locale, translations);
  return translations;
}

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    // SSR or privacy mode
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [loadRevision, setLoadRevision] = useState(0);
  const [loaded, setLoaded] = useState<{
    locale: Locale;
    translations: Translations;
  }>({ locale: "en", translations: en });

  useEffect(() => {
    let cancelled = false;
    loadTranslations(locale)
      .then((translations) => {
        if (!cancelled) setLoaded({ locale, translations });
      })
      .catch(() => {
        // Leave the previous successful locale loaded. The context falls back
        // to English while this locale is unavailable, and selecting the same
        // locale again increments loadRevision so a transient chunk failure
        // can be retried without a page reload.
      });
    return () => {
      cancelled = true;
    };
  }, [loadRevision, locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setLoadRevision((revision) => revision + 1);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: loaded.locale === locale ? loaded.translations : en,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
