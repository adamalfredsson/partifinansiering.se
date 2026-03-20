import { isValidElement } from "react";
import { describe, expect, it } from "vitest";
import { RootComponent } from "./__root";

describe("RootComponent", () => {
  it("renders the forced light theme attributes on html", () => {
    const element = RootComponent();

    expect(
      isValidElement<{
        className?: string;
        style?: { colorScheme?: string };
      }>(element),
    ).toBe(true);

    if (
      !isValidElement<{
        className?: string;
        style?: { colorScheme?: string };
      }>(element)
    ) {
      throw new Error("RootComponent must return a valid React element");
    }

    expect(element.props.className).toBe("light");
    expect(element.props.style).toEqual({ colorScheme: "light" });
  });
});
