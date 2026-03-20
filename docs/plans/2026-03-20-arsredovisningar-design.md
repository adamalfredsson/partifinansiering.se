# Årsredovisningar — design

## Syfte

Komplettera befintlig Partiinsyn-data (intäkter) med **partikansliers årsredovisningar**: tydliga **källor** (länkar + arkiverade PDF:er) och över tid **strukturerad information** (t.ex. kostnader/resultat) som är **granskad av människa** innan den visas som sanning i UI.

## Omfattning (MVP)

- **Riksnivå / partikansli** — en utpekad juridisk person per riksdagsparti (explicit mappning parti → orgnr), inte alla lokalföreningar.
- **Både länkar och data** — användaren ser var underlaget finns och, när extraktion + validering finns, nyckeltal i linje med sajtens visualiseringsstil.

## Datakällor och discovery

- **Primär källa:** Bolagsverkets **publika webb** (samma handlingar som API:et pekar på), inte det **kostnadsbelagda API:et**. Discovery görs genom **skrapning** med headless browser / crawl-ramverk.
- **Rekommenderade verktyg (välj en väg i implementation):**
  - **[Crawlee](https://crawlee.dev/)** + Playwright: köer, retry, rate limiting, bra när flödet går att uttrycka som stabila selektorer/navigering.
  - **[Stagehand](https://github.com/browserbase/stagehand)** (eller liknande AI-styrd browser): användbart om UI:t är svårfångat med enbart CSS/XPath eller ofta ändras — kan medföra LLM-kostnad redan i discovery-skiktet.
- **Discovery-skript** (build/CI eller manuellt vid behov): för varje mappat orgnr, navigera Bolagsverkets webb, hitta årsredovisningar per år, spara **kanonisk metadata** (år, sid-URL, direkt PDF-URL om sådan finns, ev. dokumentnamn) till JSON i repot.
- **PDF:er:** laddas ner via HTTP från URL:er discovery hittat; versioneras i repot; vid växande volym rekommenderas **Git LFS** för PDF-binärer så huvudrepot inte sväller onödigt.

### Manuellt underlag

CSV:n innehåller många organisationer. För att undvika fel bolag krävs en **kuraterad lista** (parti-id eller slug → orgnr för kansli) som discovery-skriptet läser — samma parti ska inte “gissa” orgnr från aggregerad data.

## Artefakter (JSON i repo)

| Fil                                                                    | Innehåll                                                                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `annual-reports.discovery.json` (namn kan preciseras i implementation) | Per parti/orgnr/år: källor, URL:er, lokal sökväg till PDF om nedladdad, tidsstämplar/rå metadata från crawl. |
| `annual-reports.extracted.proposed.json`                               | LLM:ens tolkning enligt fast schema (för parsebarhet och diff). **Committad** (spårbarhet).                  |
| `annual-reports.extracted.validated.json`                              | Redaktionellt godkänd data som **sajten läser** för diagram/tabeller.                                        |

Både **proposed** och **validated** committas (val A): PR:er kan visa vad modellen föreslagit jämfört med senaste validerade versionen.

## Extraktion (LLM)

- Årsredovisningar varierar i layout; **regelbaserad** full extraktion är ogynnsam som enda väg.
- **LLM-skript** tar text (från PDF via lämplig text-extrahering) och fyller ett **strikt JSON-schema** med de fält ni faktiskt vill exponera.
- **Icke-determinism och fel:** låg temperatur, versionsnotering (`model`, `promptVersion`) i metadata; validering mot schema ska faila tydligt om output är ogiltig — men **deploy behöver inte hänga på att LLM körs varje build**; kör extraktion vid behov och committa proposed → du validerar → uppdatera validated.

### Mänsklig validering

1. Discovery uppdaterar discovery-JSON (+ ev. nya PDF:er).
2. Extraktion producerar/uppdaterar **proposed**.
3. Du granskar diff (parti/år, siffror, rimlighet).
4. Du flyttar/mergar in i **validated** det du står bakom.
5. UI läser **endast validated** för siffror; länkar/PDF kan komma från discovery även utan validerad extraktion för ett givet år.

## Körning

- **Byggtid / CI:** discovery kräver **headless browser** (Playwright-installation i CI) och ev. längre körning än rent HTTP — överväg **inte** köra crawl vid varje `vite build`; kör på schema/manuellt och committa uppdaterad JSON/PDF.
- **Secrets:** inget Bolagsverket-API; om ni använder Stagehand behövs API-nyckel till vald LLM-leverantör i discovery-steget (dokumentera i `.env.example`).
- Lokalt: samma skript; `.env.example` listar ev. LLM-nyckel + inställningar för crawl.

## UI (riktlinje)

- Partisida: sektion **Årsredovisning** — lista per år med länk till **Bolagsverket** (eller annan kanonisk URL) och **lokal PDF** om arkiverad.
- När validated finns för året: visa utdrag/nyckeltal konsekvent med befintlig Chakra-/diagramstil.

## Felhantering

- **Saknat år** efter crawl: notera i discovery-JSON (tom post eller flagga); UI visar inte falsk data.
- **DOM-/flödesändring på Bolagsverkets sajt:** crawl failar eller returnerar ofullständig data — versionslås selektorer, spara **HTML-fixtures** i tester, och övervaka med manuell körning innan merge av ny discovery-data.
- **Rate limit / bot-skydd:** respektera rimlig concurrency och backoff; undvik onödig belastning.
- **Nedladdningsfel (PDF):** samma policy som tidigare — rekommendation **strikt** vid data-PR så inget tyst tappas.
- **LLM bryter schema (extraktion):** skript exit code ≠ 0; ingen skrivning till proposed eller manuell åtgärd.

## Juridik och kvalitet

- Kontrollera Bolagsverkets **användarvillkor / robots.txt** för webbåtkomst; skrapning ersätter inte juridisk rådgivning — minimera belastning, cacha resultat i repot, länka till original.
- Tydlig **attribution** i UI: källa (Bolagsverket) och år ska alltid framgå.
- Validated JSON är **redaktionellt ansvar**; proposed är **förslag**.

## Relation till befintlig design

Utökar [2026-03-18-partifinansiering-design.md](./2026-03-18-partifinansiering-design.md) punkt om framtida källor (partikansliers årsredovisningar / kostnader) med konkret pipeline och filuppdelning.

## Godkännande

Designen ovan speglar brainstorm: omfattning partikansli, **discovery via webbskrapning** (Crawlee eller Stagehand), PDF i repo (LFS rekommenderat vid volym), två skript (discovery + extraktion), LLM med mänsklig validering, committad proposed + validated.
