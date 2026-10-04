"use client";

import { useMemo } from "react";
import styles from "./todo.module.css";
import type { CalendarView, Todo } from "./todo-types";

const parseDate = (value: string) => new Date(`${value}T12:00:00`);
const dateFrom = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, amount: number) => {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  return dateFrom(date);
};
const weekStart = (value: string) => {
  const date = parseDate(value);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return dateFrom(date);
};
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const minutesToTime = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
const formatDate = (value: string) =>
  parseDate(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function TimelineCalendar({
  todos,
  cursor,
  calendarView,
  onCursor,
  onOpen,
  onMove,
  onCreate,
}: {
  todos: Todo[];
  cursor: string;
  calendarView: CalendarView;
  onCursor: (value: string) => void;
  onOpen: (todo: Todo) => void;
  onMove: (
    todo: Todo,
    date: string,
    startTime: string,
    endTime: string,
  ) => void;
  onCreate: (date: string, startTime: string) => void;
}) {
  const days = useMemo(
    () =>
      Array.from({ length: calendarView === "week" ? 7 : 1 }, (_, index) =>
        addDays(weekStart(cursor), index),
      ),
    [calendarView, cursor],
  );
  const hours = Array.from({ length: 16 }, (_, index) => index + 7);
  const title =
    calendarView === "week"
      ? `${formatDate(days[0])} - ${formatDate(days[6])}`
      : formatDate(cursor);

  return (
    <section className={styles.calendar}>
      <div className={styles.calendarToolbar}>
        <div className={styles.calendarNav}>
          <button
            onClick={() =>
              onCursor(addDays(cursor, calendarView === "week" ? -7 : -1))
            }
          >
            ←
          </button>
          <button
            onClick={() => onCursor(new Date().toISOString().slice(0, 10))}
          >
            Today
          </button>
          <button
            onClick={() =>
              onCursor(addDays(cursor, calendarView === "week" ? 7 : 1))
            }
          >
            →
          </button>
          <h2>{title}</h2>
        </div>
        <span className={styles.timelineHint}>
          Drag a task to reschedule · double-click a slot to create
        </span>
      </div>
      <div
        className={`${styles.timeline} ${calendarView === "day" ? styles.timelineDay : ""}`}
      >
        <div className={styles.timelineHeader}>
          <span />
          {days.map((day) => (
            <strong key={day}>{formatDate(day)}</strong>
          ))}
        </div>
        {hours.map((hour) => (
          <div className={styles.timelineRow} key={hour}>
            <span className={styles.timeLabel}>
              {String(hour).padStart(2, "0")}:00
            </span>
            {days.map((day) => (
              <div
                className={styles.timeSlot}
                key={day}
                onDoubleClick={() =>
                  onCreate(day, `${String(hour).padStart(2, "0")}:00`)
                }
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const id = event.dataTransfer.getData("todo");
                  const todo = todos.find((item) => item.id === id);
                  if (!todo) return;
                  const start = `${String(hour).padStart(2, "0")}:00`;
                  const end = minutesToTime(
                    hour * 60 +
                      Math.max(
                        30,
                        timeToMinutes(todo.endTime) -
                          timeToMinutes(todo.startTime),
                      ),
                  );
                  onMove(todo, day, start, end);
                }}
              >
                {todos
                  .filter(
                    (todo) =>
                      todo.date === day &&
                      !todo.allDay &&
                      Number(todo.startTime.split(":")[0]) === hour,
                  )
                  .map((todo) => (
                    <button
                      className={`${styles.timelineTask} ${styles[`priority${todo.priority}`]}`}
                      draggable
                      key={todo.id}
                      onDragStart={(event) =>
                        event.dataTransfer.setData("todo", todo.id)
                      }
                      onClick={() => onOpen(todo)}
                    >
                      <b>{todo.title}</b>
                      <small>
                        {todo.startTime} - {todo.endTime}
                      </small>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
