"use client";

import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/manrope/index.css";
import { system } from "../../theme";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme="light" {...props} />
    </ChakraProvider>
  );
}
