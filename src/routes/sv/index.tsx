import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy `/sv/` → `/` */
export const Route = createFileRoute("/sv/")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/",
      search: location.search,
      hash: location.hash,
    });
  },
  component: () => null,
});
