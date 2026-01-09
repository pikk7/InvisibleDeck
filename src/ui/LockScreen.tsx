import { useEffect, useState } from "react";
import { useAdminGesture } from "../settings/useAdminGesture";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function fmtTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtDate(d: Date) {
  const napok = [
    "Vasárnap",
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
  ];
  const honapok = [
    "jan.",
    "febr.",
    "márc.",
    "ápr.",
    "máj.",
    "jún.",
    "júl.",
    "aug.",
    "szept.",
    "okt.",
    "nov.",
    "dec.",
  ];
  return `${napok[d.getDay()]}, ${honapok[d.getMonth()]} ${d.getDate()}.`;
}

export default function LockScreen({
  onUnlock,
  onOpenAdmin,
}: {
  onUnlock: () => void;
  onOpenAdmin: () => void;
}) {
  // Láthatatlan admin zóna
  useEffect(() => {
    const zone = document.createElement("div");
    zone.id = "admin-zone";
    zone.style.position = "absolute";
    zone.style.bottom = "0";
    zone.style.left = "0";
    zone.style.width = "48px";
    zone.style.height = "48px";
    zone.style.zIndex = "3";
    document.body.appendChild(zone);
    return () => {
      zone.remove();
    };
  }, []);

  useAdminGesture(onOpenAdmin, "#admin-zone", 2000);

  const [time, setTime] = useState(() => fmtTime(new Date()));
  const [date, setDate] = useState(() => fmtDate(new Date()));
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(fmtTime(d));
      setDate(fmtDate(d));
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
      <div className="clock">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
      <div className="stub">
        <div className="bubble"></div>
        <div className="line"></div>
        <div className="line short"></div>
      </div>
      <div className="swipe">Húzd/koppints a feloldáshoz</div>
    </div>
  );
}
