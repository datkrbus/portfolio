"use client";
import { useI18n } from "./I18nProvider";
import LanguageSelect from "./LanguageSelect";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  applyTodoUpdate,
  endTimeFor,
  groupTodos,
  matchesTodo,
  today,
  sortTodos,
  type SortOrder,
} from "./todo-utils";
import { prepareImport } from "./todo-validation";
import styles from "./todo.module.css";
const AdvancedTodoModal = dynamic(() => import("./AdvancedTodoModal"));
const TimelineCalendar = dynamic(() => import("./TimelineCalendar"));
const CategoryManager = dynamic(() => import("./CategoryManager"));
import WorkspaceNav, { viewLabels } from "./WorkspaceNav";
import Icon from "./Icon";
import QuickAdd from "./QuickAdd";
import BoardView from "./BoardView";
import AuthScreen from "./AuthScreen";
import ViewToolbar from "./ViewToolbar";
import TaskList from "./TaskList";
const Calendar = dynamic(() => import("./MonthCalendar"));
const Statistics = dynamic(() => import("./Statistics"));
const SettingsPanel = dynamic(() => import("./SettingsPanel"));
import type {
  AppData,
  AuthMode,
  CalendarView,
  Category,
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
  StorageConflictError,
} from "./todo-storage";
const blankTodo = (userId: string, date = today()): Todo => ({
  id: "",
  userId,
  title: "",
  description: "",
  date,
  startTime: "09:00",
  endTime: "09:30",
  allDay: true,
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
  const { t, locale, formatDate } = useI18n();
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
  const [boardLayout, setBoardLayout] = useState<"board" | "list">("board");
  const [sortOrder, setSortOrder] = useState<SortOrder>("scheduled");
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const search = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !document.querySelector("dialog[open]")
      ) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    document.addEventListener("keydown", search);
    return () => document.removeEventListener("keydown", search);
  }, []);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [currentDate, setCurrentDate] = useState(today);
  const reminderKeys = useRef(new Set<string>());
  const [systemDark, setSystemDark] = useState(false);
  const [toast, setToast] = useState("");
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  useEffect(() => {
    try {
      const stored = loadData();
      const existingAdmin = stored.users.find(
        (item) => item.username === "admin",
      );
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
      } else if (
        existingAdmin.id === "local-admin" &&
        existingAdmin.password === "admin"
      ) {
        existingAdmin.password = "admin1";
      }
      setData(stored);
      const session = getSession();
      setUserId(
        stored.users.some((item) => item.id === session) ? session : null,
      );
    } catch {
      setLoadFailed(true);
      setStorageError(
        "Không đọc được dữ liệu đã lưu. Dữ liệu gốc vẫn được giữ nguyên. Kiểm tra quyền lưu dữ liệu của trình duyệt rồi thử lại.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || loadFailed) return;
    try {
      saveData(data);
      setStorageError("");
    } catch (error) {
      setStorageError(
        error instanceof StorageConflictError
          ? "Một tab khác đã thay đổi dữ liệu. Tải bản sao lưu hiện tại trước khi tải lại trang."
          : "Chưa lưu được thay đổi. Hãy tải bản sao lưu trước khi đóng tab, rồi kiểm tra dung lượng và quyền lưu dữ liệu.",
      );
    }
  }, [data, ready, loadFailed]);
  useEffect(() => {
    const refresh = () => setCurrentDate(today());
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = () => setSystemDark(media.matches);
    theme();
    media.addEventListener("change", theme);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      media.removeEventListener("change", theme);
    };
  }, []);
  useEffect(() => {
    if (!toast || toast === "Đã xóa công việc") return;
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
  const categoryCounts = useMemo(
    () =>
      new Map(
        Array.from(
          groupTodos(todos, (todo) => todo.categoryId),
          ([id, group]) => [id, group.length],
        ),
      ),
    [todos],
  );
  const preferredView = settings?.defaultView;
  useEffect(() => {
    if (preferredView) setCalendarView(preferredView);
  }, [userId, preferredView]);
  const theme =
    settings?.theme === "system"
      ? systemDark
        ? "dark"
        : "light"
      : settings?.theme || "light";
  useEffect(() => {
    if (!ready || !userId || typeof Notification === "undefined") return;
    const checkReminders = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (
          todo.completed ||
          todo.allDay ||
          !todo.reminder ||
          !todo.startTime ||
          Notification.permission !== "granted"
        )
          return;
        const taskTime = new Date(
          `${todo.date}T${todo.startTime}:00`,
        ).getTime();
        const due = taskTime - todo.reminder.minutesBefore * 60000;
        const key = `${userId}:${todo.id}:${due}`;
        if (
          now.getTime() >= due &&
          now.getTime() < due + 60000 &&
          !reminderKeys.current.has(key)
        ) {
          reminderKeys.current.add(key);
          try {
            new Notification(todo.title, {
              body: t("Bắt đầu sau {0} phút.", {
                "0": Math.max(0, Math.ceil((taskTime - now.getTime()) / 60000)),
              }),
              tag: key,
            });
          } catch {
            /* Some browsers do not support desktop notifications. */
          }
        }
      });
    };
    checkReminders();
    const timer = window.setInterval(checkReminders, 60000);
    return () => window.clearInterval(timer);
  }, [ready, todos, userId, t]);
  const visibleTodos = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return todos.filter((todo) =>
      matchesTodo(todo, search, filter, currentDate),
    );
  }, [todos, query, filter, currentDate]);
  const viewTodos = useMemo(
    () =>
      sortTodos(
        visibleTodos.filter((todo) =>
          view === "today"
            ? todo.date === currentDate
            : view === "upcoming"
              ? todo.date >= currentDate && !todo.completed
              : view === "completed"
                ? todo.completed
                : true,
        ),
        sortOrder,
      ),
    [visibleTodos, view, currentDate, sortOrder],
  );
  const summary = useMemo(
    () => ({
      active: todos.filter((todo) => !todo.completed).length,
      today: todos.filter(
        (todo) => todo.date === currentDate && !todo.completed,
      ).length,
      overdue: todos.filter(
        (todo) =>
          !todo.completed && todo.deadline && todo.deadline < currentDate,
      ).length,
      done: todos.filter((todo) => todo.completed).length,
    }),
    [todos, currentDate],
  );
  if (!ready)
    return (
      <div className={styles.loading}>{t("Đang mở không gian của bạn...")}</div>
    );
  if (loadFailed)
    return (
      <main className={styles.authPage}>
        <section className={styles.authCard} role="alert">
          <h1>{t("Chưa mở được không gian")}</h1>
          <p>{t(storageError)}</p>
          <button onClick={() => window.location.reload()}>
            {t("Thử lại")}
          </button>
        </section>
      </main>
    );
  if (!userId || !user)
    return (
      <AuthScreen
        mode={authMode}
        form={authForm}
        error={t(authError)}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setAuthError("");
        }}
        onChange={setAuthForm}
        onSubmit={(event) => {
          event.preventDefault();
          const username = authForm.username.trim();
          try {
            if (username.length < 3 || authForm.password.length < 6)
              return setAuthError(
                "Tên cần ít nhất 3 ký tự; mật khẩu ít nhất 6 ký tự.",
              );
            if (authMode === "register") {
              if (authForm.password !== authForm.confirm)
                return setAuthError("Hai mật khẩu chưa trùng nhau.");
              if (
                data.users.some(
                  (item) =>
                    item.username.toLowerCase() === username.toLowerCase(),
                )
              )
                return setAuthError("Tên này đã được dùng trên thiết bị này.");
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
                categories: [
                  ...current.categories,
                  ...defaultCategories(id, locale),
                ],
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
              if (!found) return setAuthError("Tên hoặc mật khẩu chưa đúng.");
              saveSession(found.id);
              setUserId(found.id);
            }
            setAuthForm({ username: "", password: "", confirm: "" });
            setQuery("");
            setFilter({ status: "all", priority: "all", category: "all" });
            setView("dashboard");
          } catch {
            setAuthError(
              "Trình duyệt chưa cho phép lưu dữ liệu. Hãy kiểm tra cài đặt rồi thử lại.",
            );
          }
        }}
      />
    );
  function updateTodo(nextTodo: Todo) {
    if (nextTodo.userId !== userId || !nextTodo.title.trim()) return;
    setData((current) => ({
      ...current,
      todos: applyTodoUpdate(current.todos, nextTodo),
    }));
    setSelectedTodo(null);
    setShowTodoForm(false);
    setToast("Đã lưu công việc");
  }
  function toggleTodo(todo: Todo) {
    const completing = !todo.completed;
    updateTodo({
      ...todo,
      completed: completing,
      status: completing ? "done" : "todo",
      completedAt: completing ? new Date().toISOString() : undefined,
    });
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
      endTime: endTimeFor("09:00", settings?.defaultDuration || 30),
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
      todos: current.todos.filter(
        (todo) => todo.id !== id || todo.userId !== userId,
      ),
    }));
    setSelectedTodo(null);
    setShowTodoForm(false);
    setToast("Đã xóa công việc");
  }
  function copyTodo(todo: Todo) {
    const copiedTodo: Todo = {
      ...todo,
      recurrenceSourceId: undefined,
      id: crypto.randomUUID(),
      title: t("{0} (bản sao)", { "0": todo.title }),
      completed: false,
      status: "todo",
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData((current) => ({
      ...current,
      todos: [copiedTodo, ...current.todos],
    }));
    setToast("Đã nhân bản công việc");
  }
  function undoDelete() {
    if (!deletedTodo) return;
    setData((current) => ({
      ...current,
      todos: [deletedTodo, ...current.todos],
    }));
    setDeletedTodo(null);
    setToast("Đã khôi phục công việc");
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
    updateTodo({ ...todo, date, startTime, endTime, allDay: false });
  }
  function quickAdd(title: string, date: string) {
    if (!userId || !title.trim()) return false;
    updateTodo({
      ...blankTodo(userId, date),
      title: title.trim(),
      endTime: endTimeFor("09:00", settings?.defaultDuration || 30),
      categoryId: filter.category === "all" ? "" : filter.category,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    return true;
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
    setToast("Đã lưu danh mục");
  }
  function deleteCategory(id: string) {
    setData((current) => ({
      ...current,
      categories: current.categories.filter(
        (category) => category.id !== id || category.userId !== userId,
      ),
      todos: current.todos.map((todo) =>
        todo.categoryId === id && todo.userId === userId
          ? { ...todo, categoryId: "" }
          : todo,
      ),
    }));
    if (filter.category === id)
      setFilter((current) => ({ ...current, category: "all" }));
    setToast("Đã xóa danh mục");
  }
  function exportData() {
    const payload = JSON.stringify(
      { version: 1, todos, categories, settings: settings ? [settings] : [] },
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
    updateSettings("theme", theme === "dark" ? "light" : "dark");
  }
  function clearFilters() {
    setQuery("");
    setFilter({ status: "all", priority: "all", category: "all" });
  }
  function navigate(next: View) {
    setView(next);
    clearFilters();
    setShowFilters(false);
  }
  function createTodo(
    date = view === "calendar" ? cursor : today(),
    startTime?: string,
  ) {
    if (!userId) return;
    setSelectedTodo({
      ...blankTodo(userId, date),
      allDay: !startTime,
      startTime: startTime || "09:00",
      endTime: endTimeFor(
        startTime || "09:00",
        settings?.defaultDuration || 30,
      ),
      categoryId: filter.category === "all" ? "" : filter.category,
    });
    setShowTodoForm(true);
  }
  function openTodo(todo: Todo) {
    setSelectedTodo(todo);
    setShowTodoForm(true);
  }
  function logout() {
    try {
      clearSession();
    } catch {
      setToast(
        "Chưa thể đăng xuất. Kiểm tra quyền lưu dữ liệu của trình duyệt.",
      );
      return;
    }
    setUserId(null);
    setSelectedTodo(null);
    setShowTodoForm(false);
    setShowCategoryForm(false);
    setDeletedTodo(null);
    setToast("");
    reminderKeys.current.clear();
  }
  const filtered =
    Boolean(query.trim()) ||
    Object.values(filter).some((value) => value !== "all");
  const currentCategory = categories.find(
    (item) => item.id === filter.category,
  );
  const currentTitle =
    view === "dashboard" && currentCategory
      ? currentCategory.name
      : t(viewLabels[view]);
  const subtitles: Record<View, string> = {
    dashboard: t("Mọi việc ở đúng chỗ. Tập trung vào bước tiếp theo."),
    today: formatDate(currentDate, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    upcoming: t("Một góc nhìn rõ ràng cho những ngày sắp tới."),
    calendar: t("Dành thời gian cho những việc quan trọng."),
    completed: t("Những việc bạn đã làm được, từng bước một."),
    statistics: t("Nhìn lại tiến độ theo nhịp của bạn."),
    settings: t("Thiết lập cách làm việc phù hợp với bạn."),
  };
  const taskActions = {
    categories,
    onToggle: toggleTodo,
    onOpen: openTodo,
    onCopy: copyTodo,
    onDelete: deleteTodo,
    onCreate: () => createTodo(),
    onReset: clearFilters,
    filtered,
  };
  return (
    <main className={styles.app} data-theme={theme} lang={locale}>
      <a className={styles.skipLink} href="#todo-content">
        {t("Đến nội dung chính")}
      </a>
      <WorkspaceNav
        view={view}
        onView={navigate}
        categories={categories}
        categoryId={filter.category}
        counts={categoryCounts}
        todayCount={summary.today}
        username={user.username}
        onCategory={(category) => {
          navigate("dashboard");
          setFilter({ status: "all", priority: "all", category });
        }}
        onManage={() => setShowCategoryForm(true)}
        onNew={() => createTodo()}
      />
      <section className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.breadcrumb}>
            <Icon name={view === "calendar" ? "calendar" : "board"} size={16} />
            <span>{t("Không gian cá nhân")}</span>
            <span>/</span>
            <strong>{t(viewLabels[view])}</strong>
          </div>
          <div className={styles.topActions}>
            <LanguageSelect />
            <span className={styles.savedStatus}>
              <i data-error={Boolean(storageError)} />
              {storageError ? t("Chưa lưu được") : t("Lưu trên máy này")}
            </span>
            <button
              className={styles.iconButton}
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? t("Chuyển giao diện sáng")
                  : t("Chuyển giao diện tối")
              }
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
          </div>
        </header>
        <div className={styles.contentBody} id="todo-content" tabIndex={-1}>
          <div className={styles.pageHeading}>
            <div>
              <p className={styles.overline}>
                {view === "dashboard"
                  ? t("CÙNG LÀM TỪNG VIỆC MỘT")
                  : "QUIETLY DONE"}
              </p>
              <h1>{currentTitle}</h1>
              <p className={styles.pageSubtitle}>{subtitles[view]}</p>
            </div>
            <button
              className={styles.primaryButton}
              aria-label={t("Thêm công việc")}
              onClick={() => createTodo()}
            >
              <Icon name="plus" size={18} />
              {t("Thêm công việc")}
            </button>
          </div>
          {storageError && (
            <div className={styles.errorBanner} role="alert">
              <p>{t(storageError)}</p>
              <button className={styles.outlineButton} onClick={exportData}>
                {t("Tải bản sao lưu")}
              </button>
              <button
                className={styles.textButton}
                onClick={() => {
                  if (
                    window.confirm(
                      t(
                        "Tải lại dữ liệu đã lưu? Hãy tải bản sao lưu nếu bạn có thay đổi chưa lưu.",
                      ),
                    )
                  )
                    window.location.reload();
                }}
              >
                {t("Tải lại")}
              </button>
            </div>
          )}
          {(view === "dashboard" || view === "today") && (
            <div
              className={styles.summaryStrip}
              aria-label={t("Tổng quan công việc")}
            >
              <button
                onClick={() => {
                  navigate("dashboard");
                  setFilter({
                    status: "active",
                    priority: "all",
                    category: "all",
                  });
                }}
              >
                <span className={styles.summaryIcon}>
                  <Icon name="list" />
                </span>
                <span>
                  <strong>{summary.active}</strong>
                  <small>{t("Chưa hoàn thành")}</small>
                </span>
              </button>
              <button onClick={() => navigate("today")}>
                <span className={styles.summaryIcon}>
                  <Icon name="sun" />
                </span>
                <span>
                  <strong>{summary.today}</strong>
                  <small>{t("Cần làm hôm nay")}</small>
                </span>
              </button>
              <button
                onClick={() => {
                  navigate("dashboard");
                  setFilter({
                    status: "overdue",
                    priority: "all",
                    category: "all",
                  });
                }}
              >
                <span
                  className={`${styles.summaryIcon} ${summary.overdue ? styles.overdueText : ""}`}
                >
                  <Icon name="clock" />
                </span>
                <span>
                  <strong>{summary.overdue}</strong>
                  <small>{t("Đã quá hạn")}</small>
                </span>
              </button>
              <button onClick={() => navigate("completed")}>
                <span className={styles.summaryIcon}>
                  <Icon name="check" />
                </span>
                <span>
                  <strong>{summary.done}</strong>
                  <small>{t("Đã hoàn thành")}</small>
                </span>
              </button>
            </div>
          )}
          {view !== "settings" && view !== "statistics" && (
            <>
              {(view === "dashboard" || view === "today") && (
                <QuickAdd onAdd={quickAdd} onDetails={() => createTodo()} />
              )}
              <div className={styles.workspaceTools}>
                {view === "dashboard" && (
                  <div
                    className={styles.segmented}
                    aria-label={t("Cách hiển thị")}
                  >
                    <button
                      aria-pressed={boardLayout === "board"}
                      onClick={() => setBoardLayout("board")}
                    >
                      <Icon name="board" size={16} />
                      {t("Bảng")}
                    </button>
                    <button
                      aria-pressed={boardLayout === "list"}
                      onClick={() => setBoardLayout("list")}
                    >
                      <Icon name="list" size={16} />
                      {t("Danh sách")}
                    </button>
                  </div>
                )}
                <label className={styles.search}>
                  <Icon name="search" size={18} />
                  <input
                    ref={searchInput}
                    type="search"
                    aria-label={t("Tìm công việc trong màn hình hiện tại")}
                    placeholder={t("Tìm công việc...")}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <kbd>Ctrl K</kbd>
                </label>
                {view !== "calendar" && (
                  <label className={styles.sortControl}>
                    <span>{t("Sắp xếp")}</span>
                    <select
                      aria-label={t("Sắp xếp công việc")}
                      value={sortOrder}
                      onChange={(event) =>
                        setSortOrder(event.target.value as SortOrder)
                      }
                    >
                      <option value="scheduled">{t("Theo lịch")}</option>
                      <option value="priority">{t("Ưu tiên cao")}</option>
                      <option value="newest">{t("Mới tạo")}</option>
                    </select>
                  </label>
                )}
              </div>
              <ViewToolbar
                showFilters={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
                filter={filter}
                categories={categories}
                onChange={setFilter}
                count={viewTodos.length}
                query={query}
                onClear={clearFilters}
                hideStatus={view === "completed" || view === "upcoming"}
              />
            </>
          )}
          {view === "dashboard" &&
            (boardLayout === "board" && (!filtered || viewTodos.length > 0) ? (
              <BoardView
                todos={viewTodos}
                categories={categories}
                categoryFilter={filter.category}
                onOpen={openTodo}
                onToggle={toggleTodo}
                onCopy={copyTodo}
                onDelete={deleteTodo}
                onMove={moveTodoStatus}
                onCreate={createBoardTodo}
              />
            ) : (
              <TaskList
                title={t("Tất cả công việc")}
                todos={viewTodos}
                empty={t("Bắt đầu từ một việc nhỏ")}
                {...taskActions}
              />
            ))}
          {view === "today" && (
            <TaskList
              title={t("Kế hoạch hôm nay")}
              todos={viewTodos}
              empty={t("Hôm nay chưa có công việc")}
              {...taskActions}
            />
          )}
          {view === "upcoming" && (
            <TaskList
              title={t("Kế hoạch sắp tới")}
              todos={viewTodos}
              empty={t("Lịch sắp tới đang trống")}
              grouped
              {...taskActions}
            />
          )}
          {view === "completed" && (
            <TaskList
              title={t("Những việc đã hoàn thành")}
              todos={viewTodos}
              empty={t("Thành quả sẽ xuất hiện ở đây")}
              {...taskActions}
            />
          )}
          {view === "calendar" &&
            (calendarView === "week" || calendarView === "day" ? (
              <TimelineCalendar
                todos={viewTodos}
                cursor={cursor}
                calendarView={calendarView}
                firstDay={settings?.firstDay || "monday"}
                onCursor={setCursor}
                onCalendarView={setCalendarView}
                onOpen={openTodo}
                onMove={moveTimedTodo}
                onCreate={createTodo}
              />
            ) : (
              <Calendar
                todos={viewTodos}
                categories={categories}
                cursor={cursor}
                calendarView={calendarView}
                firstDay={settings?.firstDay || "monday"}
                onCursor={setCursor}
                onCalendarView={setCalendarView}
                onOpen={openTodo}
                onCopy={copyTodo}
                onToggle={toggleTodo}
                onDrop={moveTodo}
                onCreate={createTodo}
              />
            ))}
          {view === "statistics" && (
            <Statistics todos={todos} categories={categories} />
          )}
          {view === "settings" && (
            <SettingsPanel
              settings={settings}
              onChange={updateSettings}
              onExport={exportData}
              onCategories={() => setShowCategoryForm(true)}
              onLogout={logout}
              onImport={(backup) => {
                const imported = prepareImport(backup, userId);
                setData((current) => ({
                  ...current,
                  todos: [
                    ...current.todos.filter((todo) => todo.userId !== userId),
                    ...imported.todos,
                  ],
                  categories: [
                    ...current.categories.filter(
                      (category) => category.userId !== userId,
                    ),
                    ...imported.categories,
                  ],
                  settings: imported.settings.length
                    ? [
                        ...current.settings.filter(
                          (item) => item.userId !== userId,
                        ),
                        ...imported.settings,
                      ]
                    : current.settings,
                }));
                clearFilters();
                setDeletedTodo(null);
                setToast("Đã khôi phục bản sao lưu");
              }}
              onClear={() => {
                setData((current) => ({
                  ...current,
                  todos: current.todos.filter((todo) => todo.userId !== userId),
                  categories: current.categories.filter(
                    (category) => category.userId !== userId,
                  ),
                }));
                clearFilters();
                setDeletedTodo(null);
                setToast("Đã xóa dữ liệu công việc");
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
      {(toast || deletedTodo) && (
        <div className={styles.toast} role="status" aria-live="polite">
          <Icon name="check" size={18} />
          <span>{t(toast || "Đã xóa công việc")}</span>
          {deletedTodo && <button onClick={undoDelete}>{t("Hoàn tác")}</button>}
          <button
            className={styles.iconButton}
            aria-label={t("Đóng thông báo")}
            onClick={() => {
              setToast("");
              setDeletedTodo(null);
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
