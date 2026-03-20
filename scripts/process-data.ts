import { Schema } from "effect";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Meta,
  Organization,
  Party,
  PartyYear,
  RevenueGroup,
  TopDonorEntry,
} from "../src/data/types";

// ── Constants ──────────────────────────────────────────────────────────

const RIKSDAG_PARTY_IDS = new Set([1, 2, 3, 4, 5, 55, 68, 110]);

const LARGE_DONATION_TYPE_CODES = new Set(["5.4", "5.7"]);

const PARTY_DISPLAY_NAMES: Record<number, string> = {
  1: "Moderaterna",
  2: "Socialdemokraterna",
  3: "Liberalerna",
  4: "Centerpartiet",
  5: "Vänsterpartiet",
  55: "Miljöpartiet",
  68: "Kristdemokraterna",
  110: "Sverigedemokraterna",
};

const REVENUE_GROUPS: RevenueGroup[] = [
  { code: 1, nameSv: "Offentligt stöd", nameEn: "Public funding" },
  { code: 2, nameSv: "Medlemsavgifter", nameEn: "Membership fees" },
  { code: 3, nameSv: "Försäljning och lotterier", nameEn: "Sales & lotteries" },
  { code: 4, nameSv: "Insamling av kontanter", nameEn: "Cash collections" },
  { code: 5, nameSv: "Bidrag", nameEn: "Donations" },
  { code: 6, nameSv: "Övrigt", nameEn: "Other" },
  {
    code: 8,
    nameSv: "Bidrag – närstående",
    nameEn: "Donations – related orgs",
  },
];

// ── Effect Schema definitions ──────────────────────────────────────────

/** Parse Swedish-format amount string ("7619033,00") to integer */
const SwedishAmount = Schema.transform(Schema.String, Schema.Number, {
  decode: (s) => {
    if (!s || s.trim() === "") return 0;
    return Math.round(parseFloat(s.replace(",", ".")));
  },
  encode: (n) => n.toFixed(2).replace(".", ","),
});

/** Parse string to integer, defaulting to NaN */
const IntFromString = Schema.transform(Schema.String, Schema.Number, {
  decode: (s) => parseInt(s, 10),
  encode: (n) => String(n),
});

/** Parse "Ja"/"" to boolean */
const JaBoolean = Schema.transform(Schema.String, Schema.Boolean, {
  decode: (s) => s === "Ja",
  encode: (b) => (b ? "Ja" : ""),
});

/** Schema for a single parsed CSV row */
const CsvRow = Schema.Struct({
  year: IntFromString,
  orgNumber: Schema.String,
  name: Schema.String,
  partyId: IntFromString,
  partyName: Schema.String,
  isKommunal: JaBoolean,
  municipalityCode: Schema.String,
  municipality: Schema.String,
  isRegional: JaBoolean,
  region: Schema.String,
  isRiksniva: JaBoolean,
  isEU: JaBoolean,
  revenueGroupCode: IntFromString,
  revenueGroupName: Schema.String,
  revenueTypeCode: Schema.String,
  revenueTypeName: Schema.String,
  revenueTypeDescription: Schema.String,
  amount: SwedishAmount,
});

type CsvRow = typeof CsvRow.Type;

const decodeCsvRow = Schema.decodeUnknownSync(CsvRow);

// ── Helpers ────────────────────────────────────────────────────────────

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convert a tab-separated line into the raw object shape for Schema decoding */
export function parseCsvLine(line: string): CsvRow {
  const c = line.split("\t");
  return decodeCsvRow({
    year: c[0] ?? "",
    orgNumber: c[1] ?? "",
    name: c[2] ?? "",
    partyId: c[3] ?? "",
    partyName: c[4] ?? "",
    isKommunal: c[5] ?? "",
    municipalityCode: c[6] ?? "",
    municipality: c[7] ?? "",
    isRegional: c[8] ?? "",
    region: c[10] ?? "",
    isRiksniva: c[11] ?? "",
    isEU: c[13] ?? "",
    revenueGroupCode: c[14] ?? "",
    revenueGroupName: c[15] ?? "",
    revenueTypeCode: c[16] ?? "",
    revenueTypeName: c[17] ?? "",
    revenueTypeDescription: c[18] ?? "",
    amount: c[19] ?? "",
  });
}

