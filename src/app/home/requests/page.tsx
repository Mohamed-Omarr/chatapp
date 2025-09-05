// app/home/requests/page.tsx (Server Component)
import { getFriendRequests } from "../../../../actions/features/friendRequest/getFriendRequest";
import RequestsClient from "../../../components/features/friend/RequestsClient";

export default async function RequestsPage() {
  const res = await getFriendRequests();

  const requests = res.map((r: any) => ({
    id: r.id,
    status: r.status,
    userId: r.from_user.id,
    email: r.from_user.email,
    username: r.from_user.username,
    avatar_url: r.from_user.avatar_url,
  }));

  return <RequestsClient initialRequests={requests} />;
}
