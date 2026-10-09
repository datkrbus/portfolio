"use client";
import { useI18n } from "./I18nProvider";
import LanguageSelect from "./LanguageSelect";
import type { FormEvent } from "react";
import type { AuthMode } from "./todo-types";
import Icon from "./Icon";
import styles from "./todo.module.css";
export default function AuthScreen({
  mode,
  form,
  error,
  onModeChange,
  onChange,
  onSubmit,
}: {
  mode: AuthMode;
  form: {
    username: string;
    password: string;
    confirm: string;
  };
  error: string;
  onModeChange: (mode: AuthMode) => void;
  onChange: (form: {
    username: string;
    password: string;
    confirm: string;
  }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const { t, locale } = useI18n();
  return (
    <main className={styles.authPage} lang={locale}>
      <section className={styles.authStory}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="check" />
          </span>
          <span>
            quietly<span className={styles.brandAccent}>done</span>
          </span>
        </div>
        <span className={styles.authEyebrow}>
          {t("ÍT ỒN ÀO HƠN. RÕ RÀNG HƠN.")}
        </span>
        <h1>
          {t("Mỗi ngày,")}
          <br />
          {t("một chút tiến bộ.")}
        </h1>
        <p>
          {t(
            "Một nơi nhẹ nhàng để sắp xếp việc cần làm, lên lịch và theo dõi những gì bạn đã hoàn thành.",
          )}
        </p>
        <div className={styles.authIllustration} aria-hidden="true">
          <div>
            <i />
            <span>{t("Lên kế hoạch cho tuần mới")}</span>
            <b>{t("Hôm nay")}</b>
          </div>
          <div>
            <Icon name="check" size={17} />
            <span>{t("Hoàn thành một việc nhỏ")}</span>
          </div>
          <div>
            <i />
            <span>{t("Dành thời gian cho bản thân")}</span>
            <b>{t("Ngày mai")}</b>
          </div>
        </div>
        <span className={styles.localBadge}>
          <Icon name="device" size={17} />
          {t("Không gian lưu riêng trên thiết bị của bạn")}
        </span>
      </section>
      <section className={styles.authCard}>
        <div className={styles.authLanguage}>
          <LanguageSelect />
        </div>
        <p className={styles.overline}>{t("KHÔNG GIAN CÁ NHÂN")}</p>
        <h2>
          {mode === "login"
            ? t("Chào mừng trở lại")
            : t("Tạo không gian của bạn")}
        </h2>
        <p className={styles.authIntro}>
          {mode === "login"
            ? t("Mở lại tài khoản đã tạo trong trình duyệt này.")
            : t(
                "Tài khoản giúp tách các không gian làm việc trên cùng thiết bị.",
              )}
        </p>
        <div className={styles.segmented}>
          <button
            aria-pressed={mode === "login"}
            onClick={() => onModeChange("login")}
          >
            {t("Đăng nhập")}
          </button>
          <button
            aria-pressed={mode === "register"}
            onClick={() => onModeChange("register")}
          >
            {t("Tạo tài khoản")}
          </button>
        </div>
        <form className={styles.authForm} onSubmit={onSubmit}>
          <label>
            {t("Tên tài khoản")}
            <input
              required
              minLength={3}
              maxLength={60}
              placeholder={t("Tên của bạn")}
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                onChange({ ...form, username: event.target.value })
              }
            />
          </label>
          <label>
            {t("Mật khẩu")}
            <input
              required
              minLength={6}
              type="password"
              placeholder={t("Ít nhất 6 ký tự")}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={form.password}
              onChange={(event) =>
                onChange({ ...form, password: event.target.value })
              }
            />
          </label>
          {mode === "register" && (
            <label>
              {t("Nhập lại mật khẩu")}
              <input
                required
                minLength={6}
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(event) =>
                  onChange({ ...form, confirm: event.target.value })
                }
              />
            </label>
          )}
          {error && (
            <p className={styles.formError} role="alert">
              {t(error)}
            </p>
          )}
          <button className={styles.primaryButton}>
            {mode === "login" ? t("Mở không gian") : t("Tạo và bắt đầu")}
            <Icon name="arrow" size={18} />
          </button>
        </form>
        <p className={styles.localNotice}>
          <Icon name="device" size={16} />
          {t(
            "Tài khoản và dữ liệu chỉ lưu trong trình duyệt này. Mật khẩu được lưu cục bộ; đây không phải dịch vụ tài khoản trực tuyến.",
          )}
        </p>
      </section>
    </main>
  );
}
