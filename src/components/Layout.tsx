import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { YearProvider, useYear } from "../context/YearContext";
import { getTranslation } from "../i18n/useTranslation";
import { alternateLocalePath, homeRouteTo } from "../lib/locale-paths";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteLogo } from "./SiteLogo";
import { YearSelector } from "./YearSelector";

interface LayoutProps {
  children: ReactNode;
  lang?: string;
}

function useScrolledPast(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

export function Layout({ children, lang = "sv" }: LayoutProps) {
  return (
    <YearProvider>
      <LayoutShell lang={lang}>{children}</LayoutShell>
    </YearProvider>
  );
}

function LayoutShell({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const svPath = alternateLocalePath(pathname, "sv");
  const enPath = alternateLocalePath(pathname, "en");
  const currentLang = lang === "en" ? "en" : "sv";
  const homeTo = homeRouteTo(currentLang);

  const { years, selectedYear, setSelectedYear } = useYear();
  const showHeader = useScrolledPast(80);
  const { t } = getTranslation(lang);

  return (
    <VStack align="stretch" minH="100vh" gap={0}>
      <Box
        as="header"
        pos="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={50}
        layerStyle="appBar"
        transform={showHeader ? "translateY(0)" : "translateY(-100%)"}
        transition="transform 0.25s ease"
        pointerEvents={showHeader ? "auto" : "none"}
        {...(!showHeader ? { inert: true } : {})}
      >
        <HStack
          justify="space-between"
          align="center"
          w="full"
          px={{ base: 4, md: 6 }}
          py={4}
          maxW="7xl"
          mx="auto"
          gap={4}
        >
          <Box flexShrink={0}>
            <Link to={homeTo} style={{ textDecoration: "none" }}>
              <SiteLogo size="sm" siteTitle={t("site.title")} />
            </Link>
          </Box>
          <YearSelector
            years={years}
            selected={selectedYear}
            onChange={setSelectedYear}
            flexShrink={0}
            justify="flex-end"
            hideBelow="md"
          />
        </HStack>
      </Box>

      <Box
        as="main"
        flexGrow={1}
        pt={8}
        pb={12}
        px={{ base: 4, md: 6 }}
        maxW="7xl"
        mx="auto"
        w="full"
      >
        <Box mb={{ base: 5, md: 12 }} maxW="2xl">
          <Link to={homeTo} style={{ textDecoration: "none" }}>
            <SiteLogo siteTitle={t("site.title")} />
          </Link>
        </Box>
        {children}
      </Box>

      <Box
        as="footer"
        layerStyle="footer"
        w="full"
        mt="auto"
        py={12}
        px={{ base: 4, md: 6 }}
      >
        <Stack
          maxW="7xl"
          mx="auto"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="start"
          gap={8}
        >
          <VStack align="start" gap={4}>
            <Link to={homeTo} style={{ textDecoration: "none" }}>
              <SiteLogo size="md" siteTitle={t("site.title")} />
            </Link>
            <Text
              fontSize="sm"
              lineHeight="relaxed"
              color="fg.subtle"
              maxW="sm"
            >
              {t("footer.tagline")}
            </Text>
            <Text color="fg.subtle" fontSize="xs" opacity={0.7}>
              © {new Date().getFullYear()} partifinansiering.se —{" "}
              {t("footer.source")}
            </Text>
            <Text
              fontSize="xs"
              lineHeight="relaxed"
              color="fg.subtle"
              maxW="md"
              opacity={0.7}
            >
              {t("footer.disclaimer")}
            </Text>
          </VStack>
          <VStack align={{ base: "start", md: "end" }} gap={4} fontSize="sm">
            <LanguageSwitcher
              currentLang={currentLang}
              svPath={svPath}
              enPath={enPath}
            />
            <Text
              asChild
              color="fg.subtle"
              opacity={0.7}
              _hover={{ opacity: 1 }}
              transition="opacity"
            >
              <a
                href="https://zodiapps.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("footer.builtBy")}
              </a>
            </Text>
          </VStack>
        </Stack>
      </Box>
    </VStack>
  );
}
