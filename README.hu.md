# 📱 Invisible Deck – React PWA

## _Phone Unlock Illusion / Magic Trick System Overview_

🌐 Languages:

[English description](README.md)  
[Magyar leírás](README.hu.md)

Ez egy **React + Vite + PWA** alapú mobilbűvész‑alkalmazás, amely a telefon feloldásának illúzióját használja arra, hogy a néző által megnevezett kártyát „varázsütésre” megjelenítse.  
A rendszer automatikusan iOS‑re vagy Androidra szabott feloldási élményt mutat, a bűvész pedig a folyamat közben titokban beviszi a választott lapot.

---

## 🔥 Fő funkciók

- iOS‑szerű **FaceID** képernyő + **6 számjegyű PIN feloldó**
- Android‑szerű **4×4 pattern lock** feloldó
- **Automatikus platformdetektálás** (User Agent alapján)
- Titkos **Admin Panel** (hosszú nyomás jobb‑alsó sarokban)
- Állítható **HUD** (Android pattern debug overlay)
- **Force Mode** (iOS / Android / Auto)
- **FaceID debug mód**
- **Reset Defaults** (összes beállítás törlése)
- PWA telepíthető ikonként (home screen), offline működés

---

## 🖥 Projektstruktúra

```
src/
  app/
    App.tsx
  admin/
    AdminPanel.tsx
  android/
    AndroidPattern.tsx
  ios/
    FaceIDOverlay.tsx
    IOSPasscode.tsx
  settings/
    settings.types.ts
    settings.context.tsx
    settings.storage.ts
    useAdminGesture.ts
  ui/
    LockScreen.tsx
    Reveal.tsx
  main.tsx
  index.css
public/
  manifest.webmanifest
  sw.js
```

---

## 🔐 Feloldási logikák

### iOS Flow

#### 1) FaceID overlay

- iOS‑szerű animáció
- 1,2 másodperc után → **„Face ID sikertelen”**
- automatikusan vagy gombnyomással tovább → PIN képernyő

#### 2) PIN kód (ez viszi be a lapot)

| PIN pozíció       | Jelentés                                         |
| ----------------- | ------------------------------------------------ |
| **1. számjegy**   | **Szín** – 1=♥, 2=♦, 3=♣, 4=♠ (5–9, 0 leképezve) |
| **2–3. számjegy** | **Érték** – 01..13 → A..K (mod 13 támogatott)    |
| **4–6. számjegy** | Tetszőleges (valódi PIN látszat)                 |

---

### Android Flow

#### 4×4 Pattern lock

A bűvész mintát rajzol → ebből számolódik a kártya.

#### Szín

A **kezdő pont kvadránsa** számít:

| Kvadráns   | Szín |
| ---------- | ---- |
| Bal‑felső  | ♥    |
| Jobb‑felső | ♦    |
| Bal‑alsó   | ♣    |
| Jobb‑alsó  | ♠    |

#### Rang

- Rang = `(bejárt pontok száma - 1) mod 13` → **A..K**
- Minimum 2 pont szükséges

---

## 🃏 Kártyamegjelenítés

- valószerű játékkártya UI
- felső‑bal + alsó‑jobb sarok index
- középső nagy suit ikon
- „Zárolás” gomb → vissza a lock screenre

---

## 🛠 Admin Panel (rejtett funkciók)

#### Belépés

**Lock Screen → jobb‑alsó sarok → 2 másodperc hosszú nyomás**

#### Funkciók:

- **HUD megjelenítése** (Androidon)
- **UI mód választása**:
  - auto
  - iOS
  - Android
- **FaceID debug mód**
- **Reset Defaults**
  - törli a localStorage‑ot
  - visszaállítja a default beállításokat
  - azonnal frissíti az appot

---

## ⚙️ Settings architektúra

#### Settings objektum

```ts
interface Settings {
  hud: boolean;
  forceMode: "auto" | "ios" | "android";
  debugFaceID: boolean;
  uiLang?: UiLang; // <-- AI generated languag files
}

export type UiLang = "hu" | "en" | "es" | "pt" | "pl" | "de" | "fr" | "it";
```

#### Mi tárolja?

- **SettingsContext** (React Context + Reducer)
- Mentés → `localStorage`
- Betöltés → app induláskor (`loadSettings()`)

#### Támogatott akciók:

- `SET_HUD`
- `SET_FORCE_MODE`
- `SET_DEBUG_FACEID`
- `SET_ALL`
- `RESET_DEFAULTS`

---

## 🎯 Felhasználói élmény összefoglaló

1. **Lock Screen**
2. Néző kimondja a kártyát
3. Te „feloldod” a telefont → közben titokban bevized a lapot
4. iOS:
   - FaceID → PIN → kártya
5. Android:
   - mintarajz → kártya
6. „Zárolás” → kezdődik elölről

A néző 100%-ban azt látja, mintha tényleg feloldanád a telefonodat.

---

## 📦 Futatás

#### Fejlesztés

```sh
npm install
npm run dev
```

#### Build

```sh
npm run build
npm run preview
```

#### Telepíthető PWA

- tartalmaz manifestet és service workert
- offline működés támogatott
- iOS/Android home screenre telepíthető

## Demo

[Invisible Deck Demo](https://pikk7.github.io/InvisibleDeck/)

Weblap megnyitása után, a menüből megnyitni és a **Add to Home Screen** gomb, végül az **Install** gomb és ujra **Install**

Utána Invisible Deck néven elérhető alkalmazás lesz.

## Translations

A forditasok Copilottal voltak generalva.

## Test

Android 16
One UI 8
Samsung Galaxy S24 Ultra
