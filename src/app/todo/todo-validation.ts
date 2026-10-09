import type { Category, Settings, Todo } from "./todo-types";
import { isDate, isTime, statusFor } from "./todo-utils";

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected an object.");
  return value as Record<string, unknown>;
}
function string(value: unknown, fallback?: string): string {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== "string") throw new Error("Expected text.");
  return value;
}
function required(value: unknown) {
  const result = string(value).trim();
  if (!result) throw new Error("A required field is empty.");
  return result;
}
function flag(value: unknown, fallback = false): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new Error("Expected true or false.");
  return value;
}
function choice<T extends string>(
  value: unknown,
  values: readonly T[],
  fallback: T,
): T {
  if (value === undefined) return fallback;
  if (!values.includes(value as T)) throw new Error("Unrecognized option.");
  return value as T;
}
function integer(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (value === undefined) return fallback;
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  )
    throw new Error("Invalid number.");
  return value;
}
function date(value: unknown, optional = false) {
  if (optional && (value === undefined || value === "")) return "";
  if (!isDate(value)) throw new Error("Invalid date.");
  return value;
}
function time(value: unknown, fallback: string) {
  if (value === undefined) return fallback;
  if (!isTime(value)) throw new Error("Invalid time.");
  return value;
}
function timestamp(value: unknown, fallback: string) {
  const result = string(value, fallback);
  if (!Number.isFinite(Date.parse(result)))
    throw new Error("Invalid timestamp.");
  return result;
}
export function parseTodo(value: unknown): Todo {
  const item = object(value);
  const createdAt = timestamp(item.createdAt, new Date().toISOString());
  const allDay = flag(item.allDay);
  const startTime = time(item.startTime, "09:00");
  const endTime = time(item.endTime, "09:30");
  if (!allDay && endTime <= startTime)
    throw new Error("End time must be after start time.");
  const todo: Todo = {
    id: required(item.id),
    userId: string(item.userId, ""),
    title: required(item.title),
    description: string(item.description, ""),
    date: date(item.date),
    startTime,
    endTime,
    allDay,
    priority: choice(
      item.priority,
      ["none", "low", "medium", "high"] as const,
      "none",
    ),
    categoryId: string(item.categoryId, ""),
    completed: flag(item.completed),
    status: choice(
      item.status,
      ["todo", "in_progress", "review", "done"] as const,
      "todo",
    ),
    deadline: date(item.deadline, true),
    createdAt,
    updatedAt: timestamp(item.updatedAt, createdAt),
    tags:
      item.tags === undefined ? [] : array(item.tags).map((tag) => string(tag)),
    subtasks:
      item.subtasks === undefined
        ? []
        : array(item.subtasks).map((value) => {
            const task = object(value);
            return {
              id: required(task.id),
              title: required(task.title),
              completed: flag(task.completed),
            };
          }),
  };
  todo.status = statusFor(todo);
  if (item.completedAt !== undefined)
    todo.completedAt = timestamp(item.completedAt, createdAt);
  if (item.recurrenceSourceId !== undefined)
    todo.recurrenceSourceId = required(item.recurrenceSourceId);
  if (item.reminder != null)
    todo.reminder = {
      minutesBefore: integer(object(item.reminder).minutesBefore, 0, 10080, 5),
    };
  if (item.recurrence != null) {
    const rule = object(item.recurrence);
    todo.recurrence = {
      frequency: choice(
        rule.frequency,
        ["daily", "weekly", "monthly", "yearly", "custom"] as const,
        "weekly",
      ),
      interval: integer(rule.interval, 1, 99, 1),
      ...(rule.until ? { until: date(rule.until) } : {}),
      ...(rule.days !== undefined
        ? { days: array(rule.days).map((day) => integer(day, 0, 6, 0)) }
        : {}),
    };
  }
  unique(todo.subtasks);
  return todo;
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Expected a list.");
  return value;
}
function unique(items: { id: string }[]) {
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new Error("Duplicate IDs in backup.");
}
export function parseCategory(value: unknown): Category {
  const item = object(value);
  const color = string(item.color, "#e76f8f");
  if (!/^#[0-9a-f]{6}$/i.test(color))
    throw new Error("Invalid category color.");
  return {
    id: required(item.id),
    userId: string(item.userId, ""),
    name: required(item.name),
    color,
    ...(item.icon === undefined ? {} : { icon: string(item.icon) }),
  };
}
export function parseSettings(value: unknown): Settings {
  const item = object(value);
  return {
    userId: required(item.userId),
    theme: choice(item.theme, ["light", "dark", "system"] as const, "light"),
    firstDay: choice(item.firstDay, ["monday", "sunday"] as const, "monday"),
    timeFormat: choice(item.timeFormat, ["12", "24"] as const, "24"),
    defaultView: choice(
      item.defaultView,
      ["month", "week", "day", "agenda"] as const,
      "month",
    ),
    defaultDuration: integer(item.defaultDuration, 1, 1440, 30),
    workingStart: time(item.workingStart, "08:00"),
    workingEnd: time(item.workingEnd, "18:00"),
  };
}
export type Backup = {
  todos: Todo[];
  categories: Category[];
  settings: Settings[];
};
export function parseBackup(value: unknown): Backup {
  const item = object(value);
  if (item.version !== undefined && item.version !== 1)
    throw new Error("Unsupported backup version.");
  const todos = array(item.todos).map(parseTodo);
  const categories = array(item.categories).map(parseCategory);
  const settings =
    item.settings === undefined ? [] : array(item.settings).map(parseSettings);
  unique(todos);
  unique(categories);
  return { todos, categories, settings };
}
export function prepareImport(backup: Backup, userId: string): Backup {
  // Backups can come from another local account. Never reuse its entity IDs.
  const categoryIds = new Map(
    backup.categories.map((item) => [item.id, crypto.randomUUID()]),
  );
  const todoIds = new Map(
    backup.todos.map((item) => [item.id, crypto.randomUUID()]),
  );
  return {
    categories: backup.categories.map((item) => ({
      ...item,
      id: categoryIds.get(item.id)!,
      userId,
    })),
    todos: backup.todos.map((item) => ({
      ...item,
      id: todoIds.get(item.id)!,
      userId,
      categoryId: categoryIds.get(item.categoryId) || "",
      recurrenceSourceId: item.recurrenceSourceId
        ? todoIds.get(item.recurrenceSourceId)
        : undefined,
    })),
    settings: backup.settings.slice(0, 1).map((item) => ({ ...item, userId })),
  };
}
