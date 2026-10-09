"use client";
import { useI18n } from "./I18nProvider";
import type { Category } from "./todo-types";
import { priorityLabel } from "./todo-utils";
import Icon from "./Icon";
import styles from "./todo.module.css";
export type TodoFilter = {
  status: string;
  priority: string;
  category: string;
};
export default function ViewToolbar({
  showFilters,
  onToggle,
  filter,
  categories,
  onChange,
  count,
  query,
  onClear,
  hideStatus = false,
}: {
  showFilters: boolean;
  onToggle: () => void;
  filter: TodoFilter;
  categories: Category[];
  onChange: (filter: TodoFilter) => void;
  count: number;
  query: string;
  onClear: () => void;
  hideStatus?: boolean;
}) {
  const { t, taskCount } = useI18n();
  const active =
    Object.values(filter).some((value) => value !== "all") ||
    Boolean(query.trim());
  return (
    <div className={styles.viewToolbar}>
      <div className={styles.filterSummary}>
        <span>
          <strong>{taskCount(count)}</strong>
          {query.trim() ? t(" cho “{0}”", { "0": query.trim() }) : ""}
        </span>
        {active && (
          <button className={styles.textButton} onClick={onClear}>
            {t("Xóa bộ lọc")}
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
      <button
        className={styles.toolbarButton}
        aria-expanded={showFilters}
        aria-controls="task-filters"
        onClick={onToggle}
      >
        <Icon name="filter" size={18} />
        {t("Bộ lọc")}
        {active && <span className={styles.filterDot} />}
      </button>
      {showFilters && (
        <div id="task-filters" className={styles.filterBar}>
          {!hideStatus && (
            <label>
              {t("Trạng thái")}
              <select
                value={filter.status}
                onChange={(event) =>
                  onChange({ ...filter, status: event.target.value })
                }
              >
                <option value="all">{t("Tất cả trạng thái")}</option>
                <option value="active">{t("Chưa hoàn thành")}</option>
                <option value="completed">{t("Đã hoàn thành")}</option>
                <option value="overdue">{t("Quá hạn")}</option>
              </select>
            </label>
          )}
          <label>
            {t("Ưu tiên")}
            <select
              value={filter.priority}
              onChange={(event) =>
                onChange({ ...filter, priority: event.target.value })
              }
            >
              <option value="all">{t("Tất cả mức ưu tiên")}</option>
              {Object.entries(priorityLabel).map(([value, label]) => (
                <option value={value} key={value}>
                  {t(label)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Danh mục")}
            <select
              value={filter.category}
              onChange={(event) =>
                onChange({ ...filter, category: event.target.value })
              }
            >
              <option value="all">{t("Tất cả danh mục")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
