import { useI18n } from "../i18n";
import { useSettings } from "../settings/settings.context";
import { clearSettings } from "../settings/settings.storage";
import type { UiLang } from "../settings/settings.types";

export const supportedLangs: UiLang[] = [
  "en",
  "hu",
  "es",
  "pt",
  "pl",
  "de",
  "fr",
  "it",
];
export function normalizeBrowserLang(): UiLang {
  const raw = (navigator.language || "").toLowerCase();
  // egyszerű normalizálás: 'pt-br' -> 'pt', 'es-MX' -> 'es'
  const base = raw.split("-")[0] as UiLang;
  return supportedLangs.includes(base) ? base : "en";
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { settings, dispatch } = useSettings();

  const { t } = useI18n();

  const handleReset = () => {
    const ok = confirm("Biztosan visszaállítod az alapértékeket?");
    if (!ok) return;
    clearSettings();
    dispatch({ type: "RESET_DEFAULTS" });
  };

  const current =
    (settings.uiLang as UiLang | undefined) ?? normalizeBrowserLang();

  return (
    <div className="admin-modal-root" role="dialog" aria-modal="true">
      <div className="admin-backdrop" onClick={onClose} />

      <div className="screen admin">
        <h2>{t.adminPanel}</h2>

        <div className="admin-section">
          <label>
            <input
              type="checkbox"
              checked={settings.hud}
              onChange={(e) =>
                dispatch({ type: "SET_HUD", payload: e.target.checked })
              }
            />
            {t.showAndroidHUD}
          </label>
        </div>

        <div className="admin-section">
          <label>
            {t.uiMode}&nbsp;
            <select
              value={settings.forceMode}
              onChange={(e) =>
                dispatch({
                  type: "SET_FORCE_MODE",
                  payload: e.target.value as any,
                })
              }
            >
              <option value="auto">{t.auto}</option>
              <option value="ios">{t.iOSForced}</option>
              <option value="android">{t.androidForced}</option>
            </select>
          </label>
        </div>

        <div className="admin-section">
          <label>
            <input
              type="checkbox"
              checked={settings.debugFaceID}
              onChange={(e) =>
                dispatch({
                  type: "SET_DEBUG_FACEID",
                  payload: e.target.checked,
                })
              }
            />
            {t.debugFaceID}
          </label>
        </div>

        <div className="admin-section">
          <label>
            {t.uiLanguage}:&nbsp;
            <select
              value={current}
              onChange={(e) =>
                dispatch({
                  type: "SET_UI_LANG",
                  payload: e.target.value as UiLang,
                })
              }
            >
              {supportedLangs.map((code) => (
                <option key={code} value={code}>
                  {t.langLabel?.[code] ?? code.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-actions" style={{ display: "flex", gap: 12 }}>
          <button className="ghost" onClick={onClose}>
            {t.close}
          </button>
          <button className="danger" onClick={handleReset}>
            {t.resetDefaults}
          </button>
        </div>
      </div>
    </div>
  );
}
