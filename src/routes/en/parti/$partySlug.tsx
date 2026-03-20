import { createFileRoute } from "@tanstack/react-router";
import { PartyDetailPage } from "../../../components/PartyDetailPage";

export const Route = createFileRoute("/en/parti/$partySlug")({
  component: EnPartyDetail,
});

function EnPartyDetail() {
  const { partySlug } = Route.useParams();
  return <PartyDetailPage lang="en" partySlug={partySlug} />;
}
