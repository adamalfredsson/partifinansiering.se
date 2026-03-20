import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../../components/Layout";
import { PartyDetailPage } from "../../components/PartyDetailPage";

export const Route = createFileRoute("/parti/$partySlug")({
  component: SvPartyDetail,
});

function SvPartyDetail() {
  const { partySlug } = Route.useParams();
  return (
    <Layout lang="sv">
      <PartyDetailPage lang="sv" partySlug={partySlug} />
    </Layout>
  );
}
