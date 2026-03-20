import { Box, Center, Table, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { TopDonorEntry } from "../data/types";
import { formatAmount } from "../lib/format";
import { PartyLogo } from "./PartyLogo";

interface Props {
  year: number;
  entries: TopDonorEntry[];
  lang: "sv" | "en";
  t: (key: string) => string;
}

export function TopDonorsCard({ year, entries, lang, t }: Props) {
  const title = t("topDonors.title").replace("{year}", String(year));
  const headingId = "top-donors-heading";

  return (
    <Box as="section" layerStyle="card" p={{ base: 6, md: 8 }}>
      <Text id={headingId} textStyle="sectionTitle" color="fg" mb={3}>
        {title}
      </Text>
      <Text fontSize="sm" color="fg.muted" mb={2} lineHeight="tall">
        {t("topDonors.intro")}
      </Text>
      <Text textStyle="caption" color="fg.subtle" mb={6}>
        {t("topDonors.note")}
      </Text>

      {entries.length === 0 ? (
        <Text color="fg.subtle">{t("topDonors.empty")}</Text>
      ) : (
        <Box
          borderRadius="xl"
          overflow="hidden"
          bg="bg.muted"
          borderWidth="1px"
          borderColor="bg.muted"
          minW={0}
        >
          <Table.Root
            aria-labelledby={headingId}
            native
            variant="dataCard"
            size="md"
            w="full"
            tableLayout="fixed"
          >
            <colgroup>
              <col style={{ minWidth: 0 }} />
              <col style={{ width: "3.5rem" }} />
              <col style={{ width: "min(9rem, 32vw)", minWidth: 0 }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{t("topDonors.columnDonor")}</th>
                <th scope="col">{t("topDonors.columnParty")}</th>
                <th scope="col">{t("topDonors.columnAmount")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((row, i) => (
                <tr
                  key={`${row.partyId}-${row.recipientName}-${row.amount}-${i}`}
                >
                  <td>
                    <Text textStyle="tableCellPrimary">{row.donorLabel}</Text>
                  </td>
                  <td>
                    <Center w="full">
                      <Link
                        {...(lang === "en"
                          ? {
                              to: "/en/parti/$partySlug",
                              params: { partySlug: row.partySlug },
                            }
                          : {
                              to: "/parti/$partySlug",
                              params: { partySlug: row.partySlug },
                            })}
                        aria-label={row.partyName}
                        style={{
                          display: "inline-flex",
                          borderRadius: "0.5rem",
                          textDecoration: "none",
                        }}
                      >
                        <PartyLogo
                          slug={row.partySlug}
                          size="sm"
                          rounded="lg"
                        />
                      </Link>
                    </Center>
                  </td>
                  <td>
                    <Text textStyle="tableCellAmount">
                      {formatAmount(row.amount)} {t("amount.suffix")}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
