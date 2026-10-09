"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useRef, useState } from "react";
import type { Category, View } from "./todo-types";
import Icon, { type IconName } from "./Icon";
import styles from "./todo.module.css";
export const viewLabels: Record<View, string> = {
  dashboard: "Công việc",
  today: "Hôm nay",
  upcoming: "Sắp tới",
  calendar: "Lịch",
  completed: "Đã hoàn thành",
  statistics: "Thống kê",
  settings: "Cài đặt",
};
const items: {
  view: View;
  icon: IconName;
}[] = [
  { view: "dashboard", icon: "board" },
  { view: "today", icon: "sun" },
  { view: "upcoming", icon: "arrow" },
  { view: "calendar", icon: "calendar" },
  { view: "completed", icon: "check" },
  { view: "statistics", icon: "chart" },
];
export default function WorkspaceNav({
  view,
  onView,
  categories,
  categoryId,
  counts,
  todayCount,
  username,
  onCategory,
  onManage,
  onNew,
}: {
  view: View;
  onView: (view: View) => void;
  categories: Category[];
  categoryId: string;
  counts: Map<string, number>;
  todayCount: number;
  username: string;
  onCategory: (id: string) => void;
  onManage: () => void;
  onNew: () => void;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const moreTrigger = useRef<HTMLButtonElement>(null);
  const morePanel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        moreTrigger.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !morePanel.current?.contains(target) &&
        !moreTrigger.current?.contains(target)
      )
        setExpanded(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, [expanded]);
  function navigate(value: View) {
    if (expanded) moreTrigger.current?.focus();
    onView(value);
    setExpanded(false);
  }
  return (
    <>
      <aside className={styles.sidebar}>
        <a href="#todo-content" className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="check" />
          </span>
          <span>
            quietly<span className={styles.brandAccent}>done</span>
            <small>{t("Không gian của bạn")}</small>
          </span>
        </a>
        <button className={styles.newButton} onClick={onNew}>
          <Icon name="plus" />
          {t("Thêm công việc")}
        </button>
        <p className={styles.sideLabel}>{t("KHÔNG GIAN LÀM VIỆC")}</p>
        <nav className={styles.nav} aria-label={t("Điều hướng chính")}>
          {items.map((item) => (
            <button
              key={item.view}
              className={`${styles.navButton} ${view === item.view ? styles.navActive : ""}`}
              aria-current={view === item.view ? "page" : undefined}
              onClick={() => navigate(item.view)}
            >
              <Icon name={item.icon} />
              <span>{t(viewLabels[item.view])}</span>
              {item.view === "today" && todayCount > 0 && <b>{todayCount}</b>}
            </button>
          ))}
        </nav>
        <div className={styles.sideSection}>
          <div className={styles.sideLabel}>
            {t("DANH MỤC")}
            <button
              className={styles.iconButton}
              aria-label={t("Quản lý danh mục")}
              onClick={onManage}
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
          <button
            className={`${styles.categoryLink} ${categoryId === "all" && view === "dashboard" ? styles.categoryActive : ""}`}
            onClick={() => onCategory("all")}
          >
            <Icon name="folder" size={17} />
            <span>{t("Tất cả danh mục")}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryLink} ${categoryId === category.id ? styles.categoryActive : ""}`}
              onClick={() => onCategory(category.id)}
            >
              <i style={{ background: category.color }} />
              <span>{category.name}</span>
              <small>{counts.get(category.id) || 0}</small>
            </button>
          ))}
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.localBadge}>
            <Icon name="device" size={16} />
            <span>{t("Lưu trên thiết bị này")}</span>
          </div>
          <button
            className={`${styles.profileButton} ${view === "settings" ? styles.navActive : ""}`}
            onClick={() => navigate("settings")}
          >
            <span className={styles.avatar}>
              {username.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{username}</strong>
              <small>{t("Cài đặt không gian")}</small>
            </span>
            <Icon name="settings" size={18} />
          </button>
        </div>
      </aside>
      <nav
        className={styles.mobileNav}
        aria-label={t("Điều hướng trên điện thoại")}
      >
        {items
          .filter((item) =>
            ["dashboard", "today", "calendar"].includes(item.view),
          )
          .map((item) => (
            <button
              key={item.view}
              aria-current={view === item.view ? "page" : undefined}
              onClick={() => navigate(item.view)}
            >
              <Icon name={item.icon} />
              <span>{t(viewLabels[item.view])}</span>
            </button>
          ))}
        <button
          ref={moreTrigger}
          aria-expanded={expanded}
          aria-controls="more-navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <Icon name="menu" />
          <span>{t("Thêm")}</span>
        </button>
      </nav>
      {expanded && (
        <nav
          ref={morePanel}
          id="more-navigation"
          className={styles.mobileMore}
          aria-label={t("Các màn hình khác")}
        >
          {[
            ...items.filter((item) =>
              ["upcoming", "completed", "statistics"].includes(item.view),
            ),
            { view: "settings" as View, icon: "settings" as IconName },
          ].map((item) => (
            <button key={item.view} onClick={() => navigate(item.view)}>
              <Icon name={item.icon} />
              {t(viewLabels[item.view])}
            </button>
          ))}
          <button
            onClick={() => {
              setExpanded(false);
              onManage();
            }}
          >
            <Icon name="folder" />
            {t("Quản lý danh mục")}
          </button>
        </nav>
      )}
    </>
  );
}
