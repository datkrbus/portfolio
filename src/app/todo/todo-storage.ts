import type { AppData, Category, Settings } from "./todo-types";

export const DATA_KEY = "datkrbus-todo-app";
export const SESSION_KEY = "datkrbus-todo-session";

export const defaultCategories = (userId: string): Category[] => [
  {
    id: crypto.randomUUID(),
    userId,
    name: "Personal",
    color: "#e76f8f",
    icon: "●",
  },
  {
    id: crypto.randomUUID(),
    userId,
    name: "Work",
    color: "#2a9d8f",
    icon: "◆",
  },
  {
    id: crypto.randomUUID(),
    userId,
    name: "Study",
    color: "#f28482",
    icon: "▲",
  },
];

export const defaultSettings = (userId: string): Settings => ({
  userId,
  theme: "system",
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
  try {
    const raw = window.localStorage.getItem(DATA_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      todos: Array.isArray(parsed.todos) ? parsed.todos : [],
      settings: Array.isArray(parsed.settings) ? parsed.settings : [],
    };
  } catch {
    return emptyData;
  }
}

export function saveData(data: AppData) {
  window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
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
