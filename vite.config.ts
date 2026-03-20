import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const cloudflarePlugins =
  process.env.VITEST === undefined
    ? [cloudflare({ viteEnvironment: { name: "ssr" } })]
    : [];

export default defineConfig({
  server: { port: 4321 },
  resolve: { tsconfigPaths: true },
  plugins: [...cloudflarePlugins, tanstackStart(), viteReact()],
});
