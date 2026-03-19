import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { Organization } from "../data/types";
import { formatMillions } from "../lib/format";

type OrganizationWithYearTotal = Organization & {
  yearTotal: number;
};

interface OrganizationTableProps {
  orgs: OrganizationWithYearTotal[];
  year: number;
  t: (key: string) => string;
}

export function OrganizationTable({ orgs, year, t }: OrganizationTableProps) {
  return (
    <Box layerStyle="card" p={{ base: 6, md: 8 }}>
      <Flex justify="space-between" align="end" gap={4} mb={6}>
        <Text textStyle="sectionTitle" color="fg">
          {t("party.orgCount")}
        </Text>
        <Text textStyle="caption" color="fg.subtle">
          {year}
        </Text>
      </Flex>

      <VStack align="stretch" gap={3}>
        {orgs.length === 0 ? (
          <Text color="fg.subtle">Ingen data</Text>
        ) : (
          orgs.map((org) => (
            <Flex
              key={org.orgNumber}
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={3}
              bg="white"
              borderRadius="xl"
              px={4}
              py={4}
            >
              <Box>
                <Text textStyle="itemTitle" color="fg">
                  {org.name}
                </Text>
                <Text textStyle="caption" color="fg.subtle">
                  {org.level}
                </Text>
              </Box>
              <Text textStyle="caption" color="fg.subtle">
                {formatMillions(org.yearTotal)}
              </Text>
            </Flex>
          ))
        )}
      </VStack>
    </Box>
  );
}
