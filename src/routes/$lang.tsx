import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Layout } from "../components/Layout";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (params.lang !== "sv" && params.lang !== "en") {
      throw redirect({ to: "/$lang", params: { lang: "sv" } });
    }
  },
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();
  return (
    <Layout lang={lang}>
      <Outlet />
    </Layout>
  );
}
