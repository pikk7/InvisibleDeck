import { useEffect, useState } from "react";
import { useI18n } from "../i18n";

export default function FaceIDOverlay({
  onFail,
  onCancel,
}: {
  onFail: () => void;
  onCancel: () => void;
}) {
  const [phase, setPhase] = useState<"scan" | "failed">("scan");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("failed"), 1200);
    const t2 = setTimeout(() => onFail(), 2000); // auto → PIN
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFail]);

  const { t } = useI18n();
  return (
    <div className="screen faceid" aria-live="polite">
      <div className="faceid-card">
        {phase === "scan" ? (
          <>
            <div className="face-outline"></div>
            <div className="scan-ring"></div>
            <div className="faceid-label">Face ID</div>
          </>
        ) : (
          <>
            <div className="faceid-failed">{t.faceIDUnsuccessful}</div>
            <div className="faceid-sub">{t.iOSPasscode}</div>
            <div className="faceid-actions">
              <button className="ghost" onClick={onCancel}>
                {t.cancel}
              </button>
              <button className="primary" onClick={onFail}>
                {t.enterPass}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
