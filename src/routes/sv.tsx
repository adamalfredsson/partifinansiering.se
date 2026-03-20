import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/** Legacy `/sv` — redirect to site root; children handle `/sv/…` */
export const Route = createFileRoute("/sv")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/sv") {
      throw redirect({
        to: "/",
        search: location.search,
        hash: location.hash,
      });
    }
  },
  component: () => <Outlet />,
});
