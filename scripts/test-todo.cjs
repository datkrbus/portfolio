const { execFileSync } = require("node:child_process");
const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");

// Compile business rules and UI components with the installed TypeScript compiler.
const testRoot = path.resolve(tmpdir());
const build = mkdtempSync(path.join(testRoot, "todo-tests-"));
try {
  execFileSync(
    process.execPath,
    [
      require.resolve("typescript/bin/tsc"),
      "src/app/todo/todo-storage.ts",
      "src/app/todo/QuickAdd.tsx",
      "src/app/todo/AdvancedTodoModal.tsx",
      "src/app/todo/SettingsPanel.tsx",
      "src/app/todo/TaskList.tsx",
      "src/app/todo/WorkspaceNav.tsx",
      "src/app/todo/CategoryManager.tsx",
      "src/app/todo/AuthScreen.tsx",
      "src/app/todo/MonthCalendar.tsx",
      "src/app/todo/BoardView.tsx",
      "tests/css.d.ts",
      "--jsx",
      "react-jsx",
      "--esModuleInterop",
      "--outDir",
      build,
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--target",
      "ES2020",
      "--strict",
      "--skipLibCheck",
    ],
    { stdio: "inherit" },
  );
  writeFileSync(path.join(build, "todo.module.css"), "");
  for (const timezone of [
    "Asia/Ho_Chi_Minh",
    "America/Los_Angeles",
    "Pacific/Auckland",
  ]) {
    const result = execFileSync(
      process.execPath,
      ["--test", "tests/todo.test.cjs"],
      {
        env: { ...process.env, TZ: timezone, TODO_TEST_BUILD: build },
        encoding: "utf8",
      },
    );
    console.log(
      `${timezone}\n${result
        .split("\n")
        .filter((line) => /^# (tests|pass|fail|duration_ms) /.test(line))
        .join("\n")}`,
    );
  }
  const ui = execFileSync(
    process.execPath,
    ["--test", "tests/todo-ui.test.cjs"],
    {
      env: {
        ...process.env,
        TZ: "Asia/Ho_Chi_Minh",
        TODO_TEST_BUILD: build,
        NODE_PATH: path.resolve("node_modules"),
      },
      encoding: "utf8",
    },
  );
  console.log(
    `UI workflows\n${ui
      .split("\n")
      .filter((line) => /^# (tests|pass|fail|duration_ms) /.test(line))
      .join("\n")}`,
  );
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString());
  process.exitCode = 1;
} finally {
  const target = path.resolve(build);
  if (
    path.dirname(target) !== testRoot ||
    !path.basename(target).startsWith("todo-tests-")
  ) {
    throw new Error(
      "Refusing to remove a directory outside the test workspace.",
    );
  }
  rmSync(target, { recursive: true, force: true });
}
