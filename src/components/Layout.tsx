import { Box, Grid, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { YearProvider, useYear } from "../context/YearContext";
import { getTranslation } from "../i18n/useTranslation";
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
  const otherLang = lang === "sv" ? "en" : "sv";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const otherLangPath = pathname.replace(/^\/(sv|en)(?=\/|$)/, `/${otherLang}`);

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
            <Link
              to="/$lang"
              params={{ lang }}
              style={{ textDecoration: "none" }}
            >
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
            <Link
              to="/$lang"
              params={{ lang }}
              style={{ textDecoration: "none" }}
            >
              <SiteLogo size="md" siteTitle={t("site.title")} align="start" />
            </Link>
            <Text
              fontSize="sm"
              lineHeight="relaxed"
              color="fg.subtle"
              maxW="sm"
            >
              {lang === "sv"
                ? "En oberoende granskning av hur de politiska partierna finansieras. Baserat på officiell data från Kammarkollegiets Partiinsyn."
                : "An independent review of how political parties are financed. Based on official data from Kammarkollegiet's Partiinsyn."}
            </Text>
            <Text color="fg.subtle" fontSize="xs" opacity={0.7}>
              © 2024 partifinansiering.se — Data från Kammarkollegiets
              Partiinsyn
            </Text>
          </VStack>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gapX={12}
            gapY={4}
            fontSize="sm"
          >
            {[
              { to: "#", label: lang === "sv" ? "Metodologi" : "Methodology" },
              { to: "#", label: "API" },
              { to: "#", label: lang === "sv" ? "Kontakt" : "Contact" },
              { to: "#", label: "Press" },
            ].map(({ to, label }) => (
              <a key={label} href={to}>
                <Text
                  color="fg.subtle"
                  opacity={0.7}
                  _hover={{ opacity: 1 }}
                  transition="opacity"
                >
                  {label}
                </Text>
              </a>
            ))}
            <Text
              asChild
              color="fg.subtle"
              opacity={0.7}
              _hover={{ opacity: 1 }}
              transition="opacity"
              fontWeight="bold"
            >
              <Link to={otherLangPath}>SV/EN</Link>
            </Text>
          </Grid>
        </Stack>
      </Box>
    </VStack>
  );
}
