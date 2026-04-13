import { Box, HStack, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import { PARTY_CONFIG } from "../data/parties-config";
import type { Party } from "../data/types";
import { getTranslation } from "../i18n/useTranslation";
import { formatAmount, formatKrPerVote } from "../lib/format";
import { RIKSDAG_2022_VOTES_BY_ABBR } from "../lib/riksdag-val-2022";
import { PartyLogo } from "./PartyLogo";
import { RouterLink } from "./RouterLink";

interface Props {
  party: Party;
  year: number;
  lang: "sv" | "en";
  label: string;
}

export function PartyCard({ party, year, lang, label }: Props) {
  const { t } = getTranslation(lang);
  const config = PARTY_CONFIG[party.slug];
  const yearData = party.years.find((y) => y.year === year);
  const total = yearData?.total ?? 0;
  const partyColor = config?.color ?? "#73777f";
  const riksdagVotes =
    config?.abbr !== undefined
      ? (RIKSDAG_2022_VOTES_BY_ABBR[config.abbr] ?? null)
      : null;
  const revenuePerVoteKr =
    riksdagVotes !== null && riksdagVotes > 0 && total > 0
      ? total / riksdagVotes
      : null;

  const partyLinkProps =
    lang === "en"
      ? {
          to: "/en/parti/$partySlug" as const,
          params: { partySlug: party.slug },
        }
      : {
          to: "/parti/$partySlug" as const,
          params: { partySlug: party.slug },
        };

  return (
    <LinkBox layerStyle="partyCard" p={6} display="block" role="group">
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w="4px"
        bg={partyColor}
      />
      <HStack justify="space-between" align="start" mb={6}>
        <LinkOverlay asChild>
          <RouterLink
            aria-label={`${party.name} — ${label}`}
            {...partyLinkProps}
          >
            <PartyLogo slug={party.slug} size="md" rounded="lg" />
          </RouterLink>
        </LinkOverlay>
        <Box
          as={LuArrowRight}
          aria-hidden
          color="fg.subtle"
          boxSize={5}
          flexShrink={0}
          _groupHover={{ color: partyColor }}
          transition="color 0.15s"
        />
      </HStack>
      <Text textStyle="microLabel" color="fg.muted" mb={1}>
        {label}
      </Text>
      <Text textStyle="cardStat" color="fg">
        {formatAmount(total)}
        <Text as="span" textStyle="suffix" color="fg.muted">
          {" "}
          kr
        </Text>
      </Text>
      {revenuePerVoteKr !== null && (
        <Box mt={3}>
          <Text textStyle="microLabel" color="fg.muted" mb={1}>
            {t("party.revenuePerVote")}
          </Text>
          <Text textStyle="itemTitle" color="fg.muted">
            {formatKrPerVote(revenuePerVoteKr)}
          </Text>
        </Box>
      )}
    </LinkBox>
  );
}
