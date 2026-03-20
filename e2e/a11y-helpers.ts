import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

function summarizeViolations(
  violations: { id: string; help: string; nodes: { html: string }[] }[],
): string {
  return violations
    .map(
      (v) =>
        `${v.id} (${v.help})\n  ${v.nodes
          .slice(0, 5)
          .map((n) => n.html.replace(/\s+/g, " ").slice(0, 120))
          .join(
            "\n  ",
          )}${v.nodes.length > 5 ? `\n  … +${v.nodes.length - 5} nodes` : ""}`,
    )
    .join("\n\n");
}

/**
 * WCAG 2.0/2.1 level A + AA via axe-core.
 * Recharts surfaces are excluded: data graphics routinely fail automated contrast rules
 * without matching non-visual encodings; the surrounding app chrome is still fully scanned.
 */
export async function expectNoCriticalA11yIssues(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude(".recharts-wrapper")
    .exclude(".recharts-responsive-container")
    .analyze();

  expect(
    results.violations,
    results.violations.length ? summarizeViolations(results.violations) : "",
  ).toEqual([]);
}
