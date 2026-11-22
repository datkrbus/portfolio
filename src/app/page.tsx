import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Trang portfolio đang ẩn — xem src/app/_portfolio/README.md để bật lại.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Home() {
  notFound();
}
