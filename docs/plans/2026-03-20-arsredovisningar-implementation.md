# Årsredovisningar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a two-stage pipeline (discovery → extracted proposed/validated JSON + archived PDFs) and surface annual reports on party pages, integrated with the existing static TanStack Start site.

**Architecture:** Curated `partyId → kansli orgnr` config is read by a Node script that calls Bolagsverket’s API (per current docs) at CI/build time, writes discovery JSON, downloads PDFs (Git LFS recommended). A second script extracts text from PDFs, calls an LLM with a strict schema, writes `proposed` JSON; humans merge to `validated` JSON. The app loads only `validated` for metrics and discovery for links/PDF paths.

**Tech Stack:** TypeScript, `tsx`, existing Vitest; new deps as needed (HTTP client, PDF text extraction, LLM SDK, optional Zod/Effect Schema for validation). Chakra UI for UI.

---

### Task 1: Party HQ orgnr config + types

**Files:**

- Create: `src/data/party-headquarters.ts` (or `scripts/config/party-headquarters.json` + small loader)
- Modify: `src/data/types.ts` — add TypeScript types for discovery + extracted payloads (no runtime in app unless imported from shared module)

**Step 1:** Define a committed mapping `{ partyId: number, orgNumber: string, note?: string }[]` for all Riksdag parties shown on the site (values filled from authoritative sources).

**Step 2:** Add interfaces e.g. `AnnualReportDiscoveryEntry`, `AnnualReportExtractedEntry`, and top-level file shapes for `*.discovery.json`, `*.extracted.proposed.json`, `*.extracted.validated.json`.

**Step 3:** Run `pnpm typecheck` — expect PASS.

**Step 4:** Commit: `git add src/data/types.ts src/data/party-headquarters.ts && git commit -m "feat(data): party HQ orgnr + annual report types"`

---

### Task 2: Output paths and Git LFS for PDFs

**Files:**

- Create: `data/annual-reports/.gitkeep` or document empty dir strategy
- Modify: `.gitattributes` — `data/annual-reports/**/*.pdf filter=lfs diff=lfs merge=lfs -text` (adjust path if PDFs live under `public/`)
- Modify: `docs/plans/2026-03-20-arsredovisningar-design.md` only if path decision differs (optional)

**Step 1:** Choose single canonical directory for PDFs (recommend `data/annual-reports/` + copy or symlink into `public/` at build if static URLs required).

**Step 2:** Add `.gitattributes` LFS rule; document in design or README snippet that contributors need `git lfs install`.

**Step 3:** Commit.

---

### Task 3: Discovery script skeleton + JSON write

**Files:**

- Create: `scripts/discover-annual-reports.ts`
- Create: `src/data/generated/annual-reports.discovery.json` (initial empty structure `[]` or `{ "parties": [] }` — match types)
- Modify: `package.json` — add `"discover-annual-reports": "tsx scripts/discover-annual-reports.ts"`

**Step 1:** Read `party-headquarters` config; for each row, placeholder function `fetchAnnualReportsFromBolagsverket(orgNumber): Promise<...>` (stub returning `[]`).

**Step 2:** Write merged result to `src/data/generated/annual-reports.discovery.json` with stable sorting (partyId, year desc).

**Step 3:** Run `pnpm exec tsx scripts/discover-annual-reports.ts` — expect JSON written.

**Step 4:** Commit.

---

### Task 4: Implement Bolagsverket client (read official docs first)

**Files:**

- Create: `scripts/bolagsverket-client.ts` (or under `scripts/lib/`)
- Modify: `scripts/discover-annual-reports.ts` — use real client
- Create: `.env.example` — `BOLAGSVERKET_API_KEY=`, base URL if applicable

**Step 1:** Read current Bolagsverket API documentation; implement minimal client: list/search annual accounts for an org number, map response to `AnnualReportDiscoveryEntry` (year, sourceUrl, documentId, downloadedPath null until Task 5).

**Step 2:** Integration test optional behind `process.env.CI` skip if no key in test env; or record fixture JSON in `scripts/fixtures/bolagsverket/` for unit tests.

**Step 3:** Run script locally with key — expect non-empty discovery for at least one org.

**Step 4:** Commit (no secrets).

---

### Task 5: PDF download into repo path

**Files:**

- Modify: `scripts/discover-annual-reports.ts`
- Modify: discovery types if needed (`localPdfRelativePath`)

**Step 1:** For each discovered document URL, download PDF to `data/annual-reports/{orgNumber}-{year}.pdf` (or hashed name if collisions); skip if already exists with same size/etag if API provides checksum.

