import { getFriendList } from "../../../../actions/features/showFriends/friendList";
import FriendListClient from "./FriendListClient";

export default async function ShowFriendList() {
  const friends = await getFriendList();

  return <FriendListClient friends={friends} />;
}
