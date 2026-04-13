import { YearSelector } from "@/components/YearSelector";
import {
  Box,
  HStack,
  Icon,
  Link,
  Stack,
  StackSeparator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { SiGithub } from "react-icons/si";
import { YearProvider, useYear } from "../context/YearContext";
import { getTranslation } from "../i18n/useTranslation";
import { alternateLocalePath, homeRouteTo } from "../lib/locale-paths";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RouterLink } from "./RouterLink";
import { SiteLogo } from "./SiteLogo";

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
            <RouterLink to={homeTo} style={{ textDecoration: "none" }}>
              <SiteLogo size="sm" siteTitle={t("site.title")} />
            </RouterLink>
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
          <RouterLink to={homeTo} style={{ textDecoration: "none" }}>
            <SiteLogo siteTitle={t("site.title")} />
          </RouterLink>
        </Box>
        {children}
      </Box>

      <Box as="footer" layerStyle="footer" w="full" mt="auto" py={12}>
        <Box maxW="7xl" mx="auto" w="full" px={{ base: 4, md: 6 }}>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="start"
            gap={8}
          >
            <VStack align="start" gap={4}>
              <RouterLink to={homeTo} style={{ textDecoration: "none" }}>
                <SiteLogo size="md" siteTitle={t("site.title")} />
              </RouterLink>
              <Text
                fontSize="sm"
                lineHeight="relaxed"
                color="fg.muted"
                maxW="sm"
              >
                {t("footer.tagline")}
              </Text>
              <Text color="fg.muted" fontSize="xs">
                © {new Date().getFullYear()} partifinansiering.se —{" "}
                <Text
                  asChild
                  color="fg.muted"
                  _hover={{ color: "fg" }}
                  transition="color"
                >
                  <Link
                    href="https://www.kammarkollegiet.se/vara-tjanster/insyn-i-partiers-finansiering/hitta-statistik-pa-redovisade-intakter/intaktsredovisningar-politiska-aktorer-2018-och-framat"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("footer.source")}
                  </Link>
                </Text>
              </Text>
              <Text color="fg.muted" fontSize="xs">
                {t("footer.dataUpdated", { date: "2026-03-28" })}
              </Text>
              <Text
                fontSize="xs"
                lineHeight="relaxed"
                color="fg.muted"
                maxW="md"
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
                color="fg.muted"
                _hover={{ color: "fg" }}
                transition="color"
              >
                <Link
                  href="https://statsbudget.se"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.budgetLink")}
                </Link>
              </Text>
              <HStack
                gap={4}
                separator={<StackSeparator borderColor="fg.muted" />}
                align="center"
                color="fg.muted"
                transition="color"
                _hover={{ color: "fg" }}
              >
                <Link
                  href="https://zodiapps.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                >
                  {t("footer.builtBy")}
                </Link>
                <Link
                  href="https://github.com/adamalfredsson/partifinansiering.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                >
                  <Icon
                    as={SiGithub}
                    boxSize={5}
                    flexShrink={0}
                    aria-label="GitHub"
                  />
                </Link>
              </HStack>
            </VStack>
          </Stack>
        </Box>
      </Box>
    </VStack>
  );
}
