# partifinansiering.se Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static dashboard site visualizing Swedish party financing data from Partiinsyn's open CSV.

**Architecture:** TanStack Start with static prerendering. CSV processed at build-time into JSON. React components with Chakra UI + Chakra Charts for interactive visualizations. i18n via URL prefix (`/sv/`, `/en/`).

**Tech Stack:** TanStack Start, TanStack Router, React 18+, Chakra UI v3, @chakra-ui/charts, Recharts, TypeScript, Vitest

---

## Task 1: Project Scaffolding

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/router.tsx`
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`

**Step 1: Initialize package.json**

```json
{
  "name": "partifinansiering",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "tsx scripts/process-data.ts && vite build",
    "process-data": "tsx scripts/process-data.ts"
  }
}
```

**Step 2: Install dependencies**

Run:

```bash
npm i @tanstack/react-start @tanstack/react-router react react-dom @chakra-ui/react @emotion/react @chakra-ui/charts recharts
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node vite-tsconfig-paths tsx vitest
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 4: Create vite.config.ts**

```ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 3000 },
  plugins: [tsConfigPaths(), tanstackStart(), viteReact()],
});
```

**Step 5: Create src/router.tsx**

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({ routeTree, scrollRestoration: true });
}
```

**Step 6: Create src/routes/\_\_root.tsx**

Minimal root with `<html>`, `<head>`, `<body>`, `<Outlet />`. No Chakra Provider yet (added in Task 3).

```tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Partifinansiering" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

**Step 7: Create src/routes/index.tsx**

Placeholder that just renders "Partifinansiering" as `<h1>`.

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <h1>Partifinansiering</h1>,
});
```

**Step 8: Verify dev server starts**

Run: `npm run dev`
Expected: App runs at http://localhost:3000, shows "Partifinansiering".

**Step 9: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold TanStack Start project"
```

---

## Task 2: Data Processing Script

**Files:**

- Create: `scripts/process-data.ts`
- Create: `src/data/types.ts`
- Create: `src/data/generated/.gitkeep` (directory placeholder)
- Test: `scripts/process-data.test.ts`

**Step 1: Define data types**

Create `src/data/types.ts`:

```ts
export interface PartyYear {
  year: number;
  revenue: Record<string, number>;
  total: number;
}

export interface Party {
  id: number;
  name: string;
  slug: string;
  years: PartyYear[];
}

export interface Organization {
  orgNumber: string;
  name: string;
  slug: string;
  partyId: number;
  level: "kommunal" | "regional" | "riksnivå" | "eu";
  municipality?: string;
  municipalityCode?: string;
  region?: string;
  years: PartyYear[];
}

export interface RevenueType {
  code: string;
  group: string;
  groupCode: number;
  name: string;
  nameSv: string;
  nameEn: string;
}

export interface Meta {
  years: number[];
  parties: Array<{ id: number; name: string; slug: string }>;
  lastUpdated: string;
}

