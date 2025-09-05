// app/home/pending-requests/page.tsx (Server Component)
import { getSentFriendRequests } from "../../../../actions/features/friendRequest/getSentRequest";
import PendingRequestsClient from "../../../components/features/friend/PendingRequestsClient";

export default async function PendingRequestsPage() {
  const requests = await getSentFriendRequests();

  return <PendingRequestsClient initialRequests={requests} />;
}
