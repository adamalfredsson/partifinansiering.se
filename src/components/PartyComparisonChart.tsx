import * as ChakraCharts from "@chakra-ui/charts";
import { Box, Flex, Text, Wrap } from "@chakra-ui/react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { INCOME_COLORS } from "../data/parties-config";
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
    total: yearData.total,
    ...Object.fromEntries(
      Object.entries(yearData.revenue).filter(([, v]) => v > 0),
    ),
  }));

  const chart = ChakraCharts.useChart<Record<string, string | number>>({
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
      <Flex justify="space-between" align="end" mb={10}>
        <Box>
          <Text textStyle="sectionTitle" color="fg" mb={2}>
            {t("chart.title")}
          </Text>
          <Text color="fg.muted" fontSize="sm" maxW="md">
            {t("chart.description")} {year}.
          </Text>
        </Box>
      </Flex>

      <ChakraCharts.Chart.Root chart={chart}>
        <BarChart
          data={chart.data}
          layout="vertical"
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          barCategoryGap={12}
          barSize={32}
          responsive
        >
          <XAxis type="number" hide />
          <Tooltip
            content={
              <ChakraCharts.Chart.Tooltip
                formatter={(value, name) => [
                  formatMillions(Number(value)),
                  t(`revenue.${name}`),
                ]}
              />
            }
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fontSize: 14, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          {allKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="revenue"
              fill={INCOME_COLORS[key] ?? "#73777f"}
              radius={0}
              cursor="help"
            />
          ))}
        </BarChart>
      </ChakraCharts.Chart.Root>

      {/* Legend */}
      <Wrap
        mt={12}
        gapX={6}
        gapY={3}
        pt={8}
        borderTop="1px solid"
        borderColor="border.subtle"
      >
        {allKeys.map((key) => (
          <Flex key={key} align="center" gap={2}>
            <Box
              w={3}
              h={3}
              rounded="full"
              bg={INCOME_COLORS[key] ?? "#73777f"}
            />
            <Text textStyle="legend" color="fg.muted">
              {t(`revenue.${key}`)}
            </Text>
          </Flex>
        ))}
      </Wrap>
    </Box>
  );
}