export interface GeneratedData {
  parties: Party[];
  organizations: Organization[];
  revenueTypes: RevenueType[];
  meta: Meta;
}
```

**Step 2: Write test for CSV line parsing**

Create `scripts/process-data.test.ts`:

```ts
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
  it("parses a tab-separated line", () => {
    const line =
      "2024\t802435-5664\tCommon Sense In Sweden\t1318\tCommon sense in Sweden\t\t\t\t\t\t\tJa\t\tJa\t1\tOffentligt stöd\t1.1\tStöd till partier som deltagit i val till riksdag\t\t0,00\t";
    const row = parseCsvLine(line);
    expect(row.year).toBe(2024);
    expect(row.orgNumber).toBe("802435-5664");
    expect(row.name).toBe("Common Sense In Sweden");
    expect(row.partyId).toBe(1318);
    expect(row.partyName).toBe("Common sense in Sweden");
    expect(row.revenueGroupCode).toBe(1);
    expect(row.revenueTypeCode).toBe("1.1");
    expect(row.amount).toBe(0);
  });
});
```

**Step 3: Run test to verify it fails**

Run: `npx vitest run scripts/process-data.test.ts`
Expected: FAIL — `parseCsvLine` not found

**Step 4: Implement parsing functions**

Create `scripts/process-data.ts` with exported helper functions (`parseAmount`, `toSlug`, `parseCsvLine`) and the main `processData()` function that:

1. Reads `data/PartiinsynOpenData.csv`
2. Parses each line into a typed row
3. Filters out rows with amount === 0
4. Groups by party → year → revenue type (aggregating all local orgs)
5. Also builds per-organization data
6. Writes JSON files to `src/data/generated/`

Key parsing logic:

- Tab-split each line into 21 columns (trailing tab creates empty 21st)
- `parseAmount`: replace `,` with `.`, parseFloat, round to integer
- `toSlug`: lowercase, replace `å→a`, `ä→a`, `ö→o`, replace non-alphanumeric with `-`, deduplicate dashes
- Determine geographic level from the boolean columns (6=kommunal, 9=regional, 12=riksnivå, 14=EU)

Revenue type code mapping for i18n (hardcode in `revenue-types.json`):
| Code | Swedish | English |
|------|---------|---------|
| 1 | Offentligt stöd | Public funding |
| 2 | Medlemsavgifter | Membership fees |
| 3 | Försäljning och lotterier | Sales & lotteries |
| 4 | Insamling av kontanter | Cash collections |
| 5 | Bidrag | Donations |
| 6 | Övrigt | Other |
| 8 | Bidrag - Närstående verksamhet | Donations - Related org |

**Step 5: Run tests to verify they pass**

Run: `npx vitest run scripts/process-data.test.ts`
Expected: PASS

**Step 6: Run the script against real data**

Run: `npm run process-data`
Expected: JSON files created in `src/data/generated/`. Inspect `parties.json` to verify 8 riksdagspartier with data for 7 years.

**Step 7: Add generated dir to .gitignore**

Create `.gitignore`:

```
node_modules/
dist/
src/data/generated/
src/routeTree.gen.ts
*.local
```

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: data processing script — CSV to JSON"
```

---

## Task 3: Chakra UI Setup & App Shell

**Files:**

- Modify: `src/routes/__root.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/theme.ts`

**Step 1: Run Chakra CLI to add component snippets**

Run: `npx @chakra-ui/cli snippet add`
This generates `src/components/ui/provider.tsx` and other helpers.

**Step 2: Create theme with party colors**

Create `src/theme.ts`:

```ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        party: {
          s: { value: "#ED1B34" },
          m: { value: "#52BDEC" },
          sd: { value: "#DDDD00" },
          c: { value: "#009933" },
          v: { value: "#DA291C" },
          kd: { value: "#000077" },
          mp: { value: "#83CF39" },
          l: { value: "#006AB3" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
```

**Step 3: Update \_\_root.tsx with Chakra Provider**

Wrap `<Outlet />` in Chakra's `Provider` component, passing the custom theme/system. Import from the snippet-generated provider.

**Step 4: Create Layout component**

Create `src/components/Layout.tsx` with:

- Header: site title "Partifinansiering", nav links (Översikt, Partier, Om), language switcher placeholder
- Main content area (children)
- Footer: data source attribution, year

Use Chakra `Box`, `Flex`, `Container`, `Link` components.

**Step 5: Apply Layout in \_\_root.tsx**

Wrap `<Outlet />` inside `<Layout>`.

**Step 6: Verify visually**

