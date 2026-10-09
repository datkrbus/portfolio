"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Category, Todo, TodoStatus } from "./todo-types";
import {
  groupTodos,
  statusFor,
  statusLabels,
  priorityLabel,
  today,
} from "./todo-utils";
import TaskActions from "./TaskActions";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function BoardView({
  todos,
  categories,
  categoryFilter,
  onOpen,
  onToggle,
  onCopy,
  onDelete,
  onMove,
  onCreate,
}: {
  todos: Todo[];
  categories: Category[];
  categoryFilter: string;
  onOpen: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onCopy: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onMove: (todo: Todo, status: TodoStatus) => void;
  onCreate: (title: string, status: TodoStatus, category: string) => void;
}) {
  const { t, relativeDate } = useI18n();
  const [addingTo, setAddingTo] = useState<TodoStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [dragOver, setDragOver] = useState<TodoStatus | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (addingTo) input.current?.focus();
  }, [addingTo]);
  const groups = useMemo(() => groupTodos(todos, statusFor), [todos]);
  const categoryMap = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories],
  );
  function submit(event: FormEvent, status: TodoStatus) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    onCreate(newTitle.trim(), status, categoryFilter);
    setNewTitle("");
    setAddingTo(null);
  }
  return (
    <section className={styles.board} aria-label={t("Bảng công việc")}>
      <div className={styles.boardColumns}>
        {(Object.entries(statusLabels) as [TodoStatus, string][]).map(
          ([status, label]) => {
            const tasks = groups.get(status) || [];
            return (
              <section
                key={status}
                aria-label={t(label)}
                data-status={status}
                className={`${styles.boardColumn} ${dragOver === status ? styles.dropTarget : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(status);
                }}
                onDragLeave={(event) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  )
                    setDragOver(null);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(null);
                  const todo = todos.find(
                    (item) => item.id === event.dataTransfer.getData("todo"),
                  );
                  if (todo && statusFor(todo) !== status) onMove(todo, status);
                }}
              >
                <header className={styles.boardHeader}>
                  <span className={styles.statusDot} />
                  <h3>{t(label)}</h3>
                  <span className={styles.boardCount}>{tasks.length}</span>
                  <button
                    className={styles.iconButton}
                    aria-label={t("Thêm vào {0}", { "0": t(label) })}
                    onClick={() => {
                      setAddingTo(status);
                      setNewTitle("");
                    }}
                  >
                    <Icon name="plus" size={17} />
                  </button>
                </header>
                {addingTo === status && (
                  <form
                    className={styles.inlineTaskForm}
                    onSubmit={(event) => submit(event, status)}
                  >
                    <input
                      ref={input}
                      aria-label={t("Công việc mới trong {0}", {
                        "0": t(label),
                      })}
                      placeholder={t("Tên công việc...")}
                      value={newTitle}
                      maxLength={300}
                      onChange={(event) => setNewTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setAddingTo(null);
                      }}
                    />
                    <div>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={() => setAddingTo(null)}
                      >
                        {t("Hủy")}
                      </button>
                      <button
                        className={styles.primaryButton}
                        disabled={!newTitle.trim()}
                      >
                        {t("Thêm")}
                      </button>
                    </div>
                  </form>
                )}
                <div className={styles.boardCards}>
                  {tasks.map((todo) => {
                    const category = categoryMap.get(todo.categoryId);
                    const done = todo.completed;
                    const overdue =
                      !done && todo.deadline && todo.deadline < today();
                    const completed = todo.subtasks.filter(
                      (item) => item.completed,
                    ).length;
                    return (
                      <article
                        key={todo.id}
                        className={`${styles.boardCard} ${done ? styles.boardCardDone : ""}`}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("todo", todo.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setDragOver(null)}
                      >
                        <div className={styles.cardTop}>
                          {category ? (
                            <span className={styles.categoryBadge}>
                              <i style={{ background: category.color }} />
                              {category.name}
                            </span>
                          ) : (
                            <span />
                          )}
                          <TaskActions
                            todo={todo}
                            onOpen={onOpen}
                            onCopy={onCopy}
                            onDelete={onDelete}
                            onMove={onMove}
                          />
                        </div>
                        <button
                          className={styles.boardCardBody}
                          onClick={() => onOpen(todo)}
                        >
                          <strong>{todo.title}</strong>
                          {todo.description && <p>{todo.description}</p>}
                        </button>
                        {todo.subtasks.length > 0 && (
                          <div className={styles.subtaskProgress}>
                            <div
                              role="progressbar"
                              aria-label={t("Tiến độ việc con")}
                              aria-valuenow={completed}
                              aria-valuemax={todo.subtasks.length}
                              aria-valuemin={0}
                            >
                              <i
                                style={{
                                  width: `${(completed / todo.subtasks.length) * 100}%`,
                                }}
                              />
                            </div>
                            <small>
                              {completed}/{todo.subtasks.length} {t("việc con")}
                            </small>
                          </div>
                        )}
                        <footer className={styles.cardFooter}>
                          <span className={overdue ? styles.overdueText : ""}>
                            <Icon name="calendar" size={14} />
                            {overdue ? t("Quá hạn") : relativeDate(todo.date)}
                          </span>
                          {todo.priority !== "none" && (
                            <span
                              className={`${styles.priority} ${styles[`priority${todo.priority}`]}`}
                            >
                              {t(priorityLabel[todo.priority])}
                            </span>
                          )}
                          <button
                            className={`${styles.completeButton} ${done ? styles.checked : ""}`}
                            aria-label={t(
                              done ? "Mở lại: {0}" : "Hoàn thành: {0}",
                              { "0": todo.title },
                            )}
                            aria-pressed={done}
                            onClick={() => onToggle(todo)}
                          >
                            {done && <Icon name="check" size={14} />}
                          </button>
                        </footer>
                      </article>
                    );
                  })}
                </div>
                {!tasks.length && !addingTo && (
                  <button
                    className={styles.columnEmpty}
                    onClick={() => setAddingTo(status)}
                  >
                    <Icon name="plus" size={20} />
                    <span>{t("Thêm công việc")}</span>
                    <small>{t("hoặc kéo công việc vào đây")}</small>
                  </button>
                )}
              </section>
            );
          },
        )}
      </div>
    </section>
  );
}