/** Parse Swedish amount string — exported for tests */
export function parseAmount(s: string): number {
  return Schema.decodeUnknownSync(SwedishAmount)(s);
}

function getLevel(row: CsvRow): string {
  if (row.isKommunal) return "kommunal";
  if (row.isRegional) return "regional";
  if (row.isRiksniva) return "riksnivå";
  if (row.isEU) return "eu";
  return "riksnivå";
}

/** Partiinsyn uses this label when the donor is not named — not useful in a “top donors” list. */
function isAnonymousDonorLabel(label: string): boolean {
  return /^privat bidrag\s+(pengar|övrigt)$/i.test(label.trim());
}

function donorLabelFromRow(r: CsvRow): string {
  return r.revenueTypeDescription.trim() || r.revenueTypeName;
}

/** Build top 10 disclosed large donations per year (group 5, types 5.4 / 5.7, riksdag parties). */
export function buildTopDonorsByYear(
  riksdagRows: CsvRow[],
  years: readonly number[],
): Record<string, TopDonorEntry[]> {
  const out: Record<string, TopDonorEntry[]> = {};
  for (const year of years) {
    const yearRows = riksdagRows.filter(
      (r) =>
        r.year === year &&
        r.revenueGroupCode === 5 &&
        LARGE_DONATION_TYPE_CODES.has(r.revenueTypeCode) &&
        r.amount > 0 &&
        !isAnonymousDonorLabel(donorLabelFromRow(r)),
    );
    const top = [...yearRows]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map((r) => {
        const partyName = PARTY_DISPLAY_NAMES[r.partyId] ?? r.partyName;
        return {
          amount: r.amount,
          donorLabel: donorLabelFromRow(r),
          recipientName: r.name,
          partyId: r.partyId,
          partySlug: toSlug(partyName),
          partyName,
        };
      });
    out[String(year)] = top;
  }
  return out;
}

function aggregateYears(rows: CsvRow[]): PartyYear[] {
  const yearMap = new Map<number, Map<string, number>>();

  for (const row of rows) {
    if (row.amount === 0) continue;
    if (!yearMap.has(row.year)) yearMap.set(row.year, new Map());
    const revenueMap = yearMap.get(row.year)!;
    const key = String(row.revenueGroupCode);
    revenueMap.set(key, (revenueMap.get(key) ?? 0) + row.amount);
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, revenueMap]) => {
      const revenue = Object.fromEntries(revenueMap);
      const total = Array.from(revenueMap.values()).reduce((a, b) => a + b, 0);
      return { year, revenue, total };
    });
}

// ── Main ───────────────────────────────────────────────────────────────

