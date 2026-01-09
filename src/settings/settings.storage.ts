
import type { Settings } from './settings.types';

const KEY = 'invisibleDeckSettings';

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Settings) : null;
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
