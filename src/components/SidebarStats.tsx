import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { INCOME_COLORS } from "../data/parties-config";
import type { Party, RevenueGroup } from "../data/types";
import { formatMillions } from "../lib/format";
import { contrastingForegroundHex } from "../lib/relative-luminance";

interface Props {
  parties: Party[];
  year: number;
  revenueGroups: RevenueGroup[];
  t: (key: string) => string;
  locale: string;
}

export function SidebarStats({ parties, year, t, locale }: Props) {
  const yearTotals = parties.reduce(
    (acc, p) => {
      const yd = p.years.find((y) => y.year === year);
      if (!yd) return acc;
      acc.total += yd.total;
      for (const [key, amount] of Object.entries(yd.revenue)) {
        acc.byGroup[key] = (acc.byGroup[key] ?? 0) + amount;
      }
      return acc;
    },
    { total: 0, byGroup: {} as Record<string, number> },
  );

  const prevYear = year - 1;
  const prevTotal = parties.reduce((acc, p) => {
    const yd = p.years.find((y) => y.year === prevYear);
    return acc + (yd?.total ?? 0);
  }, 0);
  const changePercent =
    prevTotal > 0 ? ((yearTotals.total - prevTotal) / prevTotal) * 100 : 0;

  const topSources = Object.entries(yearTotals.byGroup)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalBillions = yearTotals.total / 1_000_000_000;

  return (
    <VStack gap={6} gridColumn={{ lg: "span 4" }} minW={0} align="stretch">
      {/* Total card */}
      <Box layerStyle="heroCard" p={8} minW={0}>
        <Text
          textStyle="label"
          fontSize="xs"
          opacity={0.7}
          letterSpacing="0.2em"
          mb={4}
          color="fg.inverted"
        >
          {t("sidebar.total")} {year}
        </Text>
        <Text textStyle="stat" color="fg.inverted" mb={2}>
          {totalBillions.toFixed(2).replace(".", ",")}
          <Text as="span" fontSize="2xl" fontWeight="bold" opacity={0.8}>
            {" "}
            {t("amount.billion")}
          </Text>
        </Text>
        {prevTotal > 0 && (
          <Text
            fontSize="sm"
            opacity={0.8}
            fontWeight="500"
            color="fg.inverted"
          >
            {locale === "sv"
              ? `En ${changePercent >= 0 ? "ökning" : "minskning"} med ${Math.abs(changePercent).toFixed(1).replace(".", ",")}% jämfört med föregående räkenskapsår.`
              : `A ${changePercent >= 0 ? "increase" : "decrease"} of ${Math.abs(changePercent).toFixed(1)}% compared to the previous fiscal year.`}
          </Text>
        )}
      </Box>

      {/* Top 3 sources */}
      <Box layerStyle="surfaceCard" p={8} minW={0}>
        <Text
          textStyle="sectionTitle"
          fontSize="lg"
          fontWeight="bold"
          color="bg.emphasis"
          mb={6}
        >
          {t("sidebar.topSources")}
        </Text>
        <VStack gap={6} align="stretch">
          {topSources.map(([key, amount], i) => {
            const pct = ((amount / yearTotals.total) * 100)
              .toFixed(1)
              .replace(".", ",");
            const chipBg = INCOME_COLORS[key] ?? "#73777f";
            return (
              <HStack key={key} align="start" gap={4} minW={0}>
                <HStack
                  bg={chipBg}
                  color={contrastingForegroundHex(chipBg)}
                  w={8}
                  h={8}
                  minW={8}
                  minH={8}
                  rounded="lg"
                  align="center"
                  justify="center"
                  fontSize="xs"
                  fontWeight="bold"
                  flexShrink={0}
                >
                  {String(i + 1).padStart(2, "0")}
                </HStack>
                <Box minW={0} flex={1}>
                  <Text textStyle="itemTitle" fontSize="sm">
                    {t(`revenue.${key}`)}
                  </Text>
                  <Text textStyle="caption" fontSize="xs" color="fg.muted">
                    {formatMillions(amount)} ({pct}%)
                  </Text>
                </Box>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    </VStack>
  );
}
