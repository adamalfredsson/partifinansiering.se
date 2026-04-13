import en from "./en.json";
import sv from "./sv.json";

const translations: Record<string, Record<string, string>> = { sv, en };

export type Locale = "sv" | "en";

export function getTranslation(lang: string) {
  const locale: Locale = lang === "en" ? "en" : "sv";
  const t = (key: string, params?: Record<string, string>) => {
    let value = translations[locale]?.[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replaceAll(`{${k}}`, v);
      }
    }
    return value;
  };
  return { t, locale };
}
