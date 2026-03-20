import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useYear } from "../context/YearContext";
import metaData from "../data/generated/meta.json";
import orgsData from "../data/generated/organizations.json";
import partiesData from "../data/generated/parties.json";
import { PARTY_CONFIG } from "../data/parties-config";
import type { Organization, Party } from "../data/types";
import { getTranslation } from "../i18n/useTranslation";
import { formatMillions } from "../lib/format";
import { homeRouteTo } from "../lib/locale-paths";
import { OrganizationTable } from "./OrganizationTable";
import { PartyLogo } from "./PartyLogo";
import { RevenueBreakdown } from "./RevenueBreakdown";
import { RevenueTrend } from "./RevenueTrend";
import { YearSelector } from "./YearSelector";

const parties = partiesData as Party[];
const organizations = orgsData as Organization[];

export type PartyDetailPageProps = {
  lang: "sv" | "en";
  partySlug: string;
};

export function PartyDetailPage({ lang, partySlug }: PartyDetailPageProps) {
  const { t } = getTranslation(lang);
  const { selectedYear, setSelectedYear } = useYear();

  const party = parties.find((p) => p.slug === partySlug);
  if (!party) return <Text p={12}>Party not found.</Text>;

  const config = PARTY_CONFIG[party.slug];
  const partyColor = config?.color ?? "#73777f";
  const yearData = party.years.find((y) => y.year === selectedYear);
  const total = yearData?.total ?? 0;

  const prevYearData = party.years.find((y) => y.year === selectedYear - 1);
  const changePercent =
    prevYearData && prevYearData.total > 0
      ? ((total - prevYearData.total) / prevYearData.total) * 100
      : null;

  const revenueEntries = yearData
    ? Object.entries(yearData.revenue).sort(([, a], [, b]) => b - a)
    : [];
  const topSource = revenueEntries[0];

  const partyOrgs = organizations
    .filter((o) => o.partyId === party.id)
    .map((o) => ({
      ...o,
      yearTotal: o.years.find((y) => y.year === selectedYear)?.total ?? 0,
    }))
    .filter((o) => o.name.trim().length > 0 && o.yearTotal > 0)
    .sort((a, b) => b.yearTotal - a.yearTotal);

  const homeTo = homeRouteTo(lang);

  return (
    <>
      <HStack align="center" gap={2} mb={6}>
        <Text
          as="span"
          className="material-symbols-outlined"
          color="fg.subtle"
          fontSize="sm"
        >
          arrow_back
        </Text>
        <Text
          asChild
          textStyle="caption"
          color="fg.subtle"
          _hover={{ color: "fg" }}
        >
          <Link to={homeTo}>{t("party.back")}</Link>
        </Text>
      </HStack>

      <HStack align="center" gap={5} mb={8}>
        <PartyLogo slug={party.slug} size="lg" rounded="xl" />
        <Box>
          <Text
            as="h1"
            textStyle="hero"
            fontSize={{ base: "3xl", md: "4xl" }}
            color="fg"
          >
            {party.name}
          </Text>
        </Box>
      </HStack>

      <Box mb={10}>
        <YearSelector
          years={metaData.years}
          selected={selectedYear}
          onChange={setSelectedYear}
          label={t("year.select")}
          pb={4}
          mx={-6}
          px={6}
        />
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          lg: "minmax(0, 1fr) minmax(280px, 400px)",
        }}
        gap={{ base: 6, lg: 6 }}
        alignItems="start"
        mb={10}
      >
        <Box minW={0}>
          <RevenueBreakdown
            entries={revenueEntries}
            total={total}
            t={t}
            partyColor={partyColor}
          />
        </Box>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
          <Box layerStyle="heroCard" p={6}>
            <Text
              textStyle="microLabel"
              color="fg.inverted"
              opacity={0.7}
              mb={2}
            >
              {t("party.totalRevenue")}
            </Text>
            <Text textStyle="cardStat" color="fg.inverted">
              {formatMillions(total)}
            </Text>
          </Box>
          <Box layerStyle="surfaceCard" p={6}>
            <Text
              textStyle="microLabel"
              color="bg.emphasis"
              opacity={0.7}
              mb={2}
            >
              {t("party.yearOverYear")}
            </Text>
            <Text textStyle="cardStat" color="bg.emphasis">
              {changePercent !== null
                ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1).replace(".", ",")}%`
                : "—"}
            </Text>
          </Box>
          <Box layerStyle="surfaceCard" p={6}>
            <Text
              textStyle="microLabel"
              color="bg.emphasis"
              opacity={0.7}
              mb={2}
            >
              {t("party.orgCount")}
            </Text>
            <Text textStyle="cardStat" color="bg.emphasis">
              {partyOrgs.length}
            </Text>
          </Box>
          <Box layerStyle="surfaceCard" p={6}>
            <Text
              textStyle="microLabel"
              color="bg.emphasis"
              opacity={0.7}
              mb={2}
            >
              {t("party.topSource")}
            </Text>
            <Text textStyle="itemTitle" color="bg.emphasis">
              {topSource ? t(`revenue.${topSource[0]}`) : "—"}
            </Text>
          </Box>
        </Grid>
      </Grid>

      <OrganizationTable orgs={partyOrgs} year={selectedYear} t={t} />

      <Box mt={10}>
        <RevenueTrend
          party={party}
          years={metaData.years}
          selectedYear={selectedYear}
          t={t}
          partyColor={partyColor}
        />
      </Box>
    </>
  );
}