**Step 2:** Record relative path in discovery JSON for static serving decision.

**Step 3:** Commit a small test PDF only if legally OK; otherwise rely on CI/local run for binaries.

---

### Task 6: Extract script — PDF → text → LLM → proposed JSON

**Files:**

- Create: `scripts/extract-annual-reports.ts`
- Create: `scripts/prompts/annual-report-extract.md` (or `.txt`) with schema instructions
- Create: `src/data/generated/annual-reports.extracted.proposed.json` (empty scaffold)
- Create: `src/data/generated/annual-reports.extracted.validated.json` (empty scaffold)
- Modify: `package.json` — `"extract-annual-reports": "tsx scripts/extract-annual-reports.ts"`
- Modify: `.env.example` — `OPENAI_API_KEY=` (or chosen provider)

**Step 1:** For each discovery entry with `localPdfRelativePath`, extract text (library TBD: `pdf-parse`, `unpdf`, etc. — pick one with Node support).

**Step 2:** Call LLM with response format = JSON matching `AnnualReportExtractedEntry`; include `model`, `promptVersion`, `sourceYear`, `partyId` in metadata.

**Step 3:** Validate parsed JSON with Zod or Effect Schema; on failure exit 1.

**Step 4:** Write full array to `annual-reports.extracted.proposed.json`.

**Step 5:** Document that operator copies reviewed subset into `validated` or uses merge workflow.

**Step 6:** Commit.

---

### Task 7: Vitest for schema validation (TDD-style)

**Files:**

- Create: `scripts/annual-report-schema.ts` (shared validators)
- Create: `scripts/annual-report-schema.test.ts`

**Step 1:** Write test: valid minimal `AnnualReportExtractedEntry` passes; missing required field fails.

**Step 2:** Run `pnpm test` — FAIL until schema exists.

**Step 3:** Implement schema + parsers.

**Step 4:** Run `pnpm test` — PASS.

**Step 5:** Commit.

---

### Task 8: Wire build / CI (optional strict mode)

**Files:**

- Modify: `package.json` — decide whether `build` runs `discover-annual-reports` always or only `build:data` script
- Modify: CI workflow if present (e.g. `.github/workflows/*.yml`) — add secrets, `git lfs pull`, run discovery on schedule or on release

**Step 1:** Prefer explicit `pnpm run build:data` chaining: `process-data` + `discover-annual-reports` before `vite build` **or** document manual cadence to avoid flaky builds without API key.

**Step 2:** Commit.

---

### Task 9: Load JSON in route loaders

**Files:**

- Modify: `src/routes/$lang/parti/$partySlug.tsx` — loader imports or reads generated JSON (same pattern as `parties.json`)
- Create: `src/data/annual-reports.ts` — helpers `getDiscoveryForParty(partyId)`, `getValidatedForParty(partyId)`

**Step 1:** Ensure JSON files are importable from `src/data/generated/` (Vite may need `?url` or static import — follow existing pattern for `parties.json`).

**Step 2:** Pass data into `PartyDetail` as props/context.

**Step 3:** `pnpm typecheck` — PASS.

**Step 4:** Commit.

---

### Task 10: UI — Annual reports section

**Files:**

- Create: `src/components/AnnualReportsSection.tsx` (Chakra `Stack`, links to external URL + internal PDF path)
- Modify: `src/routes/$lang/parti/$partySlug.tsx`

**Step 1:** For each year in discovery, render row: year, link “Bolagsverket” (or `sourceUrl`), link “PDF” if `localPdfRelativePath` exposed via public URL.

**Step 2:** If validated entry exists for year, show key figures (exact fields from schema — e.g. total costs, result).

**Step 3:** i18n: Swedish/English strings via existing message pattern in repo.

**Step 4:** Manual check in browser on dev server.

**Step 5:** Commit.

---

### Task 11: Documentation + cross-link design doc

**Files:**

- Modify: `README.md` or `AGENTS.md` — how to run discovery/extract, LFS, env vars
- Modify: `docs/plans/2026-03-18-partifinansiering-design.md` — one-line “see 2026-03-20-arsredovisningar-design.md” under complementary sources

**Step 1:** Commit.

---

### Task 12: Final verification

**Step 1:** Run `pnpm typecheck && pnpm test && pnpm build` (with or without API keys per documented flow).

**Step 2:** Commit any fixes.

**Step 3:** Tag or PR as appropriate.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-03-20-arsredovisningar-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Parallel Session (separate)** — open a new session with executing-plans, batch execution with checkpoints.

Which approach?