Run dev server, confirm header/footer render with Chakra styling.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: Chakra UI setup with layout and party colors"
```

---

## Task 4: i18n System

**Files:**

- Create: `src/i18n/sv.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/useTranslation.ts`
- Create: `src/routes/$lang.tsx` (layout route)
- Modify: `src/routes/index.tsx` (redirect to /sv/)

**Step 1: Create translation files**

`src/i18n/sv.json`:

```json
{
  "site.title": "Partifinansiering",
  "site.description": "Så finansieras Sveriges partier",
  "nav.overview": "Översikt",
  "nav.parties": "Partier",
  "nav.about": "Om",
  "year.select": "Välj år",
  "revenue.1": "Offentligt stöd",
  "revenue.2": "Medlemsavgifter",
  "revenue.3": "Försäljning och lotterier",
  "revenue.4": "Insamling av kontanter",
  "revenue.5": "Bidrag",
  "revenue.6": "Övrigt",
  "revenue.8": "Bidrag - Närstående verksamhet",
  "amount.suffix": "kr",
  "party.total": "Totalt",
  "party.organizations": "Lokala organisationer",
  "party.compare": "Jämför",
  "about.title": "Om Partifinansiering",
  "about.source": "Datakälla",
  "footer.source": "Data från Kammarkollegiets Partiinsyn"
}
```

`src/i18n/en.json`: Same keys with English values.

**Step 2: Create useTranslation hook**

`src/i18n/useTranslation.ts`:

```ts
import { useParams } from "@tanstack/react-router";
import sv from "./sv.json";
import en from "./en.json";

const translations: Record<string, Record<string, string>> = { sv, en };

export function useTranslation() {
  const { lang } = useParams({ strict: false }) as { lang?: string };
  const locale = lang === "en" ? "en" : "sv";
  const t = (key: string) => translations[locale]?.[key] ?? key;
  return { t, locale };
}
```

**Step 3: Create $lang layout route**

`src/routes/$lang.tsx` — validates that `$lang` is `"sv"` or `"en"`, renders `<Outlet />`. Redirects to `/sv/` on invalid lang.

**Step 4: Update index.tsx to redirect**

`src/routes/index.tsx` — redirect to `/sv/`.

**Step 5: Create $lang/index.tsx**

`src/routes/$lang/index.tsx` — the actual dashboard page (placeholder for now, renders `t("site.description")`).

**Step 6: Update Layout to use translations**

Replace hardcoded strings in header/footer with `t()` calls. Add language switcher that links to same path but swapped `$lang`.

**Step 7: Verify both /sv/ and /en/ work**

Navigate to `/sv/` and `/en/`, confirm translated UI strings.

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: i18n with sv/en URL prefix routing"
```

---

## Task 5: Dashboard Page — Party Comparison Chart

**Files:**

- Modify: `src/routes/$lang/index.tsx`
- Create: `src/components/YearSelector.tsx`
- Create: `src/components/PartyComparisonChart.tsx`
- Create: `src/components/PartyCard.tsx`

**Step 1: Create route loader**

In `src/routes/$lang/index.tsx`, add a loader that imports the generated JSON:

```ts
import partiesData from "@/data/generated/parties.json";
import metaData from "@/data/generated/meta.json";

export const Route = createFileRoute("/$lang/")({
  component: Dashboard,
  loader: () => ({ parties: partiesData, meta: metaData }),
});
```

**Step 2: Create YearSelector component**

`src/components/YearSelector.tsx` — Chakra `SegmentGroup` showing available years (2018–2024). Takes `years`, `selected`, `onChange` props.

**Step 3: Create PartyComparisonChart component**

`src/components/PartyComparisonChart.tsx`:

- Takes `parties` (filtered to selected year) and `locale`
- Uses `useChart` with series for each revenue category
- Renders horizontal stacked `BarChart` via Chakra Charts
- Each party = one bar, segments colored by revenue category
- Sorted by total descending
- Tooltip with formatted amounts
- `formatNumber` from `useChart` for axis labels

**Step 4: Create PartyCard component**

`src/components/PartyCard.tsx` — Chakra `Card` showing party name, total amount for selected year, small colored dot. Links to `/$lang/parti/$partySlug`.

**Step 5: Compose dashboard page**

Wire `YearSelector`, `PartyComparisonChart`, and a grid of `PartyCard` components in the dashboard route. Use `useState` for selected year (default: latest).

**Step 6: Style and verify**

