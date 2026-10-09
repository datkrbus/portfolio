import type { Recurrence, Todo, TodoStatus } from "./todo-types";

export const dateFrom = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const today = () => dateFrom(new Date());
export const parseDate = (value: string) => new Date(`${value}T12:00:00`);
export const isDate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(parseDate(value).getTime()) &&
  dateFrom(parseDate(value)) === value;
export const isTime = (value: unknown): value is string =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export function addDays(value: string, amount: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  return dateFrom(date);
}
export function addMonths(value: string, amount: number) {
  const date = parseDate(value);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, last));
  return dateFrom(date);
}
export function weekStart(
  value: string,
  firstDay: "monday" | "sunday" = "monday",
) {
  const day = parseDate(value).getDay();
  return addDays(value, -((day + (firstDay === "monday" ? 6 : 0)) % 7));
}
export function monthDays(
  value: string,
  firstDay: "monday" | "sunday" = "monday",
) {
  const first = `${value.slice(0, 7)}-01`;
  const start = weekStart(first, firstDay);
  const date = parseDate(value);
  const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const offset =
    (parseDate(first).getDay() + (firstDay === "monday" ? 6 : 0)) % 7;
  return Array.from({ length: Math.ceil((count + offset) / 7) * 7 }, (_, i) =>
    addDays(start, i),
  );
}
export function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}
export function endTimeFor(start: string, duration: number) {
  const minutes = Math.min(1439, timeToMinutes(start) + Math.max(1, duration));
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
export function nextRecurrenceDate(value: string, recurrence: Recurrence) {
  const interval = Math.max(1, Math.trunc(recurrence.interval));
  let next: string;
  if (recurrence.frequency === "monthly" || recurrence.frequency === "yearly") {
    next = addMonths(
      value,
      interval * (recurrence.frequency === "yearly" ? 12 : 1),
    );
  } else if (
    recurrence.days?.length &&
    (recurrence.frequency === "weekly" || recurrence.frequency === "custom")
  ) {
    const base = weekStart(value);
    next = addDays(value, 1);
    // Selected weekdays repeat in each active week, with Monday as the anchor.
    for (let offset = 1; offset <= interval * 7 + 7; offset++) {
      next = addDays(value, offset);
      const weeks = Math.round(
        (parseDate(weekStart(next)).getTime() - parseDate(base).getTime()) /
          604800000,
      );
      if (
        weeks % interval === 0 &&
        recurrence.days.includes(parseDate(next).getDay())
      )
        break;
    }
  } else {
    next = addDays(
      value,
      interval * (recurrence.frequency === "weekly" ? 7 : 1),
    );
  }
  return !recurrence.until || next <= recurrence.until ? next : null;
}
export const statusFor = (todo: Todo): TodoStatus =>
  todo.completed
    ? "done"
    : todo.status === "done"
      ? "todo"
      : todo.status || "todo";
export function groupTodos(todos: Todo[], key: (todo: Todo) => string) {
  const groups = new Map<string, Todo[]>();
  for (const todo of todos) {
    const value = key(todo);
    const group = groups.get(value);
    if (group) group.push(todo);
    else groups.set(value, [todo]);
  }
  return groups;
}
export function matchesTodo(
  todo: Todo,
  query: string,
  filter: { status: string; priority: string; category: string },
  date: string,
) {
  return (
    (!query ||
      `${todo.title} ${todo.description} ${todo.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(query)) &&
    (filter.status === "all" ||
      (filter.status === "completed"
        ? todo.completed
        : filter.status === "overdue"
          ? !todo.completed && Boolean(todo.deadline) && todo.deadline < date
          : !todo.completed)) &&
    (filter.priority === "all" || todo.priority === filter.priority) &&
    (filter.category === "all" || todo.categoryId === filter.category)
  );
}
export function applyTodoUpdate(
  todos: Todo[],
  draft: Todo,
  now = new Date().toISOString(),
): Todo[] {
  const previous = todos.find(
    (todo) => todo.id === draft.id && todo.userId === draft.userId,
  );
  const next = {
    ...draft,
    title: draft.title.trim(),
    status: statusFor(draft),
    updatedAt: now,
    completedAt: draft.completed ? previous?.completedAt || now : undefined,
  };
  const result = previous
    ? todos.map((todo) => (todo === previous ? next : todo))
    : [next, ...todos];
  if (
    next.completed &&
    !previous?.completed &&
    next.recurrence &&
    !todos.some(
      (todo) =>
        todo.userId === next.userId && todo.recurrenceSourceId === next.id,
    )
  ) {
    const date = nextRecurrenceDate(next.date, next.recurrence);
    if (date) {
      const offset = Math.round(
        (parseDate(date).getTime() - parseDate(next.date).getTime()) / 86400000,
      );
      result.unshift({
        ...next,
        id: crypto.randomUUID(),
        recurrenceSourceId: next.id,
        date,
        deadline: next.deadline ? addDays(next.deadline, offset) : "",
        completed: false,
        status: "todo",
        completedAt: undefined,
        createdAt: now,
        subtasks: next.subtasks.map((task) => ({
          ...task,
          id: crypto.randomUUID(),
          completed: false,
        })),
      });
    }
  }
  return result;
}

export const formatDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
  locale = "vi-VN",
) => parseDate(value).toLocaleDateString(locale, options);
export const priorityLabel = {
  none: "Không ưu tiên",
  low: "Thấp",
  medium: "Vừa",
  high: "Cao",
} as const;

export const statusLabels = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  review: "Cần xem lại",
  done: "Hoàn thành",
} as const;
export const calendarLabels = {
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Lịch trình",
} as const;
export function relativeDate(
  value: string,
  reference = today(),
  locale: "vi" | "en" = "vi",
) {
  if (value === reference) return locale === "en" ? "Today" : "Hôm nay";
  if (value === addDays(reference, 1))
    return locale === "en" ? "Tomorrow" : "Ngày mai";
  if (value === addDays(reference, -1))
    return locale === "en" ? "Yesterday" : "Hôm qua";
  return formatDate(
    value,
    {
      day: "numeric",
      month: "numeric",
      ...(value.slice(0, 4) !== reference.slice(0, 4)
        ? { year: "numeric" }
        : {}),
    },
    locale === "en" ? "en-US" : "vi-VN",
  );
}
export type SortOrder = "scheduled" | "priority" | "newest";
export function sortTodos(todos: Todo[], order: SortOrder): Todo[] {
  const rank = { high: 0, medium: 1, low: 2, none: 3 };
  return [...todos].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      (order === "priority"
        ? rank[a.priority] - rank[b.priority]
        : order === "newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : 0) ||
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  );
}
