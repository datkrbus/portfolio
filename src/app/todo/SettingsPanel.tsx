"use client";
import { useI18n } from "./I18nProvider";
import LanguageSelect from "./LanguageSelect";
import { useRef, useState } from "react";
import type { AppData } from "./todo-types";
import { parseBackup, type Backup } from "./todo-validation";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function SettingsPanel({
  settings,
  onChange,
  onExport,
  onCategories,
  onLogout,
  onImport,
  onClear,
}: {
  settings?: AppData["settings"][number];
  onChange: (key: string, value: string | number) => void;
  onExport: () => void;
  onCategories: () => void;
  onLogout: () => void;
  onImport: (data: Backup) => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  async function readBackup(file?: File) {
    if (!file) return;
    setError("");
    setPending(null);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("size");
      const data = parseBackup(
        JSON.parse((await file.text()).replace(/^\uFEFF/, "")),
      );
      setPending(data);
      setConfirmClear(false);
    } catch {
      setError(
        "Chưa đọc được bản sao lưu. Chọn file JSON hợp lệ, nhỏ hơn 10 MB, được xuất từ app này.",
      );
    }
  }
  if (!settings) return null;
  return (
    <section className={styles.settings}>
      <section className={styles.settingsCard}>
        <header>
          <span className={styles.summaryIcon}>
            <Icon name="settings" />
          </span>
          <div>
            <h2>{t("Cách bạn làm việc")}</h2>
            <p>{t("Thay đổi được áp dụng ngay và lưu trên máy này.")}</p>
          </div>
        </header>
        <div className={styles.settingsGrid}>
          <LanguageSelect />
          <label>
            {t("Giao diện")}
            <select
              value={settings.theme}
              onChange={(event) => onChange("theme", event.target.value)}
            >
              <option value="light">{t("Sáng")}</option>
              <option value="dark">{t("Tối")}</option>
              <option value="system">{t("Theo thiết bị")}</option>
            </select>
          </label>
          <label>
            {t("Kiểu lịch mặc định")}
            <select
              value={settings.defaultView}
              onChange={(event) => onChange("defaultView", event.target.value)}
            >
              <option value="month">{t("Tháng")}</option>
              <option value="week">{t("Tuần")}</option>
              <option value="day">{t("Ngày")}</option>
              <option value="agenda">{t("Lịch trình")}</option>
            </select>
          </label>
          <label>
            {t("Ngày bắt đầu tuần")}
            <select
              value={settings.firstDay}
              onChange={(event) => onChange("firstDay", event.target.value)}
            >
              <option value="monday">{t("Thứ Hai")}</option>
              <option value="sunday">{t("Chủ nhật")}</option>
            </select>
          </label>
          <label>
            {t("Thời lượng mặc định")}
            <select
              value={settings.defaultDuration}
              onChange={(event) =>
                onChange("defaultDuration", Number(event.target.value))
              }
            >
              {[15, 30, 60, 90].map((value) => (
                <option key={value} value={value}>
                  {value} {t("phút")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className={styles.settingsCard}>
        <header>
          <span className={styles.summaryIcon}>
            <Icon name="folder" />
          </span>
          <div>
            <h2>{t("Sắp xếp không gian")}</h2>
            <p>
              {t("Dùng danh mục để tách công việc, học tập và việc cá nhân.")}
            </p>
          </div>
        </header>
        <button className={styles.outlineButton} onClick={onCategories}>
          {t("Quản lý danh mục")}
          <Icon name="chevron" size={16} />
        </button>
      </section>
      <section className={styles.settingsCard}>
        <header>
          <span className={styles.summaryIcon}>
            <Icon name="device" />
          </span>
          <div>
            <h2>{t("Dữ liệu của bạn")}</h2>
            <p>
              {t(
                "Dữ liệu nằm trong trình duyệt của thiết bị này. Tải bản sao lưu để chuyển sang máy khác hoặc giữ một bản dự phòng.",
              )}
            </p>
          </div>
        </header>
        <div className={styles.dataActions}>
          <button className={styles.primaryButton} onClick={onExport}>
            <Icon name="download" size={18} />
            {t("Tải bản sao lưu")}
          </button>
          <button
            className={styles.outlineButton}
            onClick={() => fileInput.current?.click()}
          >
            <Icon name="upload" size={18} />
            {t("Khôi phục từ file")}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            hidden
            aria-label={t("File sao lưu")}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void readBackup(file);
            }}
          />
        </div>
        {error && (
          <p className={styles.formError} role="alert">
            {t(error)}
          </p>
        )}
        {pending && (
          <div
            className={styles.importPreview}
            role="region"
            aria-label={t("Xem trước bản sao lưu")}
          >
            <strong>{t("Sẵn sàng khôi phục")}</strong>
            <p>
              {pending.todos.length}
              {" " + t("công việc ·") + " "}
              {pending.categories.length} {t("danh mục")}
              {pending.settings.length > 0 ? t(" · Có cài đặt") : ""}
            </p>
            <p>
              {t(
                "Dữ liệu hiện tại của không gian này sẽ được thay thế. Hãy tải bản sao lưu trước nếu bạn muốn giữ lại.",
              )}
            </p>
            <div className={styles.dataActions}>
              <button className={styles.outlineButton} onClick={onExport}>
                {t("Sao lưu hiện tại")}
              </button>
              <button
                className={styles.textButton}
                onClick={() => setPending(null)}
              >
                {t("Hủy")}
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  onImport(pending);
                  setPending(null);
                }}
              >
                {t("Khôi phục dữ liệu")}
              </button>
            </div>
          </div>
        )}
      </section>
      <section className={styles.settingsCard}>
        <header>
          <div>
            <h2>{t("Phiên làm việc")}</h2>
            <p>{t("Đăng xuất vẫn giữ dữ liệu đã lưu trên thiết bị này.")}</p>
          </div>
        </header>
        <button className={styles.outlineButton} onClick={onLogout}>
          <Icon name="logout" size={17} />
          {t("Đăng xuất")}
        </button>
      </section>
      <section className={`${styles.settingsCard} ${styles.dangerZone}`}>
        <h2>{t("Xóa dữ liệu công việc")}</h2>
        <p>
          {t(
            "Xóa công việc và danh mục của không gian hiện tại. Tài khoản và cài đặt vẫn được giữ.",
          )}
        </p>
        {!confirmClear ? (
          <button
            className={styles.dangerButton}
            onClick={() => {
              setConfirmClear(true);
              setPending(null);
            }}
          >
            <Icon name="trash" size={17} />
            {t("Xóa dữ liệu...")}
          </button>
        ) : (
          <div className={styles.discardPrompt} role="alert">
            <strong>{t("Thao tác này không thể hoàn tác.")}</strong>
            <p>{t("Bạn có thể tải bản sao lưu trước khi xóa.")}</p>
            <div className={styles.dataActions}>
              <button className={styles.outlineButton} onClick={onExport}>
                {t("Tải bản sao lưu")}
              </button>
              <button
                className={styles.textButton}
                onClick={() => setConfirmClear(false)}
              >
                {t("Giữ dữ liệu")}
              </button>
              <button
                className={styles.dangerButton}
                onClick={() => {
                  onClear();
                  setConfirmClear(false);
                }}
              >
                {t("Xác nhận xóa")}
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
