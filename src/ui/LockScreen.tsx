import { useEffect, useState } from "react";
import { useAdminGesture } from "../settings/useAdminGesture";
import { useI18n } from "../i18n";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function fmtTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtDate(d: Date, days: string[], months: string[]) {
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

export default function LockScreen({
  onUnlock,
  onOpenAdmin,
}: {
  onUnlock: () => void;
  onOpenAdmin: () => void;
}) {
  // Láthatatlan admin zóna
  const { t } = useI18n();
  const gestureProps = useAdminGesture(onOpenAdmin, 2000);
  const days = [t.Sun, t.Mon, t.Tue, t.Wed, t.Thu, t.Fri, t.Sat];
  const months = [
    t.Jan,
    t.Feb,
    t.Mar,
    t.Apr,
    t.May,
    t.Jun,
    t.Jul,
    t.Aug,
    t.Sep,
    t.Oct,
    t.Nov,
    t.Dec,
  ];

  const [time, setTime] = useState(() => fmtTime(new Date()));
  const [date, setDate] = useState(() => fmtDate(new Date(), days, months));
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(fmtTime(d));
      setDate(fmtDate(d, days, months));
    }, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="screen lock"
      onClick={onUnlock}
      role="button"
      aria-label="Feloldás"
    >
      <div id="admin-zone" {...gestureProps} />

      <div className="clock">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
      <div className="stub">
        <div className="bubble"></div>
        <div className="line"></div>
        <div className="line short"></div>
      </div>
      <div className="swipe">{t.swipe}</div>
    </div>
  );
}
