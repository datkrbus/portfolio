"use client";
import { useI18n } from "./I18nProvider";
import { useMemo } from "react";
import type { Todo, Category, CalendarView } from "./todo-types";
import {
  addDays,
  addMonths,
  monthDays,
  groupTodos,
  parseDate,
  today,
} from "./todo-utils";
import CalendarToolbar from "./CalendarToolbar";
import TaskList from "./TaskList";
import styles from "./todo.module.css";
export default function MonthCalendar({
  todos,
  categories,
  cursor,
  calendarView,
  firstDay,
  onToggle,
  onCursor,
  onCalendarView,
  onOpen,
  onCopy,
  onDrop,
  onCreate,
}: {
  todos: Todo[];
  categories: Category[];
  cursor: string;
  calendarView: CalendarView;
  firstDay: "monday" | "sunday";
  onToggle: (todo: Todo) => void;
  onCursor: (date: string) => void;
  onCalendarView: (view: CalendarView) => void;
  onOpen: (todo: Todo) => void;
  onCopy: (todo: Todo) => void;
  onDrop: (todo: Todo, date: string) => void;
  onCreate: (date: string) => void;
}) {
  const { t, formatDate, weekday } = useI18n();
  const days = useMemo(() => monthDays(cursor, firstDay), [cursor, firstDay]);
  const groups = useMemo(() => groupTodos(todos, (todo) => todo.date), [todos]);
  const title =
    calendarView === "month"
      ? formatDate(cursor, {
          month: "long",
          year: "numeric",
        })
      : `${formatDate(cursor)} – ${formatDate(addDays(cursor, 29))}`;
  const shift = (amount: number) =>
    onCursor(
      calendarView === "month"
        ? addMonths(cursor, amount)
        : addDays(cursor, amount * 30),
    );
  return (
    <section className={styles.calendar}>
      <CalendarToolbar
        title={title}
        cursor={cursor}
        view={calendarView}
        onCursor={onCursor}
        onView={onCalendarView}
        onPrevious={() => shift(-1)}
        onNext={() => shift(1)}
      />
      {calendarView === "agenda" ? (
        <TaskList
          title={t("Lịch trình 30 ngày")}
          todos={[...todos]
            .filter(
              (todo) => todo.date >= cursor && todo.date <= addDays(cursor, 29),
            )
            .sort((a, b) =>
              `${a.date}${a.startTime}`.localeCompare(
                `${b.date}${b.startTime}`,
              ),
            )}
          grouped
          categories={categories}
          onToggle={onToggle}
          onOpen={onOpen}
          onCopy={onCopy}
          onCreate={() => onCreate(cursor)}
          empty={t("Lịch trình đang trống")}
        />
      ) : (
        <div className={styles.calendarScroll}>
          <div className={styles.calendarGrid}>
            {(firstDay === "monday"
              ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
              : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
            ).map((day) => (
              <div key={day} className={styles.dayName}>
                {weekday(
                  ["CN", "T2", "T3", "T4", "T5", "T6", "T7"].indexOf(day),
                )}
              </div>
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`${styles.dayCell} ${day === today() ? styles.dayToday : ""} ${day.slice(0, 7) !== cursor.slice(0, 7) ? styles.dayOutside : ""}`}
                onDoubleClick={(event) => {
                  if (event.target === event.currentTarget) onCreate(day);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const task = todos.find(
                    (todo) => todo.id === event.dataTransfer.getData("todo"),
                  );
                  if (task) onDrop(task, day);
                }}
              >
                <button
                  className={styles.dayNumber}
                  aria-label={t("Thêm công việc ngày {0}", {
                    "0": formatDate(day, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  })}
                  onClick={() => onCreate(day)}
                >
                  {parseDate(day).getDate()}
                </button>
                {(groups.get(day) || []).map((todo) => (
                  <button
                    key={todo.id}
                    className={styles.calendarTask}
                    data-completed={todo.completed}
                    draggable
                    title={`${todo.title} · ${todo.allDay ? t("Cả ngày") : todo.startTime}`}
                    onDragStart={(event) =>
                      event.dataTransfer.setData("todo", todo.id)
                    }
                    onClick={() => onOpen(todo)}
                  >
                    {!todo.allDay && <small>{todo.startTime}</small>}
                    {todo.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className={styles.calendarHint}>
        {t(
          "Bấm vào số ngày để thêm việc. Kéo công việc sang ngày khác để đổi lịch.",
        )}
      </p>
    </section>
  );
}
