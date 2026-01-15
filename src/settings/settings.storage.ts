import type { Settings } from "./settings.types";

const KEY = "invisibleDeckSettings";

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Settings;
    // védőkorlát (opcionális): ha uiLang rossz, töröljük
    if (s.uiLang && s.uiLang !== "hu" && s.uiLang !== "en") {
      delete (s as any).uiLang;
    }
    return s;
  } catch {
    return null;
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function clearSettings() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
