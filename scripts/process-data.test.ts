import { describe, expect, it } from "vitest";
import {
  buildTopDonorsByYear,
  parseAmount,
  parseCsvLine,
  toSlug,
} from "./process-data";

describe("parseAmount", () => {
  it("parses Swedish decimal format", () => {
    expect(parseAmount("7619033,00")).toBe(7619033);
  });
  it("returns 0 for 0,00", () => {
    expect(parseAmount("0,00")).toBe(0);
  });
  it("returns 0 for empty string", () => {
    expect(parseAmount("")).toBe(0);
  });
});

describe("toSlug", () => {
  it("slugifies Swedish party names", () => {
    expect(toSlug("Arbetarepartiet-Socialdemokraterna")).toBe(
      "arbetarepartiet-socialdemokraterna",
    );
  });
  it("handles spaces and special chars", () => {
    expect(toSlug("Miljöpartiet de gröna")).toBe("miljopartiet-de-grona");
  });
});

describe("parseCsvLine", () => {
  it("parses a tab-separated line via Effect Schema", () => {
    const line =
      "2024\t802435-5664\tCommon Sense In Sweden\t1318\tCommon sense in Sweden\t\t\t\t\t\t\tJa\t\tJa\t1\tOffentligt stöd\t1.1\tStöd till partier som deltagit i val till riksdag\t\t0,00\t";
    const row = parseCsvLine(line);
    expect(row.year).toBe(2024);
    expect(row.orgNumber).toBe("802435-5664");
    expect(row.name).toBe("Common Sense In Sweden");
    expect(row.partyId).toBe(1318);
    expect(row.partyName).toBe("Common sense in Sweden");
    expect(row.isRiksniva).toBe(true);
    expect(row.isEU).toBe(true);
    expect(row.isKommunal).toBe(false);
    expect(row.revenueGroupCode).toBe(1);
    expect(row.revenueTypeCode).toBe("1.1");
    expect(row.revenueTypeDescription).toBe("");
    expect(row.amount).toBe(0);
  });

  it("parses a line with a non-zero amount", () => {
    const line =
      "2023\t802001-6545\tArbetarepartiet-Socialdemokraterna\t2\tArbetarepartiet-Socialdemokraterna\t\t\t\t\t\t\tJa\t\t\t1\tOffentligt stöd\t1.1\tStöd till partier\t\t168800000,00\t";
    const row = parseCsvLine(line);
    expect(row.year).toBe(2023);
    expect(row.partyId).toBe(2);
    expect(row.revenueTypeDescription).toBe("");
    expect(row.amount).toBe(168800000);
  });

  it("parses Intäktstyp beskrivning (column 18)", () => {
    const line =
      "2024\t864500-9831\tLiberalerna Borås\t3\tLiberalerna\tJa\t1490\tBorås\t\t\t\t\t\t\t5\tBidrag\t5.7\tÖvriga bidrag över 28 650 kronor\tFreja 8 (764500-1988) Pengar\t125000,00";
    const row = parseCsvLine(line);
    expect(row.revenueTypeCode).toBe("5.7");
    expect(row.revenueTypeDescription).toBe("Freja 8 (764500-1988) Pengar");
    expect(row.amount).toBe(125000);
  });
});

describe("buildTopDonorsByYear", () => {
  it("keeps top 10 by amount for riksdag group-5 large donation rows", () => {
    const base =
      "2024\t802000-0000\tTestorg\t2\tArbetarepartiet-Socialdemokraterna\t\t\t\t\t\t\tJa\t\tJa\t";
    const rows = Array.from({ length: 12 }, (_, i) =>
      parseCsvLine(
        `${base}5\tBidrag\t5.4\tPrivat över tröskel\tBidrag ${i}\t${(12 - i) * 1000},00`,
      ),
    );
    const byYear = buildTopDonorsByYear(rows, [2024]);
    expect(byYear["2024"]).toHaveLength(10);
    expect(byYear["2024"][0].amount).toBe(12000);
    expect(byYear["2024"][9].amount).toBe(3000);
  });

  it("returns empty arrays for years with no qualifying rows", () => {
    const byYear = buildTopDonorsByYear([], [2020, 2021]);
    expect(byYear["2020"]).toEqual([]);
    expect(byYear["2021"]).toEqual([]);
  });

  it("excludes anonymous Privat bidrag rows from the ranking", () => {
    const base =
      "2024\t802000-0000\tTestorg\t2\tArbetarepartiet-Socialdemokraterna\t\t\t\t\t\t\tJa\t\tJa\t";
    const anonymous = parseCsvLine(
      `${base}5\tBidrag\t5.4\tPrivat över tröskel\tPrivat bidrag Pengar\t999999,00`,
    );
    const named = parseCsvLine(
      `${base}5\tBidrag\t5.4\tPrivat över tröskel\tAcme AB (556000-0000) Pengar\t1000,00`,
    );
    const byYear = buildTopDonorsByYear([anonymous, named], [2024]);
    expect(byYear["2024"]).toHaveLength(1);
    expect(byYear["2024"][0].donorLabel).toBe("Acme AB (556000-0000) Pengar");
    expect(byYear["2024"][0].amount).toBe(1000);
  });
});
