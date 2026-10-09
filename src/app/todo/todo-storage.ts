import type { AppData, Category, Settings } from "./todo-types";
import { parseBackup } from "./todo-validation";

export const DATA_KEY = "datkrbus-todo-app";
export const SESSION_KEY = "datkrbus-todo-session";
let loadedSnapshot: string | null | undefined;

export class StorageConflictError extends Error {
  constructor() {
    super(
      "Another tab changed this workspace. Export your current changes, then reload to use the latest saved data.",
    );
  }
}

export const defaultCategories = (
  userId: string,
  locale: "vi" | "en" = "vi",
): Category[] => [
  {
    id: crypto.randomUUID(),
    userId,
    name: locale === "en" ? "Personal" : "Cá nhân",
    color: "#e76f8f",
    icon: "●",
  },
  {
    id: crypto.randomUUID(),
    userId,
    name: locale === "en" ? "Work" : "Công việc",
    color: "#2457a6",
    icon: "◆",
  },
  {
    id: crypto.randomUUID(),
    userId,
    name: locale === "en" ? "Study" : "Học tập",
    color: "#f28482",
    icon: "▲",
  },
];

export const defaultSettings = (userId: string): Settings => ({
  userId,
  theme: "light",
  firstDay: "monday",
  timeFormat: "24",
  defaultView: "month",
  defaultDuration: 30,
  workingStart: "08:00",
  workingEnd: "18:00",
});

export const emptyData: AppData = {
  users: [],
  categories: [],
  todos: [],
  settings: [],
};

export function loadData(): AppData {
  const raw = window.localStorage.getItem(DATA_KEY);
  if (!raw) {
    loadedSnapshot = raw;
    return { users: [], categories: [], todos: [], settings: [] };
  }
  const parsed = JSON.parse(raw) as Partial<AppData>;
  if (
    !parsed ||
    !Array.isArray(parsed.users) ||
    !parsed.users.every(
      (user) =>
        user &&
        typeof user.id === "string" &&
        typeof user.username === "string" &&
        typeof user.password === "string",
    )
  )
    throw new Error("Invalid saved workspace.");
  const backup = parseBackup(parsed);
  loadedSnapshot = raw;
  return {
    users: parsed.users,
    ...backup,
  };
}

export function saveData(data: AppData) {
  const raw = window.localStorage.getItem(DATA_KEY);
  if (loadedSnapshot !== undefined && loadedSnapshot !== raw)
    throw new StorageConflictError();
  const serialized = JSON.stringify({ version: 1, ...data });
  if (raw !== serialized) window.localStorage.setItem(DATA_KEY, serialized);
  loadedSnapshot = serialized;
}

export function getSession() {
  return window.localStorage.getItem(SESSION_KEY);
}

export function saveSession(userId: string) {
  window.localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
