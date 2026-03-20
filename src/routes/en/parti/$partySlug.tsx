import { createFileRoute } from "@tanstack/react-router";
import { PartyDetailPage } from "../../../components/PartyDetailPage";
import { buildPartyHead } from "../../../lib/seo-head";

export const Route = createFileRoute("/en/parti/$partySlug")({
  head: ({ params }) => buildPartyHead("en", params.partySlug),
  component: EnPartyDetail,
});

function EnPartyDetail() {
  const { partySlug } = Route.useParams();
  return <PartyDetailPage lang="en" partySlug={partySlug} />;
}
