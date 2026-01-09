export type UIMode = "auto" | "ios" | "android";

export interface Settings {
  hud: boolean; // Android HUD láthatóság
  forceMode: UIMode; // UI mód kényszerítése (auto=UA alapján)
  debugFaceID: boolean; // iOS FaceID overlay debug mód
}

export const defaultSettings: Settings = {
  hud: false,
  forceMode: "auto",
  debugFaceID: false,
};
