# Årsredovisningar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a two-stage pipeline (discovery → extracted proposed/validated JSON + archived PDFs) and surface annual reports on party pages, integrated with the existing static TanStack Start site.

**Architecture:** Curated `partyId → kansli orgnr` config is read by a Node script that **scrapes Bolagsverket’s public website** (not the paid API) using **Crawlee** (Playwright) or **Stagehand** (AI-guided browser), writes discovery JSON, downloads PDFs (Git LFS recommended). Crawl is intentionally **off the default `vite build` path**—run on a schedule or manually, then commit artifacts. A second script extracts text from PDFs, calls an LLM with a strict schema, writes `proposed` JSON; humans merge to `validated` JSON. The app loads only `validated` for metrics and discovery for links/PDF paths.

**Tech Stack:** TypeScript, `tsx`, existing Vitest; **Crawlee + playwright** *or* **@browserbasecom/stagehand** (+ Playwright); PDF text extraction; LLM SDK for extraction (and for Stagehand if used for discovery); optional Zod/Effect Schema for validation. Chakra UI for UI.

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

**Step 1:** Read `party-headquarters` config; for each row, placeholder `discoverAnnualReportsForOrg(orgNumber): Promise<...>` (stub returning `[]`) to be implemented by the crawler in Task 4.

**Step 2:** Write merged result to `src/data/generated/annual-reports.discovery.json` with stable sorting (partyId, year desc).

**Step 3:** Run `pnpm exec tsx scripts/discover-annual-reports.ts` — expect JSON written.

**Step 4:** Commit.

---

### Task 4: Implement Bolagsverket web discovery (Crawlee or Stagehand)

**Files:**

- Create: `scripts/crawl/bolagsverket-annual-reports.ts` (or `scripts/discover-annual-reports-crawler.ts`) — crawler entry
- Modify: `scripts/discover-annual-reports.ts` — call crawler implementation
- Create: `.env.example` — if **Stagehand**: `OPENAI_API_KEY=` / `ANTHROPIC_API_KEY=` (per Stagehand docs); if **Crawlee only**: optional throttling env vars only
- Modify: `package.json` — add deps: `crawlee` + `playwright` *or* `@browserbasecom/stagehand` + peer browser deps; add `postinstall` or README step: `pnpm exec playwright install chromium` (exact package per chosen stack)

**Step 1:** **Pick stack:** Crawlee for deterministic flows (recommended default); Stagehand if selectors are brittle and you accept LLM cost in discovery.

**Step 2:** Map the real user journey on `bolagsverket.se` (org search → annual report list → PDF or document page URLs). Implement one `RequestHandler` / Playwright flow that returns `AnnualReportDiscoveryEntry[]` per orgnr (year, `sourcePageUrl`, `pdfUrl` if direct link exists, raw title text).

**Step 3:** Add **fixture tests:** save redacted HTML snippets or recorded responses under `scripts/fixtures/bolagsverket-web/` and unit-test parsing logic so CI does not hit the live site every run.

**Step 4:** Run crawler locally with Playwright browsers installed — expect non-empty discovery for at least one HQ orgnr.

**Step 5:** Commit (no secrets).

---

### Task 5: PDF download into repo path

**Files:**

- Modify: `scripts/discover-annual-reports.ts`
- Modify: discovery types if needed (`localPdfRelativePath`)

**Step 1:** For each discovered PDF URL, download with `fetch` or Playwright context to `data/annual-reports/{orgNumber}-{year}.pdf` (or hashed name if collisions); skip if file exists and `Content-Length`/checksum matches when headers allow.

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
- Modify: CI workflow if present — optional **scheduled** job with `playwright install`, `git lfs pull`, run `discover-annual-reports`; on failure notify (site markup changes)

**Step 1:** Keep `vite build` chained only with `process-data` (Partiinsyn). Add separate `pnpm run discover-annual-reports` (and optionally `pnpm run build:data` = `process-data` only) — **do not** require Playwright crawl on every production build unless you add a dedicated CI job with browser cache and accept flake risk.

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

- Modify: `README.md` or `AGENTS.md` — how to run discovery (Playwright install, Crawlee vs Stagehand), extract (LLM key), LFS, env vars
- Modify: `docs/plans/2026-03-18-partifinansiering-design.md` — one-line “see 2026-03-20-arsredovisningar-design.md” under complementary sources

**Step 1:** Commit.

---

### Task 12: Final verification

**Step 1:** Run `pnpm typecheck && pnpm test && pnpm build`. Crawler smoke test remains manual or scheduled CI (not required for every local build).

**Step 2:** Commit any fixes.

**Step 3:** Tag or PR as appropriate.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-03-20-arsredovisningar-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Parallel Session (separate)** — open a new session with executing-plans, batch execution with checkpoints.

Which approach?
