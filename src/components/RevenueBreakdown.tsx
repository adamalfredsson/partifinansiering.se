import { Box, HStack, Text, VStack } from "@chakra-ui/react";
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
  const safeTotal = total > 0 ? total : 1;

  return (
    <Box layerStyle="card" p={{ base: 6, md: 8 }}>
      <VStack align="stretch" gap={5}>
        {entries.length === 0 ? (
          <Text color="fg.subtle">Ingen data</Text>
        ) : (
          entries.map(([key, amount]) => {
            const share = (amount / safeTotal) * 100;

            return (
              <Box key={key}>
                <HStack justify="space-between" align="end" mb={2} gap={4}>
                  <Text textStyle="itemTitle" color="fg">
                    {t(`revenue.${key}`)}
                  </Text>
                  <Text textStyle="caption" color="fg.subtle">
                    {formatMillions(amount)} ({share.toFixed(0)}%)
                  </Text>
                </HStack>
                <Box bg="white" borderRadius="full" h={3} overflow="hidden">
                  <Box
                    h="full"
                    bg={INCOME_COLORS[key] ?? partyColor}
                    borderRadius="full"
                    style={{ width: `${share}%` }}
                  />
                </Box>
              </Box>
            );
          })
        )}
      </VStack>
    </Box>
  );
}
