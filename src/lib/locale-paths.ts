/** Map URL pathname to the same page in the other locale (Swedish at site root). */
export function alternateLocalePath(
  pathname: string,
  target: "sv" | "en",
): string {
  const isEn =
    pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/");
  if (target === "sv") {
    if (pathname === "/en" || pathname === "/en/") return "/";
    if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
    return pathname || "/";
  }
  if (isEn) return pathname || "/en";
  if (pathname === "/" || pathname === "") return "/en";
  return `/en${pathname}`;
}

export function homeRouteTo(lang: "sv" | "en"): "/" | "/en" {
  return lang === "en" ? "/en" : "/";
}
