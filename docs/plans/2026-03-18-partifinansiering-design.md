# partifinansiering.se — Design

## Syfte

Visualisera svenska partiers finansiering för allmänheten. Enkel, visuell dashboard med partijämförelse som huvudfokus.

## Datakälla

**PartiinsynOpenData.csv** från Kammarkollegiet/Partiinsyn.

- ~45 500 rader, 2018–2024
- Alla riksdagspartier + småpartier
- Intäktskategorier: offentligt stöd, medlemsavgifter, försäljning/lotterier, insamling, bidrag, övrigt, närstående verksamhet
- Geografiska nivåer: kommunal, regional, riksnivå, EU

### Begränsningar

- Bara intäkter — inga utgifter/kostnader
- Många nollrader (varje org rapporterar alla kategorier)
- ~2 000 rader med personliga redovisare (saknar org-nummer)
- Tröskelvärden ändras mellan år (287 kr 2024 vs 227 kr 2018)
- Inga individuella givare namnges under tröskelvärdena

### Möjliga kompletterande datakällor (framtida)

- Valmyndigheten — valresultat, mandatfördelning
- SCB — befolkningsstatistik (per capita)
- Partikansliernas årsredovisningar — kostnader

## Arkitektur

```
CSV (raw)
  │
  ▼
Build-steg: process-data.ts → JSON-filer
  │
  ▼
TanStack Start
  ├── Route loaders läser JSON
  ├── Static prerendering → HTML + hydration
  └── Chakra UI + Charts renderar allt
  │
  ▼
Deploy som statisk sajt (Cloudflare Pages)
```

### Dataprocessering (build-tid)

Node-script (`scripts/process-data.ts`) körs före build:

- Parsar tabb-separerad CSV, konverterar svenskt decimalformat
- Filtrerar bort nollrader
- Aggregerar per parti + år + intäktstyp
- Rensar personposter under respektive parti
- Producerar JSON-filer i `src/data/generated/`

Genererade filer:

| Fil                  | Innehåll                                 |
| -------------------- | ---------------------------------------- |
| `parties.json`       | Aggregerad data per parti + år           |
| `organizations.json` | Alla lokala org:er per parti             |
| `revenue-types.json` | Intäktskategorier, metadata              |
| `meta.json`          | Tillgängliga år, partilista, kommunlista |

## Tech stack

| Paket                    | Syfte                        |
| ------------------------ | ---------------------------- |
| `@tanstack/react-start`  | Ramverk, SSR/prerendering    |
| `@tanstack/react-router` | Typesafe routing + loaders   |
| `@chakra-ui/react` v3    | Komponentbibliotek, tema     |
| `@chakra-ui/charts`      | Diagram (bar, line, donut)   |
| `recharts`               | Peer dep till Chakra Charts  |
| `tsx`                    | Kör dataprocesserings-script |

## Sidstruktur

```
/$lang/                              Startsida — översiktsdashboard
/$lang/parti/$partySlug              Partisida — detaljvy
/$lang/parti/$partySlug/$orgSlug     Drill-down till lokal organisation
/$lang/om                            Om sajten, datakällor, metod
```

Root (`/`) redirectar till `/sv/`.

### Startsida

- Hero: "Så finansieras Sveriges partier"
- Årväljare (2018–2024), default senaste året
- Stacked bar chart: alla riksdagspartier, uppdelat per intäktskategori
- Sammanfattningskort per parti (klickbara)

### Partisida

- Totala intäkter per år (linjediagram)
- Fördelning per intäktskategori (donut/pie)
- Lista lokala organisationer sorterade efter intäkt (klickbara)
- Jämförelseknapp — välj ytterligare parti

### Organisationssida

- Intäktsfördelning för specifik avdelning
- Geografisk kontext (kommun/region)

### Om-sida

- Datakälla, metod, begränsningar, kontakt

## Komponenter

| Komponent              | Typ                          | Hydration |
| ---------------------- | ---------------------------- | --------- |
| `YearSelector`         | Chakra `SegmentGroup`        | Direkt    |
| `PartyComparisonChart` | Stacked `BarChart`           | Direkt    |
| `PartyBreakdownChart`  | `BarList`/`BarSegment`       | Lazy      |
| `TrendChart`           | `LineChart`                  | Lazy      |
| `OrgTable`             | Chakra `Table` med sortering | Lazy      |
| `PartyComparator`      | Sammansatt `BarChart`        | Lazy      |
| `LanguageSwitcher`     | Chakra `Menu`                | Direkt    |

### Färgkodning

- Partier: officiella färger (S=röd, M=ljusblå, SD=gul, C=grön, V=mörkröd, KD=mörkblå, MP=grön, L=blå)
- Intäktskategorier: konsekvent palett genom sajten

### Interaktion

- Hover → tooltip med belopp + procent
- Klick på parti → navigera till partisida
- Årväljare uppdaterar diagram utan sidladdning
- Belopp formateras: `12 345 678 kr`

## i18n

- URL-prefix: `/sv/`, `/en/`
- JSON-översättningsfiler (`src/i18n/sv.json`, `src/i18n/en.json`)
- Egen `useTranslation` hook (~30 rader, inget bibliotek)
- UI-strängar + intäktskategorinamn översätts
- Partinamn, kommunnamn, belopp (SEK) översätts INTE

## Deploy

- Static prerendering via TanStack Start (`vinxi build`)
- Target: Cloudflare Pages (gratis, edge CDN)
- Alternativ: Vercel, Netlify

## Build-pipeline

```bash
npm run build
  1. tsx scripts/process-data.ts     → src/data/generated/*.json
  2. vinxi build                     → statisk HTML + JS
```

## Prestanda-mål

- Lighthouse 90+
- Första render <1s
- JS-bundle <150 kB gzipped

## Datauppdatering

1. Ladda ner ny CSV från Partiinsyn
2. Ersätt `data/PartiinsynOpenData.csv`
3. `npm run build` → ny sajt
