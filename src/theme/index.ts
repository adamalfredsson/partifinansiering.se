import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineLayerStyles,
  defineTextStyles,
} from "@chakra-ui/react";

// ── Text Styles ────────────────────────────────────────────────────────

const textStyles = defineTextStyles({
  // Page hero heading
  hero: {
    description: "Large page title (hero section)",
    value: {
      fontFamily: "heading",
      fontWeight: "800",
      letterSpacing: "tighter",
      lineHeight: "1",
    },
  },
  // Section headings
  sectionTitle: {
    description: "Section heading",
    value: {
      fontFamily: "heading",
      fontWeight: "bold",
      fontSize: "2xl",
      lineHeight: "tight",
    },
  },
  // Card/chart item names
  itemTitle: {
    description: "Bold item label (party name, card heading)",
    value: {
      fontFamily: "heading",
      fontWeight: "bold",
      fontSize: "sm",
    },
  },
  // Large stat number
  stat: {
    description: "Big statistic number",
    value: {
      fontFamily: "heading",
      fontWeight: "800",
      fontSize: "5xl",
      letterSpacing: "tighter",
    },
  },
  // Card stat (smaller)
  cardStat: {
    description: "Stat inside a card",
    value: {
      fontFamily: "heading",
      fontWeight: "800",
      fontSize: "xl",
    },
  },
  // Tiny uppercase label
  label: {
    description: "Uppercase micro-label",
    value: {
      fontFamily: "body",
      fontWeight: "600",
      fontSize: "xs",
      textTransform: "uppercase",
      letterSpacing: "widest",
    },
  },
  // Even smaller label (10px)
  microLabel: {
    description: "Tiny uppercase micro-label",
    value: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "widest",
    },
  },
  // Legend item text
  legend: {
    description: "Legend label in charts",
    value: {
      fontFamily: "body",
      fontWeight: "600",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "wider",
    },
  },
  // Nav link (active)
  navActive: {
    description: "Active navigation link",
    value: {
      fontFamily: "heading",
      fontWeight: "bold",
      letterSpacing: "tight",
    },
  },
  // Nav link (inactive)
  navInactive: {
    description: "Inactive navigation link",
    value: {
      fontFamily: "heading",
      fontWeight: "bold",
      letterSpacing: "tight",
    },
  },
  // Site logo
  logo: {
    description: "Site logo text",
    value: {
      fontFamily: "heading",
      fontWeight: "900",
      fontSize: "xl",
      letterSpacing: "tighter",
    },
  },
  // Secondary value text (amounts next to bars)
  caption: {
    description: "Secondary value/amount text",
    value: {
      fontFamily: "body",
      fontWeight: "600",
      fontSize: "xs",
    },
  },
  // Suffix (kr, %)
  suffix: {
    description: "Unit suffix",
    value: {
      fontFamily: "body",
      fontWeight: "bold",
      fontSize: "xs",
    },
  },
});

const layerStyles = defineLayerStyles({
  appBar: {
    description: "Fixed top app bar",
    value: {
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(24px)",
      borderBottom: "1px solid",
      borderColor: "rgba(194, 199, 208, 0.2)",
      boxShadow: "sm",
    },
  },
  card: {
    description: "Surface card with rounded corners",
    value: {
      background: "{colors.brand.100}",
      borderRadius: "2rem",
      overflow: "hidden",
    },
  },
  heroCard: {
    description: "Primary-colored hero stat card",
    value: {
      background: "{colors.brand.800}",
      color: "white",
      borderRadius: "2rem",
      boxShadow: "xl",
    },
  },
  surfaceCard: {
    description: "Secondary surface card",
    value: {
      background: "{colors.brand.400}",
      borderRadius: "2rem",
    },
  },
  partyCard: {
    description: "Clickable party overview card",
    value: {
      background: "white",
      borderRadius: "2xl",
      overflow: "hidden",
      position: "relative",
      transition: "all 0.15s",
      _hover: {
        boxShadow: "md",
      },
    },
  },
  barTrack: {
    description: "Background track for stacked bar",
    value: {
      background: "{colors.brand.400}",
      borderRadius: "md",
      overflow: "hidden",
      transition: "all 0.15s",
      _hover: {
        outline: "2px solid",
        outlineColor: "rgba(0, 47, 84, 0.2)",
      },
    },
  },
  segmentGroup: {
    description: "Segmented control background",
    value: {
      background: "{colors.brand.400}",
      borderRadius: "xl",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
    },
  },
  segmentActive: {
    description: "Active segment button",
    value: {
      background: "white",
      borderRadius: "lg",
      boxShadow: "sm",
    },
  },
  bottomNav: {
    description: "Mobile bottom navigation bar",
    value: {
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid",
      borderColor: "{colors.brand.400}",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
      borderTopLeftRadius: "2xl",
      borderTopRightRadius: "2xl",
    },
  },
  footer: {
    description: "Page footer",
    value: {
      background: "{colors.brand.100}",
    },
  },
});

// ── Semantic Tokens ────────────────────────────────────────────────────

const semanticTokens = {
  colors: {
    bg: {
      DEFAULT: { value: "{colors.brand.50}" },
      surface: { value: "{colors.brand.100}" },
      muted: { value: "{colors.brand.400}" },
      emphasis: { value: "{colors.brand.800}" },
    },
    fg: {
      DEFAULT: { value: "{colors.brand.900}" },
      muted: { value: "{colors.brand.700}" },
      subtle: { value: "{colors.brand.600}" },
      inverted: { value: "white" },
    },
    border: {
      subtle: { value: "{colors.brand.500}/20" },
    },
  },
};

// ── Config ─────────────────────────────────────────────────────────────

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        party: {
          s: { value: "#ED1B34" },
          m: { value: "#52BDEC" },
          sd: { value: "#DDDD00" },
          c: { value: "#009933" },
          v: { value: "#DA291C" },
          kd: { value: "#000077" },
          mp: { value: "#83CF39" },
          l: { value: "#006AB3" },
        },
        income: {
          1: { value: "#002f54" },
          2: { value: "#2d7a91" },
          3: { value: "#6b4fa0" },
          4: { value: "#e67e22" },
          5: { value: "#d81b60" },
          6: { value: "#f06292" },
          7: { value: "#73777f" },
        },
        brand: {
          50: { value: "#f7f9ff" },
          100: { value: "#f1f4fa" },
          200: { value: "#ebeef4" },
          300: { value: "#e5e8ee" },
          400: { value: "#dfe3e8" },
          500: { value: "#c2c7d0" },
          600: { value: "#73777f" },
          700: { value: "#42474e" },
          800: { value: "#002f54" },
          900: { value: "#181c20" },
          950: { value: "#001d36" },
        },
      },
      fonts: {
        heading: { value: "'Manrope', sans-serif" },
        body: { value: "'Inter', sans-serif" },
      },
    },
    textStyles,
    layerStyles,
    semanticTokens,
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
    },
    ".material-symbols-outlined": {
      fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
    },
  },
});

export const system = createSystem(defaultConfig, config);
