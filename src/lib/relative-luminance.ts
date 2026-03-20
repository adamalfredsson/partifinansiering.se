/** Relative luminance (sRGB), WCAG. Used to pick readable text on arbitrary hex fills. */
export function relativeLuminance(hex: string): number {
  const n = hex.replace("#", "");
  if (n.length !== 6) return 0;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(lumA: number, lumB: number): number {
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

const L_WHITE = 1;
const L_NEAR_BLACK = relativeLuminance("#181c20");

/** Pick white or near-black for maximum contrast on `bgHex` (body text on solid chips). */
export function contrastingForegroundHex(bgHex: string): "#ffffff" | "#181c20" {
  const Lbg = relativeLuminance(bgHex);
  const crWhite = contrastRatio(Lbg, L_WHITE);
  const crBlack = contrastRatio(Lbg, L_NEAR_BLACK);
  return crWhite >= crBlack ? "#ffffff" : "#181c20";
}