function processData() {
  const csvPath = join(
    import.meta.dirname,
    "..",
    "data",
    "PartiinsynOpenData.csv",
  );
  const raw = readFileSync(csvPath);

  // Detect and handle UTF-16 LE BOM
  let content: string;
  if (raw[0] === 0xff && raw[1] === 0xfe) {
    content = raw.toString("utf16le");
  } else {
    content = raw.toString("utf-8");
  }

  // Remove BOM
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  const dataLines = lines.slice(1);

  console.log(`Parsing ${dataLines.length} rows...`);

  const rows: CsvRow[] = [];
  let skipped = 0;
  for (const line of dataLines) {
    try {
      const row = parseCsvLine(line);
      if (!isNaN(row.year) && !isNaN(row.partyId)) {
        rows.push(row);
      } else {
        skipped++;
      }
    } catch {
      skipped++;
    }
  }

  console.log(`Parsed ${rows.length} valid rows (${skipped} skipped)`);

  // Filter to riksdag parties
  const riksdagRows = rows.filter((r) => RIKSDAG_PARTY_IDS.has(r.partyId));
  console.log(`Riksdag party rows: ${riksdagRows.length}`);

  // Build parties (aggregated across all orgs)
  const partyRowMap = new Map<number, CsvRow[]>();
  for (const row of riksdagRows) {
    if (!partyRowMap.has(row.partyId)) partyRowMap.set(row.partyId, []);
    partyRowMap.get(row.partyId)!.push(row);
  }

  const parties: Party[] = Array.from(partyRowMap.entries())
    .map(([partyId, partyRows]) => ({
      id: partyId,
      name: PARTY_DISPLAY_NAMES[partyId] ?? partyRows[0].partyName,
      slug: toSlug(PARTY_DISPLAY_NAMES[partyId] ?? partyRows[0].partyName),
      years: aggregateYears(partyRows),
    }))
    .sort((a, b) => {
      const aTotal = a.years.reduce((s, y) => s + y.total, 0);
      const bTotal = b.years.reduce((s, y) => s + y.total, 0);
      return bTotal - aTotal;
    });

  // Build organizations
  const orgKey = (row: CsvRow) => `${row.partyId}:${row.orgNumber || row.name}`;
  const orgRowMap = new Map<string, CsvRow[]>();
  for (const row of riksdagRows) {
    const key = orgKey(row);
    if (!orgRowMap.has(key)) orgRowMap.set(key, []);
    orgRowMap.get(key)!.push(row);
  }

  const organizations: Organization[] = Array.from(orgRowMap.entries())
    .map(([_, orgRows]) => {
      const first = orgRows[0];
      return {
        orgNumber: first.orgNumber,
        name: first.name,
        slug: toSlug(first.name || first.orgNumber),
        partyId: first.partyId,
        level: getLevel(first),
        municipality: first.municipality || undefined,
        municipalityCode: first.municipalityCode || undefined,
        region: first.region || undefined,
        years: aggregateYears(orgRows),
      };
    })
    .filter((org) => org.years.length > 0);

  // Build meta
  const allYears = new Set<number>();
  for (const row of rows) allYears.add(row.year);

  const meta: Meta = {
    years: Array.from(allYears).sort(),
    parties: parties.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
    revenueGroups: REVENUE_GROUPS,
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  // Write output
  const outDir = join(import.meta.dirname, "..", "src", "data", "generated");
  const publicDir = join(import.meta.dirname, "..", "public");
  mkdirSync(outDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  writeFileSync(join(outDir, "parties.json"), JSON.stringify(parties, null, 2));

  const siteOrigin = (
    process.env.SITE_ORIGIN ?? "https://partifinansiering.se"
  ).replace(/\/$/, "");
  const sitemapUrls = [
    `${siteOrigin}/`,
    `${siteOrigin}/en`,
    ...parties.flatMap((p) => [
      `${siteOrigin}/parti/${p.slug}`,
      `${siteOrigin}/en/parti/${p.slug}`,
    ]),
  ];
  const lastmod = meta.lastUpdated;
  const sitemapBody = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map((loc) => {
      const norm = loc.replace(/\/$/, "");
      const priority =
        norm === siteOrigin || norm === `${siteOrigin}/en` ? "1.0" : "0.8";
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    }),
    "</urlset>",
    "",
  ].join("\n");
  writeFileSync(join(publicDir, "sitemap.xml"), sitemapBody);

  const robotsBody = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    "",
  ].join("\n");
  writeFileSync(join(publicDir, "robots.txt"), robotsBody);
  writeFileSync(
    join(outDir, "organizations.json"),
    JSON.stringify(organizations, null, 2),
  );
  writeFileSync(join(outDir, "meta.json"), JSON.stringify(meta, null, 2));

  const topDonorsByYear = buildTopDonorsByYear(riksdagRows, meta.years);
  writeFileSync(
    join(outDir, "top-donors.json"),
    JSON.stringify(topDonorsByYear, null, 2),
  );

  console.log(`\nOutput written to ${outDir}`);
  console.log(`Parties: ${parties.length}`);
  console.log(`Organizations: ${organizations.length}`);
  console.log(`Years: ${meta.years.join(", ")}`);
  for (const p of parties) {
    const latest = p.years[p.years.length - 1];
    console.log(
      `  ${p.name}: ${latest?.total.toLocaleString("sv-SE")} kr (${latest?.year})`,
    );
  }
}

processData();
