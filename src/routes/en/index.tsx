import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../../components/DashboardPage";

export const Route = createFileRoute("/en/")({
  component: EnDashboard,
});

function EnDashboard() {
  return <DashboardPage lang="en" />;
}
