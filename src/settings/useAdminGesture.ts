import { useEffect } from "react";

/**
 * Hosszú nyomásos titkos gesztus az admin panelhez.
 * Alapértelmezés: #admin-zone elem, 2000ms.
 */
export function useAdminGesture(
  onEnter: () => void,
  selector = "#admin-zone",
  ms = 2000
) {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;

    let timer: any = null;
    const down = () => {
      timer = setTimeout(onEnter, ms);
    };
    const up = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
    };
  }, [onEnter, selector, ms]);
}

