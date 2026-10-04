export type Priority = "none" | "low" | "medium" | "high";
export type TodoStatus = "todo" | "in_progress" | "review" | "done";
export type View =
  | "dashboard"
  | "calendar"
  | "today"
  | "upcoming"
  | "completed"
  | "statistics"
  | "settings";
export type CalendarView = "month" | "week" | "day" | "agenda";
export type AuthMode = "login" | "register";

export type User = {
  id: string;
  username: string;
  password: string;
  createdAt: string;
};

export type Category = {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Reminder = {
  minutesBefore: number;
};

export type Recurrence = {
  frequency: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  interval: number;
  days?: number[];
  until?: string;
};

export type Todo = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  priority: Priority;
  categoryId: string;
  completed: boolean;
  status?: TodoStatus;
  completedAt?: string;
  reminder?: Reminder;
  recurrence?: Recurrence;
  deadline: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  userId: string;
  theme: "light" | "dark" | "system";
  firstDay: "monday" | "sunday";
  timeFormat: "12" | "24";
  defaultView: CalendarView;
  defaultDuration: number;
  workingStart: string;
  workingEnd: string;
};

export type AppData = {
  users: User[];
  categories: Category[];
  todos: Todo[];
  settings: Settings[];
};
