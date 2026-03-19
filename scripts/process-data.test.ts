import { describe, it, expect } from "vitest";
import { parseCsvLine, parseAmount, toSlug } from "./process-data";

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
    expect(row.amount).toBe(0);
  });

  it("parses a line with a non-zero amount", () => {
    const line =
      "2023\t802001-6545\tArbetarepartiet-Socialdemokraterna\t2\tArbetarepartiet-Socialdemokraterna\t\t\t\t\t\t\tJa\t\t\t1\tOffentligt stöd\t1.1\tStöd till partier\t\t168800000,00\t";
    const row = parseCsvLine(line);
    expect(row.year).toBe(2023);
    expect(row.partyId).toBe(2);
    expect(row.amount).toBe(168800000);
  });
});
