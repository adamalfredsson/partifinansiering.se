import {
  Box,
  HStack,
  NativeSelectField,
  NativeSelectIndicator,
  NativeSelectRoot,
  Text,
} from "@chakra-ui/react";
import type { ComponentProps } from "react";

export type YearSelectorProps = Omit<
  ComponentProps<typeof HStack>,
  "children" | "onChange"
> & {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
  /** When set, shown as uppercase label to the left of the segment group */
  label?: string;
};

export function YearSelector({
  years,
  selected,
  onChange,
  label,
  wrap = "wrap",
  gap = 4,
  ...rootProps
}: YearSelectorProps) {
  return (
    <HStack
      wrap={wrap}
      gap={gap}
      align="center"
      w={{ base: "full", md: "auto" }}
      minW={0}
      {...rootProps}
    >
      {label ? (
        <Text textStyle="label" color="fg.muted" flexShrink={0}>
          {label}
        </Text>
      ) : null}
      <Box display={{ base: "none", md: "block" }} flexShrink={0} minW={0}>
        <HStack layerStyle="segmentGroup" p={1} gap={1}>
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
                color={isActive ? "bg.emphasis" : "fg.muted"}
                cursor="pointer"
                transition="all 0.15s"
                _hover={!isActive ? { color: "bg.emphasis" } : undefined}
                {...(isActive ? { layerStyle: "segmentActive" } : {})}
              >
                {year}
              </Box>
            );
          })}
        </HStack>
      </Box>
      <NativeSelectRoot
        display={{ base: "flex", md: "none" }}
        flex={{ base: "1 1 auto", md: "unset" }}
        minW={0}
        maxW={{ base: "100%", md: "unset" }}
        size="md"
        variant="outline"
      >
        <NativeSelectField
          value={String(selected)}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          borderRadius="xl"
          borderColor="brand.400"
          _focusVisible={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </NativeSelectField>
        <NativeSelectIndicator />
      </NativeSelectRoot>
    </HStack>
  );
}
