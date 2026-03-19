# partifinansiering.se — Designspecifikation

## Syfte & målgrupp

Sajt som visualiserar svenska partiers finansiering. Målgrupp: allmänheten. Ska vara omedelbart begriplig — ingen förkunskap krävs.

Huvudfrågan sajten besvarar: **"Vem får mest pengar, och varifrån?"**

Tvåspråkig (svenska/engelska). Data: 2018–2024, alla riksdagspartier.

---

## Sidor

### 1. Startsida / Dashboard

- Rubrik: "Så finansieras Sveriges partier"
- **Årväljare** — segmented control, 2018–2024, default senaste året
- **Stacked bar chart** (horisontellt) — ett parti per rad, stapeln uppdelad i intäktskategorier, sorterat störst→minst
- **Partikort** under diagrammet — klickbara, visar partinamn + totalbelopp + partifärg

### 2. Partisida

- Partinamn som rubrik med partifärg som accent
- **Linjediagram** — totalintäkt per år (2018–2024)
- **Donut/segmentdiagram** — intäktsfördelning för valt år
- **Tabell** — lokala organisationer, sorterbara kolumner (namn, kommun/region, belopp)
- Knapp: "Jämför med annat parti"

### 3. Organisationssida

- Breadcrumb: Parti → Organisation
- Samma breakdown-diagram som partisidan, men för en lokal avdelning
- Geografisk kontext (kommun/region)

### 4. Om-sida

- Datakälla, metodik, begränsningar
- Ren text, inga diagram

---

## Navigation

- **Header:** Logotyp/titel vänster, nav-länkar mitt (Översikt · Partier · Om), språkväxlare (SV/EN) höger
- **Footer:** "Data från Kammarkollegiets Partiinsyn" + år
- Mobile: hamburger-meny

---

## Färger

### Partifärger (fasta, officiella)

| Parti                    | Färg     | Hex       |
| ------------------------ | -------- | --------- |
| Socialdemokraterna (S)   | Röd      | `#ED1B34` |
| Moderaterna (M)          | Ljusblå  | `#52BDEC` |
| Sverigedemokraterna (SD) | Gul      | `#DDDD00` |
| Centerpartiet (C)        | Grön     | `#009933` |
| Vänsterpartiet (V)       | Mörkröd  | `#DA291C` |
| Kristdemokraterna (KD)   | Mörkblå  | `#000077` |
| Miljöpartiet (MP)        | Ljusgrön | `#83CF39` |
| Liberalerna (L)          | Blå      | `#006AB3` |

### Intäktskategorier (7 st, behöver distinkt palett)

| Kategori                       | Förslag                                        |
| ------------------------------ | ---------------------------------------------- |
| Offentligt stöd                | Primär, starkast — utgör ofta största delen    |
| Medlemsavgifter                |                                                |
| Försäljning & lotterier        |                                                |
| Insamling av kontanter         |                                                |
| Bidrag                         | Bör sticka ut — mest intressant för granskning |
| Övrigt                         | Neutral/dämpad                                 |
| Bidrag – närstående verksamhet | Nära "Bidrag" men visuellt separerad           |

Designern väljer exakta färger — ska fungera mot både ljus och mörk bakgrund, och vara urskiljbara vid färgblindhet.

---

## Interaktion

| Åtgärd                             | Resultat                                                           |
| ---------------------------------- | ------------------------------------------------------------------ |
| Hover på stapelsegment             | Tooltip: kategorinamn + belopp + procent                           |
| Klick på parti (stapel eller kort) | Navigerar till partisida                                           |
| Byt år i segmented control         | Alla diagram uppdateras (ingen sidladdning)                        |
| Klick på organisation i tabell     | Navigerar till organisationssida                                   |
| Språkväxlare                       | Byter URL-prefix, UI-strängar ändras, partinamn behålls på svenska |

---

## Beloppsformat

- Tusentalsavgränsare med mellanslag: `12 345 678 kr`
- Alltid i SEK, ingen valutaväxling
- I tooltips: belopp + procent av total, t.ex. "Offentligt stöd: 45 230 000 kr (72%)"

---

## Responsivitet

| Viewport            | Beteende                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Desktop (>1024px)   | Fullbredd-diagram, partikort i grid (3–4 kolumner)                                           |
| Tablet (768–1024px) | Diagram skalas ner, partikort 2 kolumner                                                     |
| Mobil (<768px)      | Diagram vertikala/scrollbara, partikort i lista, tabell scrollar horisontellt, hamburger-nav |

---

## Tonalitet

- **Saklig, inte politisk** — neutral presentation av offentlig data
- **Datajournalistisk** — tänk SVT Datajournalistik, Ekonomistas, Our World in Data
- Inga åsikter, inga värdeladdade färgval (undvik rött = dåligt)
- Partifärgerna används strikt som identifikation, inte som värdering

---

## Leverabler designern behöver ta fram

1. **Färgpalett** för intäktskategorier (7 färger, colorblind-safe)
2. **Typsnitt** — rubrik + brödtext
3. **Startsida** — desktop + mobil
4. **Partisida** — desktop + mobil
5. **Komponentbibliotek** — knappar, kort, tabell, tooltip, segmented control, navigation
6. **Mörkt läge** — valfritt men Chakra UI stödjer det gratis, värt att tänka på

Implementeras med Chakra UI v3 (React). Designern behöver inte följa Chakra:s defaults — vi kan tema allt.
