import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../components/DashboardPage";
import { Layout } from "../components/Layout";

export const Route = createFileRoute("/")({
  component: SvHome,
});

function SvHome() {
  return (
    <Layout lang="sv">
      <DashboardPage lang="sv" />
    </Layout>
  );
}
