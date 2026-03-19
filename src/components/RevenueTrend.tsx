import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import type { Party } from "../data/types";
import { formatMillions } from "../lib/format";

interface RevenueTrendProps {
  party: Party;
  years: number[];
  t: (key: string) => string;
  partyColor: string;
}

export function RevenueTrend({
  party,
  years,
  t,
  partyColor,
}: RevenueTrendProps) {
  const series = years
    .map((year) => ({
      year,
      total: party.years.find((entry) => entry.year === year)?.total ?? 0,
    }))
    .filter((entry) => entry.total > 0);

  const maxTotal = Math.max(...series.map((entry) => entry.total), 1);

  return (
    <Box layerStyle="card" p={{ base: 6, md: 8 }}>
      <Text textStyle="sectionTitle" color="fg" mb={6}>
        {t("chart.title")}
      </Text>
      <VStack align="stretch" gap={4}>
        {series.map(({ year, total }) => (
          <Box key={year}>
            <HStack justify="space-between" align="end" mb={2} gap={4}>
              <Text textStyle="itemTitle" color="fg">
                {year}
              </Text>
              <Text textStyle="caption" color="fg.subtle">
                {formatMillions(total)}
              </Text>
            </HStack>
            <Box bg="white" borderRadius="full" h={3} overflow="hidden">
              <Box
                h="full"
                bg={partyColor}
                borderRadius="full"
                style={{ width: `${(total / maxTotal) * 100}%` }}
              />
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
