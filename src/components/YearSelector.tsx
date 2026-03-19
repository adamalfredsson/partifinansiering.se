import { Box, Flex, Text } from "@chakra-ui/react";

interface YearSelectorProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
  label: string;
}

export function YearSelector({
  years,
  selected,
  onChange,
  label,
}: YearSelectorProps) {
  return (
    <Flex wrap="wrap" align="center" gap={4} mb={12}>
      <Text textStyle="label" color="fg.subtle">
        {label}
      </Text>
      <Flex layerStyle="segmentGroup" p={1} gap={1}>
        {years.map((year) => {
          const isActive = year === selected;
          return (
            <Box
              as="button"
              key={year}
              onClick={() => onChange(year)}
              px={5}
              py={2}
              fontSize="sm"
              fontWeight={isActive ? "800" : "bold"}
              color={isActive ? "bg.emphasis" : "fg.subtle"}
              cursor="pointer"
              transition="all 0.15s"
              _hover={!isActive ? { color: "bg.emphasis" } : undefined}
              {...(isActive ? { layerStyle: "segmentActive" } : {})}
            >
              {year}
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}
