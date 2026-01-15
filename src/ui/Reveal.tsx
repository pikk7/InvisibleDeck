import { useI18n } from "../i18n";
import type { Card } from "../types";

function sym(suit: Card["suit"]) {
  return suit === "hearts"
    ? "♥"
    : suit === "diamonds"
    ? "♦"
    : suit === "clubs"
    ? "♣"
    : "♠";
}
function colorClass(suit: Card["suit"]) {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

export default function Reveal({
  card,
  onRelock,
}: {
  card: Card;
  onRelock: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="screen reveal">
      <div className="card-frame">
        <div className="card">
          <div className="corner tl">
            <span>{card.rank}</span>
            <span>{sym(card.suit)}</span>
          </div>
          <div className="corner br">
            <span>{card.rank}</span>
            <span>{sym(card.suit)}</span>
          </div>
          <div className={`pips ${colorClass(card.suit)}`}>
            {sym(card.suit)}
          </div>
        </div>
      </div>
      <button className="ghost" onClick={onRelock}>
        {t.lock}
      </button>
    </div>
  );
}
