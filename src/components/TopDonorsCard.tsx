import { Box, Center, Table, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { TopDonorEntry } from "../data/types";
import { formatAmount } from "../lib/format";
import { PartyLogo } from "./PartyLogo";

interface Props {
  year: number;
  entries: TopDonorEntry[];
  lang: string;
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
            variant="dataCard"
            size="md"
            w="full"
            tableLayout="fixed"
          >
            <Table.ColumnGroup>
              <Table.Column minW={0} />
              <Table.Column width="3.5rem" />
              <Table.Column width="min(9rem, 32vw)" minW={0} />
            </Table.ColumnGroup>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  {t("topDonors.columnDonor")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("topDonors.columnParty")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("topDonors.columnAmount")}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {entries.map((row, i) => (
                <Table.Row
                  key={`${row.partyId}-${row.recipientName}-${row.amount}-${i}`}
                >
                  <Table.Cell>
                    <Text textStyle="tableCellPrimary">{row.donorLabel}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Center w="full">
                      <Link
                        to="/$lang/parti/$partySlug"
                        params={{ lang, partySlug: row.partySlug }}
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
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="tableCellAmount">
                      {formatAmount(row.amount)} {t("amount.suffix")}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
