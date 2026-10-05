"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./todo.module.css";
import AdvancedTodoModal from "./AdvancedTodoModal";
import TimelineCalendar from "./TimelineCalendar";
import CategoryManager from "./CategoryManager";
import QuickAdd from "./QuickAdd";
import BoardView from "./BoardView";
import type {
  AppData,
  AuthMode,
  CalendarView,
  Category,
  Priority,
  Todo,
  TodoStatus,
  View,
} from "./todo-types";
import {
  clearSession,
  defaultCategories,
  defaultSettings,
  getSession,
  loadData,
  saveData,
  saveSession,
} from "./todo-storage";

const today = () => new Date().toISOString().slice(0, 10);
const dateFrom = (date: Date) => date.toISOString().slice(0, 10);
const parseDate = (value: string) => new Date(`${value}T12:00:00`);
const formatDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
) => parseDate(value).toLocaleDateString("en-US", options);
const weekStart = (value: string) => {
  const date = parseDate(value);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return dateFrom(date);
};
const addDays = (value: string, amount: number) => {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  return dateFrom(date);
};
const sameMonth = (a: string, b: string) =>
  parseDate(a).getMonth() === parseDate(b).getMonth() &&
  parseDate(a).getFullYear() === parseDate(b).getFullYear();
const priorityLabel: Record<Priority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const blankTodo = (userId: string, date = today()): Todo => ({
  id: "",
  userId,
  title: "",
  description: "",
  date,
  startTime: "09:00",
  endTime: "09:30",
  allDay: false,
  priority: "none",
  categoryId: "",
  completed: false,
  status: "todo",
  deadline: "",
  tags: [],
  subtasks: [],
  createdAt: "",
  updatedAt: "",
});

