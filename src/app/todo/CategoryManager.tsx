"use client";

import { FormEvent, useState } from "react";
import styles from "./todo.module.css";
import type { Category } from "./todo-types";

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
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e76f8f");

  function begin(category?: Category) {
    setEditing(category || null);
    setName(category?.name || "");
    setColor(category?.color || "#e76f8f");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: editing?.id || crypto.randomUUID(),
      userId: editing?.userId || "",
      name: name.trim(),
      color,
    });
    begin();
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.smallModal}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.overline}>Organization</p>
            <h2>Categories</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className={styles.categoryManagerList}>
          {categories.map((category) => (
            <div className={styles.categoryManagerRow} key={category.id}>
              <i style={{ background: category.color }} />
              <strong>{category.name}</strong>
              <button onClick={() => begin(category)}>Edit</button>
              <button
                className={styles.dangerButton}
                onClick={() =>
                  window.confirm(
                    `Delete ${category.name}? Tasks will be kept.`,
                  ) && onDelete(category.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {editing !== null || !categories.length ? (
          <form onSubmit={submit} className={styles.categoryForm}>
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
            />
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <div className={styles.modalActions}>
              <button type="button" onClick={() => begin()}>
                Cancel
              </button>
              <span />
              <button className={styles.primaryButton}>
                {editing ? "Save category" : "Create category"}
              </button>
            </div>
          </form>
        ) : (
          <button className={styles.outlineButton} onClick={() => begin()}>
            + Add category
          </button>
        )}
      </div>
    </div>
  );
}
