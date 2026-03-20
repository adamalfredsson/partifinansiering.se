/** Canonical site origin for absolute URLs (meta, OG, JSON-LD, sitemap). */
export const SITE_ORIGIN = "https://partifinansiering.se";

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path}`;
}
