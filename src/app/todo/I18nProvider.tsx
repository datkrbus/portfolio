"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LANGUAGE_KEY, localeTag, translate, type Locale } from "./todo-i18n";
import {
  formatDate as formatLocalDate,
  relativeDate as relativeLocalDate,
} from "./todo-utils";

const defaultValue = {
  locale: "vi" as Locale,
  setLocale: (() => {}) as (locale: Locale) => void,
};
const LanguageContext = createContext(defaultValue);
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLanguage] = useState<Locale>("vi");
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    const previousTitle = document.title;
    document.documentElement.lang = locale;
    document.title =
      locale === "en"
        ? "Quietly Done | Your tasks"
        : "Quietly Done | Công việc của bạn";
    return () => {
      document.documentElement.lang = previousLanguage;
      document.title = previousTitle;
    };
  }, [locale]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved === "en" || saved === "vi") {
        // Hydrate a browser-only preference after the static HTML has mounted.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguage(saved);
      }
    } catch {
      /* Language switching still works when storage is unavailable. */
    }
    const changed = (event: StorageEvent) => {
      if (event.key === LANGUAGE_KEY)
        setLanguage(event.newValue === "en" ? "en" : "vi");
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => {
        setLanguage(next);
        try {
          localStorage.setItem(LANGUAGE_KEY, next);
        } catch {
          /* Keep the current session usable. */
        }
      },
    }),
    [locale],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useI18n() {
  const { locale, setLocale } = useContext(LanguageContext);
  return useMemo(
    () => ({
      locale,
      setLocale,
      t: (text: string, values?: Record<string, string | number>) =>
        translate(locale, text, values),
      formatDate: (value: string, options?: Intl.DateTimeFormatOptions) =>
        formatLocalDate(value, options, localeTag(locale)),
      relativeDate: (value: string) =>
        relativeLocalDate(value, undefined, locale),
      weekday: (day: number) =>
        new Intl.DateTimeFormat(localeTag(locale), { weekday: "short" }).format(
          new Date(2026, 0, 4 + day),
        ),
      taskCount: (count: number) =>
        locale === "en"
          ? `${count} ${count === 1 ? "task" : "tasks"}`
          : `${count} công việc`,
    }),
    [locale, setLocale],
  );
}
