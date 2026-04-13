import { Box, HStack } from "@chakra-ui/react";
import { RouterLink } from "./RouterLink";

export type LanguageSwitcherProps = {
  currentLang: "sv" | "en";
  svPath: string;
  enPath: string;
};

const LANGS = [
  { code: "sv" as const, label: "Svenska", flag: "🇸🇪" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher({
  currentLang,
  svPath,
  enPath,
}: LanguageSwitcherProps) {
  const paths = { sv: svPath, en: enPath };
  const px = 4;
  const py = 2;
  const flagSize = "1.375rem";

  return (
    <HStack
      layerStyle="segmentGroup"
      p={1}
      gap={1}
      w="fit-content"
      role="group"
      aria-label="Språk / Language"
    >
      {LANGS.map(({ code, label, flag }) => {
        const isActive = code === currentLang;
        return (
          <RouterLink
            key={code}
            to={paths[code]}
            style={{ textDecoration: "none" }}
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={px}
              py={py}
              lineHeight={1}
              cursor="pointer"
              transition="all 0.15s ease"
              borderRadius="lg"
              _hover={!isActive ? { transform: "scale(1.06)" } : undefined}
              _active={{ transform: "scale(0.96)" }}
              {...(isActive ? { layerStyle: "segmentActive" } : {})}
            >
              <Box
                as="span"
                aria-hidden={true}
                fontSize={flagSize}
                lineHeight={1}
                opacity={isActive ? 1 : 0.55}
                transition="opacity 0.15s ease"
              >
                {flag}
              </Box>
            </Box>
          </RouterLink>
        );
      })}
    </HStack>
  );
}
