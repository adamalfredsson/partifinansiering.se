import { defineSlotRecipe } from "@chakra-ui/react";
import { tableAnatomy } from "@chakra-ui/react/anatomy";

const dataCardChrome = {
  header: {
    bg: "brand.300",
  },
  row: {
    bg: "white",
  },
  body: {
    "& tr:last-of-type td": {
      borderBottomWidth: "0",
    },
  },
} as const;

/** Merged with Chakra’s default table recipe via `createSystem(defaultConfig, config)`. */
export const tableSlotRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: tableAnatomy.keys(),
  variants: {
    variant: {
      /** Inset 3-column tables (e.g. top donors): middle column centered */
      dataCard: {
        ...dataCardChrome,
        columnHeader: {
          textStyle: "microLabel",
          color: "fg.muted",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          py: 3,
          borderBottomWidth: "1px",
          borderBottomColor: "bg.muted",
          "&:first-of-type": {
            textAlign: "start",
            px: { base: 4, md: 6 },
          },
          "&:not(:first-of-type):not(:last-of-type)": {
            textAlign: "center",
            px: { base: 3, md: 4 },
          },
          "&:last-of-type": {
            textAlign: "end",
            px: { base: 4, md: 6 },
          },
        },
        cell: {
          verticalAlign: "middle",
          whiteSpace: "normal",
          py: 4,
          borderBottomWidth: "1px",
          borderBottomColor: "bg.muted",
          "&:first-of-type": {
            minW: 0,
            px: { base: 4, md: 6 },
          },
          "&:not(:first-of-type):not(:last-of-type)": {
            textAlign: "center",
            px: { base: 3, md: 4 },
          },
          "&:last-of-type": {
            minW: 0,
            textAlign: "end",
            px: { base: 4, md: 6 },
          },
        },
      },

      /** Inset 4-column tables (e.g. local orgs): start / start / end / end */
      dataCardQuad: {
        ...dataCardChrome,
        columnHeader: {
          textStyle: "microLabel",
          color: "fg.muted",
          fontWeight: "bold",
          py: 3,
          borderBottomWidth: "1px",
          borderBottomColor: "bg.muted",
          "&:nth-of-type(1)": {
            textAlign: "start",
            whiteSpace: "normal",
            px: { base: 4, md: 6 },
          },
          "&:nth-of-type(2)": {
            textAlign: "start",
            whiteSpace: "normal",
            px: { base: 3, md: 4 },
          },
          "&:nth-of-type(3)": {
            textAlign: "end",
            whiteSpace: "normal",
            px: { base: 3, md: 4 },
          },
          "&:nth-of-type(4)": {
            textAlign: "end",
            whiteSpace: "nowrap",
            px: { base: 4, md: 6 },
          },
        },
        cell: {
          verticalAlign: "middle",
          whiteSpace: "normal",
          py: 4,
          borderBottomWidth: "1px",
          borderBottomColor: "bg.muted",
          "&:nth-of-type(1)": {
            minW: 0,
            textAlign: "start",
            px: { base: 4, md: 6 },
          },
          "&:nth-of-type(2)": {
            minW: 0,
            textAlign: "start",
            px: { base: 3, md: 4 },
          },
          "&:nth-of-type(3)": {
            minW: 0,
            textAlign: "end",
            px: { base: 3, md: 4 },
          },
          "&:nth-of-type(4)": {
            textAlign: "end",
            px: { base: 4, md: 6 },
          },
        },
      },
    },
  },
});

/** Text styles used inside `Table` (e.g. `dataCard` / `dataCardQuad` body cells). Merged in `theme/index.ts` via `defineTextStyles`. */
export const tableTextStyles = {
  tableCellPrimary: {
    description: "Primary text inside data tables",
    value: {
      fontFamily: "body",
      fontSize: "sm",
      color: "fg",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },
  },
  tableCellSecondary: {
    description: "Secondary / muted text in data tables (e.g. location)",
    value: {
      fontFamily: "body",
      fontSize: "sm",
      color: "fg.muted",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },
  },
  tableCellAmount: {
    description: "Bold tabular amount in data tables",
    value: {
      fontFamily: "body",
      fontSize: "sm",
      fontWeight: "bold",
      color: "fg",
      fontVariantNumeric: "tabular-nums",
      wordBreak: "break-word",
    },
  },
} as const;
