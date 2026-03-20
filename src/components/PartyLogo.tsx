import { HStack, Image } from "@chakra-ui/react";
import { PARTY_CONFIG } from "../data/parties-config";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, number> = {
  sm: 8,
  md: 10,
  lg: 14,
};

interface PartyLogoProps {
  slug: string;
  size?: Size;
  rounded?: "lg" | "xl";
  /** Accessible name when using a party icon image (empty = decorative). */
  logoAlt?: string;
}

export function PartyLogo({
  slug,
  size = "md",
  rounded = "lg",
  logoAlt = "",
}: PartyLogoProps) {
  const config = PARTY_CONFIG[slug];
  const color = config?.color ?? "#73777f";
  const abbr = config?.abbr ?? "?";
  const icon = config?.icon;
  const s = sizeMap[size];

  if (icon) {
    return (
      <Image
        src={icon}
        alt={logoAlt}
        w={s}
        h={s}
        minW={s}
        minH={s}
        objectFit="contain"
      />
    );
  }

  return (
    <HStack
      w={s}
      h={s}
      minW={s}
      minH={s}
      bg={color}
      rounded={rounded}
      align="center"
      justify="center"
      color="fg.inverted"
      textStyle={size === "lg" ? "sectionTitle" : "itemTitle"}
      fontWeight="900"
    >
      {abbr}
    </HStack>
  );
}
