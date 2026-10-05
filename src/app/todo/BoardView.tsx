"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./todo.module.css";
import type { Category, Todo, TodoStatus } from "./todo-types";

const columns: Array<{ id: TodoStatus; label: string }> = [
  { id: "todo", label: "Việc cần làm" },
  { id: "in_progress", label: "Đang thực hiện" },
  { id: "review", label: "Đang xem xét" },
  { id: "done", label: "Hoàn tất" },
];
const priorityLabels = {
  none: "",
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export default function BoardView({
  todos,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  onOpen,
  onToggle,
  onMove,
  onCreate,
}: {
  todos: Todo[];
  categories: Category[];
  onOpen: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onMove: (todo: Todo, status: TodoStatus) => void;
  categoryFilter: string;
  onCategoryFilterChange: (categoryId: string) => void;
  onCreate: (title: string, status: TodoStatus, categoryId: string) => void;
}) {
  const [addingTo, setAddingTo] = useState<TodoStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const filteredTodos = useMemo(
    () =>
      categoryFilter === "all"
        ? todos
        : todos.filter((todo) => todo.categoryId === categoryFilter),
    [categoryFilter, todos],
  );
  const statusFor = (todo: Todo): TodoStatus =>
    todo.status || (todo.completed ? "done" : "todo");

  function submit(event: FormEvent, status: TodoStatus) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    onCreate(newTitle.trim(), status, categoryFilter);
    setNewTitle("");
    setAddingTo(null);
  }

  return (
    <section className={styles.board} aria-label="Todo board">
      <div className={styles.boardToolbar}>
        <span className={styles.boardToolbarLabel}>Board</span>
        <label className={styles.boardFilter}>
          Category
          <select
            value={categoryFilter}
            onChange={(event) => onCategoryFilterChange(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.boardColumns}>
        {columns.map((column) => {
          const columnTodos = filteredTodos.filter(
            (todo) => statusFor(todo) === column.id,
          );
          return (
            <div
              className={styles.boardColumn}
              key={column.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const todo = todos.find(
                  (item) => item.id === event.dataTransfer.getData("todo"),
                );
                if (todo) onMove(todo, column.id);
              }}
            >
              <header className={styles.boardHeader}>
                <div className={styles.boardHeaderTitle}>
                  <span
                    className={`${styles.statusDot} ${styles[`status${column.id.replace("_", "_").replace(/^./, (letter) => letter.toUpperCase())}`]}`}
                  />
                  <strong>{column.label}</strong>
                  <span className={styles.boardCount}>
                    {columnTodos.length}
                  </span>
                </div>
                {addingTo === column.id ? (
                  <form
                    className={styles.inlineTaskForm}
                    onSubmit={(event) => submit(event, column.id)}
                  >
                    <input
                      autoFocus
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                      placeholder="Task name"
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setAddingTo(null);
                          setNewTitle("");
                        }
                      }}
                    />
                    <button aria-label="Create task">+</button>
                  </form>
                ) : (
                  <button
                    className={styles.boardAddTop}
                    onClick={() => setAddingTo(column.id)}
                  >
                    + New task
                  </button>
                )}
              </header>
              <div className={styles.boardCards}>
                {columnTodos.map((todo) => {
                  const category = categories.find(
                    (item) => item.id === todo.categoryId,
                  );
                  const isDone = statusFor(todo) === "done";
                  const subtasks = Array.isArray(todo.subtasks)
                    ? todo.subtasks
                    : [];
                  const priorityClass =
                    `priorityCard${todo.priority.charAt(0).toUpperCase()}${todo.priority.slice(1)}` as keyof typeof styles;
                  return (
                    <article
                      className={`${styles.boardCard} ${styles[priorityClass]} ${isDone ? styles.boardCardDone : ""}`}
                      draggable
                      key={todo.id}
                      onDragStart={(event) =>
                        event.dataTransfer.setData("todo", todo.id)
                      }
                    >
                      <button
                        className={styles.boardCardBody}
                        onClick={() => onOpen(todo)}
                      >
                        <strong>{todo.title}</strong>
                        <span>
                          {todo.date}
                          {category && (
                            <>
                              <i style={{ background: category.color }} />
                              {category.name}
                            </>
                          )}
                          {priorityLabels[todo.priority] && (
                            <b className={styles.priorityMeta}>
                              {priorityLabels[todo.priority]}
                            </b>
                          )}
                        </span>
                        {subtasks.length > 0 && (
                          <span className={styles.boardSubtasks}>
                            {subtasks.slice(0, 3).map((subtask) => (
                              <span
                                key={subtask.id}
                                className={
                                  subtask.completed
                                    ? styles.boardSubtaskDone
                                    : ""
                                }
                              >
                                <i>{subtask.completed ? "✓" : "·"}</i>
                                {subtask.title}
                              </span>
                            ))}
                            {subtasks.length > 3 && (
                              <small>+{subtasks.length - 3} more</small>
                            )}
                          </span>
                        )}
                      </button>
                      <button
                        className={styles.boardCompleteButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(todo);
                        }}
                        title={
                          isDone ? "Mark task active" : "Mark task complete"
                        }
                        aria-label={
                          isDone ? "Mark task active" : "Mark task complete"
                        }
                      >
                        {isDone ? "✓" : "○"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
