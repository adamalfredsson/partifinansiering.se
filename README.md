# Partifinansiering

A bilingual (Swedish / English) web app for exploring **Swedish political party financing**, built from open data published via [Kammarkollegiet Partiinsyn](https://www.kammarkollegiet.se/om-oss/partiinsyn). Raw input lives in `data/PartiinsynOpenData.csv` and is normalized into static JSON during the build.

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (SSR on [Cloudflare Workers](https://workers.cloudflare.com/))
- [React](https://react.dev/) 19, [Vite](https://vite.dev/) 8
- [Chakra UI](https://chakra-ui.com/) v3
- [Effect](https://effect.website/) for data parsing in the processing script

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Commands

| Command                             | Description                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Dev server (default port **4321**)                                                    |
| `pnpm build`                        | Run `process-data`, then production build                                             |
| `pnpm preview`                      | Preview the production build locally                                                  |
| `pnpm deploy`                       | Build and deploy with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) |
| `pnpm process-data`                 | Regenerate processed data from `data/PartiinsynOpenData.csv` only                     |
| `pnpm test`                         | Run [Vitest](https://vitest.dev/)                                                     |
| `pnpm typecheck`                    | TypeScript (`tsc --noEmit`)                                                           |
| `pnpm typegen`                      | Chakra UI theme typegen (`src/theme/index.ts`)                                        |
| `pnpm format` / `pnpm format:check` | Prettier                                                                              |

## Updating the dataset

Replace `data/PartiinsynOpenData.csv` with a newer export, then run `pnpm process-data` (or `pnpm build`, which runs the processor first).
