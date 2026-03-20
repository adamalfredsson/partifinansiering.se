import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy `/sv/…` → same path without `/sv` prefix */
export const Route = createFileRoute("/sv/$")({
  beforeLoad: ({ params, location }) => {
    const suffix = params._splat ?? "";
    const path = suffix ? `/${suffix}` : "/";
    throw redirect({
      to: path,
      search: location.search,
      hash: location.hash,
    });
  },
  component: () => null,
});
