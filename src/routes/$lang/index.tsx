import { Box, ClientOnly, Grid, Stack, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { PartyCard } from "../../components/PartyCard";
import { PartyComparisonChart } from "../../components/PartyComparisonChart";
import { SidebarStats } from "../../components/SidebarStats";
import { SiteLogo } from "../../components/SiteLogo";
import { TopDonorsCard } from "../../components/TopDonorsCard";
import { YearSelector } from "../../components/YearSelector";
import { useYear } from "../../context/YearContext";
import metaData from "../../data/generated/meta.json";
import partiesData from "../../data/generated/parties.json";
import topDonorsData from "../../data/generated/top-donors.json";
import type { Party, TopDonorsByYear } from "../../data/types";
import { getTranslation } from "../../i18n/useTranslation";

const parties = partiesData as Party[];
const topDonorsByYear = topDonorsData as TopDonorsByYear;

export const Route = createFileRoute("/$lang/")({
  component: Dashboard,
});

function Dashboard() {
  const { lang } = Route.useParams();
  const { t, locale } = getTranslation(lang);
  const { selectedYear, setSelectedYear } = useYear();

  return (
    <>
      {/* Hero Section */}
      <Box as="section">
        <Stack align="start" gap={{ base: 5, md: 12 }} mb={8} maxW="2xl">
          <SiteLogo siteTitle={t("site.title")} />
          <Text
            as="h1"
            textStyle="hero"
            fontSize={{ base: "4xl", md: "5xl" }}
            color="fg"
          >
            {t("site.description")}
          </Text>
        </Stack>
      </Box>
      <YearSelector
        years={metaData.years}
        selected={selectedYear}
        onChange={setSelectedYear}
        label={t("year.select")}
        pb={4}
        mx={-6}
        px={6}
      />

      {/* Main Content Grid */}
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }}
        gap={10}
        alignItems="start"
      >
        <Box gridColumn={{ lg: "span 8" }}>
          <ClientOnly
            fallback={
              <Box layerStyle="card" p={{ base: 8, md: 12 }} minH="400px" />
            }
          >
            <PartyComparisonChart parties={parties} year={selectedYear} t={t} />
          </ClientOnly>
        </Box>
        <SidebarStats
          parties={parties}
          year={selectedYear}
          revenueGroups={metaData.revenueGroups}
          t={t}
          locale={locale}
        />
      </Grid>

      {/* Party Grid */}
      <Box as="section" mt={20}>
        <Text as="h2" textStyle="sectionTitle" color="fg" mb={8}>
          {t("partyOverview.title")}
        </Text>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {parties
            .map((p) => ({
              party: p,
              total: p.years.find((y) => y.year === selectedYear)?.total ?? 0,
            }))
            .sort((a, b) => b.total - a.total)
            .map(({ party }) => (
              <PartyCard
                key={party.id}
                party={party}
                year={selectedYear}
                lang={lang}
                label={t("party.total")}
              />
            ))}
        </Grid>
      </Box>

      <Box mt={16}>
        <TopDonorsCard
          year={selectedYear}
          entries={topDonorsByYear[String(selectedYear)] ?? []}
          lang={lang}
          t={t}
        />
      </Box>
    </>
  );
}
