import type { Metadata } from "next";
import TodoApp from "./TodoApp";
import { I18nProvider } from "./I18nProvider";

export const metadata: Metadata = {
  title: "Quietly Done | Công việc của bạn",
  description:
    "Quản lý công việc và lịch cá nhân. Dữ liệu lưu riêng trong trình duyệt của thiết bị này.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TodoPage() {
  return (
    <I18nProvider>
      <TodoApp />
    </I18nProvider>
  );
}
