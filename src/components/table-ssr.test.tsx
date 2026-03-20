import { ChakraProvider } from "@chakra-ui/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { system } from "../theme";
import { OrganizationTable } from "./OrganizationTable";
import { TopDonorsCard } from "./TopDonorsCard";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

function getRenderedTable(html: string): string {
  const match = html.match(/<table[\s\S]*<\/table>/);
  return match?.[0] ?? "";
}

describe("table SSR markup", () => {
  it("does not inject style tags into table-only structural elements", () => {
    const html = renderToStaticMarkup(
      <ChakraProvider value={system}>
        <OrganizationTable
          orgs={[
            {
              orgNumber: "1",
              name: "Test Org",
              slug: "test-org",
              partyId: 1,
              level: "kommunal",
              municipality: "stockholm",
              years: [
                { year: 2023, revenue: {}, total: 100 },
                { year: 2024, revenue: {}, total: 200 },
              ],
              yearTotal: 200,
            },
          ]}
          year={2024}
          t={(key) => key}
        />
      </ChakraProvider>,
    );

    expect(getRenderedTable(html)).not.toMatch(
      /<(colgroup|thead|tbody|tr)\b[^>]*>\s*<style\b/,
    );
  });

  it("keeps TopDonorsCard structural table markup free of injected styles", () => {
    const html = renderToStaticMarkup(
      <ChakraProvider value={system}>
        <TopDonorsCard
          year={2024}
          lang="sv"
          t={(key) => key}
          entries={[
            {
              amount: 500000,
              donorLabel: "Test Donor",
              recipientName: "Test Recipient",
              partyId: 1,
              partySlug: "socialdemokraterna",
              partyName: "Socialdemokraterna",
            },
          ]}
        />
      </ChakraProvider>,
    );

    expect(getRenderedTable(html)).not.toMatch(
      /<(colgroup|thead|tbody|tr)\b[^>]*>\s*<style\b/,
    );
  });
});
