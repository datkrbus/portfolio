const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:3000/todo/",
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLDialogElement",
  "Node",
  "Event",
  "MouseEvent",
  "StorageEvent",
])
  global[key] = dom.window[key];
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.IS_REACT_ACT_ENVIRONMENT = true;
global.localStorage = dom.window.localStorage;
// DOM tests exercise our callbacks and form flow, not the browser's native focus trap.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
require.extensions[".css"] = (module) => {
  module.exports = {
    __esModule: true,
    default: new Proxy({}, { get: (_, key) => key }),
  };
};
const React = require("react");
const {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} = require("@testing-library/react");
afterEach(() => {
  cleanup();
  localStorage.clear();
});
const load = (name) =>
  require(path.join(process.env.TODO_TEST_BUILD, name + ".js")).default;
const utils = require(path.join(process.env.TODO_TEST_BUILD, "todo-utils.js"));
const noop = () => {};
const { I18nProvider } = require(
  path.join(process.env.TODO_TEST_BUILD, "I18nProvider.js"),
);
const { LANGUAGE_KEY, english } = require(
  path.join(process.env.TODO_TEST_BUILD, "todo-i18n.js"),
);
const showLocalized = (component) =>
  render(
    React.createElement(
      I18nProvider,
      null,
      React.createElement(load("LanguageSelect")),
      component,
    ),
  );
const task = (extra = {}) => ({
  id: "",
  userId: "local",
  title: "",
  description: "",
  date: "2026-10-09",
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
  ...extra,
});
const settings = {
  userId: "local",
  theme: "system",
  firstDay: "monday",
  timeFormat: "24",
  defaultView: "month",
  defaultDuration: 30,
  workingStart: "08:00",
  workingEnd: "18:00",
};

