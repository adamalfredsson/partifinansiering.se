import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "../components/Layout";

export const Route = createFileRoute("/en")({
  component: EnLayout,
});

function EnLayout() {
  return (
    <Layout lang="en">
      <Outlet />
    </Layout>
  );
}
