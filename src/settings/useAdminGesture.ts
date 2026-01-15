// hooks/useAdminGesture.ts
import { useCallback, useRef } from "react";

type GestureProps = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void; // ghost click elnyelése
};

export function useAdminGesture(
  onEnter: () => void,
  ms = 2000,
  moveTolerance = 10
): GestureProps {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const suppressNextClickRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Ne buborékoljon fel más elemekhez (Feloldás gomb stb.)
      e.stopPropagation();
      // iOS: fogjuk a pointert, kevesebb cancel lesz
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

      startRef.current = { x: e.clientX, y: e.clientY };
      suppressNextClickRef.current = false;

      timerRef.current = window.setTimeout(() => {
        // Hosszú nyomás „sikerült” – nyitjuk az admin panelt
        suppressNextClickRef.current = true; // a következő clicket elnyeljük
        onEnter();
        clear();
      }, ms);
    },
    [ms, onEnter, clear]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startRef.current || timerRef.current == null) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (Math.hypot(dx, dy) > moveTolerance) {
        clear();
      }
    },
    [moveTolerance, clear]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      clear();
    },
    [clear]
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      clear();
    },
    [clear]
  );

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    // iOS hosszú nyomás menü tiltása
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    // A hosszú nyomást követő „ghost click” elnyelése
    if (suppressNextClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressNextClickRef.current = false;
    }
  }, []);

  return {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerMove,
    onContextMenu,
    onClick,
  };
}
