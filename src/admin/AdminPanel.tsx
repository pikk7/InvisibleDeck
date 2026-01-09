import { useSettings } from "../settings/settings.context";
import { clearSettings } from "../settings/settings.storage";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { settings, dispatch } = useSettings();

  const handleReset = () => {
    const ok = confirm("Biztosan visszaállítod az alapértékeket?");
    if (!ok) return;
    clearSettings();
    dispatch({ type: "RESET_DEFAULTS" });
  };

  return (
    <div className="screen admin">
      <h2>Admin / Debug Panel</h2>

      <div className="admin-section">
        <label>
          <input
            type="checkbox"
            checked={settings.hud}
            onChange={(e) =>
              dispatch({ type: "SET_HUD", payload: e.target.checked })
            }
          />
          Android HUD megjelenítése
        </label>
      </div>

      <div className="admin-section">
        <label>
          UI mód:&nbsp;
          <select
            value={settings.forceMode}
            onChange={(e) =>
              dispatch({
                type: "SET_FORCE_MODE",
                payload: e.target.value as any,
              })
            }
          >
            <option value="auto">Automatikus (UA alapján)</option>
            <option value="ios">iOS kényszerítve</option>
            <option value="android">Android kényszerítve</option>
          </select>
        </label>
      </div>

      <div className="admin-section">
        <label>
          <input
            type="checkbox"
            checked={settings.debugFaceID}
            onChange={(e) =>
              dispatch({ type: "SET_DEBUG_FACEID", payload: e.target.checked })
            }
          />
          FaceID overlay teszt mód
        </label>
      </div>

      <div className="admin-actions" style={{ display: "flex", gap: 12 }}>
        <button className="ghost" onClick={onClose}>
          Bezárás
        </button>
        <button className="danger" onClick={handleReset}>
          Reset alapértékek
        </button>
      </div>
    </div>
  );
}
