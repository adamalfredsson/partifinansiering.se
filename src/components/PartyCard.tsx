import { Box, HStack, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { PARTY_CONFIG } from "../data/parties-config";
import type { Party } from "../data/types";
import { formatAmount } from "../lib/format";
import { PartyLogo } from "./PartyLogo";

interface Props {
  party: Party;
  year: number;
  lang: string;
  label: string;
}

export function PartyCard({ party, year, lang, label }: Props) {
  const config = PARTY_CONFIG[party.slug];
  const yearData = party.years.find((y) => y.year === year);
  const total = yearData?.total ?? 0;
  const partyColor = config?.color ?? "#73777f";

  return (
    <LinkBox layerStyle="partyCard" p={6} display="block" role="group">
      <LinkOverlay asChild>
        <Link
          to="/$lang/parti/$partySlug"
          params={{ lang, partySlug: party.slug }}
        />
      </LinkOverlay>
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w="4px"
        bg={partyColor}
      />
      <HStack justify="space-between" align="start" mb={6}>
        <PartyLogo slug={party.slug} size="md" rounded="lg" />
        <Text
          as="span"
          className="material-symbols-outlined"
          color="fg.subtle"
          _groupHover={{ color: partyColor }}
          transition="color 0.15s"
        >
          arrow_forward
        </Text>
      </HStack>
      <Text textStyle="microLabel" color="fg.subtle" mb={1}>
        {label}
      </Text>
      <Text textStyle="cardStat" color="fg">
        {formatAmount(total)}
        <Text as="span" textStyle="suffix" color="fg.subtle">
          {" "}
          kr
        </Text>
      </Text>
    </LinkBox>
  );
}
