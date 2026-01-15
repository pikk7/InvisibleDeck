import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { ranks, type Card } from "../types";

export default function AndroidPattern({
  onCard,
  hudVisible,
}: {
  onCard: (c: Card) => void;
  hudVisible: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ quadrant: "-", count: 0, rank: "-" });
  const { t } = useI18n();
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const grid = { rows: 4, cols: 4 };
    const circleR = 22,
      lineW = 5,
      pad = 40;
    const usableW = canvas.width - pad * 2,
      usableH = canvas.height - pad * 2;
    const cellW = usableW / (grid.cols - 1),
      cellH = usableH / (grid.rows - 1);

    type NodeT = { id: number; r: number; c: number; x: number; y: number };
    const nodes: NodeT[] = Array.from(
      { length: grid.rows * grid.cols },
      (_, i) => {
        const r = Math.floor(i / grid.cols),
          c = i % grid.cols;
        return { id: i, r, c, x: pad + c * cellW, y: pad + r * cellH };
      }
    );

    let drawing = false;
    let path: NodeT[] = [];
    const colorActive = "#5cc8ff",
      colorIdle = "#3a3a3a";

    const draw = (active: NodeT[] = []) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (active.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = lineW;
        ctx.strokeStyle = colorActive;
        ctx.lineCap = "round";
        ctx.moveTo(active[0].x, active[0].y);
        for (let i = 1; i < active.length; i++)
          ctx.lineTo(active[i].x, active[i].y);
        ctx.stroke();
      }
      for (const n of nodes) {
        const on = active.some((p) => p.id === n.id);
        ctx.beginPath();
        ctx.arc(n.x, n.y, circleR, 0, Math.PI * 2);
        ctx.fillStyle = on ? "#1c4761" : "#202020";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = on ? colorActive : colorIdle;
        ctx.stroke();
      }
    };

    const getNode = (x: number, y: number) =>
      nodes.find((n) => Math.hypot(x - n.x, y - n.y) <= circleR);
    const pos = (evt: any) => {
      const r = canvas.getBoundingClientRect();
      const t = evt.touches ? evt.touches[0] : evt;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const addUnique = (n?: NodeT) => {
      if (!n) return;
      if (!path.some((p) => p.id === n.id)) path.push(n);
    };

    const suitFromStartQuadrant = (n: NodeT) => {
      const midR = (grid.rows - 1) / 2,
        midC = (grid.cols - 1) / 2;
      const top = n.r <= midR,
        left = n.c <= midC;
      if (top && left) return "♥";
      if (top && !left) return "♦";
      if (!top && left) return "♣";
      return "♠";
    };

    const updateHUD = () => {
      if (path.length === 0) {
        setHud({ quadrant: "-", count: 0, rank: "-" });
        return;
      }
      const start = path[0];
      const quadrant = suitFromStartQuadrant(start);
      const count = path.length;
      const idx = (((count - 1) % 13) + 13) % 13; // 0..12
      setHud({ quadrant, count, rank: ranks[idx] });
    };

    const start = (evt: any) => {
      evt.preventDefault();
      drawing = true;
      path = [];
      const { x, y } = pos(evt);
      addUnique(getNode(x, y));
      draw(path);
      updateHUD();
    };
    const move = (evt: any) => {
      if (!drawing) return;
      const { x, y } = pos(evt);
      const n = getNode(x, y);
      addUnique(n);
      draw(path);
      updateHUD();
    };
    const end = () => {
      drawing = false;
      if (path.length < 2) {
        draw([]);
        path = [];
        setHud({ quadrant: "-", count: 0, rank: "-" });
        return;
      }
      const start = path[0];
      const suit = (
        suitFromStartQuadrant(start) === "♥"
          ? "hearts"
          : suitFromStartQuadrant(start) === "♦"
          ? "diamonds"
          : suitFromStartQuadrant(start) === "♣"
          ? "clubs"
          : "spades"
      ) as Card["suit"];
      const idx = (((path.length - 1) % 13) + 13) % 13;
      const rank = ranks[idx];
      onCard({ suit, rank });
      if (navigator.vibrate) navigator.vibrate(20);
      draw([]);
      path = [];
      setHud({ quadrant: "-", count: 0, rank: "-" });
    };

    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointerleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    draw([]);
    return () => {
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointerleave", end);
      canvas.removeEventListener("touchstart", start as any);
      canvas.removeEventListener("touchmove", move as any);
      canvas.removeEventListener("touchend", end as any);
    };
  }, [onCard]);

  return (
    <div className="screen pattern">
      <div className="pt-title">{t.drawPattern}</div>
      <canvas id="pad" ref={ref} width={360} height={480} />
      <div className="pt-footer">{t.patternUnlock}</div>

      {hudVisible && (
        <div className="hud">
          <div className="hud-row">
            <span className="hud-label"></span>{" "}
            <span className="hud-val">{hud.quadrant}</span>
          </div>
          <div className="hud-row">
            <span className="hud-label">{t.count}:</span>{" "}
            <span className="hud-val">{hud.count}</span>
          </div>
          <div className="hud-row">
            <span className="hud-label">{t.rank}:</span>{" "}
            <span className="hud-val">{hud.rank}</span>
          </div>
        </div>
      )}
    </div>
  );
}
