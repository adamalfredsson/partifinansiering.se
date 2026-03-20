/** Format number as "123 456 789" */
export function formatAmount(n: number): string {
  return n.toLocaleString("sv-SE");
}

/** SEK per vote (or similar unit), Swedish grouping */
export function formatKrPerVote(kr: number): string {
  return `${kr.toLocaleString("sv-SE", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} kr`;
}

/** Format as "123,4 mnkr" */
export function formatMillions(n: number): string {
  const m = n / 1_000_000;
  if (m >= 1000) {
    return `${(m / 1000).toFixed(2).replace(".", ",")} mdr`;
  }
  return `${m.toFixed(1).replace(".", ",")} mnkr`;
}
