"use server";
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { getUserInfo } from "../../getUserInfo";

export async function getFriendList() {
  try {
    const supabase = await supabaseServer();
    const user = await getUserInfo();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("friends")
      .select(
        `
        user_profile:profiles!friends_user_id_fkey (
          id,
          username,
          avatar_url
        ),
        friend_profile:profiles!friends_friend_id_fkey (
          id,
          username,
          avatar_url
        )
      `
      )
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (error) throw error;

    // Return only the other profile (not the logged-in user)
    const friends = data.map((row) =>
      row.user_profile.id === user.id ? row.friend_profile : row.user_profile
    );

    return friends;
  } catch (error) {
    console.error("Failed to get the friend list", error);
    return [];
  }
}
