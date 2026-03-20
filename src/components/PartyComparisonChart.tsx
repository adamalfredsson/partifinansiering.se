import { Chart, useChart } from "@chakra-ui/charts";
import { Box, HStack, Text, Wrap } from "@chakra-ui/react";
import { Bar, BarChart, BarStack, Tooltip, XAxis, YAxis } from "recharts";
import { INCOME_COLORS, PARTY_CONFIG } from "../data/parties-config";
import type { Party, PartyYear } from "../data/types";
import { formatMillions } from "../lib/format";

interface Props {
  parties: Party[];
  year: number;
  t: (key: string) => string;
}

export function PartyComparisonChart({ parties, year, t }: Props) {
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
            tick={({ x, y, payload }) => {
              const slug = payload?.value as string;
              const config = PARTY_CONFIG[slug];
              const color = config?.color ?? "#73777f";
              const abbr = config?.abbr ?? "?";
              const icon = config?.icon;
              const size = 32;
              return (
                <g transform={`translate(${x},${y})`}>
                  {icon ? (
                    <image
                      href={icon}
                      x={-size}
                      y={-size / 2}
                      width={size}
                      height={size}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  ) : (
                    <foreignObject x={-40} y={-12} width={40} height={24}>
                      <Box
                        as="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w={10}
                        h={6}
                        bg={color}
                        rounded="md"
                        color="white"
                        fontSize="xs"
                        fontWeight="900"
                      >
                        {abbr}
                      </Box>
                    </foreignObject>
                  )}
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
