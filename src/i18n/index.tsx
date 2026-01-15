import en from "./en";
import hu from "./hu";
import { createContext, useContext } from "react";
import pl from "./pl";
import de from "./de";
import es from "./es";
import pt from "./pt";
import fr from "./fr";
import it from "./it";

const langs = { en, hu, de, es, pl, pt, fr, it };
export type Lang = keyof typeof langs;

export const I18nContext = createContext({ lang: "en" as Lang, t: en });

export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, t: langs[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
