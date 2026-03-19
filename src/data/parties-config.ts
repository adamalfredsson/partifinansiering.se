/** Map party slug to abbreviation, color, and optional icon path (from public/) */
export const PARTY_CONFIG: Record<
  string,
  { abbr: string; color: string; icon: string }
> = {
  socialdemokraterna: {
    abbr: "S",
    color: "#ED1B34",
    icon: "/party-icons/socialdemokraterna.png",
  },
  moderaterna: {
    abbr: "M",
    color: "#52BDEC",
    icon: "/party-icons/moderaterna.png",
  },
  sverigedemokraterna: {
    abbr: "SD",
    color: "#DDDD00",
    icon: "/party-icons/sverigedemokraterna.png",
  },
  centerpartiet: {
    abbr: "C",
    color: "#009933",
    icon: "/party-icons/centerpartiet.png",
  },
  vansterpartiet: {
    abbr: "V",
    color: "#DA291C",
    icon: "/party-icons/vansterpartiet.png",
  },
  kristdemokraterna: {
    abbr: "KD",
    color: "#000077",
    icon: "/party-icons/kristdemokraterna.png",
  },
  miljopartiet: {
    abbr: "MP",
    color: "#83CF39",
    icon: "/party-icons/miljopartiet.png",
  },
  liberalerna: {
    abbr: "L",
    color: "#006AB3",
    icon: "/party-icons/liberalerna.png",
  },
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
