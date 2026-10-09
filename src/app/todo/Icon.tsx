import type { CSSProperties } from "react";
const paths = {
  board: "M3 4h7v16H3zM14 4h7v10h-7z",
  list: "M9 5h12M9 12h12M9 19h12M3 5h.01M3 12h.01M3 19h.01",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
  sun: "M12 3v2M12 19v2M3 12h2M19 12h2M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  moon: "M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z",
  arrow: "M4 12h16M14 6l6 6-6 6",
  check: "M5 12l4 4L19 6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  settings:
    "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  filter: "M4 7h16M7 12h10M10 17h4",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  close: "M6 6l12 12M6 18 18 6",
  chevron: "m9 5 7 7-7 7",
  menu: "M4 6h16M4 12h16M4 18h16",
  folder: "M3 7V4h6l3 3h9v13H3V7Z",
  device: "M3 4h18v13H3zM8 21h8M12 17v4",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  upload: "M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  copy: "M9 9h12v12H9zM5 15H3V3h12v2",
  logout: "M9 4H3v16h6M10 12h11m-4-4 4 4-4 4",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  flag: "M4 21V3m0 0h15l-3 5 3 5H4",
  repeat: "M3 8h15l-3-3m6 11H6l3 3M3 8v5M21 16v-5",
} as const;
export type IconName = keyof typeof paths;
export default function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, ...style }}
    >
      <path d={paths[name]} />
    </svg>
  );
}
