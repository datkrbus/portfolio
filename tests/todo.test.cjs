const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const utils = require(path.join(process.env.TODO_TEST_BUILD, "todo-utils.js"));
const { parseBackup, prepareImport } = require(
  path.join(process.env.TODO_TEST_BUILD, "todo-validation.js"),
);
const storage = require(
  path.join(process.env.TODO_TEST_BUILD, "todo-storage.js"),
);
const task = (extra = {}) => ({
  id: "task-1",
  userId: "alice",
  title: "Plan release",
  description: "Check accessibility",
  date: "2026-10-08",
  startTime: "09:00",
  endTime: "09:30",
  allDay: false,
  priority: "high",
  categoryId: "work",
  completed: false,
  status: "todo",
  deadline: "",
  tags: ["focus"],
  subtasks: [],
  createdAt: "2026-10-08T02:00:00.000Z",
  updatedAt: "2026-10-08T02:00:00.000Z",
  ...extra,
});
const backup = (todos = [task()]) => ({
  todos,
  categories: [{ id: "work", userId: "alice", name: "Work", color: "#173b59" }],
});
const all = { status: "all", priority: "all", category: "all" };
const { translate } = require(
  path.join(process.env.TODO_TEST_BUILD, "todo-i18n.js"),
);

test("English relative dates and calendar formatting use the selected locale", () => {
  assert.equal(utils.relativeDate("2026-10-09", "2026-10-09", "en"), "Today");
  assert.equal(
    utils.relativeDate("2026-10-10", "2026-10-09", "en"),
    "Tomorrow",
  );
  assert.equal(
    utils.relativeDate("2026-10-08", "2026-10-09", "en"),
    "Yesterday",
  );
  assert.equal(
    utils.formatDate("2026-10-09", { month: "long", year: "numeric" }, "en-US"),
    "October 2026",
  );
});
test("translation interpolates user text once without translating its contents", () => {
  assert.equal(
    translate("en", "Thao tác: {0}", { 0: "Công việc {1}" }),
    "Actions: Công việc {1}",
  );
  assert.equal(
    translate("vi", "Thao tác: {0}", { 0: "Công việc {1}" }),
    "Thao tác: Công việc {1}",
  );
});

test("relative date labels use the supplied local reference day", () => {
  assert.equal(utils.relativeDate("2026-10-09", "2026-10-09"), "Hôm nay");
  assert.equal(utils.relativeDate("2026-10-10", "2026-10-09"), "Ngày mai");
  assert.equal(utils.relativeDate("2026-10-08", "2026-10-09"), "Hôm qua");
});
test("priority sorting keeps completed tasks last without changing input", () => {
  const items = [
    task({ id: "low", priority: "low" }),
    task({ id: "done", completed: true }),
    task({ id: "high" }),
  ];
  assert.deepEqual(
    utils.sortTodos(items, "priority").map((item) => item.id),
    ["high", "low", "done"],
  );
  assert.deepEqual(
    items.map((item) => item.id),
    ["low", "done", "high"],
  );
});

