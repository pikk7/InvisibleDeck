import React from "react";
import { useI18n } from "../i18n";
import { ranks, type Card } from "../types";

function mapSuitDigit(d: number) {
  // 1→♥, 2→♦, 3→♣, 4→♠; 5→♥, 6→♦, 7→♣, 8→♠, 9→♥, 0→♠
  const map: Record<number, number> = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 0,
    6: 1,
    7: 2,
    8: 3,
    9: 0,
    0: 3,
  };
  return map[d] ?? 0;
}

export default function IOSPasscode({ onCard }: { onCard: (c: Card) => void }) {
  const [pin, setPin] = React.useState<number[]>([]);
  const { t } = useI18n();
  const add = (d: number) => {
    if (pin.length < 6) setPin((p) => [...p, d]);
  };
  const del = () => setPin((p) => p.slice(0, -1));

  React.useEffect(() => {
    if (pin.length === 6) {
      const suitIdx = mapSuitDigit(pin[0] ?? 1);
      let val = (pin[1] ?? 0) * 10 + (pin[2] ?? 1);
      val = ((((val - 1) % 13) + 13) % 13) + 1; // 1..13
      const card: Card = {
        suit: ["hearts", "diamonds", "clubs", "spades"][
          suitIdx
        ] as Card["suit"],
        rank: ranks[val - 1],
      };
      setTimeout(() => onCard(card), 120);
      if (navigator.vibrate) navigator.vibrate(25);
      setPin([]); // vizuál reset
    }
  }, [pin, onCard]);

  return (
    <div className="screen passcode">
      <div className="pc-title">{t.enterPass}</div>
      <div className="dots">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`dot ${i < pin.length ? "filled" : ""}`} />
        ))}
      </div>
      <div className="keypad" role="group" aria-label="Számbillentyűzet">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} onClick={() => add(d)}>
            {d}
          </button>
        ))}
        <div className="kp-spacer" />
        <button onClick={() => add(0)}>0</button>
        <button className="del" onClick={del}>
          ⌫
        </button>
      </div>
      <div className="pc-footer">{t.emergencyCall}</div>
    </div>
  );
}
