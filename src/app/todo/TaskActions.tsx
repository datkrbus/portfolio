"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useId, useRef, useState } from "react";
import type { Todo, TodoStatus } from "./todo-types";
import { statusFor, statusLabels } from "./todo-utils";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function TaskActions({
  todo,
  onOpen,
  onCopy,
  onDelete,
  onMove,
}: {
  todo: Todo;
  onOpen: (todo: Todo) => void;
  onCopy: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  onMove?: (todo: Todo, status: TodoStatus) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <div
      ref={ref}
      className={styles.taskActions}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className={styles.iconButton}
        aria-label={t("Thao tác: {0}", { "0": todo.title })}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        <Icon name="more" size={18} />
      </button>
      {open && (
        <div
          id={id}
          className={styles.taskMenuPopover}
          role="group"
          aria-label={t("Thao tác công việc")}
        >
          <button
            onClick={() => {
              trigger.current?.focus();
              setOpen(false);
              onOpen(todo);
            }}
          >
            <Icon name="list" size={16} />
            {t("Chỉnh sửa")}
          </button>
          {onMove && (
            <label>
              {t("Chuyển trạng thái")}
              <select
                aria-label={t("Chuyển trạng thái")}
                value={statusFor(todo)}
                onChange={(event) => {
                  trigger.current?.focus();
                  onMove(todo, event.target.value as TodoStatus);
                  setOpen(false);
                }}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {t(label)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            onClick={() => {
              trigger.current?.focus();
              onCopy(todo);
              setOpen(false);
            }}
          >
            <Icon name="copy" size={16} />
            {t("Nhân bản")}
          </button>
          {onDelete && (
            <button
              className={styles.dangerButton}
              onClick={() => {
                onDelete(todo.id);
                setOpen(false);
              }}
            >
              <Icon name="trash" size={16} />
              {t("Xóa công việc")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
