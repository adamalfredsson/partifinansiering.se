import { Chart, useChart } from "@chakra-ui/charts";
import { Box, HStack, Image, Text, Wrap } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { Bar, BarChart, BarStack, Tooltip, XAxis, YAxis } from "recharts";
import { INCOME_COLORS, PARTY_CONFIG } from "../data/parties-config";
import type { Party, PartyYear } from "../data/types";
import { formatMillions } from "../lib/format";

interface Props {
  parties: Party[];
  year: number;
  lang: "sv" | "en";
  t: (key: string) => string;
}

function partySlugFromBarClick(data: {
  payload?: unknown;
  slug?: unknown;
}): string | undefined {
  const fromPayload =
    data.payload &&
    typeof data.payload === "object" &&
    data.payload !== null &&
    "slug" in data.payload &&
    typeof (data.payload as { slug: unknown }).slug === "string"
      ? (data.payload as { slug: string }).slug
      : undefined;
  if (fromPayload) return fromPayload;
  return typeof data.slug === "string" ? data.slug : undefined;
}

export function PartyComparisonChart({ parties, year, lang, t }: Props) {
  const navigate = useNavigate();
  const partyData = parties
    .map((p) => {
      const yearData = p.years.find((y) => y.year === year);
      return { party: p, yearData };
    })
    .filter((d): d is { party: Party; yearData: PartyYear } => !!d.yearData)
    .sort((a, b) => b.yearData.total - a.yearData.total);

  const allKeys = Array.from(
    new Set(partyData.flatMap((d) => Object.keys(d.yearData.revenue))),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  const chartData = partyData.map(({ party, yearData }) => ({
    name: party.name,
    slug: party.slug,
    total: yearData.total,
    ...Object.fromEntries(
      Object.entries(yearData.revenue).filter(([, v]) => v > 0),
    ),
  }));

  const chart = useChart<Record<string, string | number>>({
    data: chartData,
    series: allKeys.map((key) => ({
      name: key,
      color: INCOME_COLORS[key] ?? "#73777f",
    })),
  });

  const handleBarClick = (data: unknown) => {
    const slug = partySlugFromBarClick(
      data as { payload?: unknown; slug?: unknown },
    );
    if (!slug) return;
    void navigate(
      lang === "en"
        ? { to: "/en/parti/$partySlug", params: { partySlug: slug } }
        : { to: "/parti/$partySlug", params: { partySlug: slug } },
    );
  };

  if (partyData.length === 0) {
    return (
      <Box layerStyle="card" p={{ base: 8, md: 12 }}>
        <Text textStyle="sectionTitle" color="fg" mb={2}>
          {t("chart.title")}
        </Text>
        <Text color="fg.muted" fontSize="sm">
          {t("chart.description")} {year}.
        </Text>
        <Text color="fg.subtle" mt={4}>
          Ingen data för valt år.
        </Text>
      </Box>
    );
  }

  return (
    <Box layerStyle="card" p={{ base: 8, md: 12 }}>
      <HStack justify="space-between" align="end" mb={10}>
        <Box>
          <Text textStyle="sectionTitle" color="fg" mb={2}>
            {t("chart.title")}
          </Text>
          <Text color="fg.muted" fontSize="sm" maxW="md">
            {t("chart.description")} {year}.
          </Text>
        </Box>
      </HStack>

      <Chart.Root chart={chart}>
        <BarChart
          data={chart.data}
          layout="vertical"
          margin={{ top: 4, right: 0, bottom: 4, left: 0 }}
          barCategoryGap={12}
          barSize={32}
          responsive
        >
          <XAxis type="number" hide />
          <Tooltip
            content={({ payload }) => (
              <Chart.Tooltip
                payload={payload}
                label={payload?.[0]?.payload?.name}
                showTotal
                formatter={(value, name) => [
                  formatMillions(Number(value)),
                  t(`revenue.${String(name)}`),
                ]}
              />
            )}
          />
          <YAxis
            type="category"
            dataKey="slug"
            width={40}
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={({ x, y, payload }) => {
              const slug = payload?.value as string;
              const config = PARTY_CONFIG[slug];
              const color = config?.color ?? "#73777f";
              const abbr = config?.abbr ?? "?";
              const icon = config?.icon;
              return (
                <g transform={`translate(${x},${y})`}>
                  <foreignObject x={-40} y={-20} width={40} height={40}>
                    <Box
                      w="full"
                      h="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      pr={1}
                    >
                      {icon ? (
                        <Image
                          src={icon}
                          w={{ base: 6, sm: 8 }}
                          h={{ base: 6, sm: 8 }}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          w={{ base: 8, sm: 10 }}
                          h={{ base: 5, sm: 6 }}
                          bg={color}
                          rounded="md"
                          color="white"
                          fontSize={{ base: "2xs", sm: "xs" }}
                          fontWeight="900"
                        >
                          {abbr}
                        </Box>
                      )}
                    </Box>
                  </foreignObject>
                </g>
              );
            }}
          />
          <BarStack stackId="revenue" radius={6}>
            {allKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={INCOME_COLORS[key] ?? "#73777f"}
                style={{ cursor: "pointer" }}
                onClick={handleBarClick}
              />
            ))}
          </BarStack>
        </BarChart>
      </Chart.Root>

      {/* Legend */}
      <Wrap
        mt={12}
        gapX={6}
        gapY={3}
        pt={8}
        borderTop="1px solid"
        borderColor="bg.muted"
      >
        {allKeys.map((key) => (
          <HStack key={key} align="center" gap={2}>
            <Box
              w={3}
              h={3}
              rounded="full"
              bg={INCOME_COLORS[key] ?? "#73777f"}
            />
            <Text textStyle="legend" color="fg.muted">
              {t(`revenue.${key}`)}
            </Text>
          </HStack>
        ))}
      </Wrap>
    </Box>
  );
}
