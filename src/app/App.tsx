import React from "react";
import { SettingsProvider, useSettings } from "../settings/settings.context";
import AdminPanel from "../admin/AdminPanel";
import LockScreen from "../ui/LockScreen";
import FaceIDOverlay from "../ios/FaceIDOverlay";
import IOSPasscode from "../ios/IOSPasscode";
import AndroidPattern from "../android/AndroidPattern";
import Reveal from "../ui/Reveal";

function detectModeUA(): "ios" | "android" {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "ios";
}

function Root() {
  const { settings } = useSettings();
  const [stage, setStage] = React.useState<
    "lock" | "faceid" | "ios" | "android" | "reveal"
  >("lock");
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [card, setCard] = React.useState<{
    suit: "hearts" | "diamonds" | "clubs" | "spades";
    rank: string;
  } | null>(null);

  const finalMode =
    settings.forceMode === "auto" ? detectModeUA() : settings.forceMode;

  return (
    <>
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {stage === "lock" && (
        <LockScreen
          onUnlock={() =>
            setStage(
              finalMode === "ios"
                ? settings.debugFaceID
                  ? "faceid"
                  : "ios"
                : "android"
            )
          }
          onOpenAdmin={() => setAdminOpen(true)}
        />
      )}

      {stage === "faceid" && (
        <FaceIDOverlay
          onFail={() => setStage("ios")}
          onCancel={() => setStage("lock")}
        />
      )}
      {stage === "ios" && (
        <IOSPasscode
          onCard={(c) => {
            setCard(c);
            setStage("reveal");
          }}
        />
      )}
      {stage === "android" && (
        <AndroidPattern
          hudVisible={settings.hud}
          onCard={(c) => {
            setCard(c);
            setStage("reveal");
          }}
        />
      )}
      {stage === "reveal" && card && (
        <Reveal
          card={card}
          onRelock={() => {
            setStage("lock");
            setCard(null);
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  );
}
