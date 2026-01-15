// src/app/App.tsx
import { useState, useMemo } from "react";
import { SettingsProvider, useSettings } from "../settings/settings.context";
import { I18nProvider } from "../i18n";

import AdminPanel, {
  normalizeBrowserLang,
  supportedLangs,
} from "../admin/AdminPanel";
import LockScreen from "../ui/LockScreen";
import FaceIDOverlay from "../ios/FaceIDOverlay";
import IOSPasscode from "../ios/IOSPasscode";
import AndroidPattern from "../android/AndroidPattern";
import Reveal from "../ui/Reveal";
import type { UiLang } from "../settings/settings.types";

function detectModeUA(): "ios" | "android" {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "ios";
}

/** Bridge: Settings + URL alapján kiválasztjuk a nyelvet és átadjuk az I18nProvider-nek. */

function I18nFromSettings({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");

  const normalizedUrl =
    urlLang && supportedLangs.includes(urlLang as UiLang)
      ? (urlLang as UiLang)
      : null;

  const lang =
    normalizedUrl ??
    (settings.uiLang as UiLang | undefined) ??
    normalizeBrowserLang();

  return <I18nProvider lang={lang}>{children}</I18nProvider>;
}

function Root() {
  const { settings } = useSettings();
  const [stage, setStage] = useState<
    "lock" | "faceid" | "ios" | "android" | "reveal"
  >("lock");
  const [adminOpen, setAdminOpen] = useState(false);
  const [card, setCard] = useState<{
    suit: "hearts" | "diamonds" | "clubs" | "spades";
    rank: string;
  } | null>(null);

  // Force mode URL-ből
  const urlForceMode = useMemo<"ios" | "android" | null>(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get("force");
    return v === "ios" || v === "android" ? v : null;
  }, []);

  // Végső mód: URL > settings.forceMode > UA
  const finalMode: "ios" | "android" =
    urlForceMode ??
    (settings.forceMode === "auto" ? detectModeUA() : settings.forceMode);

  return (
    <>
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {stage === "lock" && (
        <LockScreen
          onUnlock={() => {
            if (adminOpen) return; // amíg admin nyitva, maradjon lock
            setStage(
              finalMode === "ios"
                ? settings.debugFaceID
                  ? "faceid"
                  : "ios"
                : "android"
            );
          }}
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
      <I18nFromSettings>
        <Root />
      </I18nFromSettings>
    </SettingsProvider>
  );
}
