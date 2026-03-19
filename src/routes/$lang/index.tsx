import { Box, ClientOnly, Grid, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PartyCard } from "../../components/PartyCard";
import { PartyComparisonChart } from "../../components/PartyComparisonChart";
import { SidebarStats } from "../../components/SidebarStats";
import { YearSelector } from "../../components/YearSelector";
import metaData from "../../data/generated/meta.json";
import partiesData from "../../data/generated/parties.json";
import type { Party } from "../../data/types";
import { getTranslation } from "../../i18n/useTranslation";

const parties = partiesData as Party[];

export const Route = createFileRoute("/$lang/")({
  component: Dashboard,
});

function Dashboard() {
  const { lang } = Route.useParams();
  const { t, locale } = getTranslation(lang);
  const [selectedYear, setSelectedYear] = useState(
    metaData.years[metaData.years.length - 1],
  );

  return (
    <>
      {/* Hero Section */}
      <Box as="section" mb={12}>
        <Text
          as="h1"
          textStyle="hero"
          fontSize={{ base: "4xl", md: "5xl" }}
          color="fg"
          mb={8}
          maxW="2xl"
        >
          {t("site.description")}
        </Text>
        <YearSelector
          years={metaData.years}
          selected={selectedYear}
          onChange={setSelectedYear}
          label={t("year.select")}
        />
      </Box>

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
    </>
  );
}
