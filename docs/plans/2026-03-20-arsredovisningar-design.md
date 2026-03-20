# Årsredovisningar — design

## Syfte

Komplettera befintlig Partiinsyn-data (intäkter) med **partikansliers årsredovisningar**: tydliga **källor** (länkar + arkiverade PDF:er) och över tid **strukturerad information** (t.ex. kostnader/resultat) som är **granskad av människa** innan den visas som sanning i UI.

## Omfattning (MVP)

- **Riksnivå / partikansli** — en utpekad juridisk person per riksdagsparti (explicit mappning parti → orgnr), inte alla lokalföreningar.
- **Både länkar och data** — användaren ser var underlaget finns och, när extraktion + validering finns, nyckeltal i linje med sajtens visualiseringsstil.

## Datakällor och discovery

- **Primär källa:** Bolagsverket (automation utifrån orgnr), i enlighet med deras **aktuella API- och användarvillkor** (nyckel och gränser hanteras i CI/hemligheter, aldrig i klienten).
- **Discovery-skript** (build/CI): söker fram årsredovisningar per mappat orgnr och år, sparar **kanonisk metadata** (år, dokumentreferens, URL, ev. filnamn) till JSON i repot.
- **PDF:er:** laddas ner och versioneras i repot; vid växande volym rekommenderas **Git LFS** för PDF-binärer så huvudrepot inte sväller onödigt.

### Manuellt underlag

CSV:n innehåller många organisationer. För att undvika fel bolag krävs en **kuraterad lista** (parti-id eller slug → orgnr för kansli) som discovery-skriptet läser — samma parti ska inte “gissa” orgnr från aggregerad data.

## Artefakter (JSON i repo)

| Fil | Innehåll |
| --- | --- |
| `annual-reports.discovery.json` (namn kan preciseras i implementation) | Per parti/orgnr/år: källor, URL:er, lokal sökväg till PDF om nedladdad, tidsstämplar/rå metadata från API. |
| `annual-reports.extracted.proposed.json` | LLM:ens tolkning enligt fast schema (för parsebarhet och diff). **Committad** (spårbarhet). |
| `annual-reports.extracted.validated.json` | Redaktionellt godkänd data som **sajten läser** för diagram/tabeller. |

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

- **Byggtid / CI** (inte webbläsare): discovery och nedladdning körs med secrets; statisk sajt shippar med checkade JSON-filer (+ statiska PDF:er under t.ex. `public/` eller motsvarande).
- Lokalt: samma skript med env-filer som inte committas (`.env.example` dokumenterar variabler).

## UI (riktlinje)

- Partisida: sektion **Årsredovisning** — lista per år med länk till **Bolagsverket** (eller annan kanonisk URL) och **lokal PDF** om arkiverad.
- När validated finns för året: visa utdrag/nyckeltal konsekvent med befintlig Chakra-/diagramstil.

## Felhantering

- **Saknat år** i API: notera i discovery-JSON (tom post eller flagga); UI visar inte falsk data.
- **Nedladdnings-/API-fel i CI:** antingen faila jobbet (strikt) eller skriv varning + oförändrad snapshot (mjukt); välj policy explicit i implementation — rekommendation är **strikt för release** så sajten inte tyst tappar filer.
- **LLM bryter schema:** skript exit code ≠ 0; ingen skrivning till proposed eller manuell åtgärd.

## Juridik och kvalitet

- Följ Bolagsverkets villkor för API och återpublicering av handlingar.
- Tydlig **attribution** i UI: källa och år ska alltid framgå.
- Validated JSON är **redaktionellt ansvar**; proposed är **förslag**.

## Relation till befintlig design

Utökar [2026-03-18-partifinansiering-design.md](./2026-03-18-partifinansiering-design.md) punkt om framtida källor (partikansliers årsredovisningar / kostnader) med konkret pipeline och filuppdelning.

## Godkännande

Designen ovan speglar brainstorm: omfattning partikansli, automation i CI, PDF i repo (LFS rekommenderat vid volym), två skript (discovery + extraktion), LLM med mänsklig validering, committad proposed + validated.
