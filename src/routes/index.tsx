import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../components/DashboardPage";
import { Layout } from "../components/Layout";
import { buildHomeHead } from "../lib/seo-head";

export const Route = createFileRoute("/")({
  head: () => buildHomeHead("sv"),
  component: SvHome,
});

function SvHome() {
  return (
    <Layout lang="sv">
      <DashboardPage lang="sv" />
    </Layout>
  );
}
