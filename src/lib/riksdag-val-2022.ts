import riksdagVal2022 from "../data/riksdag-val-2022.json";

/** Abbreviation → votes in the 2022 Riksdag election (excl. “Övriga partier”). */
export const RIKSDAG_2022_VOTES_BY_ABBR: Record<string, number> =
  Object.fromEntries(
    riksdagVal2022.partier
      .filter((p) => p.förkortning !== "ÖVR")
      .map((p) => [p.förkortning, p.röster]),
  );

export const RIKSDAG_2022_META = {
  electionLabel: riksdagVal2022.val,
  electionDate: riksdagVal2022.datum,
  source: riksdagVal2022.källa,
  validVotesTotal: riksdagVal2022.giltiga_röster_totalt,
} as const;
