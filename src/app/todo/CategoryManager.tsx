"use client";
import { useI18n } from "./I18nProvider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Category } from "./todo-types";
import Dialog from "./Dialog";
import Icon from "./Icon";
import styles from "./todo.module.css";
const colors = [
  "#2457a6",
  "#5d83bc",
  "#ad7298",
  "#bd8742",
  "#8a76b0",
  "#b9685a",
];
export default function CategoryManager({
  categories,
  onSave,
  onDelete,
  onClose,
}: {
  categories: Category[];
  onSave: (category: Category) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open || !categories.length) input.current?.focus();
  }, [open, editing, categories.length]);
  function begin(category?: Category) {
    setEditing(category || null);
    setOpen(true);
    setName(category?.name || "");
    setColor(category?.color || colors[0]);
    setError("");
    setDeleting(null);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return setError("Nhập tên danh mục.");
    if (
      categories.some(
        (item) =>
          item.id !== editing?.id &&
          item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase(),
      )
    )
      return setError("Danh mục này đã có. Hãy chọn tên khác.");
    onSave({
      id: editing?.id || crypto.randomUUID(),
      userId: editing?.userId || "",
      name: name.trim(),
      color,
    });
    setOpen(false);
    setEditing(null);
    setName("");
    setError("");
  }
  return (
    <Dialog label={t("Quản lý danh mục")} onClose={onClose}>
      <div className={styles.smallModal}>
        <header className={styles.modalHeader}>
          <div>
            <p className={styles.overline}>{t("MỖI VIỆC MỘT CHỖ")}</p>
            <h2>{t("Danh mục")}</h2>
          </div>
          <button
            className={styles.iconButton}
            aria-label={t("Đóng danh mục")}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>
        <div className={styles.modalBody}>
          <p className={styles.helperText}>
            {t("Đặt tên và màu để nhận ra công việc nhanh hơn.")}
          </p>
          <div className={styles.categoryManagerList}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryManagerItem}>
                <div className={styles.categoryManagerRow}>
                  <i style={{ background: category.color }} />
                  <strong>{category.name}</strong>
                  <button
                    className={styles.iconButton}
                    aria-label={t("Sửa {0}", { "0": category.name })}
                    onClick={() => begin(category)}
                  >
                    <Icon name="settings" size={17} />
                  </button>
                  <button
                    className={styles.iconButton}
                    aria-label={t("Xóa {0}", { "0": category.name })}
                    onClick={() => setDeleting(category.id)}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>
                {deleting === category.id && (
                  <div className={styles.discardPrompt} role="alert">
                    <p>
                      {t("Xóa “")}
                      {category.name}
                      {t(
                        "”? Công việc bên trong được giữ lại và chuyển thành chưa phân loại.",
                      )}
                    </p>
                    <button
                      className={styles.outlineButton}
                      onClick={() => setDeleting(null)}
                    >
                      {t("Giữ lại")}
                    </button>
                    <button
                      className={styles.dangerButton}
                      onClick={() => {
                        onDelete(category.id);
                        setDeleting(null);
                        if (editing?.id === category.id) {
                          setOpen(false);
                          setEditing(null);
                        }
                      }}
                    >
                      {t("Xóa danh mục")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {open || !categories.length ? (
            <form className={styles.categoryForm} onSubmit={submit}>
              <h3>{editing ? t("Chỉnh sửa danh mục") : t("Danh mục mới")}</h3>
              <label>
                {t("Tên danh mục")}
                <input
                  ref={input}
                  required
                  maxLength={60}
                  placeholder={t("Ví dụ: Công việc")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <fieldset className={styles.colorChoices}>
                <legend>{t("Màu nhận diện")}</legend>
                {colors.map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-label={t("Màu {0}", { "0": value })}
                    aria-pressed={color === value}
                    style={{ background: value }}
                    onClick={() => setColor(value)}
                  >
                    {color === value && <Icon name="check" size={17} />}
                  </button>
                ))}
                <label className={styles.customColor}>
                  {t("Màu khác")}
                  <input
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                </label>
              </fieldset>
              {error && (
                <p className={styles.formError} role="alert">
                  {t(error)}
                </p>
              )}
              <div className={styles.dataActions}>
                <button
                  type="button"
                  className={styles.outlineButton}
                  onClick={() => {
                    setOpen(false);
                    setEditing(null);
                    setName("");
                  }}
                >
                  {t("Hủy")}
                </button>
                <button className={styles.primaryButton}>
                  {editing ? t("Lưu thay đổi") : t("Tạo danh mục")}
                </button>
              </div>
            </form>
          ) : (
            <button className={styles.outlineButton} onClick={() => begin()}>
              <Icon name="plus" size={18} />
              {t("Thêm danh mục")}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
