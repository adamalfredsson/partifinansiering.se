import sv from "./sv.json";
import en from "./en.json";

const translations: Record<string, Record<string, string>> = { sv, en };

export type Locale = "sv" | "en";

export function getTranslation(lang: string) {
  const locale: Locale = lang === "en" ? "en" : "sv";
  const t = (key: string) => translations[locale]?.[key] ?? key;
  return { t, locale };
}
