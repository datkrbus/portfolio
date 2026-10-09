"use client";
import { useI18n } from "./I18nProvider";
import type { Locale } from "./todo-i18n";
import styles from "./todo.module.css";
export default function LanguageSelect() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className={styles.languageSelect}>
      <span>{t("Ngôn ngữ")}</span>
      <select
        aria-label={t("Ngôn ngữ")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
