"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DECK, SOURCE, imageUrl, type TarotCard } from "./tarot-data";
import styles from "./tarot.module.css";

type Draw = { key: number; card: TarotCard; reversed: boolean; open: boolean };

/** Số ngẫu nhiên đều trong [0, max) dùng Web Crypto, tránh lệch modulo. */
function randomInt(max: number) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % max;
}

function shuffled<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_IDS = DECK.map((c) => c.id);
const BY_ID = new Map(DECK.map((c) => [c.id, c]));
/** Vuốt lên quá khoảng này (px) thì gập bộ bài. */
const CLOSE_PX = 60;

function CardImage({ draw, className }: { draw: Draw; className: string }) {
  const [failed, setFailed] = useState(false);
  const rev = draw.reversed ? "" : undefined;
  if (failed) {
    return (
      <span className={styles.fallback} data-reversed={rev}>
        {draw.card.name}
      </span>
    );
  }
  return (
    <img
      src={imageUrl(draw.card)}
      alt={`${draw.card.name}${draw.reversed ? " (reversed)" : ""}`}
      className={className}
      data-reversed={rev}
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
    />
  );
}

type DragKind = "fan" | "spread";
type DragState = {
  el: HTMLElement;
  kind: DragKind;
  id: string | number;
  pointerType: string;
  x0: number;
  y0: number;
  scroll0: number;
  mode: "idle" | "card" | "scroll" | "close";
  ghost: HTMLElement | null;
};