Confirm chart renders with real data, year selector updates chart, party cards show correct totals.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: dashboard with party comparison chart and year selector"
```

---

## Task 6: Party Detail Page

**Files:**

- Create: `src/routes/$lang/parti/$partySlug.tsx`
- Create: `src/components/TrendChart.tsx`
- Create: `src/components/PartyBreakdownChart.tsx`
- Create: `src/components/OrgTable.tsx`

**Step 1: Create route with loader**

`src/routes/$lang/parti/$partySlug.tsx`:

- Loader reads `parties.json` and `organizations.json`
- Finds party by slug, filters orgs belonging to this party
- 404 if not found

**Step 2: Create TrendChart component**

`src/components/TrendChart.tsx`:

- Line chart showing total revenue per year (2018–2024)
- Optional: multiple lines per revenue category
- Uses Chakra Charts `LineChart`

**Step 3: Create PartyBreakdownChart component**

`src/components/PartyBreakdownChart.tsx`:

- Donut or `BarSegment` showing revenue category distribution for selected year
- Uses `useChart` for percentage calculations

**Step 4: Create OrgTable component**

`src/components/OrgTable.tsx`:

- Chakra `Table` listing local organizations
- Columns: name, municipality/region, total revenue
- Sorted by revenue descending
- Each row links to `/$lang/parti/$partySlug/$orgSlug`

**Step 5: Compose party page**

Assemble components: party name as heading, year selector, trend chart, breakdown chart, org table.

**Step 6: Verify with navigation from dashboard**

Click a party card on dashboard → party page loads with correct data.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: party detail page with trend, breakdown, and org list"
```

---

## Task 7: Organization Detail Page

**Files:**

- Create: `src/routes/$lang/parti/$partySlug/$orgSlug.tsx`

**Step 1: Create route with loader**

Loader reads `organizations.json`, finds org by slug within the party.

**Step 2: Build page**

- Org name, party name (breadcrumb), geographic context (kommun/region)
- Revenue breakdown chart (same `PartyBreakdownChart` reused)
- Trend chart if multiple years exist

**Step 3: Verify navigation**

Click org in party page → org page renders.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: organization detail page"
```

---

## Task 8: About Page

**Files:**

- Create: `src/routes/$lang/om.tsx`

**Step 1: Create page**

Static content explaining:

- Data source (Kammarkollegiet, Partiinsyn, partibokslutslagen)
- Methodology (how data is aggregated, what thresholds mean)
- Limitations (income only, threshold changes between years)
- Link to raw data source

Use Chakra typography components (`Heading`, `Text`, `List`).

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: about page"
```

---

## Task 9: Static Prerendering & Polish

**Files:**

- Modify: `vite.config.ts`
- Modify: `src/routes/$lang/parti/$partySlug.tsx` (add static paths)

**Step 1: Enable static prerendering**

Update `vite.config.ts`:

```ts
tanstackStart({
  prerender: {
    enabled: true,
    crawlLinks: true,
  },
}),
```

**Step 2: Ensure dynamic routes provide static paths**

For `$lang` routes: provide `["sv", "en"]`.
For `$partySlug`: provide list of party slugs from generated data.
For `$orgSlug`: provide org slugs per party.

Use the `staticPaths` option or let `crawlLinks` discover them from the dashboard links.

**Step 3: Build and verify**

Run: `npm run build`
Expected: Static HTML files generated in `dist/` for all routes.

**Step 4: Test production build locally**

Run: `npx serve dist/`
Navigate through all pages, verify charts render after hydration.

**Step 5: Add meta tags for SEO**

Update route `head()` functions with descriptive `<title>` and `<meta description>` per page.

**Step 6: Verify Lighthouse score**

Run Lighthouse on the built site. Target: 90+ performance.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: static prerendering and SEO meta tags"
```

---

## Task 10: Responsive Design & Final Polish

**Files:**

- Modify: various component files

**Step 1: Test on mobile viewport**

Open dev tools, test 375px width. Verify:

- Charts reflow to vertical on small screens
- Navigation collapses to hamburger/drawer
- Tables scroll horizontally
- Year selector wraps gracefully

**Step 2: Fix responsive issues**

Use Chakra responsive props (`base`, `md`, `lg`) to adjust layout.

**Step 3: Add loading states**

Ensure charts show a skeleton/spinner while hydrating.

**Step 4: Final commit**

```bash
git add -A && git commit -m "polish: responsive layout and loading states"
```