export default function TodoApp() {
  const [data, setData] = useState<AppData>({
    users: [],
    categories: [],
    todos: [],
    settings: [],
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [view, setView] = useState<View>("dashboard");
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [cursor, setCursor] = useState(today());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [toast, setToast] = useState("");
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const stored = loadData();
    const existingAdmin = stored.users.find(
      (item) => item.username === "admin",
    );
    let shouldSave = false;
    if (!existingAdmin) {
      const adminId = "local-admin";
      stored.users.push({
        id: adminId,
        username: "admin",
        password: "admin1",
        createdAt: new Date().toISOString(),
      });
      stored.categories.push(...defaultCategories(adminId));
      stored.settings.push(defaultSettings(adminId));
      shouldSave = true;
    } else if (
      existingAdmin.id === "local-admin" &&
      existingAdmin.password === "admin"
    ) {
      existingAdmin.password = "admin1";
      shouldSave = true;
    }
    if (shouldSave) {
      saveData(stored);
    }
    setData(stored);
    setUserId(getSession());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveData(data);
  }, [data, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const user = data.users.find((item) => item.id === userId);
  const todos = useMemo(
    () => data.todos.filter((todo) => todo.userId === userId),
    [data.todos, userId],
  );
  const categories = useMemo(
    () => data.categories.filter((category) => category.userId === userId),
    [data.categories, userId],
  );
  const settings = data.settings.find((item) => item.userId === userId);

  useEffect(() => {
    if (!ready || !userId || typeof Notification === "undefined") return;
    const checkReminders = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (
          todo.completed ||
          !todo.reminder ||
          todo.date !== today() ||
          !todo.startTime
        )
          return;
        const [hours, minutes] = todo.startTime.split(":").map(Number);
        const taskTime = new Date();
        taskTime.setHours(hours, minutes, 0, 0);
        const minutesUntil = Math.round(
          (taskTime.getTime() - now.getTime()) / 60000,
        );
        if (
          minutesUntil <= todo.reminder.minutesBefore &&
          minutesUntil >= todo.reminder.minutesBefore - 1 &&
          Notification.permission === "granted"
        ) {
          new Notification(todo.title, {
            body: `Starts in ${todo.reminder.minutesBefore} minutes.`,
          });
        }
      });
    };
    checkReminders();
    const timer = window.setInterval(checkReminders, 60000);
    return () => window.clearInterval(timer);
  }, [ready, todos, userId]);

  const visibleTodos = useMemo(
    () =>
      todos.filter((todo) => {
        const haystack =
          `${todo.title} ${todo.description} ${todo.tags.join(" ")}`.toLowerCase();
        return (
          (!query || haystack.includes(query.toLowerCase())) &&
          (filter.status === "all" ||
            (filter.status === "completed"
              ? todo.completed
              : filter.status === "overdue"
                ? !todo.completed && todo.deadline < today()
                : !todo.completed)) &&
          (filter.priority === "all" || todo.priority === filter.priority) &&
          (filter.category === "all" || todo.categoryId === filter.category)
        );
      }),
    [todos, query, filter],
  );

  if (!ready)
    return <div className={styles.loading}>Loading your workspace...</div>;
  if (!userId || !user)
    return (
      <AuthScreen
        mode={authMode}
        form={authForm}
        error={authError}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setAuthError("");
        }}
        onChange={setAuthForm}
        onSubmit={(event) => {
          event.preventDefault();
          const username = authForm.username.trim();
          if (username.length < 3 || authForm.password.length < 6)
            return setAuthError(
              "Username must have 3 characters and password 6 characters.",
            );
          if (authMode === "register") {
            if (authForm.password !== authForm.confirm)
              return setAuthError("Passwords do not match.");
            if (
              data.users.some(
                (item) =>
                  item.username.toLowerCase() === username.toLowerCase(),
              )
            )
              return setAuthError("Username is already in use.");
            const id = crypto.randomUUID();
            setData((current) => ({
              ...current,
              users: [
                ...current.users,
                {
                  id,
                  username,
                  password: authForm.password,
                  createdAt: new Date().toISOString(),
                },
              ],
              categories: [...current.categories, ...defaultCategories(id)],
              settings: [...current.settings, defaultSettings(id)],
            }));
            saveSession(id);
            setUserId(id);
          } else {
            const found = data.users.find(
              (item) =>
                item.username.toLowerCase() === username.toLowerCase() &&
                item.password === authForm.password,
            );
            if (!found) return setAuthError("Invalid username or password.");
            saveSession(found.id);
            setUserId(found.id);
          }
        }}
      />
    );

  function updateTodo(nextTodo: Todo) {
    const normalized = { ...nextTodo, updatedAt: new Date().toISOString() };
    setData((current) => ({
      ...current,
      todos: current.todos.some((item) => item.id === normalized.id)
        ? current.todos.map((item) =>
            item.id === normalized.id ? normalized : item,
          )
        : [normalized, ...current.todos],
    }));
    setSelectedTodo(null);
    setShowTodoForm(false);
    setToast("Todo saved");
  }
  function toggleTodo(todo: Todo) {
    const completing = !todo.completed;
    updateTodo({
      ...todo,
      completed: completing,
      status: completing ? "done" : "todo",
      completedAt: completing ? new Date().toISOString() : undefined,
    });
    if (completing && todo.recurrence) {
      const nextDate =
        todo.recurrence.frequency === "daily"
          ? addDays(todo.date, todo.recurrence.interval)
          : todo.recurrence.frequency === "monthly"
            ? addDays(todo.date, todo.recurrence.interval * 30)
            : addDays(todo.date, todo.recurrence.interval * 7);
      if (!todo.recurrence.until || nextDate <= todo.recurrence.until)
        updateTodo({
          ...todo,
          id: crypto.randomUUID(),
          date: nextDate,
          completed: false,
          status: "todo",
          completedAt: undefined,
          createdAt: new Date().toISOString(),
        });
    }
  }
  function moveTodoStatus(todo: Todo, status: TodoStatus) {
    updateTodo({
      ...todo,
      status,
      completed: status === "done",
      completedAt: status === "done" ? new Date().toISOString() : undefined,
    });
  }
  function createBoardTodo(
    title: string,
    status: TodoStatus,
    categoryId = filter.category,
  ) {
    if (!userId) return;
    updateTodo({
      ...blankTodo(userId),
      id: crypto.randomUUID(),
      title,
      status,
      categoryId: categoryId === "all" ? "" : categoryId,
      completed: status === "done",
      completedAt: status === "done" ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    });
  }
  function deleteTodo(id: string) {
    const removed = todos.find((todo) => todo.id === id);
    setDeletedTodo(removed || null);
    setData((current) => ({
      ...current,
      todos: current.todos.filter((todo) => todo.id !== id),
    }));
    setSelectedTodo(null);
    setShowTodoForm(false);
    setToast("Todo deleted");
  }
  function undoDelete() {
    if (!deletedTodo) return;
    setData((current) => ({
      ...current,
      todos: [deletedTodo, ...current.todos],
    }));
    setDeletedTodo(null);
    setToast("Todo restored");
  }
  function moveTodo(todo: Todo, date: string) {
    updateTodo({ ...todo, date });
  }
  function moveTimedTodo(
    todo: Todo,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    updateTodo({ ...todo, date, startTime, endTime });
  }
  function quickAdd(value: string) {
    if (!userId) return;
    const time = value.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
    const date = /\btomorrow\b/i.test(value) ? addDays(today(), 1) : today();
    const title = value
      .replace(/\btomorrow\b/gi, "")
      .replace(/\s+at\s+([01]?\d|2[0-3]):([0-5]\d)/i, "")
      .trim();
    const startTime = time ? `${time[1].padStart(2, "0")}:${time[2]}` : "09:00";
    const endTime = `${String(Math.min(23, Number(startTime.slice(0, 2)) + 1)).padStart(2, "0")}:${startTime.slice(3)}`;
    updateTodo({
      ...blankTodo(userId, date),
      title,
      startTime,
      endTime,
      categoryId: filter.category === "all" ? "" : filter.category,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
  }
  function addCategory(event: FormEvent) {
    event.preventDefault();
    if (!categoryName.trim() || !userId) return;
    const category: Category = {
      id: crypto.randomUUID(),
      userId,
      name: categoryName.trim(),
      color: "#e76f8f",
    };
    setData((current) => ({
      ...current,
      categories: [...current.categories, category],
    }));
    setCategoryName("");
    setShowCategoryForm(false);
    setToast("Category created");
  }
  function saveCategory(category: Category) {
    if (!userId) return;
    const normalized = { ...category, userId };
    setData((current) => ({
      ...current,
      categories: current.categories.some((item) => item.id === normalized.id)
        ? current.categories.map((item) =>
            item.id === normalized.id ? normalized : item,
          )
        : [...current.categories, normalized],
    }));
    setToast("Category saved");
  }
  function deleteCategory(id: string) {
    setData((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
      todos: current.todos.map((todo) =>
        todo.categoryId === id ? { ...todo, categoryId: "" } : todo,
      ),
    }));
    setToast("Category deleted");
  }
  function exportData() {
    const payload = JSON.stringify(
      { todos, categories, settings: settings ? [settings] : [] },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([payload], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-backup-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  function updateSettings(key: string, value: string | number) {
    if (!settings) return;
    setData((current) => ({
      ...current,
      settings: current.settings.map((item) =>
        item.userId === userId ? { ...item, [key]: value } : item,
      ),
    }));
  }
  function toggleTheme() {
    updateSettings("theme", settings?.theme === "dark" ? "light" : "dark");
  }

  const currentTitle =
    view === "dashboard" ? "Dashboard" : view[0].toUpperCase() + view.slice(1);

  return (
    <main
      className={`${styles.app} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`}
      data-theme={settings?.theme}
    >
      <aside className={styles.sidebar}>
        <button
          className={styles.sidebarToggle}
          onClick={() => setSidebarCollapsed((current) => !current)}
          aria-label={
            sidebarCollapsed ? "Expand navigation" : "Collapse navigation"
          }
        >
          ☰
        </button>
        <div className={styles.brand}>
          <span className={styles.brandMark}>✓</span>
          <span>
            quietly<span className={styles.brandAccent}>done</span>
          </span>
        </div>
        <button
          className={styles.newButton}
          onClick={() => {
            setSelectedTodo(blankTodo(userId));
            setShowTodoForm(true);
          }}
        >
          <span className={styles.newButtonLabel}>+ New Todo</span>
          <span className={styles.newButtonIcon}>+</span>
        </button>
        <nav className={styles.nav} aria-label="Todo navigation">
          <NavButton
            label="Dashboard"
            icon="⌂"
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <NavButton
            label="Calendar"
            icon="▦"
            active={view === "calendar"}
            onClick={() => setView("calendar")}
          />
          <NavButton
            label="Today"
            icon="○"
            active={view === "today"}
            onClick={() => {
              setCursor(today());
              setView("today");
            }}
          />
          <NavButton
            label="Upcoming"
            icon="→"
            active={view === "upcoming"}
            onClick={() => setView("upcoming")}
          />
          <NavButton
            label="Completed"
            icon="✓"
            active={view === "completed"}
            onClick={() => setView("completed")}
          />
          <NavButton
            label="Statistics"
            icon="▥"
            active={view === "statistics"}
            onClick={() => setView("statistics")}
          />
        </nav>
        <div className={styles.sideSection}>
          <div className={styles.sideLabel}>
            Categories{" "}
            <button onClick={() => setShowCategoryForm(true)}>+</button>
          </div>
          {categories.map((category) => (
            <button
              className={styles.categoryLink}
              key={category.id}
              onClick={() => {
                setFilter({ ...filter, category: category.id });
                setView("dashboard");
              }}
            >
              <i style={{ background: category.color }} />
              {category.name}
              <span>
                {todos.filter((todo) => todo.categoryId === category.id).length}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.sidebarBottom}>
          <NavButton
            label="Settings"
            icon="⚙"
            active={view === "settings"}
            onClick={() => setView("settings")}
          />
          <button
            className={styles.logout}
            onClick={() => {
              clearSession();
              setUserId(null);
            }}
          >
            Log out @{user.username}
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.overline}>Personal workspace</p>
            <h1>{currentTitle}</h1>
          </div>
          <div className={styles.topActions}>
            <label className={styles.search}>
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks..."
              />
            </label>
            <span className={styles.avatar}>
              {user.username.slice(0, 1).toUpperCase()}
            </span>
            <button
              className={styles.themeButton}
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
            >
              {settings?.theme === "dark" ? "☼" : "☾"}
            </button>
          </div>
        </header>
        <div className={styles.contentBody}>
          {view !== "settings" && view !== "dashboard" && (
            <ViewToolbar
              view={view}
              showFilters={showFilters}
              onToggle={() => setShowFilters((current) => !current)}
              filter={filter}
              categories={categories}
              onChange={setFilter}
            />
          )}
          {view === "dashboard" && (
            <>
              <QuickAdd onAdd={quickAdd} />
              <div className={styles.boardPageHeader}>
                <div>
                  <p className={styles.overline}>Workspace</p>
                  <h2>Todo board</h2>
                </div>
                <span className={styles.boardHint}>
                  Drag tasks between columns
                </span>
              </div>
              <BoardView
                todos={todos}
                categories={categories}
                categoryFilter={filter.category}
                onCategoryFilterChange={(category) =>
                  setFilter({ ...filter, category })
                }
                onToggle={toggleTodo}
                onOpen={(todo) => {
                  setSelectedTodo(todo);
                  setShowTodoForm(true);
                }}
                onMove={moveTodoStatus}
                onCreate={createBoardTodo}
              />
            </>
          )}
          {view === "calendar" &&
            (calendarView === "week" || calendarView === "day" ? (
              <TimelineCalendar
                todos={visibleTodos}
                cursor={cursor}
                calendarView={calendarView}
                onCursor={setCursor}
                onOpen={(todo) => {
                  setSelectedTodo(todo);
                  setShowTodoForm(true);
                }}
                onMove={moveTimedTodo}
                onCreate={(date, startTime) => {
                  setSelectedTodo({
                    ...blankTodo(userId, date),
                    startTime,
                    endTime: `${String(Number(startTime.slice(0, 2)) + 1).padStart(2, "0")}:00`,
                  });
                  setShowTodoForm(true);
                }}
              />
            ) : (
              <Calendar
                todos={visibleTodos}
                cursor={cursor}
                calendarView={calendarView}
                onCursor={setCursor}
                onCalendarView={setCalendarView}
                onOpen={(todo) => {
                  setSelectedTodo(todo);
                  setShowTodoForm(true);
                }}
                onDrop={moveTodo}
                onCreate={(date) => {
                  setSelectedTodo(blankTodo(userId, date));
                  setShowTodoForm(true);
                }}
              />
            ))}
          {view === "today" && (
            <TaskList
              title={`Today · ${formatDate(today(), { weekday: "long", month: "long", day: "numeric" })}`}
              todos={visibleTodos.filter((todo) => todo.date === today())}
              categories={categories}
              onToggle={toggleTodo}
              onOpen={(todo) => {
                setSelectedTodo(todo);
                setShowTodoForm(true);
              }}
              onDelete={deleteTodo}
              empty="Nothing scheduled today."
            />
          )}
          {view === "upcoming" && (
            <TaskList
              title="Upcoming"
              todos={visibleTodos
                .filter((todo) => todo.date >= today() && !todo.completed)
                .sort((a, b) => a.date.localeCompare(b.date))}
              categories={categories}
              onToggle={toggleTodo}
              onOpen={(todo) => {
                setSelectedTodo(todo);
                setShowTodoForm(true);
              }}
              onDelete={deleteTodo}
              empty="Your upcoming list is clear."
              grouped
            />
          )}
          {view === "completed" && (
            <TaskList
              title="Completed"
              todos={visibleTodos.filter((todo) => todo.completed)}
              categories={categories}
              onToggle={toggleTodo}
              onOpen={(todo) => {
                setSelectedTodo(todo);
                setShowTodoForm(true);
              }}
              onDelete={deleteTodo}
              empty="No completed tasks yet."
            />
          )}
          {view === "statistics" && (
            <Statistics todos={todos} categories={categories} />
          )}
          {view === "settings" && (
            <SettingsPanel
              settings={settings}
              onChange={updateSettings}
              onExport={exportData}
              onImport={(imported) => {
                setData((current) => ({
                  ...current,
                  todos: [
                    ...current.todos.filter((todo) => todo.userId !== userId),
                    ...imported.todos.map((todo) => ({
                      ...todo,
                      userId: userId!,
                    })),
                  ],
                  categories: [
                    ...current.categories.filter(
                      (category) => category.userId !== userId,
                    ),
                    ...imported.categories.map((category) => ({
                      ...category,
                      userId: userId!,
                    })),
                  ],
                }));
                setToast("Backup imported");
              }}
              onClear={() => {
                if (window.confirm("Delete all your Todo data?"))
                  setData((current) => ({
                    ...current,
                    todos: current.todos.filter(
                      (todo) => todo.userId !== userId,
                    ),
                    categories: current.categories.filter(
                      (category) => category.userId !== userId,
                    ),
                  }));
              }}
            />
          )}
        </div>
      </section>
      {showTodoForm && selectedTodo && (
        <AdvancedTodoModal
          todo={selectedTodo}
          categories={categories}
          onSave={updateTodo}
          onDelete={
            selectedTodo.id ? () => deleteTodo(selectedTodo.id) : undefined
          }
          onClose={() => {
            setShowTodoForm(false);
            setSelectedTodo(null);
          }}
        />
      )}
      {showCategoryForm && (
        <CategoryManager
          categories={categories}
          onSave={saveCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategoryForm(false)}
        />
      )}
      {toast && (
        <div className={styles.toast}>
          {toast}
          {deletedTodo && toast === "Todo deleted" && (
            <button onClick={undoDelete}>Undo</button>
          )}
        </div>
      )}
    </main>
  );
}

function AuthScreen({
  mode,
  form,
  error,
  onModeChange,
  onChange,
  onSubmit,
}: {
  mode: AuthMode;
  form: { username: string; password: string; confirm: string };
  error: string;
  onModeChange: (mode: AuthMode) => void;
  onChange: (form: {
    username: string;
    password: string;
    confirm: string;
  }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <main className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>✓</span>
          <span>
            quietly<span className={styles.brandAccent}>done</span>
          </span>
        </div>
        <p className={styles.overline}>Local workspace</p>
        <h1>
          {mode === "login" ? "Welcome back." : "Make space for progress."}
        </h1>
        <p className={styles.authIntro}>
          Your tasks stay in this browser. No backend, no account server.
        </p>
        <form className={styles.authForm} onSubmit={onSubmit}>
          <input
            required
            minLength={3}
            placeholder="Username"
            value={form.username}
            onChange={(event) =>
              onChange({ ...form, username: event.target.value })
            }
          />
          <input
            required
            minLength={6}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              onChange({ ...form, password: event.target.value })
            }
          />
          {mode === "register" && (
            <input
              required
              minLength={6}
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={(event) =>
                onChange({ ...form, confirm: event.target.value })
              }
            />
          )}
          {error && <p className={styles.formError}>{error}</p>}
          <button className={styles.primaryButton}>
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
        <button
          className={styles.textButton}
          onClick={() => onModeChange(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Log in"}
        </button>
        <small className={styles.localNotice}>
          Demo authentication only. Passwords are stored locally.
        </small>
      </div>
    </main>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.navButton} ${active ? styles.navActive : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className={styles.navLabel}>{label}</span>
    </button>
  );
}

function Dashboard({
  todos,
  onToggle,
  onOpen,
  onView,
}: {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  onOpen: (todo: Todo) => void;
  onView: (view: View) => void;
}) {
  const upcoming = todos
    .filter((todo) => !todo.completed && todo.date >= today())
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )
    .slice(0, 5);
  return (
    <div className={styles.dashboard}>
      <div className={styles.pageIntro}>
        <div>
          <p className={styles.overline}>Personal workspace</p>
          <h2>My tasks</h2>
        </div>
      </div>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Upcoming</h2>
          </div>
          <button
            className={styles.textButton}
            onClick={() => onView("upcoming")}
          >
            View on calendar →
          </button>
        </div>
        {upcoming.length ? (
          upcoming.map((todo) => (
            <TaskRow
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onOpen={onOpen}
            />
          ))
        ) : (
          <Empty text="Nothing waiting on you." />
        )}
      </section>
    </div>
  );
}
function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className={`${styles.metric} ${styles[`metric${accent}`]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <i />
    </div>
  );
}
function ViewToolbar({
  view,
  showFilters,
  onToggle,
  filter,
  categories,
  onChange,
}: {
  view: View;
  showFilters: boolean;
  onToggle: () => void;
  filter: { status: string; priority: string; category: string };
  categories: Category[];
  onChange: (filter: {
    status: string;
    priority: string;
    category: string;
  }) => void;
}) {
  const activeFilters = [
    filter.status !== "all",
    filter.priority !== "all",
    filter.category !== "all",
  ].filter(Boolean).length;
  return (
    <div className={styles.viewToolbar}>
      <span className={styles.viewContext}>{view} view</span>
      <button className={styles.toolbarButton} onClick={onToggle}>
        ☷ Filter{activeFilters ? ` · ${activeFilters}` : ""}
      </button>
      {showFilters && (
        <FilterBar
          filter={filter}
          categories={categories}
          onChange={onChange}
        />
      )}
    </div>
  );
}
function FilterBar({
  filter,
  categories,
  onChange,
}: {
  filter: { status: string; priority: string; category: string };
  categories: Category[];
  onChange: (filter: {
    status: string;
    priority: string;
    category: string;
  }) => void;
}) {
  return (
    <div className={styles.filterBar}>
      <span>Filter</span>
      <select
        value={filter.status}
        onChange={(event) =>
          onChange({ ...filter, status: event.target.value })
        }
      >
        <option value="all">All status</option>
        <option value="active">Incomplete</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>
      <select
        value={filter.priority}
        onChange={(event) =>
          onChange({ ...filter, priority: event.target.value })
        }
      >
        <option value="all">All priority</option>
        {Object.entries(priorityLabel).map(([value, label]) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        value={filter.category}
        onChange={(event) =>
          onChange({ ...filter, category: event.target.value })
        }
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option value={category.id} key={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
function TaskList({
  title,
  todos,
  categories,
  onToggle,
  onOpen,
  onDelete,
  empty,
  grouped,
}: {
  title: string;
  todos: Todo[];
  categories: Category[];
  onToggle: (todo: Todo) => void;
  onOpen: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  empty: string;
  grouped?: boolean;
}) {
  const groups: Record<string, Todo[]> = grouped
    ? todos.reduce<Record<string, Todo[]>>(
        (result, todo) => ({
          ...result,
          [todo.date]: [...(result[todo.date] || []), todo],
        }),
        {},
      )
    : { all: todos };
  return (
    <section className={styles.taskList}>
      <div className={styles.listHeading}>
        <div>
          <p className={styles.overline}>Task view</p>
          <h2>{title}</h2>
        </div>
        <span>{todos.length} tasks</span>
      </div>
      {Object.entries(groups).map(([date, group]) => (
        <div className={styles.taskGroup} key={date}>
          {grouped && (
            <h3>
              {formatDate(date, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
          )}
          {group.map((todo) => (
            <TaskRow
              key={todo.id}
              todo={todo}
              categories={categories}
              onToggle={onToggle}
              onOpen={onOpen}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
      {!todos.length && <Empty text={empty} />}
    </section>
  );
}
function TaskRow({
  todo,
  categories = [],
  onToggle,
  onOpen,
  onDelete,
}: {
  todo: Todo;
  categories?: Category[];
  onToggle?: (todo: Todo) => void;
  onOpen: (todo: Todo) => void;
  onDelete?: (id: string) => void;
}) {
  const category = categories.find((item) => item.id === todo.categoryId);
  return (
    <article
      className={`${styles.taskRow} ${todo.completed ? styles.taskDone : ""}`}
    >
      <button
        className={styles.checkbox}
        onClick={() => onToggle?.(todo)}
        aria-label="Toggle task"
      >
        {todo.completed ? "✓" : ""}
      </button>
      <button className={styles.taskMain} onClick={() => onOpen(todo)}>
        <strong>{todo.title}</strong>
        <span>
          {todo.allDay
            ? "All day"
            : `${todo.date} · ${todo.startTime}–${todo.endTime}`}
          {category && (
            <>
              <b style={{ color: category.color }}> · {category.name}</b>
            </>
          )}
        </span>
      </button>
      <span
        className={`${styles.priority} ${styles[`priority${todo.priority}`]}`}
      >
        {priorityLabel[todo.priority]}
      </span>
      {onDelete && (
        <button
          className={styles.deleteIcon}
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
        >
          ×
        </button>
      )}
    </article>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className={styles.empty}>
      <span>—</span>
      <p>{text}</p>
      <small>Use “New Todo” to make a start.</small>
    </div>
  );
}

function Calendar({
  todos,
  cursor,
  calendarView,
  onCursor,
  onCalendarView,
  onOpen,
  onDrop,
  onCreate,
}: {
  todos: Todo[];
  cursor: string;
  calendarView: CalendarView;
  onCursor: (value: string) => void;
  onCalendarView: (value: CalendarView) => void;
  onOpen: (todo: Todo) => void;
  onDrop: (todo: Todo, date: string) => void;
  onCreate: (date: string) => void;
}) {
  const shift = (amount: number) =>
    onCursor(
      calendarView === "month"
        ? addDays(cursor, amount * 30)
        : addDays(cursor, amount * (calendarView === "week" ? 7 : 1)),
    );
  const days =
    calendarView === "month"
      ? Array.from({ length: 35 }, (_, index) => {
          const first = new Date(
            parseDate(cursor).getFullYear(),
            parseDate(cursor).getMonth(),
            1,
          );
          first.setDate(first.getDate() - ((first.getDay() + 6) % 7) + index);
          return dateFrom(first);
        })
      : Array.from({ length: calendarView === "week" ? 7 : 1 }, (_, index) =>
          addDays(weekStart(cursor), index),
        );
  const title =
    calendarView === "month"
      ? parseDate(cursor).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : calendarView === "week"
        ? `${formatDate(days[0], { month: "short", day: "numeric" })} – ${formatDate(days[6], { month: "short", day: "numeric", year: "numeric" })}`
        : formatDate(cursor, {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
  return (
    <section className={styles.calendar}>
      <div className={styles.calendarToolbar}>
        <div className={styles.calendarNav}>
          <button onClick={() => shift(-1)}>←</button>
          <button onClick={() => onCursor(today())}>Today</button>
          <button onClick={() => shift(1)}>→</button>
          <h2>{title}</h2>
        </div>
        <div className={styles.viewTabs}>
          {(["month", "week", "day", "agenda"] as CalendarView[]).map(
            (item) => (
              <button
                className={item === calendarView ? styles.tabActive : ""}
                key={item}
                onClick={() => onCalendarView(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>
      {calendarView === "agenda" ? (
        <TaskList
          title="Agenda"
          todos={todos.sort((a, b) => a.date.localeCompare(b.date))}
          categories={[]}
          onToggle={() => undefined}
          onOpen={onOpen}
          empty="No tasks in this range."
        />
      ) : (
        <div
          className={`${styles.calendarGrid} ${calendarView !== "month" ? styles.timelineGrid : ""}`}
        >
          {calendarView === "month" &&
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div className={styles.dayName} key={day}>
                {day}
              </div>
            ))}
          {days.map((day) => (
            <div
              className={`${styles.dayCell} ${day === today() ? styles.dayToday : ""} ${!sameMonth(day, cursor) && calendarView === "month" ? styles.dayOutside : ""}`}
              key={day}
              onDoubleClick={() => onCreate(day)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("todo");
                const todo = todos.find((item) => item.id === id);
                if (todo) onDrop(todo, day);
              }}
            >
              <button
                className={styles.dayNumber}
                onClick={() => onCreate(day)}
              >
                {formatDate(day, { day: "numeric" })}
              </button>
              {todos
                .filter((todo) => todo.date === day)
                .map((todo) => (
                  <button
                    className={`${styles.calendarTask} ${styles[`priority${todo.priority}`]}`}
                    draggable
                    key={todo.id}
                    onDragStart={(event) =>
                      event.dataTransfer.setData("todo", todo.id)
                    }
                    onClick={() => onOpen(todo)}
                  >
                    {todo.title}
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TodoModal({
  todo,
  categories,
  onSave,
  onDelete,
  onClose,
}: {
  todo: Todo;
  categories: Category[];
  onSave: (todo: Todo) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(todo);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({
      ...draft,
      title: draft.title.trim(),
      id: draft.id || crypto.randomUUID(),
      createdAt: draft.createdAt || new Date().toISOString(),
    });
  };
  return (
    <div className={styles.modalBackdrop}>
      <form className={styles.modal} onSubmit={submit}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.overline}>Todo details</p>
            <h2>{todo.id ? "Edit task" : "New task"}</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <input
          className={styles.titleInput}
          autoFocus
          required
          placeholder="Task title"
          value={draft.title}
          onChange={(event) =>
            setDraft({ ...draft, title: event.target.value })
          }
        />
        <textarea
          placeholder="Description (optional)"
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />
        <div className={styles.formGrid}>
          <label>
            Date
            <input
              type="date"
              value={draft.date}
              onChange={(event) =>
                setDraft({ ...draft, date: event.target.value })
              }
            />
          </label>
          <label>
            Priority
            <select
              value={draft.priority}
              onChange={(event) =>
                setDraft({ ...draft, priority: event.target.value as Priority })
              }
            >
              {Object.entries(priorityLabel).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start
            <input
              type="time"
              value={draft.startTime}
              disabled={draft.allDay}
              onChange={(event) =>
                setDraft({ ...draft, startTime: event.target.value })
              }
            />
          </label>
          <label>
            End
            <input
              type="time"
              value={draft.endTime}
              disabled={draft.allDay}
              onChange={(event) =>
                setDraft({ ...draft, endTime: event.target.value })
              }
            />
          </label>
          <label>
            Category
            <select
              value={draft.categoryId}
              onChange={(event) =>
                setDraft({ ...draft, categoryId: event.target.value })
              }
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Deadline
            <input
              type="date"
              value={draft.deadline}
              onChange={(event) =>
                setDraft({ ...draft, deadline: event.target.value })
              }
            />
          </label>
        </div>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={draft.allDay}
            onChange={(event) =>
              setDraft({ ...draft, allDay: event.target.checked })
            }
          />{" "}
          All day
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={Boolean(draft.recurrence)}
            onChange={(event) =>
              setDraft({
                ...draft,
                recurrence: event.target.checked
                  ? { frequency: "weekly", interval: 1 }
                  : undefined,
              })
            }
          />{" "}
          Repeat weekly
        </label>
        <div className={styles.modalActions}>
          {onDelete && (
            <button
              type="button"
              className={styles.dangerButton}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <span />
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primaryButton}>Save task</button>
        </div>
      </form>
    </div>
  );
}

function Statistics({
  todos,
  categories,
}: {
  todos: Todo[];
  categories: Category[];
}) {
  const completed = todos.filter((todo) => todo.completed).length;
  return (
    <section className={styles.statistics}>
      <div className={styles.listHeading}>
        <div>
          <p className={styles.overline}>Patterns, not pressure</p>
          <h2>Your statistics</h2>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <Metric label="Created" value={todos.length} accent="orange" />
        <Metric label="Completed" value={completed} accent="green" />
        <Metric
          label="Overdue"
          value={
            todos.filter(
              (todo) =>
                !todo.completed && todo.deadline && todo.deadline < today(),
            ).length
          }
          accent="purple"
        />
        <Metric
          label="Completion rate"
          value={`${todos.length ? Math.round((completed / todos.length) * 100) : 0}%`}
          accent="blue"
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>By category</h2>
        </div>
        {categories.map((category) => {
          const count = todos.filter(
            (todo) => todo.categoryId === category.id,
          ).length;
          return (
            <div className={styles.statBar} key={category.id}>
              <span>{category.name}</span>
              <div>
                <i
                  style={{
                    width: `${todos.length ? (count / todos.length) * 100 : 0}%`,
                    background: category.color,
                  }}
                />
              </div>
              <b>{count}</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function SettingsPanel({
  settings,
  onChange,
  onExport,
  onImport,
  onClear,
}: {
  settings?: AppData["settings"][number];
  onChange: (key: string, value: string | number) => void;
  onExport: () => void;
  onImport: (data: { todos: Todo[]; categories: Category[] }) => void;
  onClear: () => void;
}) {
  if (!settings) return null;
  return (
    <section className={styles.settings}>
      <div className={styles.listHeading}>
        <div>
          <p className={styles.overline}>Preferences</p>
          <h2>Settings</h2>
        </div>
      </div>
      <div className={styles.settingsGrid}>
        <label>
          Theme
          <select
            value={settings.theme}
            onChange={(event) => onChange("theme", event.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Default calendar view
          <select
            value={settings.defaultView}
            onChange={(event) => onChange("defaultView", event.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </label>
        <label>
          First day of week
          <select
            value={settings.firstDay}
            onChange={(event) => onChange("firstDay", event.target.value)}
          >
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </label>
        <label>
          Default duration
          <select
            value={settings.defaultDuration}
            onChange={(event) =>
              onChange("defaultDuration", Number(event.target.value))
            }
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </label>
      </div>
      <div className={styles.dataActions}>
        <div>
          <h3>Your data</h3>
          <p>Everything is stored locally in this browser.</p>
        </div>
        <div>
          <button className={styles.outlineButton} onClick={onExport}>
            Export JSON
          </button>
          <label className={styles.importButton}>
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                file.text().then((text) => {
                  try {
                    const parsed = JSON.parse(text);
                    if (
                      !Array.isArray(parsed.todos) ||
                      !Array.isArray(parsed.categories)
                    )
                      throw new Error("Invalid backup");
                    onImport({
                      todos: parsed.todos,
                      categories: parsed.categories,
                    });
                  } catch {
                    window.alert("Invalid backup file");
                  }
                });
              }}
            />
          </label>
          <button className={styles.dangerButton} onClick={onClear}>
            Clear my data
          </button>
        </div>
      </div>
    </section>
  );
}
