import { Chart, useChart } from "@chakra-ui/charts";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { INCOME_COLORS } from "../data/parties-config";
import { formatMillions } from "../lib/format";

interface RevenueBreakdownProps {
  entries: Array<[string, number]>;
  total: number;
  t: (key: string) => string;
  partyColor: string;
}

export function RevenueBreakdown({
  entries,
  total,
  t,
  partyColor,
}: RevenueBreakdownProps) {
  const data = useMemo(
    () =>
      entries
        .filter(([, amount]) => amount > 0)
        .map(([key, amount]) => ({
          name: key,
          value: amount,
          label: t(`revenue.${key}`),
        })),
    [entries, t],
  );

  const chart = useChart<Record<string, string | number>>({
    data,
    series: data.map((d) => ({
      name: d.name,
      color: INCOME_COLORS[d.name] ?? partyColor,
      label: d.label,
    })),
  });

  const safeTotal = total > 0 ? total : 1;

  if (data.length === 0) {
    return (
      <Box layerStyle="card" p={{ base: 6, md: 8 }}>
        <Text color="fg.subtle">Ingen data</Text>
      </Box>
    );
  }

  return (
    <Box layerStyle="card" p={{ base: 6, md: 8 }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={{ base: 8, md: 10 }}
        align={{ base: "stretch", md: "center" }}
      >
        <Box
          position="relative"
          w="full"
          maxW={{ base: "280px", md: "240px" }}
          mx={{ base: "auto", md: "0" }}
          flexShrink={0}
        >
          <Chart.Root chart={chart} aspectRatio="1" w="full" maxH="280px">
            <PieChart
              responsive
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <Tooltip
                content={({ payload }) => (
                  <Chart.Tooltip
                    payload={payload}
                    label={payload?.[0]?.payload?.label}
                    formatter={(value) => formatMillions(Number(value))}
                  />
                )}
              />
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={2}
              >
                {chart.data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={chart.color(INCOME_COLORS[d.name] ?? partyColor)}
                  />
                ))}
              </Pie>
            </PieChart>
          </Chart.Root>
          <Stack
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            pointerEvents="none"
          >
            <Text
              textStyle="sectionTitle"
              color="fg"
              fontSize="xl"
              lineHeight="shorter"
              textAlign="center"
            >
              {formatMillions(total)}
            </Text>
          </Stack>
        </Box>

        <Stack gap={4} flex="1" justify="center">
          {data.map((d) => {
            const share = (d.value / safeTotal) * 100;
            return (
              <HStack
                key={d.name}
                justify="space-between"
                align="start"
                gap={4}
              >
                <HStack gap={2} align="center" minW={0}>
                  <Box
                    w={3}
                    h={3}
                    rounded="full"
                    flexShrink={0}
                    bg={INCOME_COLORS[d.name] ?? partyColor}
                  />
                  <Text textStyle="itemTitle" color="fg">
                    {d.label}
                  </Text>
                </HStack>
                <Text textStyle="caption" color="fg.subtle" flexShrink={0}>
                  {formatMillions(d.value)} ({share.toFixed(0)}%)
                </Text>
              </HStack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
