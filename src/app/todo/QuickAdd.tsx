"use client";
import { useI18n } from "./I18nProvider";
import { useState, type FormEvent } from "react";
import { addDays, today } from "./todo-utils";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function QuickAdd({
  onAdd,
  onDetails,
}: {
  onAdd: (title: string, date: string) => void | boolean;
  onDetails: () => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("today");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    if (
      onAdd(
        title.trim(),
        when === "tomorrow" ? addDays(today(), 1) : today(),
      ) === false
    )
      return;
    setTitle("");
  }
  return (
    <form className={styles.quickAdd} onSubmit={submit}>
      <Icon name="plus" />
      <input
        aria-label={t("Tên công việc mới")}
        placeholder={t("Bạn cần làm gì?")}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={300}
      />
      <select
        value={when}
        aria-label={t("Ngày thêm nhanh")}
        onChange={(event) => setWhen(event.target.value)}
      >
        <option value="today">{t("Hôm nay")}</option>
        <option value="tomorrow">{t("Ngày mai")}</option>
      </select>
      <button className={styles.primaryButton} disabled={!title.trim()}>
        {t("Thêm")}
      </button>
      <button
        type="button"
        className={styles.iconButton}
        title={t("Mở form đầy đủ")}
        aria-label={t("Mở form đầy đủ")}
        onClick={onDetails}
      >
        <Icon name="more" />
      </button>
    </form>
  );
}
