import { Box, Stack, Table, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Organization } from "../data/types";
import { formatAmount } from "../lib/format";

const INITIAL_ROW_COUNT = 10;

type OrganizationWithYearTotal = Organization & {
  yearTotal: number;
};

type Trend = "up" | "down" | "flat";

interface OrganizationTableProps {
  orgs: OrganizationWithYearTotal[];
  year: number;
  t: (key: string) => string;
}

/** Title-case each word (sv-SE) so kommuner, regioner and nivåer read consistently. */
function toLocationTitleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const first = word.charAt(0).toLocaleUpperCase("sv-SE");
      const rest = word.slice(1).toLocaleLowerCase("sv-SE");
      return first + rest;
    })
    .join(" ");
}

function orgLocationLabel(
  org: Organization,
  t: (key: string) => string,
): string {
  let raw: string;
  if (org.municipality) raw = org.municipality;
  else if (org.region) raw = org.region;
  else if (org.level === "kommunal") raw = t("party.level.kommunal");
  else if (org.level === "regional") raw = t("party.level.regional");
  else {
    const key = `party.level.${org.level}`;
    const translated = t(key);
    raw = translated === key ? org.level : translated;
  }
  return toLocationTitleCase(raw);
}

function trendForOrg(org: OrganizationWithYearTotal, year: number): Trend {
  const prev = org.years.find((y) => y.year === year - 1)?.total;
  if (prev === undefined) return "flat";
  if (org.yearTotal > prev) return "up";
  if (org.yearTotal < prev) return "down";
  return "flat";
}

export function OrganizationTable({ orgs, year, t }: OrganizationTableProps) {
  const [showAll, setShowAll] = useState(false);

  const rows = useMemo(
    () =>
      orgs.map((org) => ({
        org,
        location: orgLocationLabel(org, t),
        trend: trendForOrg(org, year),
      })),
    [orgs, year, t],
  );

  const visibleRows = showAll ? rows : rows.slice(0, INITIAL_ROW_COUNT);
  const hasMore = rows.length > INITIAL_ROW_COUNT;

  const headingId = "local-orgs-heading";

  return (
    <Box
      as="section"
      layerStyle="card"
      p={{ base: 6, md: 8 }}
      minW={0}
      maxW="100%"
    >
      <Text id={headingId} as="h2" textStyle="sectionTitle" color="fg" mb={6}>
        {t("party.localOrgs")}
      </Text>

      {rows.length === 0 ? (
        <Text color="fg.subtle">{t("party.orgEmpty")}</Text>
      ) : (
        <Stack gap={0} minW={0}>
          <Box
            borderRadius="xl"
            overflow="hidden"
            bg="bg.muted"
            borderWidth="1px"
            borderColor="bg.muted"
            minW={0}
          >
            <Box
              overflowX="auto"
              minW={0}
              w="full"
              overscrollBehaviorX="contain"
            >
              <Table.Root
                aria-labelledby={headingId}
                variant="dataCardQuad"
                size="md"
                tableLayout="auto"
                css={{
                  width: "max-content",
                  minWidth: "100%",
                }}
              >
                <Table.ColumnGroup>
                  <Table.Column minW="min(12rem, 40vw)" />
                  <Table.Column minW="min(9rem, 36vw)" />
                  <Table.Column minW="9rem" />
                  <Table.Column minW="3rem" />
                </Table.ColumnGroup>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>
                      {t("party.orgName")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      {t("party.orgColumnLocation")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      {t("party.orgColumnAmount")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                      {t("party.orgColumnTrend")}
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {visibleRows.map(({ org, location, trend }) => (
                    <Table.Row
                      key={`${org.partyId}-${org.orgNumber || org.name}`}
                    >
                      <Table.Cell>
                        <Text textStyle="tableCellPrimary">{org.name}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text textStyle="tableCellSecondary">{location}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text textStyle="tableCellAmount">
                          {formatAmount(org.yearTotal)} {t("amount.suffix")}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <TrendIcon trend={trend} t={t} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
            {hasMore ? (
              <Box
                as="button"
                w="full"
                bg="white"
                borderTopWidth="1px"
                borderTopColor="bg.muted"
                py={4}
                px={4}
                cursor="pointer"
                onClick={() => setShowAll((s) => !s)}
                _hover={{ bg: "brand.50" }}
              >
                <Text
                  textAlign="center"
                  fontWeight="semibold"
                  color="fg.muted"
                  fontSize="sm"
                >
                  {showAll ? t("party.showLess") : t("party.orgShowMore")}
                </Text>
              </Box>
            ) : null}
          </Box>
        </Stack>
      )}
    </Box>
  );
}

function TrendIcon({ trend, t }: { trend: Trend; t: (key: string) => string }) {
  if (trend === "flat") {
    return (
      <Text
        as="span"
        color="fg.subtle"
        fontSize="lg"
        fontWeight="medium"
        lineHeight={1}
        aria-label={t("party.trend.flat")}
      >
        —
      </Text>
    );
  }
  const icon = trend === "up" ? "north_east" : "south_east";
  return (
    <Text
      as="span"
      className="material-symbols-outlined"
      color={trend === "up" ? "green.600" : "income.5"}
      fontSize="xl"
      lineHeight={1}
      aria-label={trend === "up" ? t("party.trend.up") : t("party.trend.down")}
    >
      {icon}
    </Text>
  );
}
