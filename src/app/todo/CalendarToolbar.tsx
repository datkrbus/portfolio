"use client";
import { useI18n } from "./I18nProvider";
import type { CalendarView } from "./todo-types";
import { calendarLabels, isDate, today } from "./todo-utils";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function CalendarToolbar({
  title,
  cursor,
  view,
  onCursor,
  onView,
  onPrevious,
  onNext,
}: {
  title: string;
  cursor: string;
  view: CalendarView;
  onCursor: (date: string) => void;
  onView: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className={styles.calendarToolbar}>
      <div className={styles.calendarNav}>
        <button aria-label={t("Khoảng trước")} onClick={onPrevious}>
          <Icon
            name="chevron"
            size={16}
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
        <button onClick={() => onCursor(today())}>{t("Hôm nay")}</button>
        <button aria-label={t("Khoảng tiếp theo")} onClick={onNext}>
          <Icon name="chevron" size={16} />
        </button>
        <h2>{title}</h2>
      </div>
      <div className={styles.viewTabs} aria-label={t("Kiểu lịch")}>
        {(Object.entries(calendarLabels) as [CalendarView, string][]).map(
          ([value, label]) => (
            <button
              key={value}
              aria-pressed={value === view}
              className={value === view ? styles.tabActive : ""}
              onClick={() => onView(value)}
            >
              {t(label)}
            </button>
          ),
        )}
      </div>
      <label className={styles.calendarJump}>
        {t("Đi đến ngày")}
        <input
          type="date"
          value={cursor}
          onChange={(event) => {
            if (isDate(event.target.value)) onCursor(event.target.value);
          }}
        />
      </label>
    </div>
  );
}
