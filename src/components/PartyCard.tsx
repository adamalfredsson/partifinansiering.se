import { Box, HStack, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { PARTY_CONFIG } from "../data/parties-config";
import type { Party } from "../data/types";
import { getTranslation } from "../i18n/useTranslation";
import { formatAmount, formatKrPerVote } from "../lib/format";
import { RIKSDAG_2022_VOTES_BY_ABBR } from "../lib/riksdag-val-2022";
import { PartyLogo } from "./PartyLogo";

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

  return (
    <LinkBox layerStyle="partyCard" p={6} display="block" role="group">
      <LinkOverlay asChild>
        <Link
          aria-label={`${party.name} — ${label}`}
          {...(lang === "en"
            ? {
                to: "/en/parti/$partySlug",
                params: { partySlug: party.slug },
              }
            : {
                to: "/parti/$partySlug",
                params: { partySlug: party.slug },
              })}
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
          aria-hidden
          _groupHover={{ color: partyColor }}
          transition="color 0.15s"
        >
          arrow_forward
        </Text>
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
