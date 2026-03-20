import { describe, expect, it } from "vitest";
import { tableSlotRecipe } from "./table";

const UNSAFE_SSR_SELECTORS = [
  ":nth-child(",
  ":first-child",
  ":last-child",
  ":only-child",
];

describe("tableSlotRecipe", () => {
  it("avoids child-index pseudo-selectors that break SSR hydration", () => {
    const serializedRecipe = JSON.stringify(tableSlotRecipe);

    for (const selector of UNSAFE_SSR_SELECTORS) {
      expect(serializedRecipe).not.toContain(selector);
    }
  });
});