test("local dates remain correct near midnight and late evening", () => {
  assert.equal(utils.dateFrom(new Date(2026, 9, 8, 0, 5)), "2026-10-08");
  assert.equal(utils.dateFrom(new Date(2026, 9, 8, 23, 55)), "2026-10-08");
});
test("date validation rejects impossible dates", () => {
  assert.equal(utils.isDate("2026-02-29"), false);
  assert.equal(utils.isDate("2028-02-29"), true);
  assert.equal(utils.isDate("2026-13-01"), false);
});
test("day arithmetic works across year and daylight-saving boundaries", () => {
  assert.equal(utils.addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(utils.addDays("2026-03-08", 1), "2026-03-09");
  assert.equal(utils.addDays("2026-11-01", -1), "2026-10-31");
});
test("month navigation clamps to actual month ends", () => {
  assert.equal(utils.addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(utils.addMonths("2028-01-31", 1), "2028-02-29");
  assert.equal(utils.addMonths("2026-03-31", -1), "2026-02-28");
});
test("six-row month includes the last day", () => {
  const days = utils.monthDays("2026-03-01");
  assert.equal(days.length, 42);
  assert.equal(days[0], "2026-02-23");
  assert.ok(days.includes("2026-03-31"));
});
test("every month includes every day exactly once with either week start", () => {
  for (let month = 1; month <= 12; month++) {
    const prefix = `2026-${String(month).padStart(2, "0")}`;
    for (const firstDay of ["monday", "sunday"]) {
      const days = utils.monthDays(`${prefix}-15`, firstDay);
      assert.equal(new Set(days).size, days.length);
      assert.equal(
        days.filter((day) => day.startsWith(prefix)).length,
        new Date(2026, month, 0).getDate(),
      );
      assert.equal(
        utils.parseDate(days[0]).getDay(),
        firstDay === "monday" ? 1 : 0,
      );
    }
  }
});
test("week starts honor Sunday preference", () => {
  assert.equal(utils.weekStart("2026-10-08"), "2026-10-05");
  assert.equal(utils.weekStart("2026-10-08", "sunday"), "2026-10-04");
});
test("late tasks cannot produce invalid 24:00/25:00 times", () => {
  assert.equal(utils.endTimeFor("23:00", 90), "23:59");
  assert.equal(utils.endTimeFor("09:15", 30), "09:45");
});
test("monthly and yearly recurrence use calendar arithmetic", () => {
  assert.equal(
    utils.nextRecurrenceDate("2026-01-31", {
      frequency: "monthly",
      interval: 1,
    }),
    "2026-02-28",
  );
  assert.equal(
    utils.nextRecurrenceDate("2028-02-29", {
      frequency: "yearly",
      interval: 1,
    }),
    "2029-02-28",
  );
});
test("recurrence honors interval, selected weekdays and inclusive end date", () => {
  assert.equal(
    utils.nextRecurrenceDate("2026-10-05", {
      frequency: "weekly",
      interval: 2,
      days: [1, 3],
    }),
    "2026-10-07",
  );
  assert.equal(
    utils.nextRecurrenceDate("2026-10-07", {
      frequency: "weekly",
      interval: 2,
      days: [1, 3],
    }),
    "2026-10-19",
  );
  assert.equal(
    utils.nextRecurrenceDate("2026-10-08", {
      frequency: "daily",
      interval: 1,
      until: "2026-10-09",
    }),
    "2026-10-09",
  );
  assert.equal(
    utils.nextRecurrenceDate("2026-10-09", {
      frequency: "daily",
      interval: 1,
      until: "2026-10-09",
    }),
    null,
  );
});
test("completion creates exactly one successor and resets its subtasks", () => {
  const original = task({
    recurrence: { frequency: "weekly", interval: 1 },
    deadline: "2026-10-10",
    subtasks: [{ id: "s1", title: "Prepare", completed: true }],
  });
  const result = utils.applyTodoUpdate([original], {
    ...original,
    completed: true,
    status: "done",
  });
  assert.equal(result.length, 2);
  const next = result.find((item) => item.id !== original.id);
  assert.equal(next.date, "2026-10-15");
  assert.equal(next.deadline, "2026-10-17");
  assert.equal(next.subtasks[0].completed, false);
  assert.equal(next.completed, false);
  assert.equal(original.completed, false);
  const reopened = utils.applyTodoUpdate(result, {
    ...original,
    completed: false,
  });
  assert.equal(
    utils.applyTodoUpdate(reopened, { ...original, completed: true }).length,
    2,
  );
});
test("editing completed tasks preserves completion timestamps", () => {
  const previous = task({
    completed: true,
    status: "done",
    completedAt: "2026-10-08T04:00:00Z",
  });
  const [result] = utils.applyTodoUpdate(
    [previous],
    { ...previous, title: "Updated" },
    "2026-10-09T04:00:00Z",
  );
  assert.equal(result.completedAt, previous.completedAt);
});
test("status reconciliation handles legacy inconsistent values", () => {
  assert.equal(
    utils.statusFor(task({ completed: true, status: "todo" })),
    "done",
  );
  assert.equal(
    utils.statusFor(task({ completed: false, status: "done" })),
    "todo",
  );
});
test("overdue filter excludes tasks without deadlines and completed tasks", () => {
  const filter = { ...all, status: "overdue" };
  assert.equal(utils.matchesTodo(task(), "", filter, "2026-10-08"), false);
  assert.equal(
    utils.matchesTodo(
      task({ deadline: "2026-10-07" }),
      "",
      filter,
      "2026-10-08",
    ),
    true,
  );
  assert.equal(
    utils.matchesTodo(
      task({ deadline: "2026-10-07", completed: true }),
      "",
      filter,
      "2026-10-08",
    ),
    false,
  );
});
test("search combines description, tags and category/priority filters", () => {
  assert.equal(
    utils.matchesTodo(task(), "accessibility", all, "2026-10-08"),
    true,
  );
  assert.equal(
    utils.matchesTodo(
      task(),
      "focus",
      { ...all, category: "other" },
      "2026-10-08",
    ),
    false,
  );
  assert.equal(
    utils.matchesTodo(
      task(),
      "focus",
      { ...all, priority: "high" },
      "2026-10-08",
    ),
    true,
  );
});
test("indexing preserves input order and handles prototype-like keys", () => {
  const tasks = [
    task({ date: "__proto__" }),
    task({ id: "2", date: "__proto__" }),
  ];
  assert.deepEqual(
    utils.groupTodos(tasks, (item) => item.date).get("__proto__"),
    tasks,
  );
});
test("legacy backups receive safe optional defaults", () => {
  const item = task();
  delete item.tags;
  delete item.subtasks;
  delete item.status;
  const result = parseBackup(backup([item]));
  assert.deepEqual(result.todos[0].tags, []);
  assert.deepEqual(result.todos[0].subtasks, []);
});
test("invalid imports are rejected before application state can change", () => {
  for (const value of [
    null,
    {},
    backup([null]),
    backup([task({ title: " " })]),
    backup([task({ tags: [null] })]),
    backup([task({ date: "2026-02-31" })]),
    backup([task({ startTime: "25:00" })]),
    backup([task({ endTime: "08:00" })]),
    backup([task({ recurrence: { frequency: "daily", interval: 0 } })]),
    backup([task({ subtasks: [null] })]),
    backup([task(), task()]),
    { ...backup(), version: 99 },
  ]) {
    assert.throws(() => parseBackup(value));
  }
});
test("import remaps IDs and ownership, preserving category and recurrence links", () => {
  const source = parseBackup(
    backup([task(), task({ id: "next", recurrenceSourceId: "task-1" })]),
  );
  const result = prepareImport(source, "bob");
  assert.ok(result.todos.every((item) => item.userId === "bob"));
  assert.notEqual(result.todos[0].id, source.todos[0].id);
  assert.equal(result.todos[0].categoryId, result.categories[0].id);
  assert.equal(result.todos[1].recurrenceSourceId, result.todos[0].id);
  assert.equal(source.todos[0].userId, "alice");
});
test("settings preserve system theme and restore on import", () => {
  const data = parseBackup({
    ...backup(),
    settings: [storage.defaultSettings("alice")],
  });
  data.settings[0].theme = "system";
  assert.equal(parseBackup(data).settings[0].theme, "system");
  assert.equal(prepareImport(data, "bob").settings[0].userId, "bob");
});
test("checked-in backup remains compatible", () => {
  if (fs.existsSync("todo-backup-2026-10-05.json"))
    parseBackup(
      JSON.parse(
        fs
          .readFileSync("todo-backup-2026-10-05.json", "utf8")
          .replace(/^\uFEFF/, ""),
      ),
    );
});
test("storage uses fresh defaults, round-trips, detects conflicts, and preserves corrupt data", () => {
  const map = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => map.set(key, value),
      removeItem: (key) => map.delete(key),
    },
  };
  const fresh = storage.loadData();
  fresh.todos.push(task());
  assert.equal(storage.loadData().todos.length, 0);
  const data = {
    users: [
      {
        id: "alice",
        username: "alice",
        password: "test-only",
        createdAt: task().createdAt,
      },
    ],
    ...parseBackup(backup()),
  };
  storage.saveData(data);
  assert.equal(storage.loadData().todos.length, 1);
  map.set(storage.DATA_KEY, "changed-by-another-tab");
  assert.throws(() => storage.saveData(data), storage.StorageConflictError);
  assert.equal(map.get(storage.DATA_KEY), "changed-by-another-tab");
  map.set(storage.DATA_KEY, "broken-json");
  assert.throws(() => storage.loadData());
  assert.equal(map.get(storage.DATA_KEY), "broken-json");
  map.clear();
  storage.loadData();
  window.localStorage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  assert.throws(() => storage.saveData(data), /QuotaExceededError/);
  delete global.window;
});
