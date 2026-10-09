"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useMemo, useRef } from "react";
import type { CalendarView, Todo } from "./todo-types";
import {
  addDays,
  endTimeFor,
  groupTodos,
  timeToMinutes,
  weekStart,
} from "./todo-utils";
import CalendarToolbar from "./CalendarToolbar";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function TimelineCalendar({
  todos,
  cursor,
  calendarView,
  firstDay,
  onCursor,
  onCalendarView,
  onOpen,
  onMove,
  onCreate,
}: {
  todos: Todo[];
  cursor: string;
  calendarView: CalendarView;
  firstDay: "monday" | "sunday";
  onCursor: (date: string) => void;
  onCalendarView: (view: CalendarView) => void;
  onOpen: (todo: Todo) => void;
  onMove: (todo: Todo, date: string, start: string, end: string) => void;
  onCreate: (date: string, start?: string) => void;
}) {
  const { t, formatDate } = useI18n();
  const days = useMemo(
    () =>
      Array.from({ length: calendarView === "week" ? 7 : 1 }, (_, index) =>
        addDays(
          calendarView === "day" ? cursor : weekStart(cursor, firstDay),
          index,
        ),
      ),
    [calendarView, cursor, firstDay],
  );
  const slots = useMemo(
    () =>
      groupTodos(
        todos,
        (todo) =>
          `${todo.date}:${todo.allDay ? "all" : Number(todo.startTime.slice(0, 2))}`,
      ),
    [todos],
  );
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scroll.current;
    const row = container?.querySelector<HTMLElement>('[data-hour="8"]');
    if (container && row)
      container.scrollTop = row.offsetTop - container.offsetTop - 50;
  }, [calendarView]);
  const title =
    calendarView === "week"
      ? `${formatDate(days[0])} – ${formatDate(days[6])}`
      : formatDate(cursor, { weekday: "long", day: "numeric", month: "long" });
  function drop(event: React.DragEvent, day: string, hour: number) {
    event.preventDefault();
    const todo = todos.find(
      (item) => item.id === event.dataTransfer.getData("todo"),
    );
    if (!todo) return;
    const start = `${String(hour).padStart(2, "0")}:00`;
    onMove(
      todo,
      day,
      start,
      endTimeFor(
        start,
        Math.max(
          30,
          timeToMinutes(todo.endTime) - timeToMinutes(todo.startTime),
        ),
      ),
    );
  }
  return (
    <section className={styles.calendar}>
      <CalendarToolbar
        title={title}
        cursor={cursor}
        view={calendarView}
        onCursor={onCursor}
        onView={onCalendarView}
        onPrevious={() =>
          onCursor(addDays(cursor, calendarView === "week" ? -7 : -1))
        }
        onNext={() =>
          onCursor(addDays(cursor, calendarView === "week" ? 7 : 1))
        }
      />
      <div
        ref={scroll}
        className={`${styles.timeline} ${calendarView === "day" ? styles.timelineDay : ""}`}
        role="region"
        aria-label={t("Lịch theo giờ")}
      >
        <div className={styles.timelineHeader}>
          <span />
          <>
            {days.map((day) => (
              <strong key={day}>
                {formatDate(day, {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                })}
              </strong>
            ))}
          </>
        </div>
        <div className={styles.timelineRow}>
          <span className={styles.timeLabel}>{t("Cả ngày")}</span>
          {days.map((day) => (
            <div className={styles.timeSlot} key={day}>
              {(slots.get(`${day}:all`) || []).map((todo) => (
                <button
                  key={todo.id}
                  className={`${styles.timelineTask} ${styles.timelineAllDayTask}`}
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("todo", todo.id)
                  }
                  onClick={() => onOpen(todo)}
                >
                  <b>{todo.title}</b>
                </button>
              ))}
              <button
                className={styles.slotCreate}
                aria-label={t("Thêm việc cả ngày {0}", {
                  "0": formatDate(day),
                })}
                onClick={() => onCreate(day)}
              >
                <Icon name="plus" size={15} />
              </button>
            </div>
          ))}
        </div>
        {Array.from({ length: 24 }, (_, hour) => (
          <div className={styles.timelineRow} key={hour} data-hour={hour}>
            <span className={styles.timeLabel}>
              {String(hour).padStart(2, "0")}:00
            </span>
            {days.map((day) => (
              <div
                className={styles.timeSlot}
                key={day}
                onDoubleClick={(event) => {
                  if (event.target === event.currentTarget)
                    onCreate(day, `${String(hour).padStart(2, "0")}:00`);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, day, hour)}
              >
                {(slots.get(`${day}:${hour}`) || []).map((todo) => (
                  <button
                    key={todo.id}
                    className={styles.timelineTask}
                    draggable
                    onDragStart={(event) =>
                      event.dataTransfer.setData("todo", todo.id)
                    }
                    onClick={() => onOpen(todo)}
                  >
                    <b>{todo.title}</b>
                    <small>
                      {todo.startTime} – {todo.endTime}
                    </small>
                  </button>
                ))}
                <button
                  className={styles.slotCreate}
                  aria-label={t("Thêm việc {0}:00 ngày {1}", {
                    "0": String(hour).padStart(2, "0"),
                    "1": formatDate(day),
                  })}
                  onClick={() =>
                    onCreate(day, `${String(hour).padStart(2, "0")}:00`)
                  }
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.calendarHint}>
        {t(
          "Bấm + để thêm việc. Kéo công việc sang khung giờ khác để đổi lịch.",
        )}
      </p>
    </section>
  );
}
