import { Box, Stack, Text, type StackProps } from "@chakra-ui/react";

const sizePx = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

const gapMap: Record<keyof typeof sizePx, StackProps["gap"]> = {
  sm: 2,
  md: 2.5,
  lg: 3,
};

const titleFontSize: Record<
  keyof typeof sizePx,
  StackProps["fontSize"] | undefined
> = {
  sm: "md",
  md: "lg",
  lg: { base: "xl", md: "2xl" },
};

export type SiteLogoSize = keyof typeof sizePx;

export interface SiteLogoProps extends Omit<
  StackProps,
  "direction" | "children"
> {
  size?: SiteLogoSize;
  /** Visible site name (default partifinansiering.se) */
  siteTitle?: string;
}

export function SiteLogo({
  size = "md",
  color = "bg.emphasis",
  siteTitle = "partifinansiering.se",
  gap,
  align = "center",
  ...props
}: SiteLogoProps) {
  const px = sizePx[size];

  return (
    <Stack
      direction="row"
      align={align}
      gap={gap ?? gapMap[size]}
      color={color}
      {...props}
    >
      <Box
        as="span"
        display="flex"
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
        lineHeight={0}
        aria-hidden
      >
        <svg
          width={px}
          height={px}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect
            x="2.5"
            y="2.5"
            width="43"
            height="43"
            rx="12"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <rect
            x="11"
            y="26"
            width="8"
            height="10"
            rx="2"
            fill="currentColor"
          />
          <rect
            x="20"
            y="18"
            width="8"
            height="18"
            rx="2"
            fill="currentColor"
          />
          <rect
            x="29"
            y="10"
            width="8"
            height="26"
            rx="2"
            fill="currentColor"
          />
        </svg>
      </Box>
      <Text
        as="span"
        textStyle="logo"
        fontSize={titleFontSize[size]}
        lineHeight="1"
        color={color}
      >
        {siteTitle}
      </Text>
    </Stack>
  );
}
