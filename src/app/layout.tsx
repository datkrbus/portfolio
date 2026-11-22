import type { Metadata } from "next";
import "./globals.css";

// Metadata + JSON-LD của portfolio đang ẩn: xem src/app/_portfolio/seo.ts.
export const metadata: Metadata = {
  title: "Tarot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
