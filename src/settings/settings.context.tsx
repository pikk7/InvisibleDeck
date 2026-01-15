// src/settings/settings.context.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Settings, UiLang } from "./settings.types";
import { defaultSettings } from "./settings.types";
import { loadSettings, saveSettings } from "./settings.storage";

type Action =
  | { type: "SET_ALL"; payload: Settings }
  | { type: "SET_HUD"; payload: boolean }
  | { type: "SET_FORCE_MODE"; payload: "auto" | "ios" | "android" }
  | { type: "SET_DEBUG_FACEID"; payload: boolean }
  | { type: "SET_UI_LANG"; payload: UiLang }
  | { type: "RESET_DEFAULTS" };

function reducer(state: Settings, action: Action): Settings {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "SET_HUD":
      return { ...state, hud: action.payload };
    case "SET_FORCE_MODE":
      return { ...state, forceMode: action.payload };
    case "SET_DEBUG_FACEID":
      return { ...state, debugFaceID: action.payload };
    case "SET_UI_LANG":
      return { ...state, uiLang: action.payload };
    case "RESET_DEFAULTS":
      return { ...defaultSettings };
    default:
      return state;
  }
}

const SettingsContext = createContext<{
  settings: Settings;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultSettings);

  useEffect(() => {
    const loaded = loadSettings();
    if (loaded) dispatch({ type: "SET_ALL", payload: loaded });
  }, []);

  useEffect(() => {
    saveSettings(state);
  }, [state]);

  return (
    <SettingsContext.Provider value={{ settings: state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
