"use client";
import { useI18n } from "./I18nProvider";
import { useMemo } from "react";
import type { Todo, Category } from "./todo-types";
import { groupTodos, priorityLabel, today } from "./todo-utils";
import TaskActions from "./TaskActions";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function TaskList({
  title,
  todos,
  categories,
  onToggle,
  onOpen,
  onDelete,
  onCopy,
  empty,
  grouped,
  onCreate,
  onReset,
  filtered = false,
}: {
  title: string;
  todos: Todo[];
  categories: Category[];
  onToggle: (todo: Todo) => void;
  onOpen: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  onCopy: (todo: Todo) => void;
  empty: string;
  grouped?: boolean;
  onCreate?: () => void;
  onReset?: () => void;
  filtered?: boolean;
}) {
  const { t, formatDate, relativeDate, taskCount } = useI18n();
  const groups = useMemo(
    () =>
      grouped
        ? groupTodos(todos, (todo) => todo.date)
        : new Map([["all", todos]]),
    [todos, grouped],
  );
  const categoryMap = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories],
  );
  return (
    <section className={styles.taskList} aria-label={title}>
      <div className={styles.listHeading}>
        <h2>{title}</h2>
        <span>{taskCount(todos.length)}</span>
      </div>
      {Array.from(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, group]) => (
          <div className={styles.taskGroup} key={date}>
            {grouped && (
              <h3>
                {relativeDate(date)}{" "}
                <span>{formatDate(date, { weekday: "long" })}</span>
                <small>{group.length}</small>
              </h3>
            )}
            {group.map((todo) => {
              const category = categoryMap.get(todo.categoryId);
              const overdue =
                !todo.completed && todo.deadline && todo.deadline < today();
              return (
                <article
                  key={todo.id}
                  className={`${styles.taskRow} ${todo.completed ? styles.taskDone : ""}`}
                >
                  <button
                    className={`${styles.completeButton} ${todo.completed ? styles.checked : ""}`}
                    aria-label={t(
                      todo.completed ? "Mở lại: {0}" : "Hoàn thành: {0}",
                      { "0": todo.title },
                    )}
                    aria-pressed={todo.completed}
                    onClick={() => onToggle(todo)}
                  >
                    {todo.completed && <Icon name="check" size={15} />}
                  </button>
                  <button
                    className={styles.taskMain}
                    onClick={() => onOpen(todo)}
                  >
                    <strong>{todo.title}</strong>
                    <span>
                      {relativeDate(todo.date)} ·{" "}
                      {todo.allDay
                        ? t("Cả ngày")
                        : `${todo.startTime}–${todo.endTime}`}
                      {todo.subtasks.length > 0 &&
                        t(" · {0}/{1} việc con", {
                          "0": todo.subtasks.filter((item) => item.completed)
                            .length,
                          "1": todo.subtasks.length,
                        })}
                    </span>
                  </button>
                  <div className={styles.taskBadges}>
                    {overdue && (
                      <span className={styles.overdueBadge}>
                        {t("Quá hạn")}
                      </span>
                    )}
                    {category && (
                      <span className={styles.categoryBadge}>
                        <i style={{ background: category.color }} />
                        {category.name}
                      </span>
                    )}
                    {todo.priority !== "none" && (
                      <span
                        className={`${styles.priority} ${styles[`priority${todo.priority}`]}`}
                      >
                        {t(priorityLabel[todo.priority])}
                      </span>
                    )}
                  </div>
                  <TaskActions
                    todo={todo}
                    onOpen={onOpen}
                    onCopy={onCopy}
                    onDelete={onDelete}
                  />
                </article>
              );
            })}
          </div>
        ))}
      {!todos.length && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name={filtered ? "search" : "check"} size={28} />
          </span>
          <h3>{filtered ? t("Không tìm thấy công việc") : empty}</h3>
          <p>
            {filtered
              ? t("Thử từ khóa khác hoặc bỏ bớt điều kiện lọc.")
              : t("Một khoảng trống để bạn chủ động lên kế hoạch.")}
          </p>
          {filtered && onReset ? (
            <button className={styles.outlineButton} onClick={onReset}>
              {t("Xóa bộ lọc")}
            </button>
          ) : (
            onCreate && (
              <button className={styles.primaryButton} onClick={onCreate}>
                <Icon name="plus" size={18} />
                {t("Thêm công việc")}
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}
