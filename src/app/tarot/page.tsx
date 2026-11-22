import type { Metadata } from "next";
import TarotApp from "./TarotApp";
import "./tarot-fonts.css";

export const metadata: Metadata = {
  title: "Bốc bài Tarot | Rider–Waite–Smith",
  description:
    "Bốc một lá từ bộ 78 lá Rider–Waite–Smith và xem ý nghĩa theo nguyên bản The Pictorial Key to the Tarot của A. E. Waite (1910).",
};

export default function TarotPage() {
  return <TarotApp />;
}
