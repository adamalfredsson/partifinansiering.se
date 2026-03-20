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
      <Box layerStyle="card" p={{ base: 7, md: 10 }}>
        <Text textStyle="sectionTitle" color="fg" mb={3}>
          {t("party.revenueOverTime")}
        </Text>
        <Text color="fg.muted" fontSize="sm" mb={6} maxW="lg" lineHeight="1.65">
          {t("party.revenueOverTimeDescription")}
        </Text>
        <Text color="fg.subtle">Ingen data</Text>
      </Box>
    );
  }

  return (
    <Box layerStyle="card" p={{ base: 7, md: 10 }}>
      <Text textStyle="sectionTitle" color="fg" mb={3}>
        {t("party.revenueOverTime")}
      </Text>
      <Text color="fg.muted" fontSize="sm" mb={6} maxW="lg" lineHeight="1.65">
        {t("party.revenueOverTimeDescription")}
      </Text>

      <Chart.Root
        chart={chart}
        aspectRatio="auto"
        h={{ base: "228px", md: "288px" }}
        maxW="100%"
        mt={1}
        css={{
          "& .recharts-cartesian-axis-tick-value": {
            whiteSpace: "nowrap",
          },
        }}
      >
        <AreaChart
          data={chart.data}
          margin={{ top: 16, right: 20, left: 4, bottom: 14 }}
          responsive
        >
          <XAxis
            dataKey="year"
            type="number"
            domain={["dataMin", "dataMax"]}
            allowDecimals={false}
            ticks={chartData.map((d) => d.year)}
            interval={0}
            minTickGap={0}
            tickFormatter={(y) => String(y)}
            tick={{ fontSize: 12, style: { whiteSpace: "nowrap" } }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatMillions(v)}
            width={100}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              style: { whiteSpace: "nowrap" },
            }}
            tickMargin={8}
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
        mt={8}
        gapX={8}
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