test("language switching translates controls and survives remounting", () => {
  const quick = React.createElement(load("QuickAdd"), {
    onAdd: noop,
    onDetails: noop,
  });
  const view = showLocalized(quick);
  fireEvent.change(screen.getByLabelText("Ngôn ngữ"), {
    target: { value: "en" },
  });
  assert.equal(localStorage.getItem(LANGUAGE_KEY), "en");
  assert.ok(screen.getByRole("textbox", { name: "New task name" }));
  assert.equal(document.documentElement.lang, "en");
  assert.equal(document.title, "Quietly Done | Your tasks");
  view.unmount();
  showLocalized(quick);
  assert.equal(screen.getByLabelText("Language").value, "en");
  assert.ok(screen.getByRole("button", { name: "Add", exact: true }));
});
test("English task details preserve user text and identifiers when saved", () => {
  let saved;
  const original = task({
    id: "kept",
    title: "Công việc",
    description: "Ghi chú của tôi",
    categoryId: "cat",
  });
  showLocalized(
    React.createElement(load("AdvancedTodoModal"), {
      todo: original,
      categories: [
        { id: "cat", userId: "local", name: "Học tập", color: "#2457a6" },
      ],
      onSave: (value) => {
        saved = value;
      },
      onClose: noop,
    }),
  );
  fireEvent.change(screen.getByLabelText("Ngôn ngữ"), {
    target: { value: "en" },
  });
  assert.equal(screen.getByLabelText("Task name").value, original.title);
  assert.ok(screen.getByRole("option", { name: "Học tập" }));
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  assert.equal(saved.id, original.id);
  assert.equal(saved.title, original.title);
  assert.equal(saved.description, original.description);
  assert.equal(saved.categoryId, original.categoryId);
});
test("existing validation errors translate immediately when language changes", () => {
  showLocalized(
    React.createElement(load("AdvancedTodoModal"), {
      todo: task({ title: "Timed", allDay: false, endTime: "08:30" }),
      categories: [],
      onSave: noop,
      onClose: noop,
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Tạo công việc" }));
  assert.match(screen.getByRole("alert").textContent, /Giờ kết thúc/);
  fireEvent.change(screen.getByLabelText("Ngôn ngữ"), {
    target: { value: "en" },
  });
  assert.match(
    screen.getByRole("alert").textContent,
    /The end time must be after/,
  );
});
test("calendar month, weekdays and navigation follow the selected language", () => {
  localStorage.setItem(LANGUAGE_KEY, "en");
  showLocalized(
    React.createElement(load("MonthCalendar"), {
      todos: [],
      categories: [],
      cursor: "2026-10-09",
      calendarView: "month",
      firstDay: "monday",
      onToggle: noop,
      onCursor: noop,
      onCalendarView: noop,
      onOpen: noop,
      onCopy: noop,
      onDrop: noop,
      onCreate: noop,
    }),
  );
  assert.ok(screen.getByRole("heading", { name: "October 2026" }));
  assert.ok(screen.getByText("Mon", { exact: true }));
  assert.ok(screen.getByText("Sun", { exact: true }));
  assert.ok(screen.getByRole("button", { name: "Month", exact: true }));
  assert.ok(screen.getByLabelText("Go to date"));
});
test("English board labels do not translate category names or task titles", () => {
  localStorage.setItem(LANGUAGE_KEY, "en");
  showLocalized(
    React.createElement(load("BoardView"), {
      todos: [task({ id: "t", title: "Cần làm", categoryId: "cat" })],
      categories: [
        { id: "cat", userId: "local", name: "Công việc", color: "#2457a6" },
      ],
      onOpen: noop,
      onMove: noop,
      categoryFilter: "all",
      onCreate: noop,
      onToggle: noop,
      onCopy: noop,
      onDelete: noop,
    }),
  );
  assert.ok(screen.getByRole("heading", { name: "To do" }));
  assert.ok(screen.getByRole("heading", { name: "In progress" }));
  assert.ok(screen.getByRole("heading", { name: "In review" }));
  assert.ok(screen.getByRole("heading", { name: "Done" }));
  assert.ok(screen.getByText("Công việc", { exact: true }));
  assert.ok(screen.getByText("Cần làm", { exact: true }));
});
test("a language update from another tab refreshes this tab", () => {
  showLocalized(
    React.createElement(load("QuickAdd"), { onAdd: noop, onDetails: noop }),
  );
  fireEvent(
    window,
    new StorageEvent("storage", { key: LANGUAGE_KEY, newValue: "en" }),
  );
  assert.ok(screen.getByRole("textbox", { name: "New task name" }));
});
test("every literal UI translation key has an English entry", () => {
  const fs = require("node:fs");
  const ts = require("typescript");
  const root = path.resolve("src/app/todo");
  const keys = new Set();
  const { viewLabels } = require(
    path.join(process.env.TODO_TEST_BUILD, "WorkspaceNav.js"),
  );
  for (const labels of [
    viewLabels,
    utils.priorityLabel,
    utils.statusLabels,
    utils.calendarLabels,
  ]) {
    for (const label of Object.values(labels)) keys.add(label);
  }
  for (const file of fs
    .readdirSync(root)
    .filter((name) => name.endsWith(".tsx"))) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(path.join(root, file), "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(source) === "t" &&
        ts.isStringLiteral(node.arguments[0])
      )
        keys.add(node.arguments[0].text);
      if (
        ts.isCallExpression(node) &&
        /^set(?:Toast|AuthError|StorageError|Error|NotificationStatus)$/.test(
          node.expression.getText(source),
        )
      ) {
        for (const argument of node.arguments) {
          if (ts.isStringLiteral(argument) && argument.text)
            keys.add(argument.text);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  for (const key of keys)
    assert.ok(english[key], `Missing English translation: ${key}`);
});
const showSettings = (extra = {}) =>
  render(
    React.createElement(load("SettingsPanel"), {
      settings,
      onChange: noop,
      onExport: noop,
      onCategories: noop,
      onLogout: noop,
      onImport: noop,
      onClear: noop,
      ...extra,
    }),
  );

test("category deletion keeps data until the explicit confirm action", () => {
  let deleted;
  render(
    React.createElement(load("CategoryManager"), {
      categories: [
        { id: "work", userId: "local", name: "Work", color: "#4f8b73" },
      ],
      onSave: noop,
      onDelete: (id) => {
        deleted = id;
      },
      onClose: noop,
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Xóa Work" }));
  assert.equal(deleted, undefined);
  assert.match(
    screen.getByRole("alert").textContent,
    /Công việc bên trong được giữ lại/,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Xóa danh mục", exact: true }),
  );
  assert.equal(deleted, "work");
});
test("category creation rejects duplicate names ignoring case and whitespace", () => {
  let saves = 0;
  render(
    React.createElement(load("CategoryManager"), {
      categories: [
        { id: "work", userId: "local", name: "Work", color: "#4f8b73" },
      ],
      onSave: () => {
        saves++;
      },
      onDelete: noop,
      onClose: noop,
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: /Thêm danh mục/ }));
  fireEvent.change(screen.getByLabelText("Tên danh mục"), {
    target: { value: " work " },
  });
  fireEvent.submit(screen.getByLabelText("Tên danh mục").closest("form"));
  assert.equal(saves, 0);
  assert.match(screen.getByRole("alert").textContent, /Danh mục này đã có/);
});

test("quick add submits a literal title for tomorrow and clears only after success", () => {
  let saved;
  render(
    React.createElement(load("QuickAdd"), {
      onAdd: (...args) => {
        saved = args;
      },
      onDetails: noop,
    }),
  );
  const input = screen.getByRole("textbox", { name: "Tên công việc mới" });
  assert.equal(
    screen.getByRole("button", { name: "Thêm", exact: true }).disabled,
    true,
  );
  fireEvent.change(input, {
    target: { value: "  tomorrow is in the title  " },
  });
  fireEvent.change(screen.getByLabelText("Ngày thêm nhanh"), {
    target: { value: "tomorrow" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Thêm", exact: true }));
  assert.deepEqual(saved, [
    "tomorrow is in the title",
    utils.addDays(utils.today(), 1),
  ]);
  assert.equal(input.value, "");
});
test("quick add retains text when storage rejects a new task", () => {
  render(
    React.createElement(load("QuickAdd"), {
      onAdd: () => false,
      onDetails: noop,
    }),
  );
  const input = screen.getByLabelText("Tên công việc mới");
  fireEvent.change(input, { target: { value: "Keep me" } });
  fireEvent.click(screen.getByRole("button", { name: "Thêm", exact: true }));
  assert.equal(input.value, "Keep me");
});
test("task form starts simple and includes an unsubmitted subtask when saving", () => {
  let saved;
  render(
    React.createElement(load("AdvancedTodoModal"), {
      todo: task(),
      categories: [],
      onSave: (value) => {
        saved = value;
      },
      onClose: noop,
    }),
  );
  assert.equal(screen.queryByLabelText("Hạn chót"), null);
  assert.equal(screen.queryByLabelText("Bắt đầu"), null);
  fireEvent.change(screen.getByLabelText("Tên công việc"), {
    target: { value: "  Main task  " },
  });
  fireEvent.click(screen.getByRole("button", { name: /Chia thành việc nhỏ/ }));
  fireEvent.change(screen.getByLabelText("Tên việc con"), {
    target: { value: "Pending step" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Tạo công việc" }));
  assert.equal(saved.title, "Main task");
  assert.equal(saved.subtasks[0].title, "Pending step");
  assert.ok(saved.id);
});
test("closing an edited draft needs an explicit discard choice", () => {
  let closed = 0;
  render(
    React.createElement(load("AdvancedTodoModal"), {
      todo: task(),
      categories: [],
      onSave: noop,
      onClose: () => {
        closed++;
      },
    }),
  );
  fireEvent.change(screen.getByLabelText("Tên công việc"), {
    target: { value: "Unsaved" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Đóng chi tiết" }));
  assert.equal(closed, 0);
  fireEvent.click(screen.getByRole("button", { name: "Bỏ thay đổi" }));
  assert.equal(closed, 1);
});
test("task form rejects an end time before the start time", () => {
  let saves = 0;
  render(
    React.createElement(load("AdvancedTodoModal"), {
      todo: task({ title: "Timed", allDay: false, endTime: "08:30" }),
      categories: [],
      onSave: () => {
        saves++;
      },
      onClose: noop,
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Tạo công việc" }));
  assert.equal(saves, 0);
  assert.match(screen.getByRole("alert").textContent, /Giờ kết thúc/);
});
test("clear data requires confirmation and can be cancelled", () => {
  let clears = 0;
  showSettings({
    onClear: () => {
      clears++;
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Xóa dữ liệu..." }));
  assert.equal(clears, 0);
  fireEvent.click(screen.getByRole("button", { name: "Giữ dữ liệu" }));
  assert.equal(screen.queryByRole("button", { name: "Xác nhận xóa" }), null);
  fireEvent.click(screen.getByRole("button", { name: "Xóa dữ liệu..." }));
  fireEvent.click(screen.getByRole("button", { name: "Xác nhận xóa" }));
  assert.equal(clears, 1);
});
test("backup restoration previews validated data before replacing anything", async () => {
  let restored;
  showSettings({
    onImport: (data) => {
      restored = data;
    },
  });
  const backup = {
    todos: [
      task({
        id: "task",
        title: "Backup",
        createdAt: "2026-10-09T01:00:00Z",
        updatedAt: "2026-10-09T01:00:00Z",
      }),
    ],
    categories: [],
  };
  fireEvent.change(screen.getByLabelText("File sao lưu"), {
    target: {
      files: [{ size: 100, text: async () => JSON.stringify(backup) }],
    },
  });
  await screen.findByRole("region", { name: "Xem trước bản sao lưu" });
  assert.equal(restored, undefined);
  fireEvent.click(screen.getByRole("button", { name: "Khôi phục dữ liệu" }));
  assert.equal(restored.todos[0].title, "Backup");
});
test("a malformed backup is rejected without offering restore", async () => {
  showSettings();
  fireEvent.change(screen.getByLabelText("File sao lưu"), {
    target: { files: [{ size: 5, text: async () => "oops" }] },
  });
  await screen.findByRole("alert");
  assert.equal(
    screen.queryByRole("button", { name: "Khôi phục dữ liệu" }),
    null,
  );
});
test("list completion and editing are available without dragging", () => {
  const todo = task({ id: "t", title: "Accessible task" });
  let toggled;
  let opened;
  render(
    React.createElement(load("TaskList"), {
      title: "List",
      todos: [todo],
      categories: [],
      empty: "Empty",
      onToggle: (value) => {
        toggled = value;
      },
      onOpen: (value) => {
        opened = value;
      },
      onCopy: noop,
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Hoàn thành: Accessible task" }),
  );
  assert.equal(toggled, todo);
  const trigger = screen.getByRole("button", {
    name: "Thao tác: Accessible task",
  });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "Chỉnh sửa" }));
  assert.equal(opened, todo);
  assert.equal(document.activeElement, trigger);
});
test("mobile navigation exposes settings and closes after navigation", () => {
  let view;
  render(
    React.createElement(load("WorkspaceNav"), {
      view: "dashboard",
      onView: (value) => {
        view = value;
      },
      categories: [],
      categoryId: "all",
      counts: new Map(),
      todayCount: 0,
      username: "Me",
      onCategory: noop,
      onManage: noop,
      onNew: noop,
    }),
  );
  const nav = screen.getByRole("navigation", {
    name: "Điều hướng trên điện thoại",
  });
  fireEvent.click(within(nav).getByRole("button", { name: "Thêm" }));
  fireEvent.click(
    within(
      screen.getByRole("navigation", { name: "Các màn hình khác" }),
    ).getByRole("button", { name: "Cài đặt" }),
  );
  assert.equal(view, "settings");
  assert.equal(
    screen.queryByRole("navigation", { name: "Các màn hình khác" }),
    null,
  );
});
