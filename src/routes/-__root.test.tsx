import { isValidElement } from "react";
import { describe, expect, it } from "vitest";
import { RootDocument } from "./__root";

describe("RootDocument", () => {
  it("renders the forced light theme attributes on html", () => {
    const element = RootDocument({ lang: "sv", children: null });

    expect(
      isValidElement<{
        lang?: string;
        className?: string;
        style?: { colorScheme?: string };
      }>(element),
    ).toBe(true);

    if (
      !isValidElement<{
        lang?: string;
        className?: string;
        style?: { colorScheme?: string };
      }>(element)
    ) {
      throw new Error("RootDocument must return a valid React element");
    }

    expect(element.props.lang).toBe("sv");
    expect(element.props.className).toBe("light");
    expect(element.props.style).toEqual({ colorScheme: "light" });
  });
});
