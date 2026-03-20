import partiesData from "../data/generated/parties.json";
import type { Party } from "../data/types";
import { getTranslation } from "../i18n/useTranslation";
import { absoluteUrl, SITE_ORIGIN } from "./site";

const parties = partiesData as Party[];

export function buildHomeHead(lang: "sv" | "en") {
  const { t } = getTranslation(lang);
  const path = lang === "en" ? "/en" : "/";
  const url = absoluteUrl(path);
  const title = `${t("site.description")} · ${t("site.title")}`;
  const description = t("seo.homeMetaDescription");
  const ogLocale = lang === "en" ? "en_US" : "sv_SE";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: t("site.title") },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:locale", content: ogLocale },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: t("site.title"),
          url: `${SITE_ORIGIN}/`,
          description,
          inLanguage: lang === "en" ? "en" : "sv-SE",
        },
      },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "sv", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/en") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  };
}

export function buildPartyHead(lang: "sv" | "en", partySlug: string) {
  const party = parties.find((p) => p.slug === partySlug);
  const { t } = getTranslation(lang);
  const homePath = lang === "en" ? "/en" : "/";

  if (!party) {
    return {
      meta: [{ title: t("site.title") }],
      links: [{ rel: "canonical", href: absoluteUrl(homePath) }],
    };
  }

  const path =
    lang === "en" ? `/en/parti/${party.slug}` : `/parti/${party.slug}`;
  const url = absoluteUrl(path);
  const title = `${party.name} · ${t("site.title")}`;
  const description = t("seo.partyMetaDescription").replace(
    "{party}",
    party.name,
  );
  const ogLocale = lang === "en" ? "en_US" : "sv_SE";
  const ogImage = absoluteUrl(`/party-icons/${party.slug}.png`);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: t("site.title") },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:locale", content: ogLocale },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          url,
          description,
          inLanguage: lang === "en" ? "en" : "sv-SE",
          isPartOf: {
            "@type": "WebSite",
            name: t("site.title"),
            url: SITE_ORIGIN,
          },
          about: {
            "@type": "PoliticalParty",
            name: party.name,
          },
        },
      },
    ],
    links: [
      { rel: "canonical", href: url },
      {
        rel: "alternate",
        hrefLang: "sv",
        href: absoluteUrl(`/parti/${party.slug}`),
      },
      {
        rel: "alternate",
        hrefLang: "en",
        href: absoluteUrl(`/en/parti/${party.slug}`),
      },
      {
        rel: "alternate",
        hrefLang: "x-default",
        href: absoluteUrl(`/parti/${party.slug}`),
      },
    ],
  };
}
