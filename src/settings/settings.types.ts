export interface Settings {
  hud: boolean;
  forceMode: "auto" | "ios" | "android";
  debugFaceID: boolean;
  uiLang?: UiLang; // <-- AI generated languag files
}

export type UiLang = "hu" | "en" | "es" | "pt" | "pl" | "de" | "fr" | "it";

export const defaultSettings: Settings = {
  hud: false,
  forceMode: "auto",
  debugFaceID: false,
  uiLang: undefined, // if undefinied, use browser language
};
