import { Box, Grid, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  lang?: string;
}

export function Layout({ children, lang = "sv" }: LayoutProps) {
  const otherLang = lang === "sv" ? "en" : "sv";

  return (
    <VStack align="stretch" minH="100vh" gap={0}>
      {/* TopAppBar */}
      <Box
        as="header"
        pos="fixed"
        top={0}
        w="full"
        zIndex={50}
        layerStyle="appBar"
      >
        <HStack
          justify="space-between"
          align="center"
          w="full"
          px={6}
          py={4}
          maxW="7xl"
          mx="auto"
        >
          <Text asChild textStyle="logo" color="bg.emphasis">
            <Link to="/$lang" params={{ lang }}>
              partifinansiering.se
            </Link>
          </Text>

          <HStack gap={8} display={{ base: "none", md: "flex" }}>
            <Text
              asChild
              textStyle="navActive"
              color="bg.emphasis"
              borderBottom="2px solid"
              borderColor="bg.emphasis"
              pb={1}
            >
              <Link to="/$lang" params={{ lang }}>
                {lang === "sv" ? "Översikt" : "Overview"}
              </Link>
            </Text>
            <Text
              asChild
              textStyle="navInactive"
              color="fg.subtle"
              _hover={{ color: "bg.emphasis" }}
              transition="colors"
            >
              <Link to="/$lang" params={{ lang }}>
                {lang === "sv" ? "Partier" : "Parties"}
              </Link>
            </Text>
            <a href="#">
              <Text
                textStyle="navInactive"
                color="fg.subtle"
                _hover={{ color: "bg.emphasis" }}
                transition="colors"
              >
                {lang === "sv" ? "Om" : "About"}
              </Text>
            </a>
          </HStack>

          <Text
            asChild
            textStyle="caption"
            fontWeight="bold"
            fontSize="sm"
            color="fg.muted"
            px={3}
            py={1}
            _hover={{ bg: "bg.surface" }}
            rounded="md"
            transition="all"
          >
            <Link to="/$lang" params={{ lang: otherLang }}>
              SV/EN
            </Link>
          </Text>
        </HStack>
      </Box>

      {/* Main content */}
      <Box
        as="main"
        flexGrow={1}
        pt={28}
        pb={20}
        px={6}
        maxW="7xl"
        mx="auto"
        w="full"
      >
        {children}
      </Box>

      {/* Mobile Bottom Nav */}
      <HStack
        as="nav"
        display={{ base: "flex", md: "none" }}
        pos="fixed"
        bottom={0}
        left={0}
        w="full"
        justify="space-around"
        align="center"
        px={4}
        pb={6}
        pt={2}
        zIndex={50}
        layerStyle="bottomNav"
      >
        <VStack
          asChild
          gap={0}
          color="bg.emphasis"
          bg="bg.surface"
          rounded="xl"
          px={4}
          py={1}
        >
          <Link to="/$lang" params={{ lang }}>
            <span className="material-symbols-outlined">dashboard</span>
            <Text textStyle="legend">
              {lang === "sv" ? "Översikt" : "Overview"}
            </Text>
          </Link>
        </VStack>
        <VStack asChild gap={0} color="fg.subtle" px={4} py={1}>
          <Link to="/$lang" params={{ lang }}>
            <span className="material-symbols-outlined">groups</span>
            <Text textStyle="legend">
              {lang === "sv" ? "Partier" : "Parties"}
            </Text>
          </Link>
        </VStack>
        <a href="#">
          <VStack gap={0} color="fg.subtle" px={4} py={1}>
            <span className="material-symbols-outlined">timeline</span>
            <Text textStyle="legend">
              {lang === "sv" ? "Historik" : "History"}
            </Text>
          </VStack>
        </a>
        <a href="#">
          <VStack gap={0} color="fg.subtle" px={4} py={1}>
            <span className="material-symbols-outlined">info</span>
            <Text textStyle="legend">{lang === "sv" ? "Om" : "About"}</Text>
          </VStack>
        </a>
      </HStack>

      {/* Footer */}
      <Box as="footer" layerStyle="footer" w="full" mt="auto" py={12} px={6}>
        <Stack
          maxW="7xl"
          mx="auto"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="start"
          gap={8}
        >
          <VStack align="start" gap={4}>
            <Text textStyle="itemTitle" color="bg.emphasis" fontSize="lg">
              partifinansiering.se
            </Text>
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
          </Grid>
        </Stack>
      </Box>
    </VStack>
  );
}