export default function TarotApp() {
  // Thứ tự xáo không xuất hiện trong DOM (mọi mặt lưng giống nhau) nên không lệch hydration.
  const [remaining, setRemaining] = useState<string[]>(() => shuffled(ALL_IDS));
  const [fanned, setFanned] = useState(false);
  const [drawn, setDrawn] = useState<Draw[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const nextKey = useRef(0);
  const drag = useRef<DragState | null>(null);
  const suppressClick = useRef(false);
  const stackSwipe = useRef<{ x: number; y: number } | null>(null);

  const drawCard = (id: string) => {
    // Tải trước ảnh để khi lật là có ngay.
    new Image().src = imageUrl(BY_ID.get(id)!);
    setRemaining((r) => r.filter((x) => x !== id));
    setDrawn((d) => [
      ...d,
      {
        key: nextKey.current++,
        card: BY_ID.get(id)!,
        reversed: randomInt(2) === 1,
        open: false,
      },
    ]);
  };

  /** Trả lá chưa lật về bộ, chèn vào vị trí ngẫu nhiên. */
  const returnCard = (key: number) => {
    const d = drawn.find((x) => x.key === key);
    if (!d || d.open) return;
    setDrawn((all) => all.filter((x) => x.key !== key));
    setRemaining((r) => {
      const at = randomInt(r.length + 1);
      return [...r.slice(0, at), d.card.id, ...r.slice(at)];
    });
  };

  /** Chạm lần 1: lật. Chạm lần 2: xem ý nghĩa. */
  const tapDrawn = (key: number) => {
    const target = drawn.find((d) => d.key === key);
    if (!target) return;
    if (target.open) setSelected(key);
    else
      setDrawn((d) => d.map((x) => (x.key === key ? { ...x, open: true } : x)));
  };

  const reshuffle = () => {
    setRemaining(shuffled(ALL_IDS));
    setDrawn([]);
    setSelected(null);
    setFanned(false);
  };

  /**
   * Cung "bánh xe": độ nghiêng/hạ thấp của mỗi lá tính theo vị trí so với
   * giữa màn hình, nên lướt tới đâu cũng thấy bài cong như đang cầm trên tay.
   */
  const arcFrame = useRef(0);
  const updateArc = () => {
    const s = scrollerRef.current;
    if (!s) return;
    const mid = s.scrollLeft + s.clientWidth / 2;
    const half = Math.max(s.clientWidth / 2, 1);
    const track = s.firstElementChild as HTMLElement | null;
    const cards = Array.from(track?.children ?? []) as HTMLElement[];
    // Đọc hết vị trí trước rồi mới ghi, tránh ép trình duyệt tính lại layout
    // sau mỗi lá (layout thrashing).
    const centers = cards.map((el) => el.offsetLeft + el.offsetWidth / 2);
    cards.forEach((el, i) => {
      const u = (centers[i] - mid) / half;
      const t = Math.max(-1.4, Math.min(1.4, u)).toFixed(2);
      // Lá ở xa ngoài màn hình đã bị kẹp ở ±1.4 → không ghi lại nếu không đổi.
      if (el.dataset.t !== t) {
        el.dataset.t = t;
        el.style.setProperty("--t", t);
      }
    });
  };
  const onFanScroll = () => {
    cancelAnimationFrame(arcFrame.current);
    arcFrame.current = requestAnimationFrame(updateArc);
  };

  // Xòe ra thì cuộn tới giữa quạt.
  useLayoutEffect(() => {
    const s = scrollerRef.current;
    if (fanned && s) s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2;
  }, [fanned]);

  // Cập nhật cung khi xòe, khi số lá đổi, và khi đổi kích thước màn hình.
  useLayoutEffect(() => {
    if (!fanned) return;
    updateArc();
    window.addEventListener("resize", onFanScroll);
    return () => window.removeEventListener("resize", onFanScroll);
  });

  // ---------- Kéo thả (pointer events: chuột + cảm ứng) ----------
  const overTarget = (kind: DragKind, y: number, dy: number) => {
    if (kind === "fan") {
      const r = deckRef.current?.getBoundingClientRect();
      return dy > 90 || (!!r && y > r.bottom);
    }
    const r = zoneRef.current?.getBoundingClientRect();
    return dy < -110 || (!!r && y < r.top);
  };

  /** Bản sao nổi theo ngón tay — để lá không bị cắt bởi vùng cuộn ngang. */
  const makeGhost = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const g = el.cloneNode(true) as HTMLElement;
    g.removeAttribute("style");
    g.className = `${el.className} ${styles.ghost}`;
    Object.assign(g.style, {
      left: `${r.left + r.width / 2 - el.offsetWidth / 2}px`,
      top: `${r.top + r.height / 2 - el.offsetHeight / 2}px`,
      width: `${el.offsetWidth}px`,
      height: `${el.offsetHeight}px`,
    });
    document.body.appendChild(g);
    el.style.visibility = "hidden";
    return g;
  };

  const dragHandlers = (kind: DragKind, id: string | number) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      drag.current = {
        el: e.currentTarget,
        kind,
        id,
        pointerType: e.pointerType,
        x0: e.clientX,
        y0: e.clientY,
        scroll0: scrollerRef.current?.scrollLeft ?? 0,
        mode: "idle",
        ghost: null,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (d.mode === "idle") {
        if (Math.hypot(dx, dy) < 8) return;
        // Chuột kéo ngang trên quạt = lướt bộ bài (cảm ứng đã có pan-x gốc).
        // Vuốt lên trên quạt = gập bộ bài lại.
        d.mode =
          kind === "fan" && Math.abs(dx) > Math.abs(dy)
            ? "scroll"
            : kind === "fan" && dy < 0
              ? "close"
              : "card";
        if (d.mode === "card") d.ghost = makeGhost(d.el);
      }
      if (d.mode === "scroll") {
        if (scrollerRef.current)
          scrollerRef.current.scrollLeft = d.scroll0 - dx;
        return;
      }
      if (d.mode === "close") {
        const up = Math.max(0, -dy);
        const s = scrollerRef.current;
        if (s) {
          s.style.transform = `translateY(${-up * 0.5}px) scale(${1 - Math.min(up, CLOSE_PX * 2) / 1000})`;
          s.style.opacity = String(Math.max(0.35, 1 - up / (CLOSE_PX * 3)));
        }
        return;
      }
      d.ghost!.style.translate = `${dx}px ${dy}px`;
      const zone = kind === "fan" ? zoneRef.current : deckRef.current;
      zone?.toggleAttribute("data-over", overTarget(kind, e.clientY, dy));
    },
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => endDrag(e, true),
    onPointerCancel: (e: React.PointerEvent<HTMLElement>) => endDrag(e, false),
  });

  const endDrag = (e: React.PointerEvent<HTMLElement>, commit: boolean) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    zoneRef.current?.removeAttribute("data-over");
    deckRef.current?.removeAttribute("data-over");
    if (d.mode === "idle") return; // để onClick xử lý như một cú chạm
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    if (d.mode === "close") {
      const s = scrollerRef.current;
      if (commit && d.y0 - e.clientY > CLOSE_PX) {
        setFanned(false);
      } else if (s) {
        s.style.transition = "transform 0.2s ease, opacity 0.2s ease";
        s.style.transform = "";
        s.style.opacity = "";
        setTimeout(() => (s.style.transition = ""), 200);
      }
      return;
    }
    if (d.mode === "scroll" || !d.ghost) return;

    const ghost = d.ghost;
    const dy = e.clientY - d.y0;
    if (commit && overTarget(d.kind, e.clientY, dy)) {
      ghost.remove();
      d.el.style.visibility = "";
      if (d.kind === "fan") drawCard(d.id as string);
      else returnCard(d.id as number);
    } else {
      // bật về chỗ cũ
      ghost.style.transition = "translate 0.25s ease";
      ghost.style.translate = "0 0";
      setTimeout(() => {
        ghost.remove();
        d.el.style.visibility = "";
      }, 250);
    }
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (selected !== null && !dlg.open) dlg.showModal();
    if (selected === null && dlg.open) dlg.close();
  }, [selected]);

  const fanCount = remaining.length;
  const stackSize = Math.min(6, Math.max(1, Math.ceil(fanCount / 13)));
  const current = drawn.find((d) => d.key === selected) ?? null;
  const meaning = current
    ? current.reversed
      ? current.card.rev
      : current.card.up
    : null;
  const other = current
    ? current.reversed
      ? current.card.up
      : current.card.rev
    : null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tarot</h1>
      </header>

      <section className={styles.deckArea} aria-label="Bộ bài">
        <div ref={deckRef} className={styles.deckDrop}>
          {!fanned || fanCount === 0 ? (
            <button
              type="button"
              className={styles.stack}
              onClick={() => setFanned(true)}
              // Vuốt theo bất kỳ hướng nào trên chồng bài cũng xòe ra.
              onPointerDown={(e) => {
                stackSwipe.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerMove={(e) => {
                const s = stackSwipe.current;
                if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 12) {
                  stackSwipe.current = null;
                  setFanned(true);
                }
              }}
              onPointerUp={() => (stackSwipe.current = null)}
              onPointerCancel={() => (stackSwipe.current = null)}
              disabled={fanCount === 0}
              aria-label={`Xòe bộ bài (${fanCount} lá)`}
            >
              {Array.from({ length: fanCount ? stackSize : 0 }, (_, i) => (
                <span
                  key={i}
                  className={`${styles.cardBack} ${styles.stackCard}`}
                  style={{ transform: `translate(${i * -2}px, ${i * -2}px)` }}
                  aria-hidden
                />
              ))}
            </button>
          ) : (
            <div
              ref={scrollerRef}
              className={styles.fanScroller}
              onScroll={onFanScroll}
            >
              <div
                className={styles.fanTrack}
                style={{ "--n": fanCount } as React.CSSProperties}
              >
                {remaining.map((id, i) => {
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.cardBack} ${styles.fanCard}`}
                      style={{ "--i": i } as React.CSSProperties}
                      tabIndex={i === Math.floor(fanCount / 2) ? 0 : -1}
                      aria-label={`Bốc một lá (còn ${fanCount} lá)`}
                      onClick={() => {
                        if (!suppressClick.current) drawCard(id);
                      }}
                      {...dragHandlers("fan", id)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <p className={styles.deckHint}>{fanCount} / 78</p>
      </section>

      <section className={styles.spread} aria-label="Các lá đã bốc">
        <div ref={zoneRef} className={styles.zone}>
          <ul className={styles.spreadGrid}>
            {drawn.map((d) => (
              <li key={d.key}>
                <button
                  type="button"
                  className={styles.drawn}
                  data-flipped={d.open ? "" : undefined}
                  onClick={() => {
                    if (!suppressClick.current) tapDrawn(d.key);
                  }}
                  {...(d.open ? {} : dragHandlers("spread", d.key))}
                  aria-label={
                    d.open
                      ? `${d.card.name}${d.reversed ? " (reversed)" : ""} — xem ý nghĩa`
                      : "Lật lá bài (kéo lên để trả về bộ)"
                  }
                >
                  <span className={styles.flipper}>
                    <span
                      className={`${styles.face} ${styles.cardBack}`}
                      aria-hidden
                    />
                    <span className={`${styles.face} ${styles.front}`}>
                      {d.open && <CardImage draw={d} className={styles.img} />}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {drawn.length > 0 && (
          <button type="button" className={styles.ghostBtn} onClick={reshuffle}>
            Xáo lại cả bộ
          </button>
        )}
      </section>

      {/* Bấm ra ngoài (backdrop) để đóng; bàn phím đã có Esc + nút Đóng. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="tarot-card-name"
      >
        {current && (
          <article className={styles.meaningCard}>
            <button
              type="button"
              className={styles.close}
              onClick={() => setSelected(null)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className={styles.dialogImg}>
              <CardImage draw={current} className={styles.img} />
            </div>
            <div>
              <h2 id="tarot-card-name" className={styles.cardName}>
                {current.card.name}
                {current.reversed && <span>Reversed</span>}
              </h2>

              <p className={styles.meaningText}>
                {meaning
                  ? meaning.en
                  : `Waite gives no reversed meaning for this card. Upright: ${current.card.up.en}`}
              </p>
              <p className={styles.cite}>— A. E. Waite, 1910</p>

              {meaning && other && (
                <details className={styles.other}>
                  <summary>{current.reversed ? "Upright" : "Reversed"}</summary>
                  <p>{other.en}</p>
                </details>
              )}
            </div>
          </article>
        )}
      </dialog>

      <footer className={styles.footer}>
        <p>
          Ý nghĩa theo nguyên bản{" "}
          <a href={SOURCE.bookUrl} target="_blank" rel="noreferrer">
            {SOURCE.book}
          </a>
          ; tranh{" "}
          <a href={SOURCE.artUrl} target="_blank" rel="noreferrer">
            {SOURCE.art}
          </a>{" "}
          — phạm vi công cộng.
        </p>
      </footer>
    </main>
  );
}
