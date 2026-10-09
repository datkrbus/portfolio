"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type {
  Category,
  Priority,
  Todo,
  TodoStatus,
  Recurrence,
} from "./todo-types";
import Dialog from "./Dialog";
import Icon from "./Icon";
import {
  isDate,
  isTime,
  statusFor,
  statusLabels,
  priorityLabel,
} from "./todo-utils";
import styles from "./todo.module.css";
export default function AdvancedTodoModal({
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
  const { t } = useI18n();
  const [draft, setDraft] = useState(todo);
  const [tags, setTags] = useState(todo.tags.join(", "));
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [error, setError] = useState("");
  const [advanced, setAdvanced] = useState(
    Boolean(
      todo.recurrence || todo.reminder || todo.deadline || todo.tags.length,
    ),
  );
  const [subtasksOpen, setSubtasksOpen] = useState(todo.subtasks.length > 0);
  const [discard, setDiscard] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const submitShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter" &&
        form.current?.contains(event.target as Node)
      ) {
        event.preventDefault();
        form.current.requestSubmit();
      }
    };
    document.addEventListener("keydown", submitShortcut);
    return () => document.removeEventListener("keydown", submitShortcut);
  }, []);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(todo) ||
    tags !== todo.tags.join(", ") ||
    Boolean(subtaskTitle.trim());
  function close() {
    if (dirty) setDiscard(true);
    else onClose();
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim())
      return setError("Nhập tên công việc trước khi lưu.");
    if (!isDate(draft.date)) return setError("Chọn ngày thực hiện hợp lệ.");
    if (
      !draft.allDay &&
      (!isTime(draft.startTime) ||
        !isTime(draft.endTime) ||
        draft.endTime <= draft.startTime)
    )
      return setError("Giờ kết thúc phải sau giờ bắt đầu trong cùng một ngày.");
    if (
      draft.recurrence &&
      (!Number.isInteger(draft.recurrence.interval) ||
        draft.recurrence.interval < 1 ||
        draft.recurrence.interval > 99)
    ) {
      setAdvanced(true);
      return setError("Chu kỳ lặp phải từ 1 đến 99.");
    }
    if (
      draft.recurrence?.until &&
      (!isDate(draft.recurrence.until) || draft.recurrence.until < draft.date)
    ) {
      setAdvanced(true);
      return setError("Ngày kết thúc lặp không được trước ngày thực hiện.");
    }
    const subtasks = subtaskTitle.trim()
      ? [
          ...draft.subtasks,
          {
            id: crypto.randomUUID(),
            title: subtaskTitle.trim(),
            completed: false,
          },
        ]
      : draft.subtasks;
    onSave({
      ...draft,
      subtasks,
      title: draft.title.trim(),
      tags: [
        ...new Set(
          tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ],
      id: draft.id || crypto.randomUUID(),
      createdAt: draft.createdAt || new Date().toISOString(),
    });
  }
  function addSubtask() {
    if (!subtaskTitle.trim()) return;
    setDraft({
      ...draft,
      subtasks: [
        ...draft.subtasks,
        {
          id: crypto.randomUUID(),
          title: subtaskTitle.trim(),
          completed: false,
        },
      ],
    });
    setSubtaskTitle("");
  }
  async function enableNotifications() {
    if (!("Notification" in window))
      return setNotificationStatus("Trình duyệt này chưa hỗ trợ thông báo.");
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(
        permission === "granted"
          ? "Đã bật. Giữ app mở để nhận lời nhắc."
          : "Chưa được cho phép. Bạn có thể bật trong cài đặt trình duyệt.",
      );
    } catch {
      setNotificationStatus("Không thể bật thông báo trong trình duyệt này.");
    }
  }
  return (
    <Dialog
      label={todo.id ? t("Chi tiết công việc") : t("Thêm công việc")}
      onClose={close}
    >
      <form ref={form} className={styles.modal} onSubmit={submit}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.overline}>
              {todo.id ? t("CHI TIẾT CÔNG VIỆC") : t("MỘT VIỆC, MỘT BƯỚC TIẾN")}
            </p>
            <h2>
              {todo.id ? t("Chỉnh sửa công việc") : t("Bạn muốn làm gì?")}
            </h2>
          </div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={t("Đóng chi tiết")}
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.fieldLabel}>
            {t("Tên công việc")}
            <input
              className={styles.titleInput}
              data-autofocus
              required
              maxLength={300}
              placeholder={t("Ví dụ: Chuẩn bị bài thuyết trình")}
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </label>
          <label className={styles.fieldLabel}>
            {t("Ghi chú")}
            <span className={styles.optional}>{t("Không bắt buộc")}</span>
            <textarea
              rows={2}
              placeholder={t("Thêm ngữ cảnh, ý tưởng hoặc đường dẫn...")}
              value={draft.description}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
            />
          </label>
          <div className={styles.formGrid}>
            <label>
              {t("Ngày thực hiện")}
              <input
                type="date"
                required
                value={draft.date}
                onChange={(event) =>
                  setDraft({ ...draft, date: event.target.value })
                }
              />
            </label>
            <label>
              {t("Danh mục")}
              <select
                value={draft.categoryId}
                onChange={(event) =>
                  setDraft({ ...draft, categoryId: event.target.value })
                }
              >
                <option value="">{t("Chưa phân loại")}</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Mức ưu tiên")}
              <select
                value={draft.priority}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    priority: event.target.value as Priority,
                  })
                }
              >
                {Object.entries(priorityLabel).map(([value, label]) => (
                  <option value={value} key={value}>
                    {t(label)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Trạng thái")}
              <select
                value={statusFor(draft)}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as TodoStatus,
                    completed: event.target.value === "done",
                  })
                }
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {t(label)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={!draft.allDay}
              onChange={(event) =>
                setDraft({ ...draft, allDay: !event.target.checked })
              }
            />
            {t("Đặt giờ cụ thể")}
            <span className={styles.optional}>{t("Không bật = cả ngày")}</span>
          </label>
          {!draft.allDay && (
            <div className={styles.formGrid}>
              <label>
                {t("Bắt đầu")}
                <input
                  required
                  type="time"
                  value={draft.startTime}
                  onChange={(event) =>
                    setDraft({ ...draft, startTime: event.target.value })
                  }
                />
              </label>
              <label>
                {t("Kết thúc")}
                <input
                  required
                  type="time"
                  value={draft.endTime}
                  onChange={(event) =>
                    setDraft({ ...draft, endTime: event.target.value })
                  }
                />
              </label>
            </div>
          )}
          <section className={styles.disclosure}>
            <button
              type="button"
              className={styles.disclosureButton}
              aria-expanded={subtasksOpen}
              aria-controls="subtask-fields"
              onClick={() => setSubtasksOpen(!subtasksOpen)}
            >
              <Icon name="list" size={18} />
              <span>{t("Chia thành việc nhỏ")}</span>
              {draft.subtasks.length > 0 && (
                <small>
                  {draft.subtasks.filter((item) => item.completed).length}/
                  {draft.subtasks.length}
                </small>
              )}
              <Icon
                name="chevron"
                size={16}
                style={{
                  transform: subtasksOpen ? "rotate(90deg)" : undefined,
                }}
              />
            </button>
            {subtasksOpen && (
              <div id="subtask-fields" className={styles.subtasks}>
                {draft.subtasks.map((subtask) => (
                  <div className={styles.subtaskRow} key={subtask.id}>
                    <input
                      type="checkbox"
                      aria-label={t("Hoàn thành: {0}", { "0": subtask.title })}
                      checked={subtask.completed}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          subtasks: draft.subtasks.map((item) =>
                            item.id === subtask.id
                              ? { ...item, completed: event.target.checked }
                              : item,
                          ),
                        })
                      }
                    />
                    <span
                      className={subtask.completed ? styles.subtaskDone : ""}
                    >
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("Xóa: {0}", { "0": subtask.title })}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          subtasks: draft.subtasks.filter(
                            (item) => item.id !== subtask.id,
                          ),
                        })
                      }
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
                <div className={styles.subtaskAdd}>
                  <input
                    aria-label={t("Tên việc con")}
                    placeholder={t("Thêm một bước nhỏ...")}
                    value={subtaskTitle}
                    onChange={(event) => setSubtaskTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSubtask();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.outlineButton}
                    disabled={!subtaskTitle.trim()}
                    onClick={addSubtask}
                  >
                    {t("Thêm")}
                  </button>
                </div>
              </div>
            )}
          </section>
          <section className={styles.disclosure}>
            <button
              type="button"
              className={styles.disclosureButton}
              aria-expanded={advanced}
              aria-controls="advanced-fields"
              onClick={() => setAdvanced(!advanced)}
            >
              <Icon name="settings" size={18} />
              <span>{t("Tùy chọn nâng cao")}</span>
              <small>{t("Hạn chót, lặp lại, lời nhắc")}</small>
              <Icon
                name="chevron"
                size={16}
                style={{ transform: advanced ? "rotate(90deg)" : undefined }}
              />
            </button>
            {advanced && (
              <div id="advanced-fields">
                <div className={styles.formGrid}>
                  <label>
                    {t("Hạn chót")}
                    <input
                      type="date"
                      value={draft.deadline}
                      onChange={(event) =>
                        setDraft({ ...draft, deadline: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    {t("Lặp lại")}
                    <select
                      value={draft.recurrence?.frequency || "never"}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          recurrence:
                            event.target.value === "never"
                              ? undefined
                              : {
                                  ...draft.recurrence,
                                  frequency: event.target
                                    .value as Recurrence["frequency"],
                                  interval: draft.recurrence?.interval || 1,
                                },
                        })
                      }
                    >
                      <option value="never">{t("Không lặp")}</option>
                      <option value="daily">{t("Hằng ngày")}</option>
                      <option value="weekly">{t("Hằng tuần")}</option>
                      <option value="monthly">{t("Hằng tháng")}</option>
                      <option value="yearly">{t("Hằng năm")}</option>
                      {draft.recurrence?.frequency === "custom" && (
                        <option value="custom">{t("Tùy chỉnh")}</option>
                      )}
                    </select>
                  </label>
                  {draft.recurrence && (
                    <>
                      <label>
                        {t("Chu kỳ (mỗi n lần)")}
                        <input
                          required
                          type="number"
                          min={1}
                          max={99}
                          value={draft.recurrence.interval}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              recurrence: {
                                ...draft.recurrence!,
                                interval: Number(event.target.value),
                              },
                            })
                          }
                        />
                      </label>
                      <label>
                        {t("Lặp đến ngày")}
                        <input
                          type="date"
                          min={draft.date}
                          value={draft.recurrence.until || ""}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              recurrence: {
                                ...draft.recurrence!,
                                until: event.target.value || undefined,
                              },
                            })
                          }
                        />
                      </label>
                    </>
                  )}
                  <label>
                    {t("Nhắc trước giờ bắt đầu")}
                    <select
                      disabled={draft.allDay}
                      value={draft.reminder?.minutesBefore || 0}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          reminder: Number(event.target.value)
                            ? { minutesBefore: Number(event.target.value) }
                            : undefined,
                        })
                      }
                    >
                      <option value={0}>{t("Không nhắc")}</option>
                      {[5, 10, 15, 30, 60].map((value) => (
                        <option key={value} value={value}>
                          {value} {t("phút trước")}
                        </option>
                      ))}
                    </select>
                    {draft.allDay && (
                      <small>{t("Bật giờ cụ thể để dùng lời nhắc.")}</small>
                    )}
                  </label>
                  <label>
                    {t("Nhãn")}
                    <input
                      placeholder={t("học tập, tập trung...")}
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                    />
                    <small>{t("Phân cách bằng dấu phẩy.")}</small>
                  </label>
                </div>
                {draft.reminder && !draft.allDay && (
                  <button
                    className={styles.textButton}
                    type="button"
                    onClick={enableNotifications}
                  >
                    {t("Bật thông báo trình duyệt")}
                  </button>
                )}
                {notificationStatus && (
                  <p role="status" className={styles.helperText}>
                    {t(notificationStatus)}
                  </p>
                )}
                <p className={styles.helperText}>
                  {t("Việc lặp tạo lần tiếp theo khi bạn đánh dấu hoàn thành.")}
                </p>
              </div>
            )}
          </section>
          {error && (
            <p className={styles.formError} role="alert">
              {t(error)}
            </p>
          )}
          {discard && (
            <div className={styles.discardPrompt} role="alert">
              <strong>{t("Bạn có thay đổi chưa lưu.")}</strong>
              <p>{t("Tiếp tục chỉnh sửa hoặc bỏ các thay đổi này.")}</p>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => setDiscard(false)}
              >
                {t("Tiếp tục sửa")}
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={onClose}
              >
                {t("Bỏ thay đổi")}
              </button>
            </div>
          )}
        </div>
        <footer className={styles.modalActions}>
          {onDelete && (
            <button
              type="button"
              className={styles.dangerButton}
              onClick={onDelete}
            >
              <Icon name="trash" size={17} />
              {t("Xóa")}
            </button>
          )}
          <span className={styles.saveHint}>
            {t("Ctrl / ⌘ + Enter để lưu")}
          </span>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={close}
          >
            {t("Hủy")}
          </button>
          <button className={styles.primaryButton}>
            {todo.id ? t("Lưu thay đổi") : t("Tạo công việc")}
          </button>
        </footer>
      </form>
    </Dialog>
  );
}
