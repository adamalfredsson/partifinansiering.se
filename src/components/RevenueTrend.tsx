import { Chart, useChart } from "@chakra-ui/charts";
import { Box, HStack, Text, Wrap } from "@chakra-ui/react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INCOME_COLORS } from "../data/parties-config";
import type { Party } from "../data/types";
import { formatMillions } from "../lib/format";

interface RevenueTrendProps {
  party: Party;
  years: number[];
  selectedYear?: number;
  t: (key: string) => string;
  partyColor: string;
}

export function RevenueTrend({
  party,
  years,
  selectedYear,
  t,
  partyColor,
}: RevenueTrendProps) {
  const yearSet = new Set(years);
  const seriesYears = party.years
    .filter((yd) => yearSet.has(yd.year))
    .sort((a, b) => a.year - b.year);

  const allKeys = Array.from(
    new Set(seriesYears.flatMap((yd) => Object.keys(yd.revenue))),
  ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const chartData: Record<string, number>[] = seriesYears.map((yd) => ({
    year: yd.year,
    total: yd.total,
    ...Object.fromEntries(
      allKeys.map((key) => [key, yd.revenue[key] ?? 0] as const),
    ),
  }));

  const hasAnyData =
    allKeys.length > 0 && chartData.some((row) => row.total > 0);

  const chart = useChart<Record<string, number>>({
    data: chartData,
    series: allKeys.map((key) => ({
      name: key,
      color: INCOME_COLORS[key] ?? partyColor,
    })),
  });

  if (!hasAnyData) {
    return (
      <Box layerStyle="card" p={{ base: 6, md: 8 }}>
        <Text textStyle="sectionTitle" color="fg" mb={2}>
          {t("party.revenueOverTime")}
        </Text>
        <Text color="fg.muted" fontSize="sm" mb={4} maxW="lg">
          {t("party.revenueOverTimeDescription")}
        </Text>
        <Text color="fg.subtle">Ingen data</Text>
      </Box>
    );
  }

  return (
    <Box layerStyle="card" p={{ base: 6, md: 8 }}>
      <Text textStyle="sectionTitle" color="fg" mb={2}>
        {t("party.revenueOverTime")}
      </Text>
      <Text color="fg.muted" fontSize="sm" mb={4} maxW="lg">
        {t("party.revenueOverTimeDescription")}
      </Text>

      <Chart.Root
        chart={chart}
        aspectRatio="auto"
        h={{ base: "200px", md: "240px" }}
        maxW="100%"
        css={{
          "& .recharts-cartesian-axis-tick-value": {
            whiteSpace: "nowrap",
          },
        }}
      >
        <AreaChart
          data={chart.data}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          responsive
        >
          <XAxis
            dataKey="year"
            type="number"
            domain={["dataMin", "dataMax"]}
            allowDecimals={false}
            tickFormatter={(y) => String(y)}
            tick={{ fontSize: 12, style: { whiteSpace: "nowrap" } }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatMillions(v)}
            width={92}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              style: { whiteSpace: "nowrap" },
            }}
          />
          <Tooltip
            content={({ payload }) => (
              <Chart.Tooltip
                payload={payload}
                label={String(payload?.[0]?.payload?.year ?? "")}
                showTotal
                formatter={(value, name) => [
                  formatMillions(Number(value)),
                  t(`revenue.${String(name)}`),
                ]}
              />
            )}
          />
          {selectedYear != null &&
            chartData.some((d) => d.year === selectedYear) && (
              <ReferenceLine
                x={selectedYear}
                stroke={partyColor}
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
          {allKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="revenue"
              stroke={INCOME_COLORS[key] ?? partyColor}
              fill={INCOME_COLORS[key] ?? partyColor}
              strokeWidth={1}
            />
          ))}
        </AreaChart>
      </Chart.Root>

      <Wrap
        mt={6}
        gapX={6}
        gapY={2}
        pt={6}
        borderTop="1px solid"
        borderColor="bg.muted"
      >
        {allKeys.map((key) => (
          <HStack key={key} align="center" gap={2}>
            <Box
              w={3}
              h={3}
              rounded="full"
              bg={INCOME_COLORS[key] ?? partyColor}
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
