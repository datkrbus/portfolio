"use client";
import { useI18n } from "./I18nProvider";
import { useMemo } from "react";
import type { Category, Todo } from "./todo-types";
import { groupTodos, today } from "./todo-utils";
import Icon, { type IconName } from "./Icon";
import styles from "./todo.module.css";
export default function Statistics({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  const { t } = useI18n();
  const completed = todos.filter((todo) => todo.completed).length;
  const overdue = todos.filter(
    (todo) => !todo.completed && todo.deadline && todo.deadline < today(),
  ).length;
  const groups = useMemo(
    () => groupTodos(todos, (todo) => todo.categoryId),
    [todos],
  );
  const metrics: {
    label: string;
    value: string | number;
    icon: IconName;
  }[] = [
    { label: t("Tổng công việc"), value: todos.length, icon: "list" },
    { label: t("Đã hoàn thành"), value: completed, icon: "check" },
    { label: t("Đã quá hạn"), value: overdue, icon: "clock" },
    {
      label: t("Tỷ lệ hoàn thành"),
      value: `${todos.length ? Math.round((completed / todos.length) * 100) : 0}%`,
      icon: "chart",
    },
  ];
  const breakdown = [
    ...categories.map((category) => ({
      ...category,
      tasks: groups.get(category.id) || [],
    })),
    ...(groups.get("")?.length
      ? [
          {
            id: "",
            name: t("Chưa phân loại"),
            color: "#7b8790",
            tasks: groups.get("")!,
          },
        ]
      : []),
  ];
  return (
    <section className={styles.statistics}>
      <div className={styles.statsGrid}>
        {metrics.map((metric) => (
          <div className={styles.metric} key={metric.label}>
            <span className={styles.summaryIcon}>
              <Icon name={metric.icon} />
            </span>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
      <section className={styles.panel}>
        <header className={styles.panelHeader}>
          <div>
            <h2>{t("Tiến độ theo danh mục")}</h2>
            <p>
              {t("Phần màu là công việc đã hoàn thành trong từng danh mục.")}
            </p>
          </div>
        </header>
        {breakdown.length ? (
          breakdown.map((category) => {
            const done = category.tasks.filter((todo) => todo.completed).length;
            return (
              <div className={styles.statBar} key={category.id}>
                <span>
                  <i style={{ background: category.color }} />
                  {category.name}
                </span>
                <div
                  role="progressbar"
                  aria-label={t("Tiến độ {0}", { "0": category.name })}
                  aria-valuemin={0}
                  aria-valuemax={category.tasks.length || 1}
                  aria-valuenow={done}
                >
                  <i
                    style={{
                      width: `${category.tasks.length ? (done / category.tasks.length) * 100 : 0}%`,
                      background: category.color,
                    }}
                  />
                </div>
                <b>
                  {done}/{category.tasks.length}
                </b>
              </div>
            );
          })
        ) : (
          <div className={styles.empty}>
            <Icon name="chart" size={28} />
            <h3>{t("Chưa có dữ liệu thống kê")}</h3>
            <p>
              {t("Tiến độ sẽ xuất hiện khi bạn thêm và hoàn thành công việc.")}
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
