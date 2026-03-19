/** Map party slug to abbreviation and color */
export const PARTY_CONFIG: Record<string, { abbr: string; color: string }> = {
  socialdemokraterna: { abbr: "S", color: "#ED1B34" },
  moderaterna: { abbr: "M", color: "#52BDEC" },
  sverigedemokraterna: { abbr: "SD", color: "#DDDD00" },
  centerpartiet: { abbr: "C", color: "#009933" },
  vansterpartiet: { abbr: "V", color: "#DA291C" },
  kristdemokraterna: { abbr: "KD", color: "#000077" },
  miljopartiet: { abbr: "MP", color: "#83CF39" },
  liberalerna: { abbr: "L", color: "#006AB3" },
};

export const INCOME_COLORS: Record<string, string> = {
  "1": "#002f54",
  "2": "#2d7a91",
  "3": "#6b4fa0",
  "4": "#e67e22",
  "5": "#d81b60",
  "6": "#f06292",
  "8": "#73777f",
};
