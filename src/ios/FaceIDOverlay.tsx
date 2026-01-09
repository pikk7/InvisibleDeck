import React from "react";

export default function FaceIDOverlay({
  onFail,
  onCancel,
}: {
  onFail: () => void;
  onCancel: () => void;
}) {
  const [phase, setPhase] = React.useState<"scan" | "failed">("scan");

  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase("failed"), 1200);
    const t2 = setTimeout(() => onFail(), 2000); // auto → PIN
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFail]);

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
            <div className="faceid-failed">Face ID sikertelen</div>
            <div className="faceid-sub">
              Koppints a tovább gombra a jelkód megadásához.
            </div>
            <div className="faceid-actions">
              <button className="ghost" onClick={onCancel}>
                Mégse
              </button>
              <button className="primary" onClick={onFail}>
                Jelkód megadása
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
