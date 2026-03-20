import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../../components/DashboardPage";
import { buildHomeHead } from "../../lib/seo-head";

export const Route = createFileRoute("/en/")({
  head: () => buildHomeHead("en"),
  component: EnDashboard,
});

function EnDashboard() {
  return <DashboardPage lang="en" />;
}
